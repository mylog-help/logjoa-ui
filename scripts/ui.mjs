// shadcn 원본 관리 — src/ui·src/hooks 는 손으로 고치지 않고 이 스크립트로만 바꾼다
//
//   node scripts/ui.mjs update [이름...]  shadcn 에서 받아 덮어쓰고 ui.lock.json 에 해시 기록 (이름 없으면 지금 있는 전부)
//   node scripts/ui.mjs check             src/ui·src/hooks 가 ui.lock.json 과 같은지 — 손으로 고치면 실패 (CI)
//   node scripts/ui.mjs upstream          최신 shadcn 을 임시로 받아 지금과 다른 파일만 알림 (아무것도 안 바꿈)
//
// shadcn 레지스트리는 버전이 고정되지 않아 같은 CLI 로도 날마다 결과가 달라질 수 있다.
// 그래서 CI 는 "마지막으로 받은 것과 같은가"(check)만 막고, 최신과의 차이(upstream)는 알림으로만 본다.
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const LOCK = path.join(ROOT, "ui.lock.json");
const SHADCN = "4.23.0";
const CONFIG = {
  style: "radix-nova",
  iconLibrary: "lucide",
  menuColor: "default",
  menuAccent: "subtle",
};

const lf = (s) => s.replace(/\r\n/g, "\n");
const hash = (s) => crypto.createHash("sha256").update(lf(s)).digest("hex");
const readLock = () =>
  fs.existsSync(LOCK)
    ? JSON.parse(fs.readFileSync(LOCK, "utf8"))
    : { files: {} };

// 원본이 쓰는 경로를 패키지 안 상대 경로로. cn 은 커스텀 글자 크기를 등록한 패키지 것을 쓴다(README "cn").
function transform(code) {
  return code
    .replace(/from "cn"/g, 'from "../cn"')
    .replace(/from "@\/lib\/utils"/g, 'from "../cn"')
    .replace(/from "@\/components\/ui\/([a-z0-9-]+)"/g, 'from "./$1"')
    .replace(/from "@\/hooks\/([a-z0-9-]+)"/g, 'from "../hooks/$1"');
}

function format(files) {
  const bin = path.join(
    ROOT,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "prettier.cmd" : "prettier",
  );
  execFileSync(bin, ["--write", "--log-level", "warn", ...files], {
    cwd: ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}

// 패키지 theme.css 를 쓰는 빈 프로젝트에 shadcn CLI 로 받는다. 결과: { "ui/button.tsx": 코드, "hooks/use-mobile.ts": 코드 }
function fetchStock(names) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "logjoa-ui-"));
  try {
    fs.mkdirSync(path.join(dir, "src", "app"), { recursive: true });
    fs.writeFileSync(
      path.join(dir, "package.json"),
      JSON.stringify({
        name: "ui-fetch",
        private: true,
        dependencies: {
          react: "19.3.1",
          "react-dom": "19.3.1",
          next: "16.4.3",
          tailwindcss: "^4",
        },
      }),
    );
    fs.writeFileSync(
      path.join(dir, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          baseUrl: ".",
          paths: { "@/*": ["./src/*"] },
          jsx: "react-jsx",
          moduleResolution: "bundler",
        },
      }),
    );
    // --font-heading 같은 토큰이 있느냐에 따라 CLI 가 넣는 클래스가 달라지므로 실제 테마를 쓴다
    const theme = fs
      .readFileSync(path.join(SRC, "theme.css"), "utf8")
      .replace(/^@source .*$/gm, "");
    fs.writeFileSync(
      path.join(dir, "src", "app", "globals.css"),
      `@import "tailwindcss";\n${theme}`,
    );
    fs.writeFileSync(
      path.join(dir, "components.json"),
      JSON.stringify({
        $schema: "https://ui.shadcn.com/schema.json",
        ...CONFIG,
        rsc: true,
        tsx: true,
        rtl: false,
        tailwind: {
          config: "",
          css: "src/app/globals.css",
          baseColor: "neutral",
          cssVariables: true,
          prefix: "",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
          ui: "@/components/ui",
          lib: "@/lib",
          hooks: "@/hooks",
        },
        registries: {},
      }),
    );
    execFileSync(
      "npx",
      [
        "--yes",
        `shadcn@${SHADCN}`,
        "add",
        ...names,
        "--yes",
        "--overwrite",
        "--silent",
      ],
      { cwd: dir, stdio: "inherit", shell: process.platform === "win32" },
    );
    const out = {};
    for (const [from, to] of [
      ["src/components/ui", "ui"],
      ["src/hooks", "hooks"],
    ]) {
      const d = path.join(dir, from);
      if (!fs.existsSync(d)) continue;
      for (const f of fs.readdirSync(d))
        out[`${to}/${f}`] = transform(
          lf(fs.readFileSync(path.join(d, f), "utf8")),
        );
    }
    return out;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

