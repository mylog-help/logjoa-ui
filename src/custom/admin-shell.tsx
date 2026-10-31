import * as React from "react";
import { cn } from "../cn";
import { Inner } from "./inner";

type LinkLike = React.ElementType<{
  href: string;
  className?: string;
  children?: React.ReactNode;
}>;

type AdminShellProps = {
  /**
   * 왼쪽 위 브랜드. 누르면 `href`(보통 관리 홈)로 간다.
   * `logo` 는 7×7 기본색 네모 안에 들어간다 — 글자 한 자, 아이콘, `<img>` 모두 된다.
   */
  brand: { name: React.ReactNode; logo?: React.ReactNode; href: string };
  /** 브랜드 옆에 흐리게 붙는 구역 이름. */
  title?: React.ReactNode;
  /** 위쪽 바 오른쪽 (테마 전환·계정 링크 등). */
  actions?: React.ReactNode;
  /** 왼쪽 메뉴 자리. 보통 `AdminNav`. 없으면 본문만 넓게. */
  nav?: React.ReactNode;
  /** 프로젝트 라우터의 Link (next/link, next-intl Link 등). 기본은 `<a>`. */
  linkComponent?: LinkLike;
  className?: string;
  children: React.ReactNode;
};

/**
 * 관리자 화면 공통 틀 — 위쪽 바(브랜드·구역 이름·액션), 왼쪽 메뉴, 본문.
 * 폭과 좌우 여백은 `Inner size="wide"` 와 같다. 접근 확인은 쓰는 쪽 layout 에서 한다.
 */
export function AdminShell({
  brand,
  title = "관리",
  actions,
  nav,
  linkComponent: Link = "a",
  className,
  children,
}: AdminShellProps) {
  return (
    <div className={cn("flex min-h-svh w-full flex-col", className)}>
      <header className="sticky top-0 z-10 border-b bg-background">
        <Inner size="wide" className="flex h-14 items-center gap-2">
          <Link
            href={brand.href}
            className="flex items-center gap-2 font-semibold"
          >
            {brand.logo && (
              <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary text-sm font-bold text-primary-foreground [&_img]:size-full [&_img]:object-cover [&_svg]:size-4">
                {brand.logo}
              </span>
            )}
            {brand.name}
          </Link>
          {title && (
            <span className="text-sm text-muted-foreground">{title}</span>
          )}
          {actions && (
            <div className="ml-auto flex items-center gap-2">{actions}</div>
          )}
        </Inner>
      </header>

      <Inner
        size="wide"
        className="flex flex-1 flex-col gap-6 py-8 lg:flex-row lg:gap-10"
      >
        {nav && (
          <div className="shrink-0 lg:w-56">
            <div className="lg:sticky lg:top-22">{nav}</div>
          </div>
        )}
        {/* 블록 흐름 — 첫 줄 `PageHeader` 의 mb-8 이 본문과의 간격이다 */}
        <main className="min-w-0 flex-1">{children}</main>
      </Inner>
    </div>
  );
}
