"use client";

import * as React from "react";
import { LogOutIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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

export type UserMenuProfile = {
  /** 이름. 없으면 이메일만 보인다(이니셜도 이메일에서). */
  name?: string;
  email?: string;
  /** 프로필 사진 주소. 없으면 이니셜. */
  photoURL?: string;
};

export type UserMenuSignOut = {
  label: string;
  /** 있으면 이 주소로 POST 하는 폼(서버가 세션을 지우고 이동시킨다). */
  action?: string;
  /** `action` 이 없을 때 쓰는 클라이언트 동작. */
  onSignOut?: () => void | Promise<void>;
};

type LinkLike = React.ElementType<{
  href: string;
  className?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  children?: React.ReactNode;
}>;

/** 메뉴 안 한 줄(링크·로그아웃)의 공통 모양. */
const rowClass =
  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-hidden [&_svg]:size-4 [&_svg]:shrink-0";

/**
 * 로그인한 사람의 계정 메뉴 — 헤더에 아이콘 버튼 하나, 누르면 팝오버.
 * 위에서부터 `profile`(사진·이름·이메일), 본문(`children` 다음 `items`), `signOut`.
 * 구역 사이에만 선이 그어지고, 없는 구역은 선도 없다. 인증은 모르고 로그아웃
 * 동작은 쓰는 쪽이 정한다(`signOut.action` 폼 POST 또는 `onSignOut`).
 */
export function UserMenu({
  label,
  icon,
  profile,
  items = [],
  children,
  signOut,
  linkComponent: Link = "a",
  className,
}: {
  /** 버튼의 화면 읽기 프로그램용 이름("유저 메뉴"). */
  label: string;
  /** 버튼 안 모양. 없으면 `User` 아이콘. */
  icon?: React.ReactNode;
  profile?: UserMenuProfile;
  items?: UserMenuItem[];
  /** 링크 목록 위에 들어가는 쓰는 쪽 구역(쿠폰 등). */
  children?: React.ReactNode;
  signOut?: UserMenuSignOut;
  /** 프로젝트 라우터의 Link. 기본은 `<a>`. */
  linkComponent?: LinkLike;
  /** 팝오버 내용에 붙일 클래스. 기본 너비는 `w-72`. */
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  const hasBody = items.length > 0 || Boolean(children);
  const sections: React.ReactNode[] = [];

  if (profile && (profile.name || profile.email)) {
    const title = profile.name || profile.email || "";
    sections.push(
      <div key="profile" className="flex items-center gap-3 px-1 py-0.5">
        <Avatar size="lg">
          <AvatarImage src={profile.photoURL} alt="" />
          <AvatarFallback>
            {title.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{title}</p>
          {profile.name && profile.email && (
            <p className="truncate text-xs text-muted-foreground">
              {profile.email}
            </p>
          )}
        </div>
      </div>,
    );
  }

  if (hasBody) {
    sections.push(
      <div key="body" className="flex flex-col gap-2.5">
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
                className={`${rowClass} text-foreground [&_svg]:text-muted-foreground`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>,
    );
  }

  if (signOut) {
    const content = (
      <>
        <LogOutIcon aria-hidden />
        {signOut.label}
      </>
    );
    const signOutClass = `${rowClass} text-destructive`;
    sections.push(
      signOut.action ? (
        <form
          key="signout"
          action={signOut.action}
          method="post"
          className="flex flex-col"
        >
          <button type="submit" className={signOutClass}>
            {content}
          </button>
        </form>
      ) : (
        <button
          key="signout"
          type="button"
          className={signOutClass}
          onClick={async () => {
            close();
            await signOut.onSignOut?.();
          }}
        >
          {content}
        </button>
      ),
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} title={label}>
          {icon ?? <UserIcon aria-hidden />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={className}
        // 열자마자 첫 항목에 포커스 링이 뜨지 않게 한다(키보드로 Tab 하면 들어간다).
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div role="separator" className="-mx-2.5 h-px bg-border" />
            )}
            {section}
          </React.Fragment>
        ))}
      </PopoverContent>
    </Popover>
  );
}
