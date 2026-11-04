/**
 * Renders the raster assets:
 *
 * - assets/preview.png: real Neovim highlighting (Tree-sitter) of a sample file,
 *   exported with `:TOhtml` and framed as a terminal window.
 * - assets/social-preview.png: assets/social-preview.svg at 1280 × 640.
 *
 * Needs Neovim 0.11+ with the TypeScript parser and nvim-treesitter's queries,
 * and a Chromium that playwright-core can launch. Paths can be overridden:
 *
 *   NVIM_TS_QUERIES   dir containing queries/typescript (default: lazy.nvim's nvim-treesitter/runtime)
 *   NVIM_TS_PARSERS   dir containing parser/typescript.so (default: stdpath("data")/site)
 *   CHROMIUM          browser executable (default: playwright's)
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import { type Entry, loadSpec, ROOT, type Spec } from "./lib/spec.ts";

const spec = loadSpec();
const data = process.env.XDG_DATA_HOME ?? join(homedir(), ".local", "share");
const queries =
  process.env.NVIM_TS_QUERIES ?? join(data, "nvim", "lazy", "nvim-treesitter", "runtime");
const parsers = process.env.NVIM_TS_PARSERS ?? join(data, "nvim", "site");

const SAMPLE = join(ROOT, "scripts", "render", "forecast.ts");
const CURSOR_LINE = 15;
const GIT_SIGNS: [line: number, kind: "Add" | "Change"][] = [
  [11, "Add"],
  [12, "Add"],
  [17, "Change"],
];
const DIAGNOSTIC = { line: 15, text: "■ Unsafe assignment of an `any` value." };

// ---------------------------------------------------------------- colors

const hex = (e: Entry | undefined) => {
  if (!e) throw new Error("missing spec entry");
  return e.hex;
};

/** sRGB blend, enough for a faint virtual-text background. */
function blend(a: string, b: string, t: number): string {
  const ch = (h: string) => [1, 3, 5].map((i) => Number.parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [ch(a), ch(b)];
  return `#${x
    .map((v, i) =>
      Math.round(v + ((y[i] as number) - v) * t)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

type Hl = { fg?: string; bg?: string; bold?: boolean; italic?: boolean; underline?: boolean };

/** Highlight groups for the preview, mapped like the themes app's Neovim export. */
function groups(s: Spec): Record<string, Hl> {
  const syn = (k: string): Hl => {
    const e = s.syntax[k];
    if (!e) throw new Error(`no syntax.${k}`);
    return { fg: e.hex, bold: e.bold, italic: e.italic, underline: e.underline };
  };
  const ui = (k: string) => hex(s.ui[k]);
  const bg = ui("editorBg");
  const map: Record<string, Hl> = {
    Normal: { fg: ui("editorFg"), bg },
    LineNr: { fg: ui("lineNr") },
    CursorLineNr: { fg: ui("lineNrActive"), bold: true },
    SignColumn: { fg: ui("lineNr") },
    GitSignsAdd: { fg: ui("gitAdd") },
    GitSignsChange: { fg: ui("gitChange") },
    DiagnosticVirtualTextWarn: { fg: ui("warning"), bg: blend(bg, ui("warning"), 0.1) },
    Comment: syn("comment"),
    String: syn("string"),
    Character: syn("string"),
    Number: syn("number"),
    Boolean: syn("boolean"),
    Constant: syn("constant"),
    Identifier: syn("variable"),
    Function: syn("function"),
    Statement: syn("keyword"),
    Keyword: syn("keyword"),
    Conditional: syn("control"),
    Repeat: syn("control"),
    Operator: syn("operator"),
    Type: syn("type"),
    Special: syn("escape"),
    Delimiter: syn("punctuation"),
    PreProc: syn("macro"),
    "@variable": syn("variable"),
    "@variable.builtin": syn("builtin"),
    "@variable.parameter": syn("parameter"),
    "@variable.member": syn("property"),
    "@property": syn("property"),
    "@constant": syn("constant"),
    "@constant.builtin": syn("constant"),
    "@module": syn("namespace"),
    "@string": syn("string"),
    "@string.escape": syn("escape"),
    "@string.regexp": syn("regex"),
    "@string.special": syn("escape"),
    "@character.special": syn("escape"),
    "@boolean": syn("boolean"),
    "@number": syn("number"),
    "@type": syn("type"),
    "@type.builtin": syn("type"),
    "@attribute": syn("attribute"),
    "@function": syn("function"),
    "@function.builtin": syn("builtin"),
    "@function.call": syn("function"),
    "@function.method": syn("method"),
    "@function.method.call": syn("method"),
    "@constructor": syn("type"),
    "@operator": syn("operator"),
    "@keyword": syn("keyword"),
    "@keyword.coroutine": syn("control"),
    "@keyword.repeat": syn("control"),
    "@keyword.return": syn("control"),
    "@keyword.exception": syn("control"),
    "@keyword.conditional": syn("control"),
    "@keyword.conditional.ternary": syn("operator"),
    "@punctuation.delimiter": syn("punctuation"),
    "@punctuation.bracket": syn("punctuation"),
    "@punctuation.special": syn("escape"),
    "@comment": syn("comment"),
    "@comment.documentation": syn("comment"),
  };
  return map;
}

function luaColorscheme(s: Spec): string {
  const val = (h: Hl) =>
    Object.entries(h)
      .filter(([, v]) => v !== undefined && v !== false)
      .map(([k, v]) => `${k} = ${typeof v === "string" ? `"${v}"` : v}`)
      .join(", ");
  return Object.entries(groups(s))
    .map(([name, h]) => `vim.api.nvim_set_hl(0, "${name}", { ${val(h)} })`)
    .join("\n");
}

// ---------------------------------------------------------------- Neovim → HTML

function tohtml(dir: string): { css: string; lines: string[] } {
  const colors = join(dir, "colors.lua");
  const driver = join(dir, "driver.lua");
  const out = join(dir, "out.html");
  writeFileSync(colors, luaColorscheme(spec));
  const marks = [
    ...GIT_SIGNS.map(
      ([line, kind]) =>
        `vim.api.nvim_buf_set_extmark(0, ns, ${line - 1}, 0, { sign_text = "▎", sign_hl_group = "GitSigns${kind}" })`,
    ),
    `vim.api.nvim_buf_set_extmark(0, ns, ${DIAGNOSTIC.line - 1}, 0, { virt_text = { { ${JSON.stringify(DIAGNOSTIC.text)}, "DiagnosticVirtualTextWarn" } }, virt_text_pos = "eol" })`,
  ];
  writeFileSync(
    driver,
    [
      'vim.cmd.packadd("nvim.tohtml")',
      `vim.opt.rtp:prepend(${JSON.stringify(queries)})`,
      `vim.opt.rtp:prepend(${JSON.stringify(parsers)})`,
      "vim.o.termguicolors = true",
      `vim.cmd.edit(${JSON.stringify(SAMPLE)})`,
      "vim.treesitter.start()",
      `dofile(${JSON.stringify(colors)})`,
      "vim.wo.number = true",
      'vim.wo.signcolumn = "yes"',
      'local ns = vim.api.nvim_create_namespace("mistpine-preview")',
      ...marks,
      'local html = require("tohtml").tohtml(0, { number_lines = true })',
      `vim.fn.writefile(html, ${JSON.stringify(out)})`,
      'vim.cmd("qa!")',
    ].join("\n"),
  );
  execFileSync("nvim", ["--clean", "--headless", "-c", `luafile ${driver}`], {
    stdio: ["ignore", "inherit", "inherit"],
    timeout: 60_000,
  });
  const html = readFileSync(out, "utf8");
  const css = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "";
  const pre = html.match(/<pre>\n?([\s\S]*?)\n*<\/pre>/)?.[1];
  if (!pre) throw new Error("no <pre> in :TOhtml output");
  if (!/class="-keyword"/.test(pre)) {
    throw new Error("no Tree-sitter highlights: check NVIM_TS_QUERIES and NVIM_TS_PARSERS");
  }
  // Only the color rules: the page sets its own font and background.
  const rules = css
    .split("\n")
    .filter((l) => /^\.[\w-]+ \{/.test(l))
    .join("\n");
  return { css: rules, lines: pre.split("\n") };
}

// ---------------------------------------------------------------- page

const font = (file: string) => pathToFileURL(join(ROOT, "scripts", "fonts", file)).href;

function page(code: { css: string; lines: string[] }): string {
  const p = spec.palette as Record<string, string>;
  const ui = (k: string) => hex(spec.ui[k]);
  const lines = code.lines.map((line, i) => {
    if (i + 1 !== CURSOR_LINE) return `${line}\n`;
    // :TOhtml has no cursor line: draw it, and the bold current line number.
    const nr = line.replace(
      /<span class="LineNr">(\s*\d+ )<\/span>/,
      '<span class="CursorLineNr">$1</span>',
    );
    return `<span class="cursorline">${nr}</span>`;
  });
  const lineCount = code.lines.length;
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face { font-family: "JetBrains Mono"; src: url("${font("JetBrainsMono-wght.ttf")}"); font-weight: 100 800; font-style: normal; }
@font-face { font-family: "JetBrains Mono"; src: url("${font("JetBrainsMono-Italic-wght.ttf")}"); font-weight: 100 800; font-style: italic; }
* { box-sizing: border-box; margin: 0; }
html, body { background: transparent; }
body { padding: 48px; width: max-content; }
.window {
  width: 1180px; border-radius: 14px; overflow: hidden;
  background: ${ui("editorBg")}; color: ${ui("editorFg")};
  box-shadow: 0 0 0 1px ${p.bg4}, 0 28px 64px -12px rgba(2, 10, 14, 0.55), 0 8px 20px -8px rgba(2, 10, 14, 0.4);
  font: 15px/1.6 "JetBrains Mono", monospace; font-variant-ligatures: none;
}
.titlebar { height: 42px; display: flex; align-items: center; padding: 0 16px; background: ${ui("panelBg")}; color: ${p.fg1}; font-size: 13px; position: relative; }
.dots { display: flex; gap: 8px; }
.dots i { width: 12px; height: 12px; border-radius: 50%; display: block; }
.title { position: absolute; left: 0; right: 0; text-align: center; pointer-events: none; }
pre { font: inherit; padding: 12px 0 10px 6px; white-space: pre; }
.cursorline { margin-left: -6px; padding-left: 6px; }
.cursorline { display: block; background: ${ui("cursorLine")}; }
${code.css}
.LineNr { color: ${ui("lineNr")}; }
.CursorLineNr { color: ${ui("lineNrActive")}; font-weight: 700; }
.status { height: 30px; display: flex; align-items: center; background: ${ui("statusBg")}; color: ${ui("statusFg")}; font-size: 13.5px; }
.status > span { padding: 0 14px; height: 100%; display: flex; align-items: center; }
.mode { background: ${ui("accent")}; color: ${ui("editorBg")}; font-weight: 700; }
.branch { background: ${ui("selection")}; color: ${p.fg2}; }
.spacer { flex: 1; }
.warn { color: ${ui("warning")}; }
.pos { background: ${ui("accent")}; color: ${ui("editorBg")}; font-weight: 700; }
.cmdline { height: 24px; padding: 0 14px; color: ${p.fg1}; font-size: 13.5px; display: flex; align-items: center; }
</style></head><body>
<div class="window">
  <div class="titlebar">
    <div class="dots"><i style="background:${p.red}"></i><i style="background:${p.yellow}"></i><i style="background:${p.green}"></i></div>
    <div class="title">nvim · forecast.ts</div>
  </div>
  <pre>${lines.join("")}</pre>
  <div class="status">
    <span class="mode">NORMAL</span><span class="branch">main</span><span>forecast.ts</span>
    <span class="spacer"></span>
    <span class="warn">■ 1</span><span>typescript</span><span>utf-8</span><span class="pos">${CURSOR_LINE}:3</span>
  </div>
  <div class="cmdline">"forecast.ts" ${lineCount}L written</div>
</div>
</body></html>`;
}

// ---------------------------------------------------------------- main

const tmp = mkdtempSync(join(tmpdir(), "mistpine-render-"));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
try {
  const preview = await browser.newPage({ deviceScaleFactor: 2 });
  await preview.setContent(page(tohtml(tmp)), { waitUntil: "load" });
  await preview.evaluate(() => document.fonts.ready);
  await preview
    .locator("body")
    .screenshot({ path: join(ROOT, "assets", "preview.png"), omitBackground: true });

  const social = await browser.newPage({ viewport: { width: 1280, height: 640 } });
  await social.goto(pathToFileURL(join(ROOT, "assets", "social-preview.svg")).href);
  await social.screenshot({ path: join(ROOT, "assets", "social-preview.png") });
  console.log("wrote assets/preview.png, assets/social-preview.png");
} finally {
  await browser.close();
  rmSync(tmp, { recursive: true, force: true });
}
