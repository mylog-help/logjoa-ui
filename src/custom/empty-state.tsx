import * as React from "react";
import { cn } from "../cn";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";

/**
 * 목록·검색 결과가 비었을 때 안내 — 원본 `Empty` 에 점선 테두리(`bordered`)를 더한 것.
 * 원본 `Empty` 에는 테두리 variant 가 없어 쓰는 쪽마다 `className="border"` 를 덧칠하던 것을 여기로 모았다.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  bordered = true,
  className,
}: {
  /** 아이콘 요소(`<FileTextIcon />` 등). 둥근 네모 칸 안에 들어간다. */
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** 아래 버튼 (새로 만들기 등). */
  action?: React.ReactNode;
  /** 점선 테두리. 표·카드 안처럼 이미 테두리가 있는 자리에서는 false. */
  bordered?: boolean;
  /** 바깥 배치(높이·여백)용. 모양은 바꾸지 않는다. */
  className?: string;
}) {
  return (
    <Empty className={cn(bordered && "border", className)}>
      <EmptyHeader>
        {icon && <EmptyMedia variant="icon">{icon}</EmptyMedia>}
        {title && <EmptyTitle>{title}</EmptyTitle>}
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}
