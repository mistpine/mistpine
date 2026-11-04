/**
 * The mistpine mark and everything built on it, drawn as plain SVG.
 * Geometry and colors follow the "Final logo · neutral triad" board.
 */
import type { Spec } from "./spec.ts";
import { num, shape, type TextStyle, textPath } from "./text.ts";

interface MarkColors {
  backPine: string;
  backFog: string;
  rightPine: string;
  midFog: string;
  frontPine: string;
  frontFog: string;
}

/** Fog lighter than the light card it sits on (#d0d1d6): not palette colors. */
const LIGHT_MID_FOG = "#e2e3e7";
const LIGHT_FRONT_FOG = "#f2f2f4";

export const markColors = (spec: Spec, variant: "dark" | "light"): MarkColors => {
  const p = spec.palette as Record<string, string>;
  const c = (k: string) => {
    const v = p[k];
    if (!v) throw new Error(`palette has no ${k}`);
    return v;
  };
  return variant === "dark"
    ? {
        backPine: c("fg0"),
        backFog: c("bg4"),
        rightPine: c("fg1"),
        midFog: c("fg2"),
        frontPine: c("brightCyan"),
        frontFog: c("fg3"),
      }
    : {
        backPine: c("fg2"),
        backFog: c("fg3"),
        rightPine: c("fg1"),
        midFog: LIGHT_MID_FOG,
        frontPine: c("cyan"),
        frontFog: LIGHT_FRONT_FOG,
      };
};

/** Detail levels from the board: wavy fog, straight fog at 32 px, pines only at 16 px. */
export type Detail = "full" | "32" | "16";

const WAVE = "q7 -5 14 0 t14 0 t14 0 t14 0 t14 0";
const PINES = {
  back: "M60 8 L84 76 L36 76 Z",
  right: "M80 30 L104 98 L56 98 Z",
  front: "M38 38 L64 110 L12 110 Z",
};

/** The mark in its own 120 × 120 coordinate space. */
export function markShapes(c: MarkColors, detail: Detail = "full", stroke = 5): string {
  const fog = (d: string, color: string, w = stroke) =>
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  const pine = (d: string, color: string) => `<path d="${d}" fill="${color}"/>`;
  if (detail === "16") {
    return [
      pine(PINES.back, c.backPine),
      pine(PINES.right, c.rightPine),
      pine(PINES.front, c.frontPine),
    ].join("");
  }
  if (detail === "32") {
    return [
      pine(PINES.back, c.backPine),
      pine(PINES.right, c.rightPine),
      fog("M44 86 H112", c.midFog, 8),
      pine(PINES.front, c.frontPine),
      fog("M4 98 H74", c.frontFog, 8),
    ].join("");
  }
  return [
    pine(PINES.back, c.backPine),
    fog(`M34 64 ${WAVE}`, c.backFog),
    pine(PINES.right, c.rightPine),
    fog(`M44 86 ${WAVE}`, c.midFog),
    pine(PINES.front, c.frontPine),
    fog(`M4 98 ${WAVE}`, c.frontFog),
  ].join("");
}

const place = (x: number, y: number, size: number, inner: string) =>
  `<g transform="translate(${num(x)} ${num(y)}) scale(${num(size / 120)})">${inner}</g>`;

function svg(width: number, height: number, label: string, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${num(width)}" height="${num(height)}" viewBox="0 0 ${num(width)} ${num(height)}" role="img" aria-label="${label}"><title>${label}</title>${body}</svg>\n`;
}

export function markSvg(c: MarkColors, detail: Detail = "full", stroke = 5): string {
  return svg(120, 120, "mistpine", markShapes(c, detail, stroke));
}

/** App icon / avatar: the mark on a raised tile, as on the board. */
export function avatarSvg(spec: Spec): string {
  const p = spec.palette as Record<string, string>;
  const body = `<rect x="0.5" y="0.5" width="139" height="139" rx="32" fill="${p.bg2}" stroke="${p.bg4}"/>${place(18, 18, 104, markShapes(markColors(spec, "dark")))}`;
  return svg(140, 140, "mistpine", body);
}

/** Where the baseline of a CSS line box sits, measured from the box top. */
function baseline(style: TextStyle, lineHeight?: number): number {
  const { ascent, descent } = shape("x", style);
  const box = lineHeight ?? ascent + descent;
  return (box - (ascent + descent)) / 2 + ascent;
}

