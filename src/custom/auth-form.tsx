"use client";

import * as React from "react";
import { CircleCheckIcon, MailCheckIcon } from "lucide-react";
import { cn } from "../cn";
import { Button } from "../ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import {
  AuthFooter,
  AuthHeader,
  NewPasswordExpired,
  type AuthLinkComponent,
} from "./auth";
import {
  AUTH_PASSWORD_MIN,
  authErrorText,
  authValidate,
  fillAuthText,
  type AuthErrorLike,
  type AuthMessages,
} from "./auth-messages";

/*
 * 로그인·회원가입·비밀번호 재설정·새 비밀번호 화면 — 세 사이트(devlog·mylog·mobilog) 공통.
 *
 * 사이트가 하는 일은 `onSubmit` 하나다(Supabase 호출·이동). 검사·오류 표시·진행 상태·
 * 포커스·완료 화면은 여기서 한다. 오류 표시 규칙:
 * - 입력칸 문제 → 그 칸 아래 빨간 글자(`aria-invalid` + `aria-describedby`), 첫 칸으로 포커스.
 * - 서버가 거절(비밀번호 틀림·이미 가입 등) → 제출 버튼 바로 위 빨간 글자(`role="alert"`).
 *   상자(`Alert`)는 쓰지 않는다 — 입력칸과 같은 모양이라 빈 칸처럼 보인다.
 * 첫 제출 전에는 입력 중에 오류를 띄우지 않고, 한 번 제출한 뒤에는 고치는 대로 다시 검사한다.
 */

/** 사이트 `onSubmit` 이 돌려주는 오류 — Supabase `AuthError` 를 그대로, 또는 직접 정한 문장. */
export type AuthSubmitError = AuthErrorLike | string;

type AuthAction = "login" | "signup" | "resetPassword" | "newPassword";

/** 오류를 화면 문장으로 — 문자열은 그대로, Supabase 오류는 `authErrorText`. */
export function authSubmitErrorText(
  messages: AuthMessages,
  error: AuthSubmitError,
  action: AuthAction,
): string {
  return typeof error === "string"
    ? error
    : authErrorText(messages, error, action);
}

/** `onSubmit` 이 던졌을 때 — 네트워크 실패(fetch 의 TypeError)면 연결 문구, 아니면 동작별 기본 문구. */
function thrownErrorText(
  messages: AuthMessages,
  error: unknown,
  action: AuthAction,
): string {
  return error instanceof TypeError
    ? messages.errors.network
    : messages.errors[action];
}

/* ------------------------------------------------------------------ */
/* 입력칸·오류                                                          */
/* ------------------------------------------------------------------ */

type AuthFieldProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "id" | "name"
> & {
  id: string;
  name: string;
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  /** 빨간 글자로 칸 아래에. 있으면 `description` 대신 보인다. */
  error?: string;
  /** 칸 아래 안내(비밀번호 규칙 등). */
  description?: React.ReactNode;
  /** 칸 옆 버튼 등(사업자번호 확인). */
  addon?: React.ReactNode;
};

/**
 * 라벨·입력·아래 안내 또는 빨간 오류 한 줄. 오류는 `aria-describedby` 로 입력칸에 이어져
 * 포커스가 가면 화면 읽기 프로그램이 함께 읽는다.
 */
export function AuthField({
  id,
  label,
  error,
  description,
  addon,
  onChange,
  type = "text",
  ...inputProps
}: AuthFieldProps) {
  const describedBy = error
    ? `${id}-error`
    : description
      ? `${id}-description`
      : undefined;
  // 이메일은 자동 대문자·맞춤법 교정을 끈다(모바일 키보드가 첫 글자를 대문자로 바꾸는 것)
  const emailProps =
    type === "email"
      ? ({ autoCapitalize: "none", autoCorrect: "off", spellCheck: false } as const)
      : {};
  const input = (
    <Input
      id={id}
      type={type}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      onChange={(event) => onChange(event.target.value)}
      {...emailProps}
      {...inputProps}
    />
  );
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {addon ? (
        <div className="flex gap-2">
          {input}
          {addon}
        </div>
      ) : (
        input
      )}
      {error ? (
        // 제출 때 첫 오류 칸으로 포커스가 가며 읽힌다 — 칸마다 alert 로 겹쳐 읽히지 않게 role 을 뺀다
        <FieldError id={`${id}-error`} role={undefined}>
          {error}
        </FieldError>
      ) : description ? (
        <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
      ) : null}
    </Field>
  );
}

