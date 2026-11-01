# @logjoa/ui

logjoa 웹 프로젝트(devlog·mobilog·mylog) 공통 UI — shadcn 원본 컴포넌트, 직접 만든 컴포넌트, 테마. npm에 올리지 않고 git 태그로 설치한다.

## 구조

| 폴더            | 내용                                         | 규칙                                                                                 |
| --------------- | -------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/ui`        | shadcn 원본 컴포넌트 (radix-nova, lucide)    | **손으로 고치지 않는다.** `pnpm ui:update`로만 바뀐다. CI(`pnpm ui:check`)가 지킨다. |
| `src/hooks`     | shadcn 원본 훅 (`use-mobile` — sidebar가 씀) | 위와 같다.                                                                           |
| `src/custom`    | 직접 만들거나 원본을 감싼 컴포넌트           | 자유롭게 고친다. 원본 컴포넌트를 import해 조합한다. 아래 "커스텀" 표에 적는다.       |
| `src/theme.css` | 공통 색·radius·글꼴 + 컴포넌트 클래스 스캔   | 프로젝트에만 쓰는 토큰은 각 프로젝트 `globals.css`에.                                |
| `src/typeset.css` | shadcn Typeset 원본 (긴 글·마크다운 활자) | **손으로 고치지 않는다.** CLI로 못 받아 shadcn 저장소에서 복사했다. 아래 "Typeset" |
| `src/cn.ts`     | 커스텀 글자 크기를 등록한 `cn`               | 원본 컴포넌트도 이것을 쓴다(받을 때 import만 바꿈).                                  |
| `ui.lock.json`  | 마지막으로 받은 원본의 해시·shadcn 버전      | `ui:update`가 쓴다. 손대지 않는다.                                                   |

## 쓰기

```bash
pnpm add "github:mylog-help/logjoa-ui#v0.19.1"
```

```ts
// next.config.ts — TS 소스를 그대로 배포하므로 Next가 컴파일하게 한다
transpilePackages: ["@logjoa/ui"],
```

```css
/* globals.css */
@import "tailwindcss";
@import "@logjoa/ui/theme.css"; /* 색·radius·글꼴 + 컴포넌트 클래스 스캔(@source) */
```

```tsx
import { Button } from "@logjoa/ui/button"; // 원본 (src/ui)
import { SmartDateInput } from "@logjoa/ui/custom/smart-date-input"; // 커스텀 (src/custom)
import { cn } from "@logjoa/ui/cn";
```

- import 경로만 봐도 원본인지 커스텀인지 안다. 원본의 모양·사용법은 [shadcn 문서](https://ui.shadcn.com/docs/components)를 본다.
- `cn`은 패키지 것을 쓴다. 세 프로젝트의 커스텀 글자 크기(`text-caption` 등)를 등록해 둬서, 색 클래스를 지우지 않는다. 프로젝트에 `--text-*`를 추가하면 `src/cn.ts`의 `CUSTOM_TEXT_SIZES`에도 넣는다.
- `@shadcn/lint`의 `no-restyle`이 이 패키지 컴포넌트(원본·커스텀 모두)를 알아보게 `components.json`의 `aliases.ui`를 `"@logjoa/ui"`로.
- `cmdk`·`vaul`·`sonner`·`recharts`·`dayjs` 등은 선택 peer 의존성 — 그 컴포넌트를 쓰는 프로젝트만 설치한다.

## 커스텀 (`src/custom`)

| 컴포넌트              | 하는 일                                                                                                                                | 쓰는 곳 (2026-10-31)                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `SmartDateInput`      | 입력하는 동안 `2026`·`202601`·`260101`·`2026/1/15`·`2026.01` 등을 해석해 결과를 보여 줌(연도만이면 "대략")                             | devlog my-history (순간·인물 대화상자, 경력 폼)   |
| `NormalizedDateInput` | 입력칸을 벗어날 때 `yyyy-MM-dd`로 맞춤, 못 바꾸면 `invalidMessage`를 띄우고 빈 값을 올림. `normalizeDateString`도 내보냄               | devlog user-history (직원·등록 폼, 개인 타임라인) |
| `FullscreenMenu`      | 화면 전체를 덮는 모바일 메뉴(반투명 배경·강한 블러·페이드). Radix Dialog 기반, `Trigger`·`Content`(`description` 필수)·`Title`·`Close` | (지금은 없음 — mylog 헤더가 v0.9.0에서 `SiteHeader`로 옮김) |
| `PageHeader`          | 페이지 상단 제목(`h1`)·설명·오른쪽 액션. 좁은 화면은 세로, `sm` 이상은 가로                                                            | devlog 기능 페이지, mobilog 업무 화면             |
| `Inner`               | 콘텐츠 폭(`narrow`·`default`·`wide`)과 좌우 여백 `px-4 md:px-6`. `default`는 `wide` 틀 안에서 왼쪽 정렬                                | devlog 전반, mobilog                              |
| `TableBase`           | 열 정의로 그리는 표. 행 선택(일괄 편집)·`md` 미만 카드 보기(`mobileCards`)·남은 높이 채우기(`fillHeight`)                              | mobilog 업무 목록, devlog                         |
| `AdminShell`          | 관리자 화면 틀 — 위쪽 바(브랜드 네모 로고·구역 이름·`actions`), 왼쪽 `nav` 자리, 본문(`Inner wide`). 상태 없음, `linkComponent`로 라우터 Link를 받음 | devlog·mobilog·mylog 관리자 layout                |
| `AdminNav`            | `AdminShell` 왼쪽 메뉴. 묶음(`groups`)별 링크, 활성 표시(`secondary`), `lg` 미만은 "메뉴" 버튼 + 왼쪽 `Sheet`. 현재 경로·Link는 쓰는 쪽이 넘김 | devlog·mylog 관리자 메뉴                          |
| `SiteHeader`          | 사이트 위쪽 바 — 브랜드(네모 로고), 내비게이션(링크·드롭다운 `{ label, groups }`), 오른쪽 `actions`. `lg` 미만은 내비게이션을 오른쪽 `Sheet`로(맨 아래 `menuFooter`). 활성 표시(`secondary`)는 `currentPath`로, 앵커(`#`) 링크는 활성으로 치지 않음. `ref`·`sticky` 받음 | devlog·mobilog·mylog 사이트 헤더 |
| `SiteFooter`          | 사이트 아래쪽 — 브랜드·소개·소셜, 링크 묶음(`groups`), 구분선 아래 작은 글자(`children`, `<p>` 안 링크에 밑줄). 상태 없음(서버 컴포넌트에서 그대로) | devlog·mobilog·mylog 사이트 푸터 |
| `Brand`               | 네모 로고 + 이름 링크. `AdminShell`·`SiteHeader`·`SiteFooter`·`AuthShell`이 같이 씀. 상태 없음 | 위 블록들, mobilog 회사 등록 화면 |
| `AuthShell`           | 로그인·가입 화면 틀 — 왼쪽 위 브랜드·`actions`, 가운데 폼(`max-w-sm`), 넓은 화면 오른쪽 `aside` 패널(`bg-muted`, 없으면 한 단). 상태 없음 | devlog·mobilog·mylog 인증 화면 |
| `AuthHeader`·`AuthFooter` | 인증 폼 위 제목(`h1`)·설명(`icon` 선택), 아래 전환 문구(줄마다 `<p>`, 링크 밑줄). 구분선은 원본 `FieldSeparator`, 입력은 원본 `Field` | devlog·mobilog·mylog 인증 화면 |
| `StatusScreen`        | 404·오류 화면 — 큰 코드·제목(`h1`)·설명·오류 코드(`digest`)·버튼. 원본 `Empty` 위. 레이아웃 안 `min-h-[60vh]`, 밖은 `fullScreen` | devlog·mobilog·mylog `not-found`·`error` |
| `GlobalErrorScreen`   | `global-error.tsx` 화면 — `<html>`·`<body>` 직접, 전역 CSS 없이 인라인 스타일. `reset` 을 `onRetry` 로 | devlog·mobilog·mylog `global-error` |
| `EmptyState`          | 빈 목록 안내 — 원본 `Empty` + 점선 테두리(`bordered`, 기본 켜짐)·아이콘·제목·설명·버튼. 쓰는 쪽에서 `Empty` 에 `border` 를 덧칠하지 않게 | devlog 목록 화면, mylog 백업 뷰어 |
| `ConfirmDialog`       | 되돌리기 어려운 동작 전 확인 상자(원본 `AlertDialog`). 확인 버튼 색은 `destructive` 하나로. `open` 을 주면 확인 뒤 저절로 닫히지 않고(쓰는 쪽이 성공 후 닫음), `trigger` 만 주면 `onConfirm` 이 끝난 뒤 닫음(`false` 를 돌려주면 열린 채). `pending` 이면 취소·Esc 로도 안 닫힘 | devlog·mobilog 삭제·취소 확인 |
| `ThemeToggle`         | 밝은·어두운 테마 전환 아이콘 버튼(next-themes). 아이콘은 CSS(`dark:`)로 바꿔 하이드레이션 경고가 없다 | mylog·mobilog 헤더 |
| `DemoBanner`          | 공유 데모 계정으로 둘러보는 중이라는 표시. `bar`(헤더 아래 전체 폭 띠)·`box`(고정 사이드바가 있는 앱 본문 맨 위 상자). 문구·오른쪽 버튼은 쓰는 쪽이 정한다 | devlog 헤더 아래, mobilog 업무 화면 |
| `LanguageMenu`        | 헤더 언어 선택 — 글로브 아이콘 버튼 하나, 누르면 드롭다운(지금 언어에 체크). 실제 링크(`hrefLang`·`aria-current`). 주소는 `items[].href`, next-intl이면 `linkProps={{ locale }}`. 라우터를 모른다 | devlog·mylog 헤더 |
| `UserMenu`            | 로그인한 사람의 계정 메뉴 — 헤더 아이콘 버튼(기본 `User`) + 팝오버. 위에서부터 `profile`(사진·이름·이메일, 사진이 없으면 이니셜)·`children`(쓰는 쪽 구역)·`items`(링크)·`signOut`(글자만 빨간 항목, `action` 폼 POST 또는 `onSignOut`). 구역 사이에만 선. 인증은 모른다 | devlog·mylog 헤더 |
| `ContactPage`         | 문의 페이지 틀 — 왼쪽 제목(h1)·설명·안내 목록(`notes`), 오른쪽 폼 카드(`children`). 좁은 화면에서는 한 단. 서버 컴포넌트로 쓸 수 있다 | devlog·mylog·mobilog `/contact` |
| `ContactForm`         | 문의 폼 — 라디오 카드 유형, 필수 `*`/"(선택)" 표시, 첨부(이미지·PDF 5MB·3개, 서명 주소로 직접 업로드), 접수번호가 있는 완료 화면. 문의함 API 는 모른다: 서버 액션(`submitAction`·`uploadAction`)을 사이트가 넘긴다(키가 브라우저 코드에 안 들어오게) | devlog·mylog·mobilog `/contact` |
| `contactMessages`     | `@logjoa/ui/custom/contact-messages` — 문의 화면 문구 ko·en·ja 한 벌(해요체)과 `fillContactText`. 사이트마다 다른 것(설명·유형·안내 한 줄)만 props 로 | 세 사이트 |

