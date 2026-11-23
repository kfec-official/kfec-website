import { getCollection, type CollectionEntry } from 'astro:content';
import awardsData from '../data/awards.json';

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
  team: string;
};

/** 수상 내역을 최신 연도순(자리표시 연도는 맨 뒤)으로 정렬합니다. 같은 해는 파일에 적힌 순서를 따릅니다. */
export function getAwards(): Award[] {
  const list = awardsData as Award[];
  return list
    .map((a, i) => ({ a, i, y: Number.parseInt(String(a.year), 10) }))
    .sort((x, y) => (Number.isNaN(y.y) ? -Infinity : y.y) - (Number.isNaN(x.y) ? -Infinity : x.y) || x.i - y.i)
    .map(({ a }) => a);
}

/** 수익률 문자열의 부호에 따라 색상 클래스를 고릅니다. (한국 증시 관례: 상승 빨강, 하락 파랑) */
export function returnTone(value: string): 'up' | 'down' | 'flat' {
  if (isPlaceholder(value)) return 'flat';
  const v = value.trim();
  if (v.startsWith('+')) return 'up';
  if (v.startsWith('-') || v.startsWith('−') || v.startsWith('–')) return 'down';
  return 'flat';
}

/** "2026.09.28" ~ "2026.12.31" → "2026.09.28 – 12.31" (같은 해면 뒤쪽 연도 생략) */
export function formatPeriod(start: string, end: string): string {
  const [sy] = start.split('.');
  const [ey, ...rest] = end.split('.');
  if (sy && sy === ey && rest.length === 2) return `${start} – ${rest.join('.')}`;
  return `${start} – ${end}`;
}
