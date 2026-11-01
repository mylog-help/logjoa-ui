"use client";

import * as React from "react";
import {
  CheckIcon,
  LoaderCircleIcon,
  PaperclipIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import { cn } from "../cn";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Textarea } from "../ui/textarea";
import type { ContactMessages } from "./contact-messages";

/** 필드별 오류 문구(문의함 API 가 돌려준 것). */
export type ContactFieldErrors = Partial<
  Record<"kind" | "email" | "subject" | "body" | "meta" | "agree", string>
>;

/** 폼과 서버 액션이 주고받는 상태. */
export type ContactState = {
  status: "idle" | "sent" | "error";
  /** 접수번호. 봇으로 판정해 조용히 흘려보낸 경우에는 없다. */
  ticket?: string;
  errors?: ContactFieldErrors;
  /** 필드가 아니라 접수 자체가 막힌 사유. */
  message?: string;
};

/** 첨부 업로드 허가의 결과(서버 액션 → 폼). */
export type AttachmentPermit =
  | { ok: true; uploadId: string; signedUrl: string }
  | { ok: false; message: string };

export type ContactKind = {
  value: string;
  label: string;
  /** 이 유형을 골랐을 때 내용 칸에 보여 줄 예시. 없으면 기본 안내. */
  hint?: string;
};

/** 폼 끝에 덧붙이는 선택 입력 한 칸(예: 앱 버전·기기). */
export type ContactExtraField = {
  name: string;
  label: string;
  placeholder?: string;
  hint?: string;
  maxLength?: number;
};

type LinkLike = React.ElementType<{
  href: string;
  className?: string;
  children?: React.ReactNode;
}>;

const BODY_MIN = 10;
const BODY_MAX = 4000;

/**
 * 첨부 규칙. 같은 값이 문의함 API 와 저장소 버킷에도 걸려 있다 — 여기서 먼저 거르는 것은
 * 올리기 전에 알려 주려는 것이고, 이 검사를 우회해도 서버가 막는다.
 */
const ALLOWED: Record<string, readonly string[]> = {
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/gif": ["gif"],
  "image/webp": ["webp"],
  "application/pdf": ["pdf"],
};
const ACCEPT = Object.keys(ALLOWED).join(",");
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 3;

type Item = {
  key: string;
  name: string;
  status: "uploading" | "done" | "error";
  uploadId?: string;
  error?: string;
};

function extension(name: string): string {
  return name.includes(".") ? (name.split(".").pop() ?? "").toLowerCase() : "";
}

