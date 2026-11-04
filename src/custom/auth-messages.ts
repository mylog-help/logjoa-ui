/**
 * 로그인·회원가입·비밀번호 재설정 화면의 문구 한 벌(ko·en·ja). 세 사이트(devlog·mylog·mobilog)가
 * 같은 말을 쓰도록 여기 한 곳에 둔다. 어조는 한국어 기준 해요체다.
 *
 * 화면 제목 아래 설명은 두지 않는다 — 제목과 입력칸으로 충분하다. 사이트마다 다른 것
 * (mobilog "이메일 또는 아이디" 등)은 사이트가 따로 둔다.
 *
 * `{email}`·`{min}` 은 `fillAuthText` 로 채운다. Supabase Auth 오류는 `authErrorText` 로 문장을 고른다.
 */

export type AuthMessages = {
  common: {
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordConfirm: string;
    or: string;
    login: string;
    signup: string;
    checkInbox: string;
  };
  login: {
    title: string;
    submit: string;
    submitting: string;
    demo: string;
    demoPending: string;
    noAccount: string;
    forgotPassword: string;
  };
  signup: {
    title: string;
    submit: string;
    submitting: string;
    hasAccount: string;
    /** 인증 메일을 보낸 뒤. `{email}` */
    sent: string;
  };
  resetPassword: {
    title: string;
    submit: string;
    submitting: string;
    /** 재설정 메일을 보낸 뒤. `{email}` */
    sent: string;
    otherEmail: string;
    backToLogin: string;
    resend: string;
    resending: string;
    /** 다시 보내기 대기. `{seconds}` */
    resendIn: string;
    resent: string;
  };
  newPassword: {
    title: string;
    /** 재설정 링크로 들어온 세션을 확인하는 동안 */
    checking: string;
    password: string;
    passwordConfirm: string;
    submit: string;
    submitting: string;
    done: string;
    doneDescription: string;
    /** 바꾼 뒤 다음 화면으로 */
    continue: string;
    /** 재설정 링크 없이 들어왔거나 링크가 만료됐을 때 */
    expired: string;
    expiredDescription: string;
    requestAgain: string;
  };
  validation: {
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    /** `{min}` */
    passwordMin: string;
    /** 새 비밀번호 칸 아래 미리 보이는 규칙. `{min}` */
    passwordHint: string;
    passwordMismatch: string;
  };
  errors: {
    invalidCredentials: string;
    emailNotConfirmed: string;
    emailExists: string;
    weakPassword: string;
    samePassword: string;
    emailInvalid: string;
    signupDisabled: string;
    userBanned: string;
    rateLimit: string;
    emailRateLimit: string;
    timeout: string;
    network: string;
    login: string;
    signup: string;
    resetPassword: string;
    newPassword: string;
    /** 가입 인증·소셜 로그인 링크가 만료됐거나 이미 쓰였을 때 */
    linkExpired: string;
  };
};

