import * as React from "react";
import { cn } from "../cn";

export type BrandInfo = {
  name: React.ReactNode;
  /** 7×7 기본색 네모 안에 들어간다 — 글자 한 자, 아이콘, `<img>` 모두 된다. */
  logo?: React.ReactNode;
  href: string;
};

type LinkLike = React.ElementType<{
  href: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}>;

/**
 * 브랜드(네모 로고 + 이름) 링크. `AdminShell`·`SiteHeader`·`SiteFooter`·`AuthShell` 이 같이 쓴다.
 * 상태가 없어 서버 컴포넌트에서도 그대로 쓴다.
 */
export function Brand({
  brand,
  linkComponent: Link = "a",
  onClick,
  className,
}: {
  brand: BrandInfo;
  /** 프로젝트 라우터의 Link. 기본은 `<a>`. */
  linkComponent?: LinkLike;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={brand.href}
      onClick={onClick}
      className={cn("flex shrink-0 items-center gap-2 font-semibold", className)}
    >
      {brand.logo && (
        <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary text-sm font-bold text-primary-foreground [&_img]:size-full [&_img]:object-cover [&_svg]:size-4">
          {brand.logo}
        </span>
      )}
      {brand.name}
    </Link>
  );
}
