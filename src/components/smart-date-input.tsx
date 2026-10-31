"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { Input } from "./input";
import { cn } from "../cn";

/**
 * 다양한 날짜 형식을 자동 파싱하는 스마트 날짜 입력 컴포넌트
 *
 * 지원 입력 형식:
 *   2026       → 2026-01-01 (연도만)
 *   202601     → 2026-01-01 (연월, 6자리 but YYYY+MM)
 *   260101     → 2026-01-01 (YYMMDD)
 *   20260101   → 2026-01-01 (YYYYMMDD)
 *   2026/1     → 2026-01-01
 *   2026/1/15  → 2026-01-15
 *   26/1/15    → 2026-01-15
 *   2026.01    → 2026-01-01
 */

function parseSmartDate(input: string): {
  value: string;
  label: string;
  approximate: boolean;
} | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const digits = trimmed.replace(/\D/g, "");

  // ── 순수 숫자 입력 ──────────────────────────────────────────
  if (/^\d+$/.test(trimmed)) {
    if (digits.length === 4) {
      const y = parseInt(digits);
      if (y < 1900 || y > 2100) return null;
      return {
        value: `${digits}-01-01`,
        label: `${digits}년`,
        approximate: true,
      };
    }

    if (digits.length === 6) {
      const firstTwo = parseInt(digits.slice(0, 2));
      const secondTwo = parseInt(digits.slice(2, 4));
      const lastTwo = parseInt(digits.slice(4, 6));

      // YYMMDD (YY ≤ 30 → 20YY, else 19YY)
      if (secondTwo >= 1 && secondTwo <= 12 && lastTwo >= 1 && lastTwo <= 31) {
        const year =
          firstTwo <= 30
            ? `20${digits.slice(0, 2)}`
            : `19${digits.slice(0, 2)}`;
        const mm = digits.slice(2, 4);
        const dd = digits.slice(4, 6);
        return {
          value: `${year}-${mm}-${dd}`,
          label: `${year}년 ${parseInt(mm)}월 ${parseInt(dd)}일`,
          approximate: false,
        };
      }

      // YYYYMM (연도가 4자리인 경우, 앞 4자리가 1900~2100)
      const yearCandidate = parseInt(digits.slice(0, 4));
      const monthCandidate = parseInt(digits.slice(4, 6));
      if (
        yearCandidate >= 1900 &&
        yearCandidate <= 2100 &&
        monthCandidate >= 1 &&
        monthCandidate <= 12
      ) {
        const yyyy = digits.slice(0, 4);
        const mm = digits.slice(4, 6);
        return {
          value: `${yyyy}-${mm}-01`,
          label: `${yyyy}년 ${parseInt(mm)}월`,
          approximate: true,
        };
      }
    }

    if (digits.length === 8) {
      const yyyy = digits.slice(0, 4);
      const mm = digits.slice(4, 6);
      const dd = digits.slice(6, 8);
      const y = parseInt(yyyy);
      const m = parseInt(mm);
      const d = parseInt(dd);
      if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31)
        return null;
      return {
        value: `${yyyy}-${mm}-${dd}`,
        label: `${yyyy}년 ${m}월 ${d}일`,
        approximate: false,
      };
    }
  }

  // ── 구분자 포함 입력 ──────────────────────────────────────────
  const parts = trimmed
    .split(/[/\-\.\s년월일]+/)
    .filter(Boolean)
    .map(Number);
  if (parts.some(isNaN)) return null;

  if (parts.length >= 2) {
    let [y, m, d = 1] = parts;
    if (y < 100) y = y <= 30 ? 2000 + y : 1900 + y;
    if (y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;

    const yyyy = String(y);
    const mm = String(m).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    const approximate = parts.length < 3;

    return {
      value: `${yyyy}-${mm}-${dd}`,
      label: parts.length >= 3 ? `${yyyy}년 ${m}월 ${d}일` : `${yyyy}년 ${m}월`,
      approximate,
    };
  }

  return null;
}

type Props = {
  value: string; // YYYY-MM-DD or ""
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
};

export function SmartDateInput({
  value,
  onChange,
  placeholder = "예: 20260101, 2026/1, 2026",
  disabled,
  className,
  id,
  "aria-invalid": ariaInvalid,
}: Props) {
  // 표시 텍스트: value가 있으면 사람이 읽기 좋은 형태로, 편집 중이면 raw 입력
  const [inputText, setInputText] = useState<string>(() => {
    if (!value) return "";
    const parsed = parseSmartDate(value);
    return parsed?.label ?? value;
  });
  const [parsed, setParsed] = useState<ReturnType<typeof parseSmartDate>>(() =>
    value ? parseSmartDate(value) : null,
  );
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setEditing(true);
    // 편집 시작 시 raw YYYY-MM-DD 값을 보여줌
    if (value) setInputText(value);
  };

  const handleBlur = () => {
    setEditing(false);
    if (!inputText.trim()) {
      setParsed(null);
      onChange("");
      return;
    }

    const result = parseSmartDate(inputText);
    if (result) {
      setParsed(result);
      onChange(result.value);
      setInputText(result.label); // 사람이 읽기 좋은 형태로 변환
    } else {
      // 파싱 실패 시 기존 값 복원
      if (value) {
        const fallback = parseSmartDate(value);
        setInputText(fallback?.label ?? value);
        setParsed(fallback);
      } else {
        setInputText("");
        setParsed(null);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleClear = () => {
    setInputText("");
    setParsed(null);
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          aria-invalid={ariaInvalid}
          value={inputText}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pr-8",
            parsed && !editing && "text-foreground",
            parsed?.approximate && !editing && "text-muted-foreground",
          )}
          autoComplete="off"
        />
        {inputText && (
          <button
            type="button"
            onClick={handleClear}
            tabIndex={-1}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* 파싱 결과 힌트 */}
      {editing && inputText && (
        <div className="mt-1 text-xs text-muted-foreground">
          {parseSmartDate(inputText) ? (
            <span className="text-green-600 dark:text-green-400">
              → {parseSmartDate(inputText)!.label}
              {parseSmartDate(inputText)!.approximate && " (대략)"}
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400">
              인식할 수 없는 형식 (예: 20260101, 2026/1, 2026)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
