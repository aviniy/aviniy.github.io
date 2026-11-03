# Aviniy's Lab

`https://aviniy.github.io/`는 개인 홈페이지이고, 기술 블로그 Aviniy's Lab은
`https://aviniy.github.io/lab/`에서 제공된다. 예전 게시글·카테고리·검색 주소는 대응하는
`/lab/` 주소로 정적 리디렉션된다.

## 웹 관리자

배포된 사이트의 `/admin/`에서 Pages CMS 관리 화면으로 이동할 수 있다. GitHub로 로그인하고
`aviniy/aviniy.github.io` 저장소를 선택하면 `src/content/posts`의 글을 작성, 수정, 삭제할 수 있다.
저장 내용은 `main` 브랜치에 커밋되며 기존 GitHub Actions가 자동으로 사이트를 다시 배포한다.

최초 한 번은 Pages CMS GitHub App을 설치하면서 접근 저장소를
`aviniy/aviniy.github.io` 하나로 제한해야 한다. 블로그 수정 권한은 저장소 쓰기 권한을 가진
GitHub 계정에만 있다.

정보보안 학습 기록을 위한 Astro 정적 블로그입니다. Markdown과 Notion HTML ZIP을 지원합니다.

## 배포 없이 로컬에서 미리보기 (선택)

Node.js 22 이상이 필요합니다.

```bash
npm install
npm run dev
```

빌드는 `npm run build`, 결과 확인은 `npm run preview`로 실행합니다. 샘플 ZIP 가져오기와 빌드 검증은 `npm run test:import`로 실행합니다.

## 게시글 작성

`src/content/posts/`에 Markdown 파일을 추가합니다. 메타데이터는 `title`, `description`, `category`, `tags`, `createdAt`, `updatedAt`, `draft`입니다. 카테고리 목록은 `src/config/categories.js`에서 관리합니다. 새 카테고리는 여기 추가하면 탐색 메뉴와 정적 페이지에 반영됩니다.

## Notion HTML 가져오기

1. Notion에서 **HTML**로 내보낸 ZIP을 GitHub 저장소의 `imports/` 폴더에 업로드하고 `main`에 반영합니다.
2. GitHub Actions가 자동으로 `npm ci` → `npm run import:notion` → `npm run build` → GitHub Pages 배포를 실행합니다. 로컬 설치나 실행은 필요하지 않습니다.
3. ZIP 내부의 `bandit/` 폴더와 `bandit` 상위 페이지는 자동으로 `OverTheWire Bandit`에 분류됩니다. `Dreamhack/Web/`, `Dreamhack/Reversing/` 같은 경로는 Dreamhack 하위 유형에 분류됩니다. 다른 폴더 이름이 `src/config/categories.js`의 카테고리 이름과 일치하면 그 카테고리에 분류됩니다. 일치하지 않으면 `Study Notes`로 게시됩니다.

ZIP 안의 여러 HTML과 이미지를 처리합니다. 동일한 ZIP 이름과 내부 파일 경로는 같은 주소의 게시글로 생성되므로 중복되지 않습니다. Actions에서는 생성물이 저장소에 커밋되지 않고 매번 빌드 중에 다시 생성됩니다. Notion 내보내기에서 날짜를 찾지 못한 경우 빌드 시점을 사용합니다. 외부 이미지는 가져오지 않고, 외부 링크는 허용합니다. SVG 첨부는 보안을 위해 복사하지 않습니다. ZIP은 25 MB, 단일 파일은 20 MB, 전체 압축 해제 크기는 100 MB로 제한합니다. Notion HTML은 허용된 HTML만 남기고 스크립트, iframe, 이벤트 핸들러, 위험한 URL을 제거합니다.

## GitHub Pages 배포

저장소 [Settings → Pages](https://github.com/aviniy/aviniy.github.io/settings/pages) → Build and deployment에서 **GitHub Actions**를 선택합니다. `main` 브랜치에 Push하면 워크플로가 실행됩니다. 사이트 주소는 `https://aviniy.github.io/`이며 Astro의 `base`는 `/`입니다.

## 구조

`src/pages`는 정적 페이지, `src/components`는 UI, `src/content/posts`는 기존 Markdown 게시글, `imports`는 업로드할 ZIP, `scripts/import-notion.mjs`는 가져오기 CLI, `public/assets/notion`은 빌드 중 생성되는 이미지, `.github/workflows/deploy.yml`은 배포 설정입니다.

## 제한사항

Notion의 복잡한 데이터베이스와 임베드는 완전히 재현되지 않습니다. 검색은 브라우저에서 글의 최대 12,000자까지 검색합니다. Notion 첨부 중 SVG와 외부 이미지는 표시하지 않습니다. 자동 Import 글의 태그는 빈 목록입니다. 날짜가 내보내기 데이터에 없으면 재배포 시 작성일과 수정일이 새 빌드 날짜로 바뀔 수 있습니다.