/**
 * 폼 전체 오류(서버 거절·네트워크 등) — 제출 버튼 바로 위 빨간 글자. 나타나면 바로 읽힌다.
 * 비어 있으면 아무것도 그리지 않는다.
 */
export function AuthFormError({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p
      role="alert"
      data-slot="auth-form-error"
      className={cn("text-sm text-destructive", className)}
    >
      {children}
    </p>
  );
}

/**
 * 제출 뒤 바뀐 화면(메일 보냄·완료)의 제목. 화면이 통째로 바뀌어 포커스가 사라지므로
 * 제목으로 옮겨 새 내용을 읽게 한다.
 */
export function AuthStatus(props: React.ComponentProps<typeof AuthHeader>) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div ref={ref} tabIndex={-1} className="outline-none">
      <AuthHeader {...props} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 폼 상태                                                              */
/* ------------------------------------------------------------------ */

type FieldCheck<K extends string> = (
  value: string,
  values: Record<K, string>,
) => string | undefined;

/**
 * `run` 이 돌려주는 것 — `{ error }` 면 폼 오류로, `"navigating"` 이면 다른 화면으로 가는 중이라
 * 버튼을 계속 막아 둔다. 그 밖은 끝난 것으로 본다.
 */
export type AuthRunResult = { error: AuthSubmitError } | "navigating" | void;

/**
 * 인증 폼 상태 — 값·칸 오류·폼 오류·진행 중, 제출 때 검사와 첫 오류 칸 포커스.
 * 공통 화면(`LoginForm` 등)이 쓰고, 칸이 더 있는 화면(mobilog 회사 가입 등)은 이것과
 * `AuthField`·`AuthFormError` 로 직접 만든다.
 *
 * `fields` 순서가 화면 순서다(첫 오류 칸 포커스).
 */
export function useAuthForm<K extends string>({
  messages,
  action,
  fields,
  initialError,
}: {
  messages: AuthMessages;
  action: AuthAction;
  fields: Record<K, FieldCheck<K>>;
  /** 처음부터 보일 폼 오류(인증 링크 만료 등). 다음 제출 때 지워진다. */
  initialError?: string | null;
}) {
  const keys = Object.keys(fields) as K[];
  const baseId = React.useId();
  const [values, setValues] = React.useState(
    () => Object.fromEntries(keys.map((k) => [k, ""])) as Record<K, string>,
  );
  const [errors, setErrors] = React.useState<Partial<Record<K, string>>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(
    initialError ?? null,
  );
  const [pending, setPending] = React.useState(false);
  const inputs = React.useRef<Partial<Record<K, HTMLInputElement | null>>>({});

  function check(next: Record<K, string>) {
    const found: Partial<Record<K, string>> = {};
    for (const key of keys) {
      const message = fields[key](next[key], next);
      if (message) found[key] = message;
    }
    return found;
  }

  /** `AuthField` 에 펼쳐 넣는 속성. */
  function field(name: K) {
    return {
      id: `${baseId}-${name}`,
      name,
      value: values[name],
      error: errors[name],
      ref: (el: HTMLInputElement | null) => {
        inputs.current[name] = el;
      },
      onChange: (value: string) => {
        const next = { ...values, [name]: value };
        setValues(next);
        if (submitted) setErrors(check(next));
      },
    };
  }

  /**
   * `<form onSubmit>` 에. 검사를 통과하면 `run` 을 부른다.
   * `extraValid` 는 이 훅 밖의 칸(사이트가 따로 두는 칸) 검사 — `false` 면 멈춘다.
   */
  function onSubmit(
    run: (values: Record<K, string>) => Promise<AuthRunResult>,
    extraValid?: (focusFirst: boolean) => boolean,
  ) {
    return async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (pending) return;
      setSubmitted(true);
      const found = check(values);
      setErrors(found);
      const first = keys.find((k) => found[k]);
      const extraOk = extraValid ? extraValid(!first) : true;
      if (first) {
        inputs.current[first]?.focus();
        return;
      }
      if (!extraOk) return;

      setPending(true);
      setFormError(null);
      let result: AuthRunResult;
      try {
        result = await run(values);
      } catch (error) {
        result = { error: thrownErrorText(messages, error, action) };
      }
      if (result === "navigating") return;
      setPending(false);
      if (result && "error" in result) {
        setFormError(authSubmitErrorText(messages, result.error, action));
      }
    };
  }

  return {
    values,
    errors,
    pending,
    formError,
    setFormError,
    field,
    onSubmit,
  };
}