export const authMessages = {
  ko: {
    common: {
      email: "이메일",
      emailPlaceholder: "name@example.com",
      password: "비밀번호",
      passwordConfirm: "비밀번호 확인",
      or: "또는",
      login: "로그인",
      signup: "회원가입",
      checkInbox: "메일함을 확인해 주세요",
    },
    login: {
      title: "로그인",
      submit: "로그인",
      submitting: "로그인 중…",
      demo: "데모 계정으로 둘러보기",
      demoPending: "데모 계정으로 들어가는 중…",
      noAccount: "계정이 없나요?",
      forgotPassword: "비밀번호를 잊었나요?",
    },
    signup: {
      title: "회원가입",
      submit: "회원가입",
      submitting: "가입하는 중…",
      hasAccount: "이미 계정이 있나요?",
      sent: "{email} 주소로 인증 링크를 보냈어요. 링크를 열면 가입이 끝나요.",
    },
    resetPassword: {
      title: "비밀번호 재설정",
      submit: "재설정 링크 받기",
      submitting: "보내는 중…",
      sent: "{email} 주소로 재설정 링크를 보냈어요. 링크를 열면 새 비밀번호를 정할 수 있어요.",
      otherEmail: "다른 이메일로 받기",
      backToLogin: "로그인으로 돌아가기",
      resend: "메일 다시 받기",
      resending: "보내는 중…",
      resendIn: "{seconds}초 뒤에 다시 받을 수 있어요",
      resent: "메일을 다시 보냈어요.",
    },
    newPassword: {
      title: "새 비밀번호",
      checking: "확인하는 중…",
      password: "새 비밀번호",
      passwordConfirm: "새 비밀번호 확인",
      submit: "비밀번호 바꾸기",
      submitting: "바꾸는 중…",
      done: "비밀번호를 바꿨어요",
      doneDescription: "다음부터 새 비밀번호로 로그인해요.",
      continue: "계속하기",
      expired: "링크를 쓸 수 없어요",
      expiredDescription:
        "재설정 링크가 만료됐거나 이미 쓰였어요. 링크를 다시 받아 주세요.",
      requestAgain: "재설정 링크 다시 받기",
    },
    validation: {
      emailRequired: "이메일을 입력해 주세요.",
      emailInvalid: "이메일 주소를 다시 확인해 주세요.",
      passwordRequired: "비밀번호를 입력해 주세요.",
      passwordMin: "비밀번호는 {min}자 이상이어야 해요.",
      passwordHint: "{min}자 이상으로 정해 주세요.",
      passwordMismatch: "비밀번호가 서로 달라요.",
    },
    errors: {
      invalidCredentials: "이메일 또는 비밀번호가 맞지 않아요.",
      emailNotConfirmed:
        "아직 메일 인증이 끝나지 않았어요. 가입할 때 받은 메일의 링크를 열어 주세요.",
      emailExists: "이미 가입된 이메일이에요. 로그인해 주세요.",
      weakPassword: "비밀번호가 너무 쉬워요. 더 길고 짐작하기 어렵게 정해 주세요.",
      samePassword: "지금 쓰는 비밀번호와 다르게 정해 주세요.",
      emailInvalid: "이메일 주소를 다시 확인해 주세요.",
      signupDisabled: "지금은 새로 가입할 수 없어요.",
      userBanned: "이 계정은 지금 쓸 수 없어요. 문의해 주세요.",
      rateLimit: "시도가 너무 많았어요. 잠시 뒤에 다시 해 주세요.",
      emailRateLimit: "메일을 너무 자주 보냈어요. 잠시 뒤에 다시 해 주세요.",
      timeout: "응답이 늦어요. 잠시 뒤에 다시 해 주세요.",
      network: "인터넷 연결을 확인한 뒤 다시 해 주세요.",
      login: "로그인하지 못했어요. 잠시 뒤에 다시 해 주세요.",
      signup: "가입하지 못했어요. 잠시 뒤에 다시 해 주세요.",
      resetPassword: "메일을 보내지 못했어요. 잠시 뒤에 다시 해 주세요.",
      newPassword: "비밀번호를 바꾸지 못했어요. 잠시 뒤에 다시 해 주세요.",
      linkExpired:
        "인증 링크가 만료됐거나 이미 쓰였어요. 로그인하거나 처음부터 다시 해 주세요.",
    },
  },
  en: {
    common: {
      email: "Email",
      emailPlaceholder: "name@example.com",
      password: "Password",
      passwordConfirm: "Confirm password",
      or: "or",
      login: "Log in",
      signup: "Sign up",
      checkInbox: "Check your inbox",
    },
    login: {
      title: "Log in",
      submit: "Log in",
      submitting: "Logging in…",
      demo: "Explore with a demo account",
      demoPending: "Opening the demo account…",
      noAccount: "Don't have an account?",
      forgotPassword: "Forgot your password?",
    },
    signup: {
      title: "Sign up",
      submit: "Sign up",
      submitting: "Signing up…",
      hasAccount: "Already have an account?",
      sent: "We sent a confirmation link to {email}. Open it to finish signing up.",
    },
    resetPassword: {
      title: "Reset password",
      submit: "Send reset link",
      submitting: "Sending…",
      sent: "We sent a reset link to {email}. Open it to choose a new password.",
      otherEmail: "Use a different email",
      backToLogin: "Back to log in",
      resend: "Send the email again",
      resending: "Sending…",
      resendIn: "You can resend in {seconds}s",
      resent: "We sent the email again.",
    },
    newPassword: {
      title: "New password",
      checking: "Checking…",
      password: "New password",
      passwordConfirm: "Confirm new password",
      submit: "Change password",
      submitting: "Changing…",
      done: "Password changed",
      doneDescription: "Use your new password the next time you log in.",
      continue: "Continue",
      expired: "This link can't be used",
      expiredDescription:
        "The reset link has expired or was already used. Please request a new one.",
      requestAgain: "Request a new link",
    },
    validation: {
      emailRequired: "Enter your email.",
      emailInvalid: "Check your email address.",
      passwordRequired: "Enter your password.",
      passwordMin: "Use at least {min} characters.",
      passwordHint: "At least {min} characters.",
      passwordMismatch: "The passwords don't match.",
    },
    errors: {
      invalidCredentials: "The email or password is incorrect.",
      emailNotConfirmed:
        "Your email isn't confirmed yet. Open the link in the email we sent when you signed up.",
      emailExists: "This email is already registered. Please log in.",
      weakPassword:
        "This password is too easy to guess. Choose a longer, harder one.",
      samePassword: "Choose a password different from your current one.",
      emailInvalid: "Check your email address.",
      signupDisabled: "Sign-ups are closed right now.",
      userBanned: "This account can't be used right now. Please contact us.",
      rateLimit: "Too many attempts. Please try again in a moment.",
      emailRateLimit: "Too many emails sent. Please try again in a moment.",
      timeout: "The server is slow to respond. Please try again in a moment.",
      network: "Check your internet connection and try again.",
      login: "We couldn't log you in. Please try again in a moment.",
      signup: "We couldn't sign you up. Please try again in a moment.",
      resetPassword: "We couldn't send the email. Please try again in a moment.",
      newPassword:
        "We couldn't change your password. Please try again in a moment.",
      linkExpired:
        "This link has expired or was already used. Log in or start again.",
    },
  },
  ja: {
    common: {
      email: "メールアドレス",
      emailPlaceholder: "name@example.com",
      password: "パスワード",
      passwordConfirm: "パスワード（確認）",
      or: "または",
      login: "ログイン",
      signup: "新規登録",
      checkInbox: "メールを確認してください",
    },
    login: {
      title: "ログイン",
      submit: "ログイン",
      submitting: "ログイン中…",
      demo: "デモアカウントで試す",
      demoPending: "デモアカウントに入っています…",
      noAccount: "アカウントをお持ちでないですか？",
      forgotPassword: "パスワードをお忘れですか？",
    },
    signup: {
      title: "新規登録",
      submit: "新規登録",
      submitting: "登録中…",
      hasAccount: "すでにアカウントをお持ちですか？",
      sent: "{email} に確認リンクを送りました。リンクを開くと登録が完了します。",
    },
    resetPassword: {
      title: "パスワードの再設定",
      submit: "再設定リンクを受け取る",
      submitting: "送信中…",
      sent: "{email} に再設定リンクを送りました。リンクを開くと新しいパスワードを設定できます。",
      otherEmail: "別のメールアドレスで受け取る",
      backToLogin: "ログインに戻る",
      resend: "メールを再送する",
      resending: "送信中…",
      resendIn: "{seconds}秒後に再送できます",
      resent: "メールを再送しました。",
    },
    newPassword: {
      title: "新しいパスワード",
      checking: "確認中…",
      password: "新しいパスワード",
      passwordConfirm: "新しいパスワード（確認）",
      submit: "パスワードを変更",
      submitting: "変更中…",
      done: "パスワードを変更しました",
      doneDescription: "次回から新しいパスワードでログインしてください。",
      continue: "続ける",
      expired: "このリンクは使えません",
      expiredDescription:
        "再設定リンクの期限が切れたか、すでに使われています。もう一度リンクを受け取ってください。",
      requestAgain: "再設定リンクをもう一度受け取る",
    },
    validation: {
      emailRequired: "メールアドレスを入力してください。",
      emailInvalid: "メールアドレスをもう一度確認してください。",
      passwordRequired: "パスワードを入力してください。",
      passwordMin: "パスワードは{min}文字以上にしてください。",
      passwordHint: "{min}文字以上で設定してください。",
      passwordMismatch: "パスワードが一致しません。",
    },
    errors: {
      invalidCredentials: "メールアドレスまたはパスワードが正しくありません。",
      emailNotConfirmed:
        "メールの確認が済んでいません。登録時に届いたメールのリンクを開いてください。",
      emailExists: "このメールアドレスは登録済みです。ログインしてください。",
      weakPassword:
        "パスワードが推測されやすいです。より長く、推測しにくいものにしてください。",
      samePassword: "現在のパスワードとは別のものにしてください。",
      emailInvalid: "メールアドレスをもう一度確認してください。",
      signupDisabled: "現在、新規登録はできません。",
      userBanned: "このアカウントは現在使えません。お問い合わせください。",
      rateLimit: "試行回数が多すぎます。しばらくしてからもう一度お試しください。",
      emailRateLimit:
        "メールの送信が多すぎます。しばらくしてからもう一度お試しください。",
      timeout: "応答が遅れています。しばらくしてからもう一度お試しください。",
      network: "インターネット接続を確認して、もう一度お試しください。",
      login: "ログインできませんでした。しばらくしてからもう一度お試しください。",
      signup: "登録できませんでした。しばらくしてからもう一度お試しください。",
      resetPassword:
        "メールを送信できませんでした。しばらくしてからもう一度お試しください。",
      newPassword:
        "パスワードを変更できませんでした。しばらくしてからもう一度お試しください。",
      linkExpired:
        "リンクの期限が切れたか、すでに使われています。ログインするか、最初からやり直してください。",
    },
  },
} satisfies Record<"ko" | "en" | "ja", AuthMessages>;