const WORDMARK = (size: number, tracking = -0.02): TextStyle => ({
  family: "outfit",
  size,
  weight: 300,
  tracking,
});

interface LockupOptions {
  variant: "dark" | "light";
  /** Port suffix such as `.nvim`, set in JetBrains Mono. */
  suffix?: { text: string; color: string };
}

/**
 * Mark + wordmark on a transparent background ("repo lockups" board):
 * 88 px mark, 20 px gap, Outfit Light 52 px, suffix in JetBrains Mono 38 px.
 */
export function lockupSvg(spec: Spec, opts: LockupOptions): string {
  const p = spec.palette as Record<string, string>;
  const mark = 88;
  const gap = 20;
  const word = WORDMARK(52);
  const text = shape("mistpine", word);
  const base = (mark - (text.ascent + text.descent)) / 2 + text.ascent;
  const x = mark + gap;
  const color = opts.variant === "dark" ? (p.fg3 as string) : (p.bg1 as string);
  let body = place(0, 0, mark, markShapes(markColors(spec, opts.variant)));
  body += textPath("mistpine", word, x, base, color);
  let width = x + text.width;
  if (opts.suffix) {
    const sx = width + (word.tracking ?? 0) * word.size;
    const mono: TextStyle = { family: "mono", size: 38 };
    body += textPath(opts.suffix.text, mono, sx, base, opts.suffix.color);
    width = sx + shape(opts.suffix.text, mono).width;
  }
  const label = `mistpine${opts.suffix?.text ?? ""}`;
  return svg(Math.ceil(width + 2), mark, label, body);
}

/** README banner: the lockup and tagline centered on the editor background. */
export function bannerSvg(spec: Spec, tagline: string): string {
  const p = spec.palette as Record<string, string>;
  const [W, H] = [1280, 360];
  const mark = 168;
  const gap = 40;
  const word = WORDMARK(112, -0.03);
  const tag: TextStyle = { family: "outfit", size: 26, weight: 300 };
  const wordW = shape("mistpine", word).width;
  const tagW = shape(tagline, tag).width;
  const tagBox = shape(tagline, tag);
  const blockH = 112 + 14 + tagBox.ascent + tagBox.descent;
  const groupW = mark + gap + Math.max(wordW, tagW);
  const x0 = (W - groupW) / 2;
  const cy = H / 2 - 4;
  const top = cy - blockH / 2;
  const tx = x0 + mark + gap;
  const accents = ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"];
  const band = accents
    .map((k, i) => {
      const w = W / accents.length;
      return `<rect x="${num(i * w)}" y="${H - 6}" width="${num(w + 0.5)}" height="6" fill="${p[k]}"/>`;
    })
    .join("");
  const body = [
    `<defs><clipPath id="card"><rect width="${W}" height="${H}" rx="24"/></clipPath></defs>`,
    `<g clip-path="url(#card)"><rect width="${W}" height="${H}" fill="${p.bg1}"/>${band}</g>`,
    place(x0, cy - mark / 2, mark, markShapes(markColors(spec, "dark"), "full", 4.5)),
    textPath("mistpine", word, tx, top + baseline(word, 112), p.fg3 as string),
    textPath(tagline, tag, tx + 2, top + 112 + 14 + baseline(tag), p.fg1 as string),
  ].join("");
  return svg(W, H, `mistpine: ${tagline}`, body);
}

/** Rounded strip of equal segments with a 1 px outline, as on the social board. */
function strip(id: string, x: number, y: number, w: number, colors: string[], ring: string) {
  const seg = w / colors.length;
  const cells = colors
    .map(
      (c, i) =>
        `<rect x="${num(x + i * seg)}" y="${y}" width="${num(seg + 0.5)}" height="32" fill="${c}"/>`,
    )
    .join("");
  return [
    `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="32" rx="8"/></clipPath>`,
    `<rect x="${x - 0.5}" y="${y - 0.5}" width="${w + 1}" height="33" rx="8.5" fill="none" stroke="${ring}"/>`,
    `<g clip-path="url(#${id})">${cells}</g>`,
  ].join("");
}