/** `<form>` 공통 속성. JS 가 뜨기 전에 눌려도 GET 으로 비밀번호가 주소에 붙지 않게 POST. */
function formProps(pending: boolean) {
  return { method: "post", noValidate: true, "aria-busy": pending } as const;
}

/* ------------------------------------------------------------------ */
/* 화면                                                                 */
/* ------------------------------------------------------------------ */

type Linking = {
  /** 프로젝트 라우터의 Link. 기본은 `<a>`. */
  linkComponent?: AuthLinkComponent;
};

type LoginFormProps = Linking & {
  messages: AuthMessages;
  /**
   * 로그인. 실패면 `{ error }`(Supabase 오류 또는 문장), 성공이면 사이트가 이동을 시작하고
   * 아무것도 돌려주지 않는다 — 이동하는 동안 버튼은 막혀 있다.
   */
  onSubmit: (values: {
    email: string;
    password: string;
  }) => Promise<{ error: AuthSubmitError } | void>;
  /**
   * 이메일 대신 받는 식별자(mobilog "이메일 또는 아이디"). 형식은 보지 않고 비었는지만 본다.
   * `onSubmit` 의 `email` 에 그대로 담긴다.
   */
  identifier?: { label: string; placeholder?: string; requiredMessage: string };
  /** 처음부터 보일 오류(인증 링크 만료 등). */
  initialError?: string | null;
  signupHref?: string;
  resetPasswordHref?: string;
  /** 로그인 버튼 바로 아래(데모 계정 버튼 등). */
  afterSubmit?: React.ReactNode;
  /** 폼 아래(구분선·소셜 로그인 등). */
  children?: React.ReactNode;
};

