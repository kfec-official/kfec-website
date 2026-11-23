import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 리포트 1건 = src/content/reports/ 안의 .md 파일 1개
// 파일 이름이 주소가 됩니다. 예) 2026-11-20-cosmetics.md → /research/2026-11-20-cosmetics/
// 밑줄(_)로 시작하는 파일(_template.md)은 사이트에 나오지 않습니다.
const reports = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/reports' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['기업분석', '산업분석']),
    // 2026-11-20 형식의 날짜. 아직 정해지지 않았다면 "[YYYY-MM-DD]"처럼 따옴표 안에 자리표시를 둘 수 있습니다.
    date: z.union([z.date(), z.string()]),
    summary: z.string(),
    opinion: z.string().optional(),
    team: z.string(),
    // public/reports/ 폴더에 넣은 PDF 파일 이름. 예) "2026-11-20-cosmetics.pdf"
    pdf: z.string().optional(),
    // true로 바꾸면 사이트에서 숨겨집니다.
    draft: z.boolean().default(false),
  }),
});

export const collections = { reports };