const currentNames = () =>
  fs
    .readdirSync(path.join(SRC, "ui"))
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.slice(0, -4));

const [cmd, ...args] = process.argv.slice(2);

if (cmd === "update") {
  const names = args.length ? args : currentNames();
  const files = fetchStock(names);
  const written = [];
  for (const [rel, code] of Object.entries(files)) {
    const p = path.join(SRC, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, code);
    written.push(p);
  }
  format(written);
  const prev = readLock().files;
  for (const rel of Object.keys(files))
    prev[rel] = hash(fs.readFileSync(path.join(SRC, rel), "utf8"));
  const lock = {
    shadcn: SHADCN,
    config: CONFIG,
    updated: new Date().toISOString().slice(0, 10),
    files: Object.fromEntries(Object.entries(prev).sort()),
  };
  fs.writeFileSync(LOCK, JSON.stringify(lock, null, 2) + "\n");
  console.log(`받음: ${Object.keys(files).join(", ")}`);
} else if (cmd === "check") {
  const lock = readLock();
  const bad = [];
  for (const [rel, h] of Object.entries(lock.files)) {
    const p = path.join(SRC, rel);
    if (!fs.existsSync(p)) bad.push(`${rel}: 없음`);
    else if (hash(fs.readFileSync(p, "utf8")) !== h)
      bad.push(`${rel}: 원본과 다름`);
  }
  for (const dir of ["ui", "hooks"]) {
    for (const f of fs.readdirSync(path.join(SRC, dir)))
      if (!lock.files[`${dir}/${f}`])
        bad.push(
          `${dir}/${f}: ui.lock.json 에 없음 — 직접 만든 것이면 src/custom 으로`,
        );
  }
  if (bad.length) {
    console.error(
      "✗ src/ui·src/hooks 는 shadcn 원본만 둔다. 바꾸려면 node scripts/ui.mjs update, 모양을 더하려면 src/custom.\n  " +
        bad.join("\n  "),
    );
    process.exit(1);
  }
  console.log(
    `✓ shadcn 원본 ${Object.keys(lock.files).length}개 그대로 (shadcn ${lock.shadcn}, ${lock.updated})`,
  );
} else if (cmd === "upstream") {
  const files = fetchStock(currentNames());
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "logjoa-ui-fmt-"));
  const paths = Object.entries(files).map(([rel, code]) => {
    const p = path.join(tmp, rel.replace("/", "__"));
    fs.writeFileSync(p, code);
    return [rel, p];
  });
  format(paths.map(([, p]) => p));
  const changed = paths
    .filter(
      ([rel, p]) =>
        !fs.existsSync(path.join(SRC, rel)) ||
        lf(fs.readFileSync(p, "utf8")) !==
          lf(fs.readFileSync(path.join(SRC, rel), "utf8")),
    )
    .map(([rel]) => rel);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(
    changed.length
      ? `최신 shadcn 과 다른 파일: ${changed.join(", ")}\n받으려면: node scripts/ui.mjs update`
      : "최신 shadcn 과 같음",
  );
} else {
  console.error(
    "사용법: node scripts/ui.mjs update [이름...] | check | upstream",
  );
  process.exit(1);
}