export function LoginForm({
  messages: m,
  onSubmit,
  identifier,
  initialError,
  signupHref,
  resetPasswordHref,
  afterSubmit,
  children,
  linkComponent: Link = "a",
}: LoginFormProps) {
  const form = useAuthForm({
    messages: m,
    action: "login",
    initialError,
    fields: {
      email: identifier
        ? (v) => (v.trim() ? undefined : identifier.requiredMessage)
        : (v) => authValidate.email(m, v),
      // 로그인은 길이를 보지 않는다(예전 규칙으로 만든 비밀번호도 있다)
      password: (v) => authValidate.password(m, v),
    },
  });

  return (
    <>
      <AuthHeader title={m.login.title} />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <form
            {...formProps(form.pending)}
            onSubmit={form.onSubmit(async ({ email, password }) => {
              const result = await onSubmit({ email: email.trim(), password });
              return result ?? "navigating";
            })}
          >
            <FieldGroup>
              <AuthField
                {...form.field("email")}
                type={identifier ? "text" : "email"}
                autoComplete="username"
                label={identifier ? identifier.label : m.common.email}
                placeholder={
                  identifier ? identifier.placeholder : m.common.emailPlaceholder
                }
                {...(identifier && {
                  autoCapitalize: "none",
                  autoCorrect: "off",
                  spellCheck: false,
                })}
                required
              />
              <AuthField
                {...form.field("password")}
                type="password"
                autoComplete="current-password"
                label={m.common.password}
                required
              />
              <AuthFormError>{form.formError}</AuthFormError>
              <Button type="submit" className="w-full" disabled={form.pending}>
                {form.pending ? m.login.submitting : m.login.submit}
              </Button>
            </FieldGroup>
          </form>
          {afterSubmit}
        </div>
        {children}
      </div>
      {(signupHref || resetPasswordHref) && (
        <AuthFooter>
          {signupHref && (
            <p>
              {m.login.noAccount} <Link href={signupHref}>{m.common.signup}</Link>
            </p>
          )}
          {resetPasswordHref && (
            <p>
              <Link href={resetPasswordHref}>{m.login.forgotPassword}</Link>
            </p>
          )}
        </AuthFooter>
      )}
    </>
  );
}

type SignupFormProps = Linking & {
  messages: AuthMessages;
  /**
   * 가입. 실패면 `{ error }`, 인증 메일을 보냈으면 `{ sent: true }`(메일함 안내 화면으로),
   * 바로 로그인돼 사이트가 이동을 시작했으면 아무것도 돌려주지 않는다.
   */
  onSubmit: (values: {
    email: string;
    password: string;
  }) => Promise<{ error: AuthSubmitError } | { sent: true } | void>;
  loginHref?: string;
  /**
   * 비밀번호 확인 칸 아래에 더 둘 칸(mobilog 회사 정보 등). 상태는 사이트가 갖고 `AuthField` 로 그린다.
   */
  extraFields?: React.ReactNode;
  /**
   * `extraFields` 검사 — 제출 때 부른다. 문제가 있으면 칸 오류를 띄우고 `false`.
   * `focusFirst` 가 참이면(위 공통 칸에 오류가 없으면) 첫 오류 칸으로 포커스를 옮긴다.
   */
  validateExtra?: (focusFirst: boolean) => boolean;
  /** 폼 아래(구분선·소셜 로그인 등). */
  children?: React.ReactNode;
};

export function SignupForm({
  messages: m,
  onSubmit,
  loginHref,
  extraFields,
  validateExtra,
  children,
  linkComponent: Link = "a",
}: SignupFormProps) {
  const [sentTo, setSentTo] = React.useState<string | null>(null);
  const form = useAuthForm({
    messages: m,
    action: "signup",
    fields: {
      email: (v) => authValidate.email(m, v),
      password: (v) => authValidate.newPassword(m, v),
      confirm: (v, all) => authValidate.passwordConfirm(m, v, all.password),
    },
  });

  if (sentTo) {
    return (
      <AuthStatus
        icon={<MailCheckIcon strokeWidth={1.5} />}
        title={m.common.checkInbox}
        description={fillAuthText(m.signup.sent, { email: sentTo })}
      />
    );
  }

  return (
    <>
      <AuthHeader title={m.signup.title} />
      <div className="flex flex-col gap-6">
        <form
          {...formProps(form.pending)}
          onSubmit={form.onSubmit(async ({ email, password }) => {
            const address = email.trim();
            const result = await onSubmit({ email: address, password });
            if (!result) return "navigating";
            if ("sent" in result) {
              setSentTo(address);
              return;
            }
            return result;
          }, validateExtra)}
        >
          <FieldGroup>
            <AuthField
              {...form.field("email")}
              type="email"
              autoComplete="email"
              label={m.common.email}
              placeholder={m.common.emailPlaceholder}
              required
            />
            <AuthField
              {...form.field("password")}
              type="password"
              autoComplete="new-password"
              label={m.common.password}
              description={fillAuthText(m.validation.passwordHint, {
                min: AUTH_PASSWORD_MIN,
              })}
              minLength={AUTH_PASSWORD_MIN}
              required
            />
            <AuthField
              {...form.field("confirm")}
              type="password"
              autoComplete="new-password"
              label={m.common.passwordConfirm}
              required
            />
            {extraFields}
            <AuthFormError>{form.formError}</AuthFormError>
            <Button type="submit" className="w-full" disabled={form.pending}>
              {form.pending ? m.signup.submitting : m.signup.submit}
            </Button>
          </FieldGroup>
        </form>
        {children}
      </div>
      {loginHref && (
        <AuthFooter>
          <p>
            {m.signup.hasAccount} <Link href={loginHref}>{m.common.login}</Link>
          </p>
        </AuthFooter>
      )}
    </>
  );
}

