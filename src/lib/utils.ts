import { getCollection, type CollectionEntry } from 'astro:content';
import awardsData from '../data/awards.json';
import alumniData from '../data/alumni.json';

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

export type Award = {
  year: string | number;
  competition: string;
  host: string;
  prize: string;
};

/** 수상 내역을 최신 연도순(자리표시 연도는 맨 뒤)으로 정렬합니다. 같은 해는 파일에 적힌 순서를 따릅니다. */
export function getAwards(): Award[] {
  const list = awardsData as Award[];
  return list
    .map((a, i) => ({ a, i, y: Number.parseInt(String(a.year), 10) }))
    .sort((x, y) => (Number.isNaN(y.y) ? -Infinity : y.y) - (Number.isNaN(x.y) ? -Infinity : x.y) || x.i - y.i)
    .map(({ a }) => a);
}

export type Alumni = {
  /** 재직 / 인턴 / 현장실습 등 */
  status: string;
  organization: string;
  year: string | number;
};

/** Alumni·실습 현황을 최신 연도순(자리표시 연도는 맨 뒤)으로 정렬합니다. 같은 해는 파일 순서를 따릅니다. */
export function getAlumni(): Alumni[] {
  return (alumniData as Alumni[])
    .map((a, i) => ({ a, i, y: Number.parseInt(String(a.year), 10) }))
    .sort((x, y) => (Number.isNaN(y.y) ? -Infinity : y.y) - (Number.isNaN(x.y) ? -Infinity : x.y) || x.i - y.i)
    .map(({ a }) => a);
}

/** 구분별 인원 수 (자리표시는 세지 않음) */
export function countAlumniByStatus(list: Alumni[]): { status: string; count: number }[] {
  const map = new Map<string, number>();
  for (const a of list) {
    if (isPlaceholder(a.status)) continue;
    const key = a.status.trim();
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map, ([status, count]) => ({ status, count }));
}
