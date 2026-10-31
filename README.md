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

## 고치기

1. 이 저장소에서 고친다. 프로젝트 화면에서 확인하려면 `pnpm pack` 후 프로젝트에서 `pnpm add ../logjoa-ui/logjoa-ui-x.y.z.tgz`. (`pnpm link`는 이 저장소의 devDependencies React를 따로 읽어 React가 둘이 된다.)
2. `package.json` 버전을 올리고 커밋, `git tag vX.Y.Z && git push --follow-tags`.
3. 각 프로젝트에서 `#vX.Y.Z`로 바꾸고 `pnpm install`.

컴포넌트를 새로 받을 때(`shadcn add`)는 아무 프로젝트에서 받은 뒤 `src/components`로 옮기고 import를 상대 경로(`./button`, `../cn`)로 바꾼다.
