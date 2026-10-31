import * as React from "react";
import { cn } from "../cn";
import { Separator } from "../ui/separator";
import { Brand, type BrandInfo } from "./brand";
import { Inner } from "./inner";

export type SiteFooterLink = {
  href: string;
  label: React.ReactNode;
  /** 글자 앞 아이콘(소셜 링크 등). */
  icon?: React.ReactNode;
  /** 새 탭으로 여는 바깥 링크. */
  external?: boolean;
  /** `rel` 을 직접 정할 때(예: 소셜 계정의 `me`). `external` 의 기본값을 덮는다. */
  rel?: string;
  /** 링크에 그대로 붙일 `data-*` 속성(분석 태그 등). */
  data?: Record<`data-${string}`, string | undefined>;
};

export type SiteFooterGroup = {
  title: React.ReactNode;
  links: SiteFooterLink[];
};

type LinkLike = React.ElementType<{
  href: string;
  className?: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  children?: React.ReactNode;
}>;

type SiteFooterProps = {
  /** 왼쪽 브랜드. `logo` 는 7×7 기본색 네모 안에 들어간다(`SiteHeader` 와 같다). */
  brand: BrandInfo;
  /** 브랜드 아래 한두 줄 소개. */
  description?: React.ReactNode;
  /** 소개 아래 소셜 링크. */
  social?: SiteFooterLink[];
  /** 오른쪽 링크 묶음(제품·지원·약관 등). */
  groups?: SiteFooterGroup[];
  /** 구분선 아래 작은 글자 영역 — 사업자 정보·저작권·방문자 수 등. 줄마다 `<p>` 로 넣는다(`<p>` 안 링크에 밑줄). */
  children?: React.ReactNode;
  /** 프로젝트 라우터의 Link. 기본은 `<a>`. 바깥 링크(`external`)는 늘 `<a>`. */
  linkComponent?: LinkLike;
  className?: string;
};

function FooterLink({
  link,
  Link,
  className,
}: {
  link: SiteFooterLink;
  Link: LinkLike;
  className?: string;
}) {
  const Comp: LinkLike = link.external ? "a" : Link;
  return (
    <Comp
      href={link.href}
      className={className}
      target={link.external ? "_blank" : undefined}
      rel={link.rel ?? (link.external ? "noopener noreferrer" : undefined)}
      {...link.data}
    >
      {link.icon}
      {link.label}
    </Comp>
  );
}

/**
 * 사이트 아래쪽 — 브랜드·소개·소셜, 링크 묶음, 구분선 아래 작은 글자.
 * 폭과 좌우 여백은 `Inner size="wide"` 와 같다. 상태가 없어 서버 컴포넌트에서 그대로 쓴다.
 */
export function SiteFooter({
  brand,
  description,
  social = [],
  groups = [],
  children,
  linkComponent: Link = "a",
  className,
}: SiteFooterProps) {
  return (
    <footer
      className={cn("w-full border-t bg-background break-keep", className)}
    >
      <Inner size="wide" className="py-12">
        {/* 브랜드는 고정 폭, 링크 묶음은 남은 폭을 고르게 나눈다 — 가운데가 비지 않게 */}
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="flex flex-col gap-3 md:w-72 md:shrink-0">
            <Brand brand={brand} linkComponent={Link} />
            {description && (
              <p className="text-sm text-pretty text-muted-foreground">
                {description}
              </p>
            )}
            {social.length > 0 && (
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {social.map((link) => (
                  <li key={link.href}>
                    <FooterLink
                      link={link}
                      Link={Link}
                      className="flex items-center gap-1.5 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-4"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {groups.length > 0 && (
            <div className="grid flex-1 grid-cols-2 gap-8 sm:auto-cols-fr sm:grid-flow-col sm:grid-cols-none">
              {groups.map((group, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <p className="text-xs font-medium">{group.title}</p>
                  <ul className="flex flex-col">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <FooterLink
                          link={link}
                          Link={Link}
                          className="inline-block py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:py-1"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {children && (
          <>
            <Separator className="my-8" />
            <div className="flex flex-col gap-2 text-xs text-muted-foreground [&_p_a]:underline [&_p_a]:underline-offset-4 [&_p_a:hover]:text-foreground">
              {children}
            </div>
          </>
        )}
      </Inner>
    </footer>
  );
}
