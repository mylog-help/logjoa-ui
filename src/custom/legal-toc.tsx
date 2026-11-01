"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../cn";

/** 루트 글자 크기를 읽지 못했을 때 쓰는 헤더 여백(px). */
const FALLBACK_TOP_PX = 88;

/**
 * 긴 문서 옆에 세워 두는 목차. 지금 읽고 있는 절을 표시한다 — 절이 열 개 넘는
 * 글은 "내가 어디쯤인지"가 안 보이면 스크롤 막대만 보고 가늠하게 된다.
 *
 * scroll 이벤트 대신 IntersectionObserver 를 쓴다. 화면 위쪽을 지나간 절 중 마지막
 * 것을 현재 절로 본다 — 절이 짧으면 여러 개가 동시에 화면에 걸리므로 "보이는 것"만
 * 으로는 하나로 좁혀지지 않는다.
 *
 * 헤더에 가리는 높이는 목차 자신의 sticky `top` 을 읽어 쓴다. 사이트마다 헤더
 * 높이가 달라도(`--site-header-h`) 앵커로 멈추는 자리와 현재 절로 잡히는 자리가
 * 같은 값에서 나온다. `rootMargin` 은 px·% 만 받으므로 계산된 px 를 쓴다.
 */
export function LegalToc({
  sections,
  numbered = true,
  label,
  className,
}: {
  sections: { id: string; title: string }[];
  /** 제목이 이미 번호를 달고 있으면(약관의 `제1조`) 꺼서 겹치지 않게 한다. */
  numbered?: boolean;
  /** 스크린리더가 읽는 이름. */
  label: string;
  className?: string;
}) {
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(sections[0]?.id);

  // 부모가 매 렌더 새 배열을 넘겨도 관찰자를 다시 만들지 않게 id 문자열로 비교한다.
  const key = sections.map((section) => section.id).join(",");

  useEffect(() => {
    const els = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el) => el !== null);
    if (els.length === 0) return;

    const top = navRef.current
      ? parseFloat(getComputedStyle(navRef.current).top)
      : NaN;
    const offset = Number.isFinite(top) && top > 0 ? top : FALLBACK_TOP_PX;

    /** 화면 위쪽을 이미 지났거나 지금 걸려 있는 절. */
    const passed = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // top < 0 이면 위로 지나간 절이다. 화면 밖이라고 뒤로 돌아가면 안 된다.
          passed.set(
            entry.target.id,
            entry.isIntersecting || entry.boundingClientRect.top < 0,
          );
        }
        const current = els.filter((el) => passed.get(el.id)).at(-1);
        setActive((current ?? els[0]).id);
      },
      // 헤더에 가린 만큼 위를 깎고, 아래는 화면 3분의 2 를 잘라 "위쪽까지 올라온"
      // 절만 후보가 되게 한다.
      { rootMargin: `-${Math.round(offset)}px 0px -66% 0px`, threshold: 0 },
    );

    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, [key]);

  /**
   * 목차가 화면보다 길면 현재 항목이 레일 밖으로 밀려난다. 레일이 실제로 넘칠
   * 때만 레일의 scrollTop 을 맞춘다 — `scrollIntoView` 는 페이지 전체를 움직여
   * 읽던 자리를 빼앗는다.
   */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || nav.scrollHeight <= nav.clientHeight) return;

    const el = nav.querySelector<HTMLElement>(
      `[data-legal-toc-item="${active}"]`,
    );
    if (!el) return;

    const navBox = nav.getBoundingClientRect();
    const box = el.getBoundingClientRect();
    if (box.top >= navBox.top && box.bottom <= navBox.bottom) return;

    nav.scrollTop +=
      box.top - navBox.top - (nav.clientHeight - el.clientHeight) / 2;
  }, [active]);

  return (
    <nav ref={navRef} aria-label={label} className={className}>
      <ol className="flex flex-col gap-0.5">
        {sections.map((section, index) => {
          const current = section.id === active;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                data-legal-toc-item={section.id}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "flex items-baseline gap-2.5 rounded-lg py-1.5 pr-2 pl-2.5 text-sm leading-snug transition-colors",
                  current
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {numbered && (
                  <span
                    aria-hidden
                    className={cn(
                      "shrink-0 font-mono text-xs tabular-nums transition-colors",
                      current ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
                <span className="min-w-0">{section.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
