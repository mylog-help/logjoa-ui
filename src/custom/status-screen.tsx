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
 * 404·오류 화면 — 큰 코드(`404` 등), 제목(`h1`), 설명, 오류 코드(`digest`), 버튼.
 * 원본 `Empty` 위에 쌓는다. 레이아웃 안에서는 `min-h-[60vh]`, 레이아웃 밖(루트 not-found)은 `fullScreen`.
 * 상태가 없어 서버·클라이언트 어디서나 쓴다. `error.tsx` 의 `reset` 은 쓰는 쪽 버튼에서 부른다.
 */
export function StatusScreen({
  code,
  title,
  description,
  digest,
  digestLabel = "오류 코드",
  actions,
  fullScreen = false,
  className,
}: {
  /** 제목 위 큰 글자 — "404" 등. 오류 화면은 비워 둔다. */
  code?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Next 오류 `digest`. 있으면 작은 고정폭 글자로 보여 준다(문의할 때 쓰라고). */
  digest?: string;
  digestLabel?: React.ReactNode;
  /** 버튼 줄 — "다시 시도"·"홈으로" 등. */
  actions?: React.ReactNode;
  /** 화면 전체 높이. 레이아웃(헤더) 없이 그릴 때. */
  fullScreen?: boolean;
  className?: string;
}) {
  return (
    <Empty
      className={cn(
        "break-keep",
        fullScreen ? "min-h-svh" : "min-h-[60vh]",
        className,
      )}
    >
      <EmptyHeader>
        {code && (
          <EmptyMedia>
            <span className="text-6xl font-bold tracking-tight text-primary">
              {code}
            </span>
          </EmptyMedia>
        )}
        <EmptyTitle>
          <h1 className="text-2xl font-semibold">{title}</h1>
        </EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
        {digest && (
          <p className="font-mono text-xs text-muted-foreground">
            {digestLabel}: {digest}
          </p>
        )}
      </EmptyHeader>
      {actions && (
        <EmptyContent>
          <div className="flex flex-wrap justify-center gap-2">{actions}</div>
        </EmptyContent>
      )}
    </Empty>
  );
}

/**
 * `global-error.tsx` 화면 — 루트 레이아웃까지 실패했을 때. 전역 CSS가 없을 수 있어 인라인 스타일로만 그린다.
 * `<html>`·`<body>` 를 직접 그린다. 쓰는 쪽 파일에 `"use client"` 를 두고 `reset` 을 `onRetry` 로 넘긴다.
 */
export function GlobalErrorScreen({
  lang = "ko",
  title = "문제가 발생했습니다.",
  description = "잠시 후 다시 시도해 주세요.",
  retryLabel = "다시 시도",
  digest,
  digestLabel = "오류 코드",
  onRetry,
}: {
  lang?: string;
  title?: string;
  description?: string;
  retryLabel?: string;
  digest?: string;
  digestLabel?: string;
  onRetry: () => void;
}) {
  return (
    <html lang={lang}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#fafafa",
          color: "#374151",
          wordBreak: "keep-all",
        }}
      >
        <div style={{ textAlign: "center", padding: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>{title}</h1>
          <p style={{ color: "#6b7280" }}>{description}</p>
          {digest && (
            <p
              style={{ fontFamily: "monospace", fontSize: 12, color: "#9ca3af" }}
            >
              {digestLabel}: {digest}
            </p>
          )}
          <button
            type="button"
            onClick={onRetry}
            style={{
              marginTop: 16,
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            {retryLabel}
          </button>
        </div>
      </body>
    </html>
  );
}