/** GitHub social preview (1280 × 640), after the "GitHub social preview" board. */
export function socialSvg(spec: Spec, tagline: string): string {
  const p = spec.palette as Record<string, string>;
  const t = spec.ansi.map((e) => e.hex);
  const [W, H, pad] = [1280, 640, 96];
  const word = WORDMARK(120, -0.03);
  const tag: TextStyle = { family: "outfit", size: 28, weight: 300 };
  const tagBox = shape(tagline, tag);
  const textH = 120 + 12 + tagBox.ascent + tagBox.descent;
  const top = (H - (220 + 56 + 32 + 12 + 32)) / 2;
  const textTop = top + (220 - textH) / 2;
  const tx = pad + 220 + 40;
  const neutrals = ["bg0", "bg1", "bg2", "bg3", "bg4", "fg0", "fg1", "fg2", "fg3"].map(
    (k) => p[k] as string,
  );
  const accents = ["red", "orange", "yellow", "green", "cyan", "blue", "purple"].map(
    (k) => p[k] as string,
  );
  const body = [
    `<rect width="${W}" height="${H}" fill="${p.bg1}"/>`,
    place(pad, top, 220, markShapes(markColors(spec, "dark"), "full", 4.5)),
    textPath("mistpine", word, tx, textTop + baseline(word, 120), p.fg3 as string),
    textPath(tagline, tag, tx + 2, textTop + 132 + baseline(tag), p.fg1 as string),
    strip("n", pad, top + 276, W - 2 * pad, [...neutrals, t[15] as string], p.bg4 as string),
    strip(
      "a",
      pad,
      top + 320,
      W - 2 * pad,
      [...accents, t[5] as string, p.pink as string],
      p.bg4 as string,
    ),
  ].join("");
  return svg(W, H, `mistpine: ${tagline}`, body);
}

/** Palette specimen: neutrals, accents, and brights under the accent they brighten. */
export function specimenSvg(spec: Spec): string {
  const p = spec.palette as Record<string, string>;
  const [W, pad, gap] = [1280, 48, 16];
  const tileW = (W - 2 * pad - 8 * gap) / 9;
  const tileH = 72;
  const label: TextStyle = { family: "mono", size: 13 };
  const name: TextStyle = { family: "mono", size: 14 };
  const accents = ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"];
  const brightOf: Record<string, string> = {
    red: "brightRed",
    yellow: "brightYellow",
    green: "brightGreen",
    cyan: "brightCyan",
    blue: "brightBlue",
    purple: "brightPurple",
  };
  const rows: { title: string; cells: (string | null)[] }[] = [
    { title: "neutrals", cells: ["bg0", "bg1", "bg2", "bg3", "bg4", "fg0", "fg1", "fg2", "fg3"] },
    { title: "accents", cells: accents },
    { title: "brights", cells: accents.map((a) => brightOf[a] ?? null) },
  ];
  const rowH = 20 + 12 + tileH + 14 + 18 + 4 + 18;
  const rowGap = 28;
  const H = pad * 2 + rows.length * rowH + (rows.length - 1) * rowGap;
  const parts = [`<rect width="${W}" height="${H}" rx="20" fill="${p.bg1}"/>`];
  rows.forEach((row, r) => {
    const y = pad + r * (rowH + rowGap);
    parts.push(textPath(row.title, label, pad, y + 14, p.fg1 as string));
    row.cells.forEach((key, i) => {
      if (!key) return;
      const x = pad + i * (tileW + gap);
      const ty = y + 32;
      const hex = p[key] as string;
      parts.push(
        `<rect x="${num(x + 0.5)}" y="${ty + 0.5}" width="${num(tileW - 1)}" height="${tileH - 1}" rx="10" fill="${hex}" stroke="#ffffff" stroke-opacity="0.07"/>`,
        textPath(key, name, x, ty + tileH + 14 + 14, p.fg3 as string),
        textPath(hex, label, x, ty + tileH + 14 + 18 + 4 + 13, p.fg1 as string),
      );
    });
  });
  return svg(W, H, "mistpine palette", parts.join(""));
}

/** Small rounded swatch for tables. */
export function swatchSvg(hex: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect x="0.5" y="0.5" width="19" height="19" rx="5" fill="${hex}" stroke="#7f7f7f" stroke-opacity="0.35"/></svg>\n`;
}
