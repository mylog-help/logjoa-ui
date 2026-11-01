"use client";

import * as React from "react";
import { UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export type UserMenuItem = {
  href: string;
  label: React.ReactNode;
  /** 글자 앞 아이콘. */
  icon?: React.ReactNode;
  /** 새 탭으로 여는 바깥 링크. */
  external?: boolean;
};

type LinkLike = React.ElementType<{
  href: string;
  className?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  children?: React.ReactNode;
}>;

/**
 * 로그인한 사람의 계정 메뉴 — 헤더에 아이콘 버튼 하나, 누르면 팝오버.
 * 위에서부터 `header`(프로필·이메일), `children`(쿠폰 같은 쓰는 쪽 구역),
 * `items`(링크 목록), `footer`(로그아웃)가 쌓인다. 로그아웃 동작은 쓰는 쪽이
 * 정한다(폼 POST든 클라이언트 호출이든) — 이 컴포넌트는 인증을 모른다.
 */
export function UserMenu({
  label,
  icon,
  header,
  items = [],
  children,
  footer,
  linkComponent: Link = "a",
  className,
}: {
  /** 버튼의 화면 읽기 프로그램용 이름("유저 메뉴"). */
  label: string;
  /** 버튼 안 모양. 없으면 `User` 아이콘. 사용자 사진이 있으면 쓰는 쪽이 넘긴다. */
  icon?: React.ReactNode;
  /** 맨 위 프로필 영역. 아래에 구분선이 붙는다. */
  header?: React.ReactNode;
  items?: UserMenuItem[];
  /** `header` 와 `items` 사이에 들어가는 쓰는 쪽 구역. */
  children?: React.ReactNode;
  /** 맨 아래(로그아웃). 위에 구분선이 붙는다. */
  footer?: React.ReactNode;
  /** 프로젝트 라우터의 Link. 기본은 `<a>`. */
  linkComponent?: LinkLike;
  /** 팝오버 내용에 붙일 클래스(너비 등). */
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} title={label}>
          {icon ?? <UserIcon aria-hidden />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className={className}>
        {header && (
          <div className="border-b border-border pb-2.5">{header}</div>
        )}
        {children}
        {items.length > 0 && (
          <nav className="flex flex-col gap-0.5">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                {...(item.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-muted [&_svg]:size-4 [&_svg]:text-muted-foreground"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        {footer && (
          <div className="flex flex-col border-t border-border pt-2.5">
            {footer}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
