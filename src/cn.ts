import { createCn } from "cn/config";

/**
 * 세 프로젝트 globals.css `@theme` 의 커스텀 `--text-*` 글자 크기. 이름이 xs·sm 꼴이
 * 아니면 `cn` 이 글자색으로 읽고 같은 호출의 `text-primary-foreground` 같은 색
 * 클래스를 지운다. 공용 컴포넌트 안의 `cn` 도 쓰는 쪽이 넘긴 className 을 합치므로
 * 모든 프로젝트의 이름이 여기 있어야 한다. 프로젝트에 크기를 추가하면 여기에도 넣는다.
 */
export const CUSTOM_TEXT_SIZES = [
  // devlog·mobilog
  "3xs",
  "2xs",
  "2xs-plus",
  // mylog
  "micro",
  "caption",
  "page",
  "page-lg",
  "hero",
  "hero-sm",
  "hero-xl",
  "page-xl",
  "title",
  "heading-lg",
  "heading",
  "heading-sm",
  "lead",
  "reading",
  "reading-sm",
  "tag",
] as const;

/**
 * 기본 `font-size` 그룹에 넣지 않고 따로 둔다. 기본 그룹은 `leading-*` 와
 * 충돌해서 앞에 온 행간을 지우는데, 이 크기들은 행간을 정하지 않으므로
 * 행간은 남아야 한다. 기본 크기(`text-sm` 등)와는 서로 덮어쓴다.
 */
export const cn = createCn({
  extend: {
    classGroups: { "custom-font-size": [{ text: [...CUSTOM_TEXT_SIZES] }] },
    conflictingClassGroups: {
      "custom-font-size": ["font-size"],
      "font-size": ["custom-font-size"],
    },
  },
});
