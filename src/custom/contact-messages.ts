/**
 * 문의 화면의 문구 한 벌(ko·en·ja). 세 사이트(devlog·mylog·mobilog)가 같은 말을 쓰도록
 * 여기 한 곳에 둔다. 사이트마다 달라지는 것(제목 아래 설명, 문의 유형, 안내 한 줄)은
 * 사이트가 props 로 넘긴다.
 *
 * `{email}` 은 `fillContactText` 로 채운다. 어조는 한국어 기준 해요체다.
 */

export type ContactMessages = {
  page: { title: string };
  form: {
    kind: { label: string };
    email: { label: string; placeholder: string };
    subject: { label: string; placeholder: string };
    body: { label: string; placeholder: string };
    attachment: {
      label: string;
      hint: string;
      choose: string;
      uploading: string;
      remove: string;
      errorType: string;
      errorSize: string;
      errorFailed: string;
    };
    agree: { label: string; link: string };
    optional: string;
    required: string;
    submit: string;
    submitting: string;
    uploading: string;
  };
  success: {
    title: string;
    description: string;
    ticket: string;
    home: string;
  };
  errors: {
    /** 접수가 안 될 때 메일로 안내하는 문구. 서버 액션이 쓴다. */
    unavailable: string;
  };
  /** 안내 목록의 공통 항목. 가운데 항목은 사이트가 채운다. */
  notes: {
    reply: { title: string; description: string };
    mail: { title: string; description: string };
  };
};

export const contactMessages = {
  ko: {
    page: { title: "문의하기" },
    form: {
      kind: { label: "문의 유형" },
      email: { label: "회신받을 이메일", placeholder: "example@email.com" },
      subject: { label: "제목", placeholder: "문의 제목을 적어 주세요" },
      body: {
        label: "문의 내용",
        placeholder: "문의 내용을 자세히 적어 주세요. (최소 10자)",
      },
      attachment: {
        label: "첨부",
        hint: "이미지·PDF · 5MB까지 · 최대 3개",
        choose: "파일 고르기",
        uploading: "올리는 중",
        remove: "빼기",
        errorType: "이미지(PNG·JPG·GIF·WebP)와 PDF만 올릴 수 있어요.",
        errorSize: "파일은 5MB까지 올릴 수 있어요.",
        errorFailed: "올리지 못했어요. 다시 시도해 주세요.",
      },
      agree: {
        label:
          "개인정보 수집·이용에 동의해요. 접수한 문의와 첨부 파일은 1년 뒤 지워져요.",
        link: "개인정보처리방침",
      },
      optional: "(선택)",
      required: "필수",
      submit: "문의 보내기",
      submitting: "보내는 중…",
      uploading: "첨부를 올리는 중…",
    },
    success: {
      title: "접수됐어요",
      description:
        "적어 주신 이메일로 답장을 보낼게요. 답장이 스팸함으로 가는 경우가 있어 함께 확인해 주세요.",
      ticket: "접수번호",
      home: "홈으로 돌아가기",
    },
    errors: {
      unavailable:
        "지금은 접수가 되지 않아요. 메일({email})로 보내 주시면 확인할게요.",
    },
    notes: {
      reply: {
        title: "모든 문의에 답장드려요",
        description:
          "접수된 순서대로 확인하고, 내용에 따라 며칠 걸릴 수 있어요.",
      },
      mail: {
        title: "이메일로도 받아요",
        description: "메일({email})로 보내셔도 같은 순서로 확인해요.",
      },
    },
  },
  en: {
    page: { title: "Contact" },
    form: {
      kind: { label: "Type of inquiry" },
      email: { label: "Email for our reply", placeholder: "example@email.com" },
      subject: { label: "Subject", placeholder: "Enter a subject" },
      body: {
        label: "Message",
        placeholder:
          "Please describe your inquiry in detail. (At least 10 characters)",
      },
      attachment: {
        label: "Attachments",
        hint: "Images or PDF · up to 5MB · up to 3 files",
        choose: "Choose files",
        uploading: "Uploading",
        remove: "Remove",
        errorType:
          "Only images (PNG, JPG, GIF, WebP) and PDF files can be uploaded.",
        errorSize: "Files can be up to 5MB.",
        errorFailed: "Upload failed. Please try again.",
      },
      agree: {
        label:
          "I agree to the collection and use of my personal information. Inquiries and attachments are deleted after one year.",
        link: "Privacy Policy",
      },
      optional: "(optional)",
      required: "required",
      submit: "Send inquiry",
      submitting: "Sending…",
      uploading: "Uploading attachments…",
    },
    success: {
      title: "We got it",
      description:
        "We will reply to the email you gave us. Please check your spam folder too, in case the reply lands there.",
      ticket: "Reference number",
      home: "Back to home",
    },
    errors: {
      unavailable:
        "We cannot accept inquiries right now. Please email {email} instead.",
    },
    notes: {
      reply: {
        title: "Every inquiry gets a reply",
        description:
          "We review inquiries in the order they arrive. Some may take a few days.",
      },
      mail: {
        title: "Email works too",
        description:
          "You can also write to {email}. We review it in the same order.",
      },
    },
  },
  ja: {
    page: { title: "お問い合わせ" },
    form: {
      kind: { label: "お問い合わせの種類" },
      email: {
        label: "ご返信先のメールアドレス",
        placeholder: "example@email.com",
      },
      subject: { label: "件名", placeholder: "件名を入力してください" },
      body: {
        label: "お問い合わせ内容",
        placeholder: "お問い合わせ内容を詳しくご入力ください。(10文字以上)",
      },
      attachment: {
        label: "添付",
        hint: "画像・PDF ・ 5MBまで ・ 3つまで",
        choose: "ファイルを選ぶ",
        uploading: "アップロード中",
        remove: "外す",
        errorType: "画像(PNG・JPG・GIF・WebP)とPDFのみアップロードできます。",
        errorSize: "ファイルは5MBまでです。",
        errorFailed: "アップロードできませんでした。もう一度お試しください。",
      },
      agree: {
        label:
          "個人情報の収集・利用に同意します。お問い合わせと添付ファイルは1年後に削除されます。",
        link: "プライバシーポリシー",
      },
      optional: "(任意)",
      required: "必須",
      submit: "送信する",
      submitting: "送信中…",
      uploading: "添付をアップロード中…",
    },
    success: {
      title: "受け付けました",
      description:
        "ご入力のメールアドレスにご返信します。返信が迷惑メールフォルダに入ることがあるため、あわせてご確認ください。",
      ticket: "受付番号",
      home: "ホームに戻る",
    },
    errors: {
      unavailable:
        "現在お問い合わせを受け付けられません。{email} までメールをお送りください。",
    },
    notes: {
      reply: {
        title: "すべてのお問い合わせに返信します",
        description:
          "受け付けた順に確認します。内容によっては数日かかる場合があります。",
      },
      mail: {
        title: "メールでも受け付けます",
        description:
          "{email} へ送っていただいても、同じ順番で確認します。",
      },
    },
  },
} satisfies Record<"ko" | "en" | "ja", ContactMessages>;

export type ContactLocale = keyof typeof contactMessages;

/** `{email}` 같은 자리표시자를 채운다. */
export function fillContactText(
  text: string,
  values: Record<string, string>,
): string {
  return text.replace(
    /\{(\w+)\}/g,
    (match, key: string) => values[key] ?? match,
  );
}
