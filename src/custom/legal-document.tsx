import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "../cn";
import { Inner } from "./inner";
import { LegalToc } from "./legal-toc";
import {
  formatLegalDate,
  legalMessages,
  type LegalLocale,
} from "./legal-messages";

/**
 * 약관·개인정보처리방침·법적고지처럼 절이 여러 개인 문서의 틀. 세 사이트
 * (devlog·mylog·mobilog)가 같은 틀을 쓰고, 본문(`sections`)만 사이트가 넘긴다.
 *
 * 목차는 **본문과 같은 배열 하나**에서 나온다. 절을 하나 더 쓰면 목차에도 저절로
 * 생긴다.
 *
 * 헤더에 가리는 높이는 `--site-header-h`(없으면 4rem)에 1.5rem 을 더한 값이다.
 * 목차의 sticky 위치, 앵커로 뛰었을 때 멈추는 자리, 현재 절 판정이 모두 이 값을
 * 쓴다. 헤더가 떠 있는 사이트는 감싸는 요소에서 `--site-header-h` 를 맞춘다.
 */

export type LegalSection = {
  /** 앵커. 한 번 정하면 바꾸지 않는다 — 밖에서 걸어 둔 링크가 끊긴다. */
  id: string;
  title: string;
  children: React.ReactNode;
};

/** 본문 문단. */
export function LegalP({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-base leading-7 text-pretty text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** 본문 안의 항목 나열. */
export function LegalList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "flex list-disc flex-col gap-1.5 pl-5 text-base leading-7 text-muted-foreground marker:text-primary/40",
        className,
      )}
    >
      {children}
    </ul>
  );
}

/** 본문 안 링크(메일·문의 페이지 등)에 쓰는 모양. 사이트의 Link 에 붙인다. */
export const legalLinkClassName =
  "text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-primary";

export function LegalDocument({
  locale = "ko",
  eyebrow,
  title,
  lead,
  updatedAt,
  effectiveAt,
  sections,
  numbered = true,
  footer,
  className,
}: {
  /** 껍데기 문구(목차·날짜 표기)의 언어. 본문 언어와는 따로다. */
  locale?: LegalLocale;
  /** 제목 위 작은 줄. 문자열이 아니어도 된다(배지 등). */
  eyebrow?: React.ReactNode;
  title: string;
  /** 첫 문장. 이 문서가 무엇을 정하는지 한 줄로 알린다. */
  lead?: string;
  /** 최종 수정일 `YYYY-MM-DD`. 화면의 날짜가 곧 개정 고지다. */
  updatedAt?: string;
  /** 시행일 `YYYY-MM-DD`. */
  effectiveAt?: string;
  sections: LegalSection[];
  /**
   * 절 번호를 이 틀이 붙일지. 제목 자체가 이미 `제1조` 를 달고 있는 문서에서는
   * 꺼서 `01 제1조` 가 겹치지 않게 한다.
   */
  numbered?: boolean;
  /** 본문 끝에 선을 긋고 붙이는 덧말(문의처 등). */
  footer?: React.ReactNode;
  className?: string;
}) {
  const t = legalMessages[locale];
  const toc = sections.map(({ id, title }) => ({ id, title }));
  const dates = [
    effectiveAt && { label: t.effective, value: effectiveAt },
    updatedAt && { label: t.updated, value: updatedAt },
  ].filter((date) => !!date);

  return (
    <Inner size="wide" className={cn("py-16 sm:py-24", className)}>
      {/* 목차 열(11rem)과 본문 열이 한 격자를 쓴다. 머리말은 본문 열에 얹어
          목차 위가 아니라 본문 위에 오게 한다. */}
      <div className="mx-auto flex w-full max-w-[58rem] flex-col gap-10 lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-x-14 lg:gap-y-14">
        <header className="flex flex-col items-start gap-4 lg:col-start-2 lg:row-start-1">
          {typeof eyebrow === "string" ? (
            <p className="text-sm font-medium text-primary">{eyebrow}</p>
          ) : (
            eyebrow
          )}
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {title}
          </h1>
          {lead && (
            <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
              {lead}
            </p>
          )}
          {dates.length > 0 && (
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {dates.map((date) => (
                <span key={date.label}>
                  {date.label}{" "}
                  <time dateTime={date.value}>
                    {formatLegalDate(date.value, locale)}
                  </time>
                </span>
              ))}
            </p>
          )}
        </header>

        {/* 넓은 화면: 왼쪽에 세워 두는 목차. 현재 절을 표시한다. */}
        <LegalToc
          sections={toc}
          numbered={numbered}
          label={t.toc}
          className={cn(
            "hidden max-h-[calc(100dvh-8rem)] self-start overflow-y-auto lg:sticky lg:col-start-1 lg:row-start-2 lg:block",
            "lg:top-[calc(var(--site-header-h,4rem)+1.5rem)]",
          )}
        />

        {/* 좁은 화면: 접어 둔 목차. 펼쳐 두면 목차가 본문보다 길어진다.
            `<details>` 라 JS 없이도 열린다. */}
        <details className="group rounded-xl border bg-card px-4 lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
            {t.toc}
            <ChevronDownIcon
              className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
              strokeWidth={1.5}
              aria-hidden
            />
          </summary>
          <div className="max-h-[50dvh] overflow-y-auto border-t pt-2 pb-3">
            <LegalToc sections={toc} numbered={numbered} label={t.toc} />
          </div>
        </details>

        <div className="flex min-w-0 flex-col gap-12 lg:col-start-2 lg:row-start-2">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="flex scroll-mt-[calc(var(--site-header-h,4rem)+1.5rem)] flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                {numbered && (
                  <span
                    aria-hidden
                    className="font-mono text-xs text-primary tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
                <h2 className="text-xl leading-snug font-semibold tracking-tight text-balance">
                  {section.title}
                </h2>
              </div>
              {section.children}
            </section>
          ))}

          {footer && <div className="border-t pt-10">{footer}</div>}
        </div>
      </div>
    </Inner>
  );
}
