import { cn } from "../cn";
import React from "react";

// 콘텐츠 폭 단계 — 좌우 여백은 헤더/푸터와 동일하게 통일
const SIZE_CLASS = {
  narrow: "max-w-2xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
} as const;

const FRAME_CLASS = "mx-auto w-full px-4 md:px-6";

type InnerProps = {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof SIZE_CLASS;
};

export const Inner = ({ children, className, size = "default" }: InnerProps) => {
  // default는 wide 프레임 안에서 왼쪽 정렬 — 목록(wide)↔상세 이동 시 시작선 유지
  if (size === "default") {
    return (
      <div className={cn(FRAME_CLASS, SIZE_CLASS.wide)}>
        <div className={cn(SIZE_CLASS.default, className)}>{children}</div>
      </div>
    );
  }

  return (
    <div className={cn(FRAME_CLASS, SIZE_CLASS[size], className)}>
      {children}
    </div>
  );
};

