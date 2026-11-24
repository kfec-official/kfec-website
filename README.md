# KFEC 공식 홈페이지

경성대학교 금융투자학회 **KFEC**(Kyungsung Finance & Economics Club) 홈페이지입니다.
웹 개발을 몰라도 **파일 몇 개만 고치면** 리포트·Achievements(공모전·대외활동·진출)를 바꿀 수 있습니다.

> **처음이라면 [관리 설명서(GUIDE.md)](GUIDE.md)부터 보세요.** 화면 하나하나 따라 할 수 있게 쉽게 적어 두었습니다.

모든 수정은 GitHub 웹사이트에서 할 수 있고, 저장(커밋)하면 몇 분 뒤 사이트에 자동 반영됩니다.

---

## 한눈에 보기: 무엇을 어디서 고치나요?

| 바꾸고 싶은 것 | 고칠 파일 |
| --- | --- |
| 리포트 추가·수정 | `src/content/reports/` 폴더의 `.md` 파일 |
| 리포트 PDF | `public/reports/` 폴더 |
| Achievements (공모전 · 대외활동 · 진출) | `src/data/achievements.json` |
| 주요 활동 목록 (What We Do) | `src/data/activities.json` |
| 정규 활동 시간, 학회비, 카페·인스타그램 주소 | `src/data/site.json` |

> 대괄호로 된 글자(`[기업명]`, `[대회명]`, `[±0.00%]` 등)는 **아직 채우지 않은 자리표시**입니다. 실제 내용으로 바꿔 주세요.

---

## 1. 새 리포트 추가하기

### ① 파일 복사
1. GitHub 저장소에서 `src/content/reports/` 폴더로 들어갑니다.
2. `_template.md` 파일을 열고 내용 전체를 복사합니다.
3. 폴더 화면으로 돌아가 **Add file → Create new file**을 누릅니다.
4. 파일 이름을 **영문 소문자·숫자·하이픈(-)** 으로 적습니다. 끝은 꼭 `.md`
   - 좋은 예: `2026-12-01-samsung.md`
   - 나쁜 예: `삼성전자 리포트.md` (한글·띄어쓰기 X)
   - 같은 이름의 PDF가 이 리포트에 연결됩니다 → `2026-12-01-samsung.pdf`
5. 복사한 내용을 붙여 넣습니다.

### ② 내용 수정
홈페이지에는 분류와 기업·산업 이름만 나오고, 내용은 PDF로 봅니다. 세 줄만 채우세요.

```yaml
---
title: "삼성전자"     # 기업명 또는 산업명 (따옴표 유지)
category: 기업분석    # 기업분석 또는 산업분석 (둘 중 하나만!)
date: 2026-12-01      # 발행일 — 화면에는 안 나오고 최신순 정렬에만 쓰임
---
```

- 다 쓰면 **Commit changes** 를 누릅니다.

### ③ PDF 넣기
1. `public/reports/` 폴더로 이동 → **Add file → Upload files**
2. PDF를 끌어다 놓습니다. **파일 이름을 리포트 파일과 똑같이** 맞추세요. (예: `2026-12-01-samsung.md` → `2026-12-01-samsung.pdf`)
3. 이름이 같으면 리서치 목록에 **PDF** 다운로드 버튼이 자동으로 생깁니다. (PDF가 없으면 "PDF 준비 중"으로 표시)
   - 다른 이름의 PDF를 쓰고 싶다면 리포트 정보 칸에 `pdf: "파일이름.pdf"` 를 적어도 됩니다.

### 리포트 숨기기·삭제
- 잠시 숨기기: 정보 부분에 `draft: true` 한 줄 추가
- 완전히 삭제: 해당 `.md` 파일 삭제 (PDF도 함께 지우세요)
- PDF에 휴대폰 번호 같은 개인정보가 없는지 확인하고 올리세요. 올린 PDF는 누구나 내려받을 수 있습니다.

---

## 2. Achievements 수정하기 (`src/data/achievements.json`)

공모전, 대외활동, 학회원의 진출 현황을 한 파일에 적습니다. 홈페이지에서는 **연도별(2026, 2025 …)로 묶여** 최신 연도부터 나옵니다.
1건이 `{ ... }` 한 묶음입니다. (묶음 사이 쉼표, 마지막 뒤엔 쉼표 없음)

```json
[
  {
    "year": 2026,
    "category": "공모전",
    "title": "대회 이름",
    "host": "주최 기관",
    "result": "대상"
  }
]
```

