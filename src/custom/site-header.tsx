"use client";

import * as React from "react";
import { ChevronDownIcon, MenuIcon } from "lucide-react";
import { cn } from "../cn";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Inner } from "./inner";

export type SiteNavLink = {
  href: string;
  label: React.ReactNode;
  /** 드롭다운·서랍에서 글자 앞에 붙는 아이콘. 위쪽 바 링크에는 그리지 않는다. */
  icon?: React.ReactNode;
  /** 글자 뒤에 붙는 작은 표시(잠금 아이콘 등). 드롭다운·서랍에서만. */
  trailing?: React.ReactNode;
  /** 지금 위치인지. 없으면 `currentPath` 로 판단한다(아래 `isCurrent`). */
  active?: boolean;
  /** 새 탭으로 여는 바깥 링크. */
  external?: boolean;
  /** 링크에 그대로 붙일 `data-*` 속성(분석 태그 등). */
  data?: Record<`data-${string}`, string | undefined>;
};

export type SiteNavGroup = {
  /** 묶음 이름. 없으면 이름 없이 항목만. */
  label?: React.ReactNode;
  items: SiteNavLink[];
};

/** 위쪽 바에서 드롭다운으로 접히는 묶음. 서랍에서는 펼친 목록이 된다. */
export type SiteNavMenu = {
  label: React.ReactNode;
  groups: SiteNavGroup[];
};

export type SiteNavItem = SiteNavLink | SiteNavMenu;

type LinkLike = React.ElementType<{
  href: string;
  className?: string;
  onClick?: () => void;
  "aria-current"?: "page" | "true";
  target?: string;
  rel?: string;
  children?: React.ReactNode;
}>;

type SiteHeaderProps = {
  /** 왼쪽 브랜드. `logo` 는 7×7 기본색 네모 안에 들어간다(`AdminShell` 과 같다). */
  brand: { name: React.ReactNode; logo?: React.ReactNode; href: string };
  /** 가운데 내비게이션. `lg` 이상은 위쪽 바에, 미만은 오른쪽 서랍에. */
  nav?: SiteNavItem[];
  /**
   * 오른쪽 끝 — 늘 보인다(언어·로그인·테마 등). 좁은 화면에서 숨길 것은 쓰는 쪽이 감싸서 숨긴다.
   * 높이를 맞추려면 Button 기본 크기(`h-8`)·아이콘은 `size="icon"`. 가장 강한 버튼을 맨 오른쪽에.
   */
  actions?: React.ReactNode;
  /** 서랍 맨 아래(내려받기·언어 목록 등). */
  menuFooter?: React.ReactNode;
  /** 프로젝트 라우터 기준 현재 경로 (`usePathname()`). */
  currentPath?: string;
  /** 프로젝트 라우터의 Link (next/link, next-intl Link 등). 기본은 `<a>`. */
  linkComponent?: LinkLike;
  /** 서랍 버튼 이름·서랍 제목. */
  menuLabel?: string;
  /** 화면 읽기 프로그램용 서랍 설명 · `<nav>` 이름. */
  navLabel?: string;
  /** 위쪽에 붙어 따라오는지. */
  sticky?: boolean;
  className?: string;
  ref?: React.Ref<HTMLElement>;
};

function isMenu(item: SiteNavItem): item is SiteNavMenu {
  return "groups" in item;
}

/**
 * 링크가 지금 위치를 가리키는지. 같은 경로이거나 그 하위 경로면 맞다.
 * 앵커(`/#faq`)는 같은 페이지 안 이동이라 현재 위치로 치지 않는다.
 */
export function isCurrent(currentPath: string | undefined, href: string) {
  if (!currentPath || href.includes("#")) return false;
  return (
    currentPath === href ||
    (href !== "/" && currentPath.startsWith(`${href}/`))
  );
}

function linkProps(link: SiteNavLink, active: boolean) {
  return {
    href: link.href,
    "aria-current": active ? ("page" as const) : undefined,
    ...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
    ...link.data,
  };
}

