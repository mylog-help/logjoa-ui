/**
 * 약관·개인정보처리방침 화면의 고정 문구(ko·en·ja). 본문은 사이트가 넘기고,
 * 여기에는 껍데기(`LegalDocument`)가 직접 그리는 말만 둔다.
 */

export type LegalMessages = {
  /** 목차의 이름(스크린리더·접이식 목차 제목). */
  toc: string;
  updated: string;
  effective: string;
};

export const legalMessages = {
  ko: { toc: "목차", updated: "최종 수정일", effective: "시행일" },
  en: { toc: "Contents", updated: "Last updated", effective: "Effective" },
  ja: { toc: "目次", updated: "最終更新日", effective: "施行日" },
} satisfies Record<"ko" | "en" | "ja", LegalMessages>;

export type LegalLocale = keyof typeof legalMessages;

const DATE_LOCALE: Record<LegalLocale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
};

/**
 * `2026-11-01` → `2026년 11월 1일` / `November 1, 2026` / `2026年11月1日`.
 * 날짜만 다루므로 UTC 로 읽고 UTC 로 찍는다 — 서버 시간대에 따라 하루가 밀리지 않게.
 */
export function formatLegalDate(date: string, locale: LegalLocale): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(DATE_LOCALE[locale], {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
