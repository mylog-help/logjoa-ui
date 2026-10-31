"use client";

import React, { useState, useCallback } from "react";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Input } from "../ui/input";
import { cn } from "../cn";

dayjs.extend(customParseFormat);

/**
 * 다양한 형식의 날짜 문자열을 'yyyy-MM-dd' 형식으로 변환합니다.
 * 지원하는 형식:
 * - yyyy-MM-dd, yyyy/MM/dd, yyyy.MM.dd
 * - yy-MM-dd, yy/MM/dd, yy.MM.dd
 * - yyyyMMdd, yyMMdd
 * - yyyyMM, yyMM (일자는 1일로 설정)
 * @param dateString - 변환할 날짜 문자열
 * @returns 'yyyy-MM-dd' 형식의 날짜 문자열 또는 변환 실패 시 null
 */
export function normalizeDateString(dateString: string): string | null {
  if (!dateString) return null;

  let cleanedString = dateString.replace(/[^0-9]/g, "");

  // 불완전한 월 입력 패딩 처리
  // 5자리: YYYYM → YYYYMM (예: 20221 → 202201)
  // 3자리: YYM  → YYMM  (예: 221  → 2201)
  if (cleanedString.length === 5) {
    cleanedString = cleanedString.slice(0, 4) + "0" + cleanedString.slice(4);
  } else if (cleanedString.length === 3) {
    cleanedString = cleanedString.slice(0, 2) + "0" + cleanedString.slice(2);
  }

  let parsedDate: Dayjs | null = null;

  // 우선순위가 높은 긴 형식부터 파싱 시도
  const formats: { format: string; length: number }[] = [
    { format: "YYYYMMDD", length: 8 },
    { format: "YYMMDD", length: 6 },
    { format: "YYYYMM", length: 6 },
    { format: "YYMM", length: 4 },
  ];

  for (const fmt of formats) {
    if (cleanedString.length === fmt.length) {
      const d = dayjs(cleanedString, fmt.format, true);
      if (d.isValid()) {
        parsedDate = d;
        break;
      }
    }
  }

  // 숫자만으로 파싱되지 않은 경우, 구분자 있는 형식 시도
  if (!parsedDate) {
    const d = dayjs(dateString);
    if (d.isValid()) {
      parsedDate = d;
    }
  }

  if (parsedDate && parsedDate.isValid()) {
    return parsedDate.format("YYYY-MM-DD");
  }

  return null;
}

interface NormalizedDateInputProps {
  value: string;
  onChange: (value: string) => void;
  /** 바꿀 수 없는 형식일 때 입력칸 아래에 보이는 문구 */
  invalidMessage: string;
  placeholder?: string;
  required?: boolean;
}

/**
 * 입력칸을 벗어날 때 날짜를 'yyyy-MM-dd'로 맞추는 입력. 바꿀 수 없으면 문구를 띄우고 빈 값을 올린다.
 * 입력하는 동안 해석 결과를 보여 주는 것은 SmartDateInput.
 */
export function NormalizedDateInput({
  value,
  onChange,
  invalidMessage,
  placeholder,
  required,
}: NormalizedDateInputProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setDisplayValue(value);
    // Reset error if the prop value is cleared externally
    if (!value) {
      setError(null);
    }
  }

  const handleBlur = useCallback(() => {
    if (!displayValue && !required) {
      setError(null);
      onChange("");
      return;
    }

    const normalized = normalizeDateString(displayValue);
    if (normalized) {
      setDisplayValue(normalized);
      onChange(normalized);
      setError(null);
    } else {
      setError(invalidMessage);
      onChange(""); // Send invalid state upstream
    }
  }, [displayValue, onChange, required, invalidMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(
          error ? "border-destructive focus-visible:ring-destructive" : "",
        )}
        required={required}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
