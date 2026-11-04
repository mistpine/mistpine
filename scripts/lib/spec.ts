import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export const ROOT = resolve(import.meta.dirname, "..", "..");

/** One resolved color: its hex, and the palette swatch or derivation it comes from. */
export interface Entry {
  hex: string;
  /** Palette key (`fg1`), when the color is a palette swatch. */
  ref?: string;
  /** How a blended color is made, e.g. `mix(@terminal.background, $yellow, 35%)`. */
  derived?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

/** `palette/mistpine.json`: the reference every port implements. */
export interface Spec {
  $comment: string;
  name: string;
  variant: "dark" | "light";
  palette: Record<string, string>;
  terminal: Record<string, Entry>;
  ansi: Entry[];
  syntax: Record<string, Entry>;
  ui: Record<string, Entry>;
}

export function loadSpec(): Spec {
  return JSON.parse(readFileSync(join(ROOT, "palette", "mistpine.json"), "utf8")) as Spec;
}