| 항목 | 뜻 |
| --- | --- |
| `year` | 연도. 같은 연도끼리 자동으로 묶입니다 |
| `category` | `공모전` · `대외활동` · `진출` |
| `title` | 대회명 · 활동명 · 기관·기업명 |
| `host` | 주최 기관 (진출은 `""`) |
| `result` | 수상 등급 · 활동 내용 · 재직/인턴/현장실습 |

- 같은 해 안에서는 파일에 적힌 순서대로 나옵니다. 홈 화면에는 가장 최근 연도만 표시됩니다.
- 진출 현황에는 이름과 부서를 적지 않습니다.

## 3. 기타 정보 (`src/data/site.json`)
정규 활동 시간(`meeting`), 학회비(`fee`), 면제 대상(`feeExemption`), 네이버 카페 주소(`cafeUrl`), 인스타그램 계정(`instagram`, `instagramUrl`)을 바꿀 수 있습니다.

### 저장했는데 사이트가 안 바뀌어요
저장소의 **Actions** 탭을 확인하세요. 빨간 ✕ 표시가 있다면 대부분 아래 중 하나입니다.
- JSON 파일의 쉼표 누락/초과, 따옴표 누락
- 리포트의 `category`가 `기업분석`/`산업분석`이 아님
- 리포트 정보 부분의 `---` 가 지워짐
실패한 항목을 눌러 보면 어느 파일에서 문제가 났는지 적혀 있습니다.

---

## 4. GitHub Pages로 배포하기 (무료)

처음 한 번만 설정하면, 이후엔 파일을 고칠 때마다 자동으로 배포됩니다.

1. GitHub에서 새 저장소를 만들고 이 프로젝트 파일을 모두 올립니다. (기본 브랜치 이름: `main`)
2. 저장소 **Settings → Pages** 로 이동합니다.
3. **Build and deployment → Source** 를 **GitHub Actions** 로 바꿉니다.
4. **Actions** 탭에서 "GitHub Pages 배포" 작업이 초록색 ✓ 이 되면 완료입니다.
5. 사이트 주소: `https://<GitHub 아이디>.github.io/<저장소 이름>/`
   - 저장소 이름을 `<아이디>.github.io` 로 만들면 주소가 `https://<아이디>.github.io/` 가 됩니다.
   - 주소(하위 경로)는 워크플로가 자동으로 맞추므로 따로 설정할 필요가 없습니다.

자체 도메인(예: `kfec.kr`)을 쓰려면 Settings → Pages → Custom domain 에 입력하고, 도메인 업체에서 DNS를 GitHub 안내대로 설정하세요.

## 5. Vercel로 배포하기 (대안, 무료)

1. [vercel.com](https://vercel.com) 에 GitHub 계정으로 로그인
2. **Add New → Project** → 이 저장소 선택 → **Import**
3. Framework Preset이 **Astro** 로 자동 선택됩니다. 다른 설정은 그대로 두고 **Deploy**
4. 이후 `main` 브랜치에 저장할 때마다 자동 배포됩니다.

- 자체 도메인을 연결했다면 Vercel 프로젝트 **Settings → Environment Variables** 에 `SITE_URL` = `https://내도메인` 을 추가하세요. (SNS 미리보기 이미지·사이트맵 주소에 쓰입니다)
- GitHub Pages와 Vercel을 동시에 쓸 필요는 없습니다. 하나만 고르세요.

---

## 개발자용 메모

```bash
npm install      # 처음 한 번
npm run dev      # http://localhost:4321 에서 미리보기
npm run build    # dist/ 폴더에 정적 사이트 생성
```

- 기술 스택: Astro 5 + Tailwind CSS 4, 정적 사이트(SSG)
- 로고: 원본은 프로젝트 루트의 `kfec_logo.png`. 원본을 바꾼 뒤 `python3 scripts/make-logos.py` (Pillow 필요)를 실행하면 남색·흰색 로고, 파비콘, Open Graph 이미지(`public/og-image.png`)가 다시 만들어집니다.
- 배포 주소: `SITE_URL`, `BASE_PATH` 환경 변수로 결정 (`astro.config.mjs` 참고)
- 색상·폰트: `src/styles/global.css` 의 `@theme`
- 사이트맵: `@astrojs/sitemap` 이 `sitemap-index.xml` 생성, `robots.txt` 는 `src/pages/robots.txt.ts`