function Brand({
  brand,
  Link,
  onClick,
}: {
  brand: SiteHeaderProps["brand"];
  Link: LinkLike;
  onClick?: () => void;
}) {
  return (
    <Link
      href={brand.href}
      onClick={onClick}
      className="flex shrink-0 items-center gap-2 font-semibold"
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

function DesktopMenu({
  menu,
  currentPath,
  Link,
}: {
  menu: SiteNavMenu;
  currentPath?: string;
  Link: LinkLike;
}) {
  const items = menu.groups.flatMap((group) => group.items);
  const anyActive = items.some(
    (item) => item.active ?? isCurrent(currentPath, item.href),
  );

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant={anyActive ? "secondary" : "ghost"}>
          {menu.label}
          <ChevronDownIcon aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-auto">
        {/* 묶음이 여럿이면 옆으로 나란히 — 긴 목록 하나로 내려가지 않게 */}
        <div className="grid gap-x-2 sm:auto-cols-fr sm:grid-flow-col">
          {menu.groups.map((group, i) => (
            <DropdownMenuGroup key={i}>
              {group.label && (
                <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
              )}
              {group.items.map((item) => {
                const active = item.active ?? isCurrent(currentPath, item.href);
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link {...linkProps(item, active)}>
                      {item.icon}
                      {item.label}
                      {item.trailing}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** 서랍용 — 바로 걸린 링크는 이름 없는 묶음 하나로, 드롭다운은 묶음별로 펼친다. */
function toSheetGroups(nav: SiteNavItem[]): SiteNavGroup[] {
  const groups: SiteNavGroup[] = [];
  let loose: SiteNavLink[] = [];
  const flush = () => {
    if (loose.length > 0) groups.push({ items: loose });
    loose = [];
  };
  for (const item of nav) {
    if (!isMenu(item)) {
      loose.push(item);
      continue;
    }
    flush();
    for (const group of item.groups) {
      groups.push({ label: group.label ?? item.label, items: group.items });
    }
  }
  flush();
  return groups;
}

/**
 * 사이트 위쪽 바 — 브랜드, 내비게이션(링크·드롭다운), 오른쪽 액션.
 * `lg` 미만은 내비게이션을 오른쪽 서랍(`Sheet`)으로 옮긴다.
 * 폭과 좌우 여백은 `Inner size="wide"` 와 같다. 로그인 여부·언어는 쓰는 쪽이 `actions` 로 넣는다.
 */
export function SiteHeader({
  brand,
  nav = [],
  actions,
  menuFooter,
  currentPath,
  linkComponent: Link = "a",
  menuLabel = "메뉴",
  navLabel = "사이트 메뉴",
  sticky = true,
  className,
  ref,
}: SiteHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  const hasMenu = nav.length > 0 || Boolean(menuFooter);

  return (
    <header
      ref={ref}
      className={cn(
        "z-40 w-full border-b bg-background break-keep",
        sticky && "sticky top-0",
        className,
      )}
    >
      <Inner size="wide" className="flex h-14 items-center gap-2">
        <Brand brand={brand} Link={Link} />

        {nav.length > 0 && (
          <nav
            aria-label={navLabel}
            className="ml-4 hidden items-center gap-1 lg:flex"
          >
            {nav.map((item, i) => {
              if (isMenu(item)) {
                return (
                  <DesktopMenu
                    key={i}
                    menu={item}
                    currentPath={currentPath}
                    Link={Link}
                  />
                );
              }
              const active = item.active ?? isCurrent(currentPath, item.href);
              return (
                <Button
                  key={item.href}
                  asChild
                  variant={active ? "secondary" : "ghost"}
                >
                  <Link {...linkProps(item, active)}>{item.label}</Link>
                </Button>
              );
            })}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-1">
          {actions}

          {hasMenu && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={menuLabel}
                  className="lg:hidden"
                >
                  <MenuIcon aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Brand brand={brand} Link={Link} onClick={close} />
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    {navLabel}
                  </SheetDescription>
                </SheetHeader>
                <nav
                  aria-label={navLabel}
                  className="flex flex-col gap-6 px-4 pb-6"
                >
                  {toSheetGroups(nav).map((group, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      {group.label && (
                        <p className="px-2.5 text-xs font-medium text-muted-foreground">
                          {group.label}
                        </p>
                      )}
                      {group.items.map((item) => {
                        const active =
                          item.active ?? isCurrent(currentPath, item.href);
                        return (
                          <Button
                            key={item.href}
                            asChild
                            variant={active ? "secondary" : "ghost"}
                            size="lg"
                            className="w-full justify-start"
                          >
                            <Link {...linkProps(item, active)} onClick={close}>
                              {item.icon}
                              {item.label}
                              {item.trailing}
                            </Link>
                          </Button>
                        );
                      })}
                    </div>
                  ))}
                  {menuFooter && (
                    <div className="flex flex-col gap-3 border-t pt-6">
                      {menuFooter}
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </Inner>
    </header>
  );
}
