import fs from 'node:fs';
import path from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';
import achievementsData from '../data/achievements.json';

/** 배포 경로(base)를 반영한 내부 링크를 만듭니다. */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + (path.startsWith('/') ? path : `/${path}`);
}

/** "[...]" 형태의 자리표시인지 확인합니다. */
export function isPlaceholder(value: unknown): boolean {
  return typeof value === 'string' && /^\s*\[.*\]\s*$/.test(value);
}

/** 날짜를 2026.11.20 형식으로 표시합니다. 자리표시 문자열은 그대로 표시합니다. */
export function formatDate(value: Date | string): string {
  const d = toDate(value);
  if (!d) return String(value);
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${d.getUTCFullYear()}.${mm}.${dd}`;
}

/** 기계가 읽는 날짜(YYYY-MM-DD). 자리표시면 undefined. */
export function isoDate(value: Date | string): string | undefined {
  const d = toDate(value);
  return d ? d.toISOString().slice(0, 10) : undefined;
}

function toDate(value: Date | string): Date | undefined {
  if (value instanceof Date) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T00:00:00Z`);
  return undefined;
}

/** 공개 리포트를 최신순(자리표시 날짜는 맨 뒤)으로 가져옵니다. */
export async function getReports(): Promise<CollectionEntry<'reports'>[]> {
  const all = await getCollection('reports', ({ data }) => !data.draft);
  return all.sort((a, b) => {
    const da = toDate(a.data.date)?.getTime() ?? -Infinity;
    const db = toDate(b.data.date)?.getTime() ?? -Infinity;
    return db - da || a.id.localeCompare(b.id);
  });
}

export type Achievement = {
  year: string | number;
  /** 공모전 / 대외활동 / 진출 */
  category: string;
  /** 대회명 · 활동명 · 기관명 */
  title: string;
  /** 주최 기관 (없으면 "") */
  host?: string;
  /** 수상 등급 · 활동 내용 · 재직/인턴/현장실습 */
  result: string;
};

/** Achievements를 연도별로 묶어 최신 연도부터 돌려줍니다. 같은 해 안에서는 파일에 적힌 순서를 따릅니다. */
export function getAchievementsByYear(): { year: string; items: Achievement[] }[] {
  const groups = new Map<string, Achievement[]>();
  for (const a of achievementsData as Achievement[]) {
    const year = String(a.year).trim();
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(a);
  }
  const num = (y: string) => {
    const n = Number.parseInt(y, 10);
    return Number.isNaN(n) ? -Infinity : n;
  };
  return Array.from(groups, ([year, items]) => ({ year, items })).sort((a, b) => num(b.year) - num(a.year));
}

/**
 * 리포트의 PDF 주소를 찾습니다.
 * ① pdf: 항목에 적은 파일 → ② .md 파일과 같은 이름의 PDF
 * public/reports/ 에 실제로 파일이 있을 때만 주소를 돌려줍니다.
 */
export function getReportPdf(report: CollectionEntry<'reports'>): string | undefined {
  const dir = path.join(process.cwd(), 'public', 'reports');
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const find = (name: string) => files.find((f) => f.toLowerCase() === name.toLowerCase());
  const wanted = report.data.pdf && !isPlaceholder(report.data.pdf)
    ? report.data.pdf.replace(/^\/?(public\/)?(reports\/)?/, '').trim()
    : undefined;
  if (wanted && !find(wanted)) {
    console.warn(`[리포트 ${report.id}] pdf: "${wanted}" 파일을 public/reports/ 에서 찾지 못했습니다.`);
  }
  const file = (wanted && find(wanted)) || find(`${report.id}.pdf`);
  return file ? url(`/reports/${encodeURIComponent(file)}`) : undefined;
}