export type AuthLocale = keyof typeof authMessages;

/**
 * 새로 정하는 비밀번호(가입·재설정·변경)의 최소 길이 — 세 사이트 공통.
 * Supabase 프로젝트의 Auth → Password 최소 길이도 같은 값으로 둔다.
 * 로그인은 길이를 보지 않는다(예전 규칙으로 만든 비밀번호도 있다).
 */
export const AUTH_PASSWORD_MIN = 8;

/** 지원하지 않는 언어는 한국어로. */
export function getAuthMessages(locale: string): AuthMessages {
  return locale in authMessages
    ? authMessages[locale as AuthLocale]
    : authMessages.ko;
}

/** `{email}`·`{min}` 같은 자리를 채운다. */
export function fillAuthText(
  text: string,
  values: Record<string, string | number>,
): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Supabase Auth 오류 모양 — `AuthError` 를 그대로 넘기면 된다. */
export type AuthErrorLike = { code?: string; name?: string; status?: number };

const errorCodes: Record<string, keyof AuthMessages["errors"]> = {
  invalid_credentials: "invalidCredentials",
  email_not_confirmed: "emailNotConfirmed",
  user_already_exists: "emailExists",
  email_exists: "emailExists",
  weak_password: "weakPassword",
  same_password: "samePassword",
  email_address_invalid: "emailInvalid",
  validation_failed: "emailInvalid",
  signup_disabled: "signupDisabled",
  user_banned: "userBanned",
  over_request_rate_limit: "rateLimit",
  over_email_send_rate_limit: "emailRateLimit",
  request_timeout: "timeout",
};

