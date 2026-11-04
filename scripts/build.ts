/**
 * Writes everything derived from `palette/mistpine.json`: palette formats, logos,
 * banner, specimen, swatches and the generated blocks of README.md and docs/spec.md.
 *
 *   pnpm build            write the files
 *   pnpm build --check    fail if any file is out of date (CI)
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  avatarSvg,
  bannerSvg,
  lockupSvg,
  markColors,
  markSvg,
  socialSvg,
  specimenSvg,
  swatchSvg,
} from "./lib/brand.ts";
import {
  fill,
  readmePalette,
  readmeTerminal,
  shareUrl,
  specGroup,
  specPalette,
  specTerminal,
  swatchColors,
  swatchPath,
} from "./lib/docs.ts";
import { base16, base24, css, lua, scss } from "./lib/formats.ts";
import { loadSpec, ROOT } from "./lib/spec.ts";

export const TAGLINE = "a color scheme drawn from fog and pine";

const check = process.argv.includes("--check");
const spec = loadSpec();
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");
const out = new Map<string, string>();

// Palette formats
out.set("palette/mistpine.css", css(spec));
out.set("palette/mistpine.scss", scss(spec));
out.set("palette/mistpine.lua", lua(spec));
out.set("palette/mistpine.base16.yaml", base16(spec));
out.set("palette/mistpine.base24.yaml", base24(spec));

// Brand
const dark = markColors(spec, "dark");
out.set("assets/logo/mark.svg", markSvg(dark));
out.set("assets/logo/mark-light.svg", markSvg(markColors(spec, "light")));
out.set("assets/logo/mark-32.svg", markSvg(dark, "32"));
out.set("assets/logo/mark-16.svg", markSvg(dark, "16"));
out.set("assets/logo/avatar.svg", avatarSvg(spec));
out.set("assets/logo/lockup.svg", lockupSvg(spec, { variant: "dark" }));
out.set("assets/logo/lockup-light.svg", lockupSvg(spec, { variant: "light" }));
out.set(
  "assets/logo/lockup-nvim.svg",
  lockupSvg(spec, {
    variant: "dark",
    suffix: { text: ".nvim", color: spec.palette.brightGreen as string },
  }),
);
out.set("assets/banner.svg", bannerSvg(spec, TAGLINE));
out.set("assets/social-preview.svg", socialSvg(spec, TAGLINE));
out.set("assets/palette.svg", specimenSvg(spec));
for (const hex of swatchColors(spec)) out.set(swatchPath(hex), swatchSvg(hex));

// Docs
const share = shareUrl(read("mistpine.theme.json"));
let readme = read("README.md");
readme = fill(readme, "palette", readmePalette(spec));
readme = fill(readme, "terminal", readmeTerminal(spec));
readme = readme.replace(/https:\/\/themes\.utimura\.io\/#s=[\w-]*/g, share);
out.set("README.md", readme);

const bg = spec.ui.editorBg?.hex as string;
let doc = read("docs/spec.md");
doc = fill(doc, "palette", specPalette(spec));
doc = fill(doc, "terminal", specTerminal(spec));
doc = fill(doc, "syntax", specGroup(spec.syntax, bg, true));
doc = fill(doc, "ui", specGroup(spec.ui, bg));
doc = doc.replace(/https:\/\/themes\.utimura\.io\/#s=[\w-]*/g, share);
out.set("docs/spec.md", doc);

// Swatches no longer in use
const swatchDir = join(ROOT, "assets", "swatches");
const stale = existsSync(swatchDir)
  ? readdirSync(swatchDir)
      .map((f) => `assets/swatches/${f}`)
      .filter((f) => !out.has(f))
  : [];

if (check) {
  const outdated = [...out]
    .filter(([path, content]) => !existsSync(join(ROOT, path)) || read(path) !== content)
    .map(([path]) => path);
  const problems = [...outdated, ...stale.map((f) => `${f} (stale)`)];
  if (problems.length) {
    console.error(`Out of date, run \`pnpm build\`:\n  ${problems.join("\n  ")}`);
    process.exit(1);
  }
  console.log(`${out.size} files up to date`);
} else {
  for (const [path, content] of out) {
    const file = join(ROOT, path);
    mkdirSync(dirname(file), { recursive: true });
    if (!existsSync(file) || readFileSync(file, "utf8") !== content) writeFileSync(file, content);
  }
  for (const f of stale) rmSync(join(ROOT, f));
  console.log(`wrote ${out.size} files${stale.length ? `, removed ${stale.length}` : ""}`);
}
