import * as React from "react";
import { cn } from "../cn";
import { Brand, type BrandInfo } from "./brand";

type LinkLike = React.ElementType<{
  href: string;
  className?: string;
  children?: React.ReactNode;
}>;

type AuthShellProps = {
  /** 왼쪽 위 브랜드. 누르면 `href`(보통 사이트 홈)로 간다. */
  brand: BrandInfo;
  /** 브랜드 줄 오른쪽 (테마 전환 등). */
  actions?: React.ReactNode;
  /**
   * 넓은 화면 오른쪽 패널(`bg-muted`). 이미지·서비스 소개 등.
   * 이미지는 `absolute inset-0 size-full object-cover` 로 넣으면 패널을 채운다. 없으면 한 단.
   */
  aside?: React.ReactNode;
  /** 프로젝트 라우터의 Link (next/link, next-intl Link 등). 기본은 `<a>`. */
  linkComponent?: LinkLike;
  className?: string;
  children: React.ReactNode;
};

/**
 * 로그인·가입·비밀번호 재설정 화면 틀 — 왼쪽 위 브랜드, 가운데 폼(`max-w-sm`), 넓은 화면 오른쪽 패널.
 * 폼 위에는 `AuthHeader`, 아래에는 `AuthFooter`. 실제 로그인 처리는 쓰는 쪽 폼에 둔다.
 * 상태가 없어 서버 컴포넌트에서 그대로 쓴다.
 */
export function AuthShell({
  brand,
  actions,
  aside,
  linkComponent,
  className,
  children,
}: AuthShellProps) {
  return (
    <div
      className={cn(
        "grid min-h-svh bg-background break-keep",
        aside && "lg:grid-cols-2",
        className,
      )}
    >
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex items-center justify-between gap-2">
          <Brand brand={brand} linkComponent={linkComponent} />
          {actions && <div className="flex items-center gap-1">{actions}</div>}
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
        </div>
      </div>
      {aside && (
        <div className="relative hidden flex-col justify-center gap-6 overflow-hidden bg-muted p-10 lg:flex">
          {aside}
        </div>
      )}
    </div>
  );
}

/**
 * 인증 화면 제목(`h1`)과 설명. `icon` 은 메일 확인·완료 같은 상태 화면에서 제목 위에 둥근 칸으로.
 */
export function AuthHeader({
  title,
  description,
  icon,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col items-center gap-1 text-center", className)}
    >
      {icon && (
        <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-foreground [&_svg]:size-6">
          {icon}
        </span>
      )}
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && (
        <p className="text-sm text-balance text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * 폼 아래 전환 문구 — "계정이 없나요? 가입하기", "비밀번호를 잊으셨나요?" 등. 줄마다 `<p>` 로 넣는다.
 * 안의 링크는 밑줄로 그린다.
 */
export function AuthFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 text-center text-sm text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