/** 재설정 메일을 다시 보내기까지 기다리는 초. */
const RESEND_COOLDOWN = 60;

type ResetPasswordFormProps = Linking & {
  messages: AuthMessages;
  /**
   * 재설정 메일 보내기. 실패면 `{ error }`. 가입하지 않은 주소여도 Supabase 는 오류를 주지 않는다
   * (가입 여부를 알리지 않으려는 것) — 그대로 "메일함을 확인해 주세요" 로 간다.
   */
  onSubmit: (email: string) => Promise<{ error: AuthSubmitError } | void>;
  loginHref: string;
};

export function ResetPasswordForm({
  messages: m,
  onSubmit,
  loginHref,
  linkComponent: Link = "a",
}: ResetPasswordFormProps) {
  const [sentTo, setSentTo] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(0);
  const [resending, setResending] = React.useState(false);
  const [resendError, setResendError] = React.useState<string | null>(null);
  const [resent, setResent] = React.useState(false);
  const form = useAuthForm({
    messages: m,
    action: "resetPassword",
    fields: { email: (v) => authValidate.email(m, v) },
  });

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  async function resend() {
    if (!sentTo || cooldown > 0 || resending) return;
    setResending(true);
    setResendError(null);
    setResent(false);
    let result: { error: AuthSubmitError } | void;
    try {
      result = await onSubmit(sentTo);
    } catch (error) {
      result = { error: thrownErrorText(m, error, "resetPassword") };
    }
    setResending(false);
    if (result) {
      setResendError(authSubmitErrorText(m, result.error, "resetPassword"));
      return;
    }
    setResent(true);
    setCooldown(RESEND_COOLDOWN);
  }

  const footer = (
    <AuthFooter>
      <p>
        <Link href={loginHref}>{m.resetPassword.backToLogin}</Link>
      </p>
    </AuthFooter>
  );

  if (sentTo) {
    return (
      <>
        <AuthStatus
          icon={<MailCheckIcon strokeWidth={1.5} />}
          title={m.common.checkInbox}
          description={fillAuthText(m.resetPassword.sent, { email: sentTo })}
        />
        <div className="flex flex-col gap-2">
          <AuthFormError className="text-center">{resendError}</AuthFormError>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={resend}
            disabled={cooldown > 0 || resending}
          >
            {resending
              ? m.resetPassword.resending
              : cooldown > 0
                ? fillAuthText(m.resetPassword.resendIn, { seconds: cooldown })
                : m.resetPassword.resend}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            disabled={resending}
            onClick={() => {
              setSentTo(null);
              setResendError(null);
              setResent(false);
            }}
          >
            {m.resetPassword.otherEmail}
          </Button>
          <p
            role="status"
            className="min-h-5 text-center text-sm text-muted-foreground"
          >
            {resent ? m.resetPassword.resent : null}
          </p>
        </div>
        {footer}
      </>
    );
  }

  return (
    <>
      <AuthHeader title={m.resetPassword.title} />
      <form
        {...formProps(form.pending)}
        onSubmit={form.onSubmit(async ({ email }) => {
          const address = email.trim();
          const result = await onSubmit(address);
          if (result) return result;
          setSentTo(address);
          setCooldown(RESEND_COOLDOWN);
        })}
      >
        <FieldGroup>
          <AuthField
            {...form.field("email")}
            type="email"
            autoComplete="email"
            label={m.common.email}
            placeholder={m.common.emailPlaceholder}
            required
          />
          <AuthFormError>{form.formError}</AuthFormError>
          <Button type="submit" className="w-full" disabled={form.pending}>
            {form.pending ? m.resetPassword.submitting : m.resetPassword.submit}
          </Button>
        </FieldGroup>
      </form>
      {footer}
    </>
  );
}