/**
 * Supabase Auth 오류를 화면에 보일 문장으로. 원문(`Invalid login credentials` 같은 영어)은
 * 사용자에게 그대로 보이지 않게 한다. 모르는 코드는 동작별 기본 문장으로 떨어진다.
 */
export function authErrorText(
  messages: AuthMessages,
  error: AuthErrorLike,
  action: "login" | "signup" | "resetPassword" | "newPassword",
): string {
  // 서버에 닿지 못한 경우(오프라인·DNS 등). supabase-js 는 status 0 으로 준다.
  if (error.name === "AuthRetryableFetchError" || error.status === 0) {
    return messages.errors.network;
  }
  if (error.status === 429) return messages.errors.rateLimit;
  const key = error.code ? errorCodes[error.code] : undefined;
  return messages.errors[key ?? action];
}

/**
 * 입력칸 검사 — 세 사이트가 같은 기준·문장을 쓴다. 문제가 없으면 `undefined`.
 * zod 를 쓰는 사이트는 `superRefine` 등에서, 쓰지 않는 사이트는 제출 때 바로 부른다.
 */
export const authValidate = {
  email(messages: AuthMessages, value: string): string | undefined {
    const v = value.trim();
    if (!v) return messages.validation.emailRequired;
    // 브라우저 `type=email` 과 같은 수준 — 골뱅이 앞뒤에 글자, 뒤에 점.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return messages.validation.emailInvalid;
  },
  /** 로그인 — 길이는 보지 않는다(예전 규칙으로 만든 비밀번호도 있다). */
  password(messages: AuthMessages, value: string): string | undefined {
    if (!value) return messages.validation.passwordRequired;
  },
  /** 가입·새 비밀번호 */
  newPassword(
    messages: AuthMessages,
    value: string,
    min: number = AUTH_PASSWORD_MIN,
  ): string | undefined {
    if (!value) return messages.validation.passwordRequired;
    if (value.length < min)
      return fillAuthText(messages.validation.passwordMin, { min });
  },
  passwordConfirm(
    messages: AuthMessages,
    value: string,
    password: string,
  ): string | undefined {
    if (value !== password) return messages.validation.passwordMismatch;
  },
};
