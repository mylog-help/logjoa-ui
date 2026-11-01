import * as React from "react";
import { cn } from "../cn";
import { Inner } from "./inner";

export type ContactNote = {
  /** 글자 앞 아이콘(lucide 등). */
  icon: React.ReactNode;
  title: string;
  description: string;
};

/**
 * 문의 페이지의 틀 — 왼쪽에 제목·설명·안내 목록, 오른쪽에 폼 카드(`children`).
 * 좁은 화면에서는 제목과 폼만 한 단으로 보인다(안내 목록은 숨긴다). 세 사이트가 같은 틀을 쓰도록 여기 한 곳에 둔다.
 * 서버 컴포넌트로도 쓸 수 있다(상태가 없다).
 */
export function ContactPage({
  title,
  subtitle,
  notes = [],
  children,
  className,
}: {
  /** 페이지 제목(h1). 보통 `contactMessages[locale].page.title`. */
  title: string;
  /** 제목 아래 설명. 사이트마다 다르다. */
  subtitle: string;
  /** 왼쪽 안내 목록. 사실인 것만 적는다. */
  notes?: ContactNote[];
  /** 폼. */
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Inner className={cn("max-w-full py-12 sm:py-20", className)}>
      {/*
        넓은 화면: 왼쪽에 제목·안내, 오른쪽에 폼. 폼이 길어 왼쪽을 세로 가운데에 둔다.
        폭은 기본 5xl 대신 wide 프레임(7xl)을 다 쓴다 — 5xl 이면 두 단이 좁게 붙는다.
        좁은 화면: 제목 → 폼만 보인다. 안내 목록은 폼을 첫 화면 밖으로 밀어내서 숨긴다
        (메일 주소 등 꼭 필요한 말은 폼·접수 실패 문구에도 있다).
      */}
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {title}
            </h1>
            <p className="text-base leading-relaxed text-pretty text-muted-foreground">
              {subtitle}
            </p>
          </div>

          {notes.length > 0 && (
            <ul className="hidden w-full flex-col lg:flex">
              {notes.map((note) => (
                <li
                  key={note.title}
                  className="flex gap-4 border-t py-5 last:border-b"
                >
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-4"
                    aria-hidden
                  >
                    {note.icon}
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{note.title}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {note.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </Inner>
  );
}
