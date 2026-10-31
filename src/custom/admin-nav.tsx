"use client";

import * as React from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export type AdminNavItem = {
  href: string;
  label: React.ReactNode;
  /** 지금 화면인지. 없으면 `href === currentPath` 로 판단한다. */
  active?: boolean;
  /** 새 탭으로 여는 바깥 링크. */
  external?: boolean;
};

export type AdminNavGroup = {
  /** 묶음 이름. 없으면 이름 없이 항목만. */
  label?: React.ReactNode;
  items: AdminNavItem[];
};

type LinkLike = React.ElementType<{
  href: string;
  onClick?: () => void;
  "aria-current"?: "page";
  target?: string;
  rel?: string;
  children?: React.ReactNode;
}>;

type AdminNavProps = {
  groups: AdminNavGroup[];
  /** 프로젝트 라우터 기준 현재 경로 (`usePathname()`). */
  currentPath: string;
  /** 프로젝트 라우터의 Link. 기본은 `<a>`. */
  linkComponent?: LinkLike;
  /** 좁은 화면 메뉴 버튼과 서랍 제목. */
  menuLabel?: string;
  sheetTitle?: string;
};

function NavList({
  groups,
  currentPath,
  linkComponent: Link = "a",
  onNavigate,
}: Omit<AdminNavProps, "menuLabel" | "sheetTitle"> & {
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="관리 메뉴" className="flex flex-col gap-6">
      {groups.map((group, i) => (
        <div key={i} className="flex flex-col gap-1">
          {group.label && (
            <p className="px-2.5 text-xs font-medium text-muted-foreground">
              {group.label}
            </p>
          )}
          {group.items.map((item) => {
            const active = item.active ?? item.href === currentPath;
            return (
              <Button
                key={item.href}
                asChild
                variant={active ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                )}
              </Button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

/**
 * `AdminShell` 왼쪽 메뉴. 넓은 화면은 목록, `lg` 미만은 "메뉴" 버튼 + 왼쪽 서랍.
 * 링크 컴포넌트와 현재 경로는 쓰는 쪽 라우터에서 받는다(프로젝트마다 i18n Link 가 다르다).
 */
export function AdminNav({
  menuLabel = "메뉴",
  sheetTitle = "관리",
  ...props
}: AdminNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="hidden lg:block">
        <NavList {...props} />
      </div>

      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <MenuIcon aria-hidden />
              {menuLabel}
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>{sheetTitle}</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-4">
              <NavList {...props} onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
