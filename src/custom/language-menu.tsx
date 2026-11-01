"use client";

import * as React from "react";
import { CheckIcon, GlobeIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type LanguageMenuItem = {
  /** 언어 코드(`ko`·`en`·`ja`). `hrefLang`·`lang` 에도 쓴다. */
  code: string;
  /** 목록에 보이는 이름. 늘 그 언어 자신의 글자로(한국어·English·日本語). */
  label: string;
  /** 이 언어로 가는 주소. 같은 페이지의 번역이 없으면 그 언어의 홈으로 보내는 건 쓰는 쪽이 정한다. */
  href: string;
  /** 링크에 그대로 붙일 속성. next-intl 이라면 `{ locale: code }`. */
  linkProps?: Record<string, unknown>;
};

type LinkLike = React.ElementType<{
  href: string;
  className?: string;
  hrefLang?: string;
  lang?: string;
  "aria-current"?: "page" | "true";
  children?: React.ReactNode;
}>;

/**
 * 헤더용 언어 선택 — 글로브 아이콘 버튼 하나, 누르면 드롭다운(지금 언어에 체크). 고르면 바로 이동한다.
 * 실제 링크라서 새 탭·크롤링이 되고 `hreflang` 이 붙는다. 경로 바꾸기는 쓰는 쪽
 * 몫이다(`items[].href`·`linkProps`) — 이 컴포넌트는 라우터를 모른다.
 */
export function LanguageMenu({
  items,
  current,
  label,
  linkComponent: Link = "a",
  className,
}: {
  items: LanguageMenuItem[];
  /** 지금 언어 코드. */
  current: string;
  /** 화면 읽기 프로그램용 이름("언어"). 지금 언어가 뒤에 붙는다. */
  label: string;
  /** 프로젝트 라우터의 Link. 기본은 `<a>`. */
  linkComponent?: LinkLike;
  className?: string;
}) {
  const active = items.find((item) => item.code === current);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={active ? `${label}: ${active.label}` : label}
          title={active ? `${label}: ${active.label}` : label}
          className={className}
        >
          <GlobeIcon aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-36">
        {items.map((item) => (
          <DropdownMenuItem key={item.code} asChild>
            <Link
              {...item.linkProps}
              href={item.href}
              hrefLang={item.code}
              lang={item.code}
              aria-current={item.code === current ? "true" : undefined}
            >
              <span className="flex-1">{item.label}</span>
              {item.code === current && (
                <CheckIcon className="size-3.5" aria-hidden />
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