/** 라벨 + (필수 `*` 또는 "(선택)") + 오른쪽 보조 문구 + 칸 + 오류. */
function Field({
  id,
  label,
  required,
  optionalText,
  requiredText,
  hint,
  error,
  group,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optionalText: string;
  requiredText: string;
  hint?: React.ReactNode;
  error?: string;
  /** 라디오 묶음처럼 `<label htmlFor>` 가 가리킬 단일 칸이 없을 때. */
  group?: boolean;
  children: React.ReactNode;
}) {
  const text = (
    <>
      {label}{" "}
      {required ? (
        <span className="text-destructive" aria-hidden>
          *
        </span>
      ) : (
        <span className="font-normal opacity-70">{optionalText}</span>
      )}
      {required && <span className="sr-only">({requiredText})</span>}
    </>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        {group ? (
          <span
            id={`${id}-label`}
            className="text-xs font-medium text-muted-foreground"
          >
            {text}
          </span>
        ) : (
          <label
            htmlFor={id}
            className="text-xs font-medium text-muted-foreground"
          >
            {text}
          </label>
        )}
        {hint}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** 입력 칸에 붙이는 오류 연결 속성. */
function invalid(id: string, error?: string) {
  return error
    ? ({ "aria-invalid": true, "aria-describedby": `${id}-error` } as const)
    : {};
}

/**
 * 첨부 입력. 파일을 고르면 **그 자리에서** 올리고(서명 주소로 직접 PUT), 폼에는 올라간
 * 파일의 id 만 숨은 칸으로 실린다 — 제출 요청에 파일이 섞이지 않아서 서버리스 요청 크기
 * 제한과 상관없이 5MB 까지 받을 수 있다.
 */
function AttachmentField({
  messages,
  uploadAction,
  onBusyChange,
}: {
  messages: ContactMessages["form"]["attachment"];
  uploadAction: (file: {
    name: string;
    size: number;
    mime: string;
  }) => Promise<AttachmentPermit>;
  onBusyChange: (busy: boolean) => void;
}) {
  const [items, setItems] = React.useState<Item[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const busy = items.some((item) => item.status === "uploading");
  React.useEffect(() => onBusyChange(busy), [busy, onBusyChange]);

  const patch = (key: string, next: Partial<Item>) =>
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, ...next } : item)),
    );

  async function upload(file: File, key: string) {
    if (!ALLOWED[file.type]?.includes(extension(file.name))) {
      return patch(key, { status: "error", error: messages.errorType });
    }
    if (file.size <= 0 || file.size > MAX_BYTES) {
      return patch(key, { status: "error", error: messages.errorSize });
    }

    try {
      const permit = await uploadAction({
        name: file.name,
        size: file.size,
        mime: file.type,
      });
      if (!permit.ok) {
        return patch(key, { status: "error", error: permit.message });
      }

      // supabase-js 의 uploadToSignedUrl 과 같은 요청이다. 서명 주소에 권한이 들어 있어
      // 인증 헤더는 필요 없다.
      const body = new FormData();
      body.append("cacheControl", "3600");
      body.append("", file);
      const response = await fetch(permit.signedUrl, {
        method: "PUT",
        body,
        headers: { "x-upsert": "false" },
      });

      if (!response.ok) {
        return patch(key, { status: "error", error: messages.errorFailed });
      }
      patch(key, { status: "done", uploadId: permit.uploadId });
    } catch {
      patch(key, { status: "error", error: messages.errorFailed });
    }
  }

  function onPick(files: FileList | null) {
    if (!files) return;
    // 실패한 항목은 자리를 차지하지 않는다 — 남은 자리만큼만 받는다.
    const room = MAX_FILES - items.filter((i) => i.status !== "error").length;
    const picked = Array.from(files).slice(0, Math.max(room, 0));
    if (inputRef.current) inputRef.current.value = "";
    if (picked.length === 0) return;

    const added = picked.map((file) => ({
      file,
      item: {
        key: crypto.randomUUID(),
        name: file.name,
        status: "uploading" as const,
      },
    }));
    setItems((current) => [
      ...current.filter((i) => i.status !== "error"),
      ...added.map(({ item }) => item),
    ]);
    for (const { file, item } of added) void upload(file, item.key);
  }

  const full =
    items.filter((item) => item.status !== "error").length >= MAX_FILES;

  return (
    <div className="flex flex-col gap-3">
      {items
        .filter((item) => item.status === "done")
        .map((item) => (
          <input
            key={item.key}
            type="hidden"
            name="uploadId"
            value={item.uploadId}
          />
        ))}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => onPick(event.target.files)}
      />

      <div>
        <Button
          type="button"
          variant="outline"
          disabled={full}
          onClick={() => inputRef.current?.click()}
        >
          <PaperclipIcon aria-hidden />
          {messages.choose}
        </Button>
      </div>

      {items.length > 0 && (
        <ul className="flex flex-col gap-2" aria-live="polite">
          {items.map((item) => (
            <li
              key={item.key}
              className="flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm"
            >
              {item.status === "uploading" && (
                <LoaderCircleIcon
                  aria-label={messages.uploading}
                  className="size-4 shrink-0 animate-spin text-muted-foreground"
                />
              )}
              <span className="min-w-0 flex-1 truncate">{item.name}</span>
              {item.status === "error" && (
                <span className="text-xs text-destructive" role="alert">
                  {item.error}
                </span>
              )}
              <button
                type="button"
                aria-label={`${item.name} ${messages.remove}`}
                disabled={item.status === "uploading"}
                onClick={() =>
                  setItems((current) =>
                    current.filter((other) => other.key !== item.key),
                  )
                }
                className="shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-40"
              >
                <XIcon className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * 문의 폼 — 세 사이트(devlog·mylog·mobilog)가 같은 화면을 쓴다.
 *
 * 이 컴포넌트는 인증도 API 도 모른다. 서버 액션(`submitAction`·`uploadAction`)은 각 사이트가
 * 만들어 넘긴다 — 문의함 API 의 키가 이 패키지(브라우저로 나가는 코드)에 들어오지 않게
 * 하려는 것이다. 문구는 `contactMessages[locale]` 를 그대로 넘기면 된다.
 *
 * 필수 입력은 빨간 `*`, 선택 입력은 "(선택)" 로 표시한다.
 */
export function ContactForm({
  messages,
  kinds,
  submitAction,
  uploadAction,
  privacyHref,
  homeHref = "/",
  extraField,
  linkComponent: Link = "a",
  onSent,
}: {
  messages: ContactMessages;
  /** 이 사이트가 받는 문의 유형(첫 번째가 기본 선택). */
  kinds: ContactKind[];
  submitAction: (
    previous: ContactState,
    formData: FormData,
  ) => Promise<ContactState>;
  uploadAction: (file: {
    name: string;
    size: number;
    mime: string;
  }) => Promise<AttachmentPermit>;
  privacyHref: string;
  homeHref?: string;
  extraField?: ContactExtraField;
  /** 프로젝트 라우터의 Link. 기본은 `<a>`. */
  linkComponent?: LinkLike;
  /** 접수가 끝났을 때 한 번 불린다(통계 등). */
  onSent?: () => void;
}) {
  const t = messages.form;
  const [state, action, pending] = React.useActionState<ContactState, FormData>(
    submitAction,
    { status: "idle" },
  );
  const [kind, setKind] = React.useState(kinds[0]?.value ?? "");
  const [bodyLength, setBodyLength] = React.useState(0);
  // 첨부를 올리는 동안은 제출을 잠근다 — 올라가기 전에 보내면 첨부가 빠진다.
  const [uploading, setUploading] = React.useState(false);
  const startedRef = React.useRef<HTMLInputElement>(null);

  // 값을 서버 렌더 결과에 넣으면 하이드레이션이 어긋난다. 붙인 뒤에 채운다.
  React.useEffect(() => {
    if (startedRef.current) startedRef.current.value = String(Date.now());
  }, []);

  const sent = state.status === "sent";
  React.useEffect(() => {
    if (sent) onSent?.();
  }, [sent, onSent]);

  const formRef = React.useRef<HTMLFormElement>(null);
  const messageRef = React.useRef<HTMLParagraphElement>(null);
  const successRef = React.useRef<HTMLHeadingElement>(null);

  // 접수가 끝나면 완료 문구로 옮긴다. 완료 카드는 폼보다 짧아서, 아래쪽 제출 버튼을
  // 눌렀다면 새 내용이 화면 밖에 남고 스크린리더도 바뀐 걸 알 수 없다.
  React.useEffect(() => {
    if (!sent) return;
    successRef.current?.focus({ preventScroll: true });
    successRef.current?.scrollIntoView({ block: "center" });
  }, [sent]);

  // 접수가 안 됐을 때 사유(`message`)나 첫 오류 칸으로 옮긴다. 제출 버튼은 맨 아래라
  // 위에 뜬 오류는 사용자가 보지 못한다. `state` 는 제출마다 새 객체라 같은 오류가
  // 다시 나도 다시 옮긴다.
  React.useEffect(() => {
    if (state.status !== "error") return;
    const target =
      state.message && messageRef.current
        ? messageRef.current
        : formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (!target) return;
    // 라디오 묶음은 묶음 자체가 아니라 안의 첫 칸이 포커스를 받는다.
    const focusable =
      target.matches("input, textarea, button, select, [tabindex]")
        ? target
        : (target.querySelector<HTMLElement>("button, input") ?? target);
    focusable.focus({ preventScroll: true });
    target.scrollIntoView({ block: "center" });
  }, [state]);

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-5">
        <span
          className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
          aria-hidden
        >
          <CheckIcon className="size-6" strokeWidth={1.5} />
        </span>
        <div className="flex flex-col gap-2">
          <h2
            ref={successRef}
            tabIndex={-1}
            className="scroll-mt-24 text-2xl font-semibold tracking-tight outline-none"
          >
            {messages.success.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {messages.success.description}
          </p>
        </div>

        {state.ticket && (
          <div className="flex w-full flex-col gap-1 rounded-2xl border bg-muted/50 px-5 py-4">
            <span className="text-xs font-medium text-muted-foreground">
              {messages.success.ticket}
            </span>
            <span className="font-mono text-lg tracking-widest">
              {state.ticket}
            </span>
          </div>
        )}

        <Link
          href={homeHref}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {messages.success.home}
        </Link>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const placeholder =
    kinds.find((option) => option.value === kind)?.hint ?? t.body.placeholder;
  const fieldText = {
    optionalText: t.optional,
    requiredText: t.required,
  };

  return (
    <form
      ref={formRef}
      // `<form action>` 은 결과와 상관없이 폼을 리셋해 오류가 나면 입력이 사라진다.
      // 직접 디스패치하면 리셋이 걸리지 않는다. 브라우저의 required 검증은 그대로 거친다.
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        React.startTransition(() => action(formData));
      }}
      className="flex flex-col gap-5"
    >
      {state.message && (
        <p
          ref={messageRef}
          tabIndex={-1}
          className="scroll-mt-24 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive outline-none"
          role="alert"
        >
          {state.message}
        </p>
      )}

      <Field
        id="kind"
        label={t.kind.label}
        required
        group
        error={errors.kind}
        {...fieldText}
      >
        <RadioGroup
          id="kind"
          aria-labelledby="kind-label"
          {...invalid("kind", errors.kind)}
          value={kind}
          onValueChange={setKind}
          name="kind"
          required
          className="grid-cols-2 sm:grid-cols-3"
        >
          {kinds.map((option) => (
            <label
              key={option.value}
              htmlFor={`kind-${option.value}`}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-xl border border-input px-3.5 py-2.5 text-sm transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5",
              )}
            >
              <RadioGroupItem
                value={option.value}
                id={`kind-${option.value}`}
              />
              {option.label}
            </label>
          ))}
        </RadioGroup>
      </Field>

      <Field
        id="email"
        label={t.email.label}
        required
        error={errors.email}
        {...fieldText}
      >
        <Input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder={t.email.placeholder}
          className="h-11"
          {...invalid("email", errors.email)}
        />
      </Field>

      <Field
        id="subject"
        label={t.subject.label}
        required
        error={errors.subject}
        {...fieldText}
      >
        <Input
          id="subject"
          name="subject"
          required
          maxLength={120}
          placeholder={t.subject.placeholder}
          className="h-11"
          {...invalid("subject", errors.subject)}
        />
      </Field>

      <Field
        id="body"
        label={t.body.label}
        required
        error={errors.body}
        hint={
          <span
            className={cn(
              "text-xs tabular-nums",
              bodyLength > BODY_MAX
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {bodyLength}/{BODY_MAX}
          </span>
        }
        {...fieldText}
      >
        <Textarea
          id="body"
          name="body"
          rows={8}
          required
          minLength={BODY_MIN}
          maxLength={BODY_MAX}
          placeholder={placeholder}
          onChange={(event) => setBodyLength(event.target.value.length)}
          {...invalid("body", errors.body)}
        />
      </Field>

      {extraField && (
        <Field
          id={extraField.name}
          label={extraField.label}
          error={errors.meta}
          hint={
            extraField.hint ? (
              <span className="text-xs text-muted-foreground">
                {extraField.hint}
              </span>
            ) : undefined
          }
          {...fieldText}
        >
          <Input
            id={extraField.name}
            name={extraField.name}
            maxLength={extraField.maxLength}
            placeholder={extraField.placeholder}
            className="h-11"
            {...invalid(extraField.name, errors.meta)}
          />
        </Field>
      )}

      <Field
        id="attachments"
        label={t.attachment.label}
        group
        hint={
          <span className="text-xs text-muted-foreground">
            {t.attachment.hint}
          </span>
        }
        {...fieldText}
      >
        <AttachmentField
          messages={t.attachment}
          uploadAction={uploadAction}
          onBusyChange={setUploading}
        />
      </Field>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="agree"
          className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
        >
          <Checkbox
            id="agree"
            name="agree"
            required
            className="mt-0.5"
            {...invalid("agree", errors.agree)}
          />
          <span>
            {t.agree.label}{" "}
            <Link
              href={privacyHref}
              className="text-foreground underline underline-offset-4"
            >
              {t.agree.link}
            </Link>
          </span>
        </label>
        {errors.agree && (
          <p id="agree-error" className="text-xs text-destructive" role="alert">
            {errors.agree}
          </p>
        )}
      </div>

      {/* 사람에게는 보이지 않는 함정. 자동 입력기가 채우면 조용히 버린다. */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input ref={startedRef} name="startedAt" type="hidden" />

      <Button
        size="lg"
        type="submit"
        disabled={pending || uploading}
        className="mt-1 w-full"
      >
        {pending ? (
          t.submitting
        ) : uploading ? (
          t.uploading
        ) : (
          <>
            <SendIcon aria-hidden />
            {t.submit}
          </>
        )}
      </Button>
    </form>
  );
}
