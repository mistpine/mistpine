/** Generated blocks of README.md and docs/spec.md, plus the themes.utimura.io share link. */
import { deflateRawSync } from "node:zlib";
import type { Entry, Spec } from "./spec.ts";

/** What each swatch is for in mistpine (from the resolved spec, see docs/spec.md). */
export const ROLES: Record<string, string> = {
  bg0: "Panels, floats, inactive tabs",
  bg1: "Editor and terminal background",
  bg2: "Cursor line, status line, menus, ANSI black",
  bg3: "Visual selection, menu selection",
  bg4: "Borders, line numbers, terminal selection",
  fg0: "Decoration only (the logo's back pine): too dim for text",
  fg1: "Comments",
  fg2: "Punctuation, status line text, ANSI white",
  fg3: "Text, variables, cursor",
  red: "Keywords, control flow, errors, deletions",
  orange: "Operators, builtins, escapes, current search match",
  yellow: "Types, attributes, warnings, current line number",
  green: "Functions, strings, headings, additions",
  cyan: "Tags, macros, regexes, links, hints",
  blue: "Parameters, properties, modules, info, accent",
  purple: "Numbers, constants, booleans",
  pink: "Spare accent for app-specific highlights",
  brightRed: "ANSI 9 (bright red)",
  brightGreen: "ANSI 10 (bright green)",
  brightYellow: "ANSI 11 (bright yellow)",
  brightBlue: "ANSI 12 (bright blue)",
  brightPurple: "ANSI 13 (bright magenta)",
  brightCyan: "ANSI 14 (bright cyan), the logo's front pine",
};

const BRIGHT: Record<string, string> = {
  red: "brightRed",
  green: "brightGreen",
  yellow: "brightYellow",
  blue: "brightBlue",
  purple: "brightPurple",
  cyan: "brightCyan",
};

const ANSI = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];

// ---------------------------------------------------------------- helpers

export const swatchPath = (hex: string) => `assets/swatches/${hex.slice(1)}.svg`;

/** Every color that gets a swatch image. */
export function swatchColors(spec: Spec): string[] {
  const all = [
    ...Object.values(spec.palette),
    ...spec.ansi.map((e) => e.hex),
    ...[spec.terminal, spec.syntax, spec.ui].flatMap((g) => Object.values(g).map((e) => e.hex)),
  ];
  return [...new Set(all)].sort();
}

function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [16, 8, 0].map((s) => {
    const c = ((n >> s) & 255) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio. */
export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m) as [number, number];
  return (x + 0.05) / (y + 0.05);
}

const sw = (hex: string, prefix: string) =>
  `<img src="${prefix}${swatchPath(hex)}" width="20" height="20" alt="">`;
const code = (s: string) => `\`${s}\``;
const style = (e: Entry) =>
  (["bold", "italic", "underline"] as const).filter((f) => e[f]).join(", ") || "";
const from = (e: Entry) => (e.ref ? code(e.ref) : e.derived ? code(e.derived) : "");

function table(head: string[], rows: string[][], align?: string[]): string {
  const sep = align ?? head.map(() => "---");
  return [head, sep, ...rows].map((r) => `| ${r.join(" | ")} |`).join("\n");
}

// ---------------------------------------------------------------- README

export function readmePalette(spec: Spec): string {
  const p = spec.palette;
  const neutrals = ["bg0", "bg1", "bg2", "bg3", "bg4", "fg0", "fg1", "fg2", "fg3"];
  const accents = ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"];
  const n = table(
    ["", "Neutral", "Hex", "Used for"],
    neutrals.map((k) => [sw(p[k] as string, ""), code(k), code(p[k] as string), ROLES[k] ?? ""]),
    [":-:", "---", "---", "---"],
  );
  const a = table(
    ["", "Accent", "Hex", "", "Bright", "Hex", "Used for"],
    accents.map((k) => {
      const b = BRIGHT[k];
      const bh = b ? (p[b] as string) : undefined;
      return [
        sw(p[k] as string, ""),
        code(k),
        code(p[k] as string),
        bh ? sw(bh, "") : "",
        b ? code(b) : "",
        bh ? code(bh) : "",
        ROLES[k] ?? "",
      ];
    }),
    [":-:", "---", "---", ":-:", "---", "---", "---"],
  );
  return `${n}\n\n${a}`;
}

