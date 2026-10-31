import * as React from "react";
import { InfoIcon } from "lucide-react";
import { cn } from "../cn";
import { Inner } from "./inner";

/**
 * 데모 계정으로 둘러보는 중임을 알리는 표시.
 * - `bar` (기본): 헤더 바로 아래 전체 폭 띠. 폭·여백은 `Inner size="wide"`.
 * - `box`: 본문 맨 위에 넣는 둥근 상자 — 고정 사이드바가 있는 앱 화면처럼 전체 폭 띠가 가려지는 곳.
 * 문구·오른쪽 버튼(로그아웃·가입 등)은 쓰는 쪽이 정한다. 상태가 없어 서버 컴포넌트에서도 쓴다.
 */
export function DemoBanner({
  children = "데모 계정으로 둘러보는 중이에요. 공개 글쓰기와 계정 변경은 막혀 있어요.",
  action,
  variant = "bar",
  className,
}: {
  children?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "bar" | "box";
  className?: string;
}) {
  const content = (
    <>
      <InfoIcon className="size-4 shrink-0" aria-hidden />
      <p className="flex-1">{children}</p>
      {action}
    </>
  );
  const row = "flex min-h-10 items-center gap-2 py-2 text-sm text-muted-foreground";

  if (variant === "box") {
    return (
      <div
        role="status"
        className={cn(row, "rounded-lg border bg-background px-3 break-keep", className)}
      >
        {content}
      </div>
    );
  }

  return (
    <div role="status" className={cn("w-full border-b bg-muted break-keep", className)}>
      <Inner size="wide" className={row}>
        {content}
      </Inner>
    </div>
  );
}
