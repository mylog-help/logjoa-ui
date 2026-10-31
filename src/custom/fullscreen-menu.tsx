"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "../cn";

/**
 * 화면 전체를 덮는 모바일 메뉴.
 *
 * shadcn `Sheet`는 옆에서 밀려 들어오는 패널이라, 헤더 자리에서 그대로
 * 펼쳐지는 전체 화면 메뉴(반투명 배경 + 강한 블러, 페이드)는 Radix Dialog로 따로 둔다.
 *
 * ```tsx
 * <FullscreenMenu open={open} onOpenChange={setOpen}>
 *   <header>… <FullscreenMenuTrigger asChild><button>≡</button></FullscreenMenuTrigger></header>
 *   <FullscreenMenuContent description="사이트 메뉴" className="lg:hidden">
 *     <FullscreenMenuTitle className="sr-only">메뉴</FullscreenMenuTitle>
 *     …
 *   </FullscreenMenuContent>
 * </FullscreenMenu>
 * ```
 */
function FullscreenMenu(
  props: React.ComponentProps<typeof DialogPrimitive.Root>,
) {
  return <DialogPrimitive.Root data-slot="fullscreen-menu" {...props} />;
}

function FullscreenMenuTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>,
) {
  return (
    <DialogPrimitive.Trigger data-slot="fullscreen-menu-trigger" {...props} />
  );
}

function FullscreenMenuClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>,
) {
  return <DialogPrimitive.Close data-slot="fullscreen-menu-close" {...props} />;
}

function FullscreenMenuTitle(
  props: React.ComponentProps<typeof DialogPrimitive.Title>,
) {
  return <DialogPrimitive.Title data-slot="fullscreen-menu-title" {...props} />;
}

function FullscreenMenuContent({
  className,
  children,
  description,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  /** 화면 읽기 프로그램용 설명 (보이지 않음) */
  description: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="fullscreen-menu-overlay"
        className="data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50 bg-black/20 duration-300"
      />
      <DialogPrimitive.Content
        data-slot="fullscreen-menu-content"
        className={cn(
          "bg-background/85 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50 flex flex-col backdrop-blur-3xl duration-300 outline-none motion-reduce:animate-none",
          className,
        )}
        {...props}
      >
        <DialogPrimitive.Description className="sr-only">
          {description}
        </DialogPrimitive.Description>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export {
  FullscreenMenu,
  FullscreenMenuClose,
  FullscreenMenuContent,
  FullscreenMenuTitle,
  FullscreenMenuTrigger,
};