- 두 날짜 입력은 동작이 달라 따로 둔다. 원래 이름이 둘 다 `SmartDateInput`이었는데 user-history 쪽을 `NormalizedDateInput`으로 바꿨다(v0.3.0).
- `FullscreenMenu`는 shadcn `Sheet`(옆에서 밀려 들어오는 패널)로는 같은 모양이 안 나와 따로 둔다(v0.4.0).
- `PageHeader`·`Inner`·`TableBase`는 devlog·mobilog에 글자 하나 다르지 않게 복사돼 있던 것을 옮겼다(v0.7.0).
- `AdminShell`의 본문은 블록 흐름이다. 첫 줄 `PageHeader`의 `mb-8`이 본문과의 간격이 된다. 접근 확인(guard)은 넣지 않는다 — 쓰는 쪽 layout에서 한다(v0.8.0).
- `SiteHeader`·`SiteFooter`는 세 프로젝트 헤더·푸터를 기본 모양으로 맞춘 것이다. 로그인 여부·언어 선택·테마 전환은 각 프로젝트가 `actions`에 넣는다(v0.9.0).
- 새 커스텀을 넣으면 이 표에 적는다. 원본에 모양만 더하는 것이면 `src/ui`를 고치지 말고 `src/custom`에서 원본을 감싼다.

