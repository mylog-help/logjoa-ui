# @logjoa/ui

logjoa 웹 프로젝트(devlog·mobilog·mylog) 공통 shadcn 컴포넌트와 테마. npm에 올리지 않고 git 태그로 설치한다.

## 쓰기

```bash
pnpm add "github:mylog-help/logjoa-ui#v0.1.0"
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
import { Button } from "@logjoa/ui/button";
import { cn } from "@logjoa/ui/cn";
```

- `cn`은 패키지 것을 쓴다. 세 프로젝트의 커스텀 글자 크기(`text-caption` 등)를 등록해 둬서, 색 클래스를 지우지 않는다. 프로젝트에 `--text-*`를 추가하면 `src/cn.ts`의 `CUSTOM_TEXT_SIZES`에도 넣는다.
- `@shadcn/lint`의 `no-restyle`이 이 패키지 컴포넌트를 알아보게 `components.json`의 `aliases.ui`를 `"@logjoa/ui"`로.
- `cmdk`·`vaul`·`sonner`·`recharts` 등은 선택 peer 의존성 — 그 컴포넌트를 쓰는 프로젝트만 설치한다.

## shadcn 기본에 더한 것

나머지는 shadcn(radix-nova) 그대로라 모양·사용법은 [shadcn 문서](https://ui.shadcn.com/docs/components)를 본다. 아래만 이 패키지에서 더했다. 쓰는 곳은 2026-10-31 기준.

| 컴포넌트                     | 추가                | 모양                                                    | 쓰는 곳                                                                                 |
| ---------------------------- | ------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `Button`                     | `variant="glass"`   | 반투명 유리 + 윗선 하이라이트 + 떠 있는 그림자          | mylog `site-header.tsx`(오른쪽 아래 테마 버튼, `ThemeToggle variant`)                   |
| `Button`                     | `size="pill"`       | 높이 44px 알약, primary 섞인 그림자, 누르면 살짝 줄어듦 | mylog `marketing/demo-frame.tsx`, `viewer/drop-zone.tsx`                                |
| `Button`                     | `size="icon-round"` | 32px 원형 아이콘 버튼                                   | mylog `theme-toggle.tsx`                                                                |
| `TabsList`                   | `variant="pill"`    | 둥근 트레이 안 세그먼트, 선택 탭이 카드처럼 떠오름      | mylog `marketing/features-tabs.tsx`                                                     |
| `TabsList`                   | `variant="glass"`   | 스크롤을 따라오는 반투명 탭 줄                          | mylog `viewer/viewer-app.tsx`                                                           |
| `DropdownMenuContent`·`Item` | `size="lg"`         | 더 둥글고 넓은 메뉴(알약 버튼 옆에 붙는 메뉴용)         | mylog `site-header.tsx`("더 보기"), `language-links.tsx` — Content와 Item을 함께 `lg`로 |
| `DialogContent`              | (기본 동작)         | 닫히는 동안 닫기 버튼이 먼저 사라짐                     | 모든 대화상자                                                                           |
| `ScrollArea`                 | (컴포넌트)          | shadcn `scroll-area` 그대로                             | mylog에서 가져옴                                                                        |

- `glass`·`pill` 계열은 `theme.css`의 `--shadow-ink`·`--shadow-sheen*`·`--ease-fluid`를 쓴다. 이 토큰을 프로젝트에서 덮어쓰면 모양이 바뀐다.
- variant를 새로 더하면 이 표에도 적는다. 한 프로젝트에서만 쓰는 모양이면 패키지에 넣기 전에 그 프로젝트에서 감싸 쓰는 것으로 충분한지 먼저 본다.

## 고치기

1. 이 저장소에서 고친다. 프로젝트 화면에서 확인하려면 `pnpm pack` 후 프로젝트에서 `pnpm add ../logjoa-ui/logjoa-ui-x.y.z.tgz`. (`pnpm link`는 이 저장소의 devDependencies React를 따로 읽어 React가 둘이 된다.)
2. `package.json` 버전을 올리고 커밋, `git tag vX.Y.Z && git push --follow-tags`.
3. 각 프로젝트에서 `#vX.Y.Z`로 바꾸고 `pnpm install`.

컴포넌트를 새로 받을 때(`shadcn add`)는 아무 프로젝트에서 받은 뒤 `src/components`로 옮기고 import를 상대 경로(`./button`, `../cn`)로 바꾼다.
