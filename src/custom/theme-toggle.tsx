"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

/**
 * 밝은·어두운 테마 전환 아이콘 버튼. 쓰는 쪽 루트에 next-themes `ThemeProvider` 가 있어야 한다.
 * 서버 렌더 때는 테마를 모르므로 아이콘은 CSS(`dark:`)로 바꾼다 — 하이드레이션 경고가 없다.
 */
export function ThemeToggle({
  label = "밝은 테마와 어두운 테마 전환",
  variant = "ghost",
  className,
}: {
  /** 화면 읽기 프로그램·마우스 올림 설명. */
  label?: string;
  variant?: "ghost" | "outline";
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size="icon"
      className={className}
      aria-label={label}
      title={label}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </Button>
  );
}