type NewPasswordFormProps = Linking & {
  messages: AuthMessages;
  /** 비밀번호 바꾸기. 실패면 `{ error }`, 성공이면 아무것도 돌려주지 않는다(완료 화면으로). */
  onSubmit: (password: string) => Promise<{ error: AuthSubmitError } | void>;
  /**
   * 바꿀 수 있는 세션이 있는지 — `checking` 은 확인 중 화면, `expired` 는 링크를 다시 받는 화면.
   * 서버에서 이미 확인했으면 넘기지 않는다(기본 `ready`).
   */
  access?: "checking" | "ready" | "expired";
  /** 완료 뒤 "계속하기". */
  continueHref: string;
  /** 링크 만료 때 "재설정 링크 다시 받기". `access` 가 `expired` 일 수 있으면 필요하다. */
  requestAgainHref?: string;
  /** 제목·설명을 바꿀 때(mobilog 임시 비밀번호 변경 등). 기본은 `newPassword.title`. */
  title?: React.ReactNode;
  description?: React.ReactNode;
};

export function NewPasswordForm({
  messages: m,
  onSubmit,
  access = "ready",
  continueHref,
  requestAgainHref,
  title,
  description,
  linkComponent: Link = "a",
}: NewPasswordFormProps) {
  const [done, setDone] = React.useState(false);
  const form = useAuthForm({
    messages: m,
    action: "newPassword",
    fields: {
      password: (v) => authValidate.newPassword(m, v),
      confirm: (v, all) => authValidate.passwordConfirm(m, v, all.password),
    },
  });

  if (access === "checking") {
    return (
      <p role="status" className="text-center text-sm text-muted-foreground">
        {m.newPassword.checking}
      </p>
    );
  }

  if (access === "expired") {
    return (
      <NewPasswordExpired
        messages={m}
        href={requestAgainHref}
        linkComponent={Link}
      />
    );
  }

  if (done) {
    return (
      <>
        <AuthStatus
          icon={<CircleCheckIcon strokeWidth={1.5} />}
          title={m.newPassword.done}
          description={m.newPassword.doneDescription}
        />
        <Button className="w-full" asChild>
          <Link href={continueHref}>{m.newPassword.continue}</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <AuthHeader title={title ?? m.newPassword.title} description={description} />
      <form
        {...formProps(form.pending)}
        onSubmit={form.onSubmit(async ({ password }) => {
          const result = await onSubmit(password);
          if (result) return result;
          setDone(true);
        })}
      >
        <FieldGroup>
          <AuthField
            {...form.field("password")}
            type="password"
            autoComplete="new-password"
            label={m.newPassword.password}
            description={fillAuthText(m.validation.passwordHint, {
              min: AUTH_PASSWORD_MIN,
            })}
            minLength={AUTH_PASSWORD_MIN}
            required
          />
          <AuthField
            {...form.field("confirm")}
            type="password"
            autoComplete="new-password"
            label={m.newPassword.passwordConfirm}
            required
          />
          <AuthFormError>{form.formError}</AuthFormError>
          <Button type="submit" className="w-full" disabled={form.pending}>
            {form.pending ? m.newPassword.submitting : m.newPassword.submit}
          </Button>
        </FieldGroup>
      </form>
    </>
  );
}