## Typeset (`typeset.css`)

[shadcn Typeset](https://ui.shadcn.com/docs/typeset) — `typeset` 클래스를 단 요소 안의 맨 HTML(`p`·`h2`·`ul`·`a`·`code`·`table` 등)에 활자를 입히는 CSS 한 장. 긴 글을 태그마다 클래스로 꾸미지 않고 쓴다.

```css
/* globals.css — theme.css 다음에 */
@import "@logjoa/ui/typeset.css";

/* 프리셋은 프로젝트마다. @layer components 밖에 두면 Tailwind 유틸리티로 덮어쓸 수 없다 */
@layer components {
  .typeset-article {
    --typeset-size: 1.05rem;   /* 본문 크기 (48rem 미만은 1.125배) */
    --typeset-leading: 1.8;    /* 줄 간격 */
    --typeset-flow: 1.75rem;   /* 문단 사이. 제목 위아래 간격도 여기서 나온다 */
  }
}
```

```tsx
<article className="typeset typeset-article">…</article>
```

- 제목 글꼴은 `--font-heading`, 코드는 `--font-mono`(theme.css)를 그대로 쓴다. 다크 모드는 테마 토큰을 따라 따로 할 것이 없다.
- `data-slot`이 있는 요소(shadcn 원본 컴포넌트)는 건드리지 않는다. 직접 만든 컴포넌트·버튼처럼 `data-slot`이 없는 것은 `not-typeset`을 달아 뺀다 — 안 달면 `<a>`에 밑줄, `ul`에 점이 붙는다.
- `not-typeset`을 단 요소는 위 간격도 받지 않는다. 글 흐름 안에 둘 때는 `mt-(--typeset-flow)`를 준다.
- 원본 shadcn CLI가 아니라 저장소 파일이라 `ui:update`·`ui:check` 대상이 아니다. 새로 받을 때는 맨 위 주석의 출처 커밋을 바꾸고 아래를 그대로 덮어쓴다.

## 원본 받기·확인

```bash
pnpm ui:update [이름...]  # shadcn에서 받아 src/ui·src/hooks를 덮어쓰고 ui.lock.json 기록 (이름 없으면 지금 있는 전부)
pnpm ui:check             # src/ui·src/hooks가 ui.lock.json 그대로인지 — CI에서 돈다
pnpm ui:upstream          # 최신 shadcn을 임시로 받아 지금과 다른 파일만 알림 (아무것도 안 바꿈)
```

- `ui:update`는 이 패키지 `theme.css`를 쓰는 빈 프로젝트에 shadcn CLI(버전은 `scripts/ui.mjs`의 `SHADCN`)로 받은 뒤 import만 패키지 안 경로로 바꾼다(`"cn"`→`"../cn"`, `@/components/ui/x`→`./x`, `@/hooks/x`→`../hooks/x`). 그래서 card·dialog 제목의 `font-heading`처럼 테마에 따라 CLI가 넣는 클래스도 원본 그대로다.
- shadcn 레지스트리는 버전이 고정되지 않는다. 같은 CLI로도 날마다 결과가 바뀔 수 있어서 CI는 "마지막으로 받은 것과 같은가"만 막고, 최신과의 차이는 `ui:upstream`으로 가끔 본다.
- 원본은 shadcn 코드 그대로라 react-hooks v7 린트 규칙에 걸리는 곳이 있다(carousel·use-mobile의 effect 안 setState). 프로젝트는 `node_modules`를 린트하지 않으니 문제없고, 이 저장소에 린트를 넣으면 `src/ui`·`src/hooks`는 뺀다.

## 고치기·배포

1. 이 저장소에서 고친다. 프로젝트 화면에서 확인하려면 `pnpm pack` 후 프로젝트에서 `pnpm add ../logjoa-ui/logjoa-ui-x.y.z.tgz`. (`pnpm link`는 이 저장소의 devDependencies React를 따로 읽어 React가 둘이 된다.)
2. `package.json` 버전을 올리고 커밋, `git tag vX.Y.Z && git push origin main vX.Y.Z` (가벼운 태그라 `--follow-tags`로는 안 올라간다).
3. 각 프로젝트에서 `#vX.Y.Z`로 바꾸고 `pnpm install`.

## 바뀐 것

- v0.19.1: 문의 문구의 메일 주소 조사를 "메일(주소)로"로 고침.
- v0.19.0: 문의 화면 한 벌 추가 — `ContactPage`·`ContactForm`·`contactMessages`(세 사이트 문의 화면을 같게).
- v0.18.0: `UserMenu` 다듬음 — `header`·`footer` 대신 `profile`·`signOut`(글자만 빨간 항목), 구역 사이 선, 열 때 자동 포커스 끔, 기본 너비 `w-72`.
- v0.17.0: 커스텀 `UserMenu` 추가(로그인한 사람의 계정 메뉴 — devlog 것을 옮기고 헤더·링크·로그아웃을 props로).
- v0.16.0: `LanguageMenu` 버튼을 아이콘만 남기도록 바꿈(`items[].short` 제거).
- v0.15.0: 커스텀 `LanguageMenu` 추가(헤더 언어 선택 — mylog 것을 옮기고 링크 주소·속성을 props로).
- v0.14.0: 커스텀 `DemoBanner` 추가(공유 데모 계정 안내).
- v0.13.0: 커스텀 `ConfirmDialog`(mobilog 것을 옮기고 `trigger`·`cancelLabel` 추가)·`ThemeToggle`·`EmptyState` 추가.
- v0.12.0: 원본 `empty` 추가(빈 상태 — 세 프로젝트 빈 목록 안내가 씀). 커스텀 `StatusScreen`·`GlobalErrorScreen` 추가(404·오류 화면 공통).
- v0.11.0: 커스텀 `AuthShell`·`AuthHeader`·`AuthFooter`(세 프로젝트 인증 화면 공통)·`Brand` 추가. `AdminShell`·`SiteHeader`·`SiteFooter`의 브랜드도 `Brand`로.
- v0.10.1: `SiteHeader` 메뉴를 Button 기본 크기(`h-8`·14px)로, 서랍 링크는 `lg`. `SiteFooter` 링크 묶음은 브랜드 옆 남은 폭을 고르게 나누고(가운데 빈칸 없앰), 묶음 제목 12px, 좁은 화면 링크 터치 영역을 넓힘. 두 블록 모두 `break-keep`(한국어 단어 중간 줄바꿈 방지).
- v0.10.0: shadcn Typeset 원본 `typeset.css` 추가(`@logjoa/ui/typeset.css`, 긴 글 활자).
- v0.9.0: 커스텀 `SiteHeader`·`SiteFooter` 추가(세 프로젝트 사이트 헤더·푸터 공통).
- v0.8.0: 커스텀 `AdminShell`·`AdminNav` 추가(세 프로젝트 관리자 화면 공통 틀).
- v0.7.0: 커스텀 `PageHeader`·`Inner`·`TableBase` 추가(devlog·mobilog에 똑같이 복사돼 있던 페이지 제목·콘텐츠 폭·표).
- v0.6.0: 원본 `item` 추가(아바타·이름 같은 목록 행).
- v0.5.0: 원본 `native-select` 추가(mylog 공유 게시판 필터의 `<select>`).
- v0.4.0: 원본 `alert` 추가(devlog 정책 안내 박스). 커스텀 `FullscreenMenu` 추가(mylog 모바일 메뉴).
- v0.3.0: `src/components`를 `src/ui`(원본)·`src/custom`(커스텀)으로 나눔. dialog(닫기 버튼 먼저 사라짐)·carousel·use-mobile을 원본으로 되돌림. `smart-date-input`은 `custom/`으로(import 경로 `@logjoa/ui/custom/smart-date-input`), devlog user-history의 날짜 입력을 `NormalizedDateInput`으로 들여옴. `ui:update`·`ui:check`·`ui:upstream` 추가.
- v0.2.0: mylog 전용 variant(Button `glass`·`pill`·`icon-round`, Tabs `pill`·`glass`, DropdownMenu `size="lg"`)와 그 토큰(`--shadow-ink`·`--shadow-sheen*`·`--ease-fluid`)을 뺌.
- v0.1.0: devlog ui 컴포넌트·테마로 시작.
