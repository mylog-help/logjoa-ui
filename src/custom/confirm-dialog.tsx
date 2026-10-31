"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export type ConfirmDialogProps = {
  /**
   * 여닫기를 쓰는 쪽이 정할 때. 이때는 확인을 눌러도 **저절로 닫히지 않는다** —
   * 성공한 뒤 `onOpenChange(false)` 를 부른다(요청 중에도 상자가 남아 `pending` 을 보여 줄 수 있게).
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * 상자를 여는 버튼(`asChild`). `open` 없이 이것만 주면 상자가 스스로 여닫고,
   * 확인을 누르면 `onConfirm` 이 끝난 뒤 닫는다(`false` 를 돌려주면 열린 채로).
   */
  trigger?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** 설명 아래 추가 내용 (대상 목록 등). */
  children?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  /** 되돌릴 수 없는 동작(삭제 등) — 확인 버튼을 `destructive` 로. */
  destructive?: boolean;
  /** 요청 중 — 두 버튼을 막고 바깥 클릭·Esc 로도 닫히지 않는다. */
  pending?: boolean;
  /** 확인 버튼만 막는다(입력 확인 전 등). */
  disabled?: boolean;
  onConfirm: () => void | boolean | Promise<void | boolean>;
};

/**
 * 삭제·취소처럼 되돌리기 어려운 동작 전에 띄우는 확인 상자 (원본 `AlertDialog` 기반).
 * 버튼 색은 `destructive` 하나로 정한다 — 확인 버튼에 클래스를 덧칠하지 않는다.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  confirmLabel = "삭제",
  cancelLabel = "취소",
  destructive = true,
  pending = false,
  disabled = false,
  onConfirm,
}: ConfirmDialogProps) {
  const controlled = open !== undefined;
  const [innerOpen, setInnerOpen] = React.useState(false);
  const isOpen = controlled ? open : innerOpen;

  const setOpen = (next: boolean) => {
    if (!next && pending) return;
    if (!controlled) setInnerOpen(next);
    onOpenChange?.(next);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent
        {...(description ? {} : { "aria-describedby": undefined })}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? "destructive" : "default"}
            disabled={pending || disabled}
            onClick={async (e) => {
              e.preventDefault();
              const result = await onConfirm();
              if (!controlled && result !== false) setInnerOpen(false);
            }}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
