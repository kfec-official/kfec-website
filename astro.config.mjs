// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// 배포 주소 설정
// - GitHub Pages: 워크플로(.github/workflows/deploy.yml)가 SITE_URL·BASE_PATH를 자동으로 넣어 줍니다.
// - Vercel: 별도 설정 없이 동작합니다. (자체 도메인을 쓰면 SITE_URL 환경 변수만 지정)
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site =
  process.env.SITE_URL ||
  (vercelHost ? `https://${vercelHost}` : 'http://localhost:4321');
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
