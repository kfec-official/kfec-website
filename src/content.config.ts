import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 리포트 1건 = src/content/reports/ 안의 .md 파일 1개
// PDF는 public/reports/ 에 .md 파일과 같은 이름으로 올리면 자동으로 연결됩니다.
// 예) 2026-05-15-hantec.md  ↔  2026-05-15-hantec.pdf
// 밑줄(_)로 시작하는 파일(_template.md)은 사이트에 나오지 않습니다.
const reports = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/reports' }),
  schema: z.object({
    // 기업명 또는 산업명. 예) "한텍", "화장품 산업"
    title: z.string(),
    category: z.enum(['기업분석', '산업분석']),
    // 발행일 (화면에는 나오지 않고, 최신순 정렬에만 쓰입니다)
    date: z.union([z.date(), z.string()]),
    // (선택) PDF 이름이 .md 파일과 다를 때만 적습니다
    pdf: z.string().optional(),
    // true로 바꾸면 사이트에서 숨겨집니다.
    draft: z.boolean().default(false),
  }),
});

export const collections = { reports };