export function readmeTerminal(spec: Spec, prefix = ""): string {
  const cell = (e: Entry) => `${sw(e.hex, prefix)}<br>${code(e.hex)}`;
  const t = spec.terminal;
  const pair = (k: string) => code(t[k]?.hex ?? "");
  return [
    table(
      ["", ...ANSI.map((name, i) => `${i} ${name}`)],
      [
        ["**normal**", ...spec.ansi.slice(0, 8).map(cell)],
        ["**bright**", ...spec.ansi.slice(8, 16).map(cell)],
      ],
      ["---", ...ANSI.map(() => ":-:")],
    ),
    "",
    `Background ${pair("background")}, foreground ${pair("foreground")}, cursor ${pair("cursor")} on ${pair("cursorText")}, selection ${pair("selectionBg")} with ${pair("selectionFg")} text.`,
  ].join("\n");
}

// ---------------------------------------------------------------- docs/spec.md

export function specPalette(spec: Spec): string {
  const bg = spec.terminal.background?.hex as string;
  return table(
    ["", "Key", "Hex", "Contrast on `bg1`", "Used for"],
    Object.entries(spec.palette).map(([k, hex]) => [
      sw(hex, "../"),
      code(k),
      code(hex),
      k.startsWith("bg") ? "" : `${contrast(hex, bg).toFixed(1)}:1`,
      ROLES[k] ?? "",
    ]),
    [":-:", "---", "---", "--:", "---"],
  );
}

export function specTerminal(spec: Spec): string {
  const rows = [
    ...Object.entries(spec.terminal).map(([k, e]) => [code(k), e] as const),
    ...spec.ansi.map(
      (e, i) => [`${code(`ansi${i}`)} ${i < 8 ? "" : "bright "}${ANSI[i % 8]}`, e] as const,
    ),
  ];
  return table(
    ["", "Token", "Hex", "From"],
    rows.map(([k, e]) => [sw(e.hex, "../"), k, code(e.hex), from(e)]),
    [":-:", "---", "---", "---"],
  );
}

export function specGroup(entries: Record<string, Entry>, against: string, styled = false): string {
  const head = ["", "Token", "Hex", "From", ...(styled ? ["Style", "Contrast"] : [])];
  return table(
    head,
    Object.entries(entries).map(([k, e]) => [
      sw(e.hex, "../"),
      code(k),
      code(e.hex),
      from(e),
      ...(styled ? [style(e), `${contrast(e.hex, against).toFixed(1)}:1`] : []),
    ]),
    [":-:", "---", "---", "---", ...(styled ? ["---", "--:"] : [])],
  );
}

// ---------------------------------------------------------------- share link

/** Same encoding as the app: `#s=` + base64url(deflate-raw(JSON without id/locks)). */
export function shareUrl(themeJson: string): string {
  const { id: _id, locks: _locks, ...rest } = JSON.parse(themeJson) as Record<string, unknown>;
  const packed = deflateRawSync(Buffer.from(JSON.stringify(rest)), { level: 9 });
  return `https://themes.utimura.io/#s=${packed.toString("base64url")}`;
}

/** Replace the text between `<!-- BEGIN:name -->` and `<!-- END:name -->`. */
export function fill(doc: string, name: string, body: string): string {
  const re = new RegExp(`(<!-- BEGIN:${name} -->)[\\s\\S]*?(<!-- END:${name} -->)`);
  if (!re.test(doc)) throw new Error(`missing <!-- BEGIN:${name} --> block`);
  return doc.replace(re, `$1\n${body}\n$2`);
}
