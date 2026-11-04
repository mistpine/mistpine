# mistpine spec

The reference every mistpine port implements: which color goes where, in the
terminal, in code and in an editor's interface.
[`palette/mistpine.json`](../palette/mistpine.json) holds the same data in
machine-readable form, and
[themes.utimura.io](https://themes.utimura.io/#s=lVRNj-M2DP0vao6ejO04_jrtboH2VhTFXNpLQMl0oo4tuRI92WCQ_16IzjrxJt3tAgEcvkdSFPXId7Hy6oA9iFociAZfPz_TAXv065F0PzpYa_s8uTy_Jeu_vTUiEm_ovLZG1EkkDPQoatFrT4M2GFhwGgyJWjTgXkUkBuiQCEX9LuQ-FrX4KS6SKk1EJOQ-YVsmbVqwnbLdpkWKbG-CnWzTdjPxWbDTPEsyEJFoJ15lqmpitjkeChlLyTbnL4sqh4nn8zPMt0WwHTbBllhstrmIhHVg9sgpq1IydMKus0eGUthuQ9a9QzScFypgRJ2AgW1bQRWiZDdymrwtWyhDE0Y3dAyVqsxkFiBtXjlvXEKlQpDT-wP9MdXUxCXkOKO_fjkTKlkVMON_zuU1SqXFNeDTpYJqA63KZvj3uQ5ZQqnymfj5coUyl0rm4hwJ-4bO6QZ9eDlC12sD3RqM1_HikRZUsujngkoXLVtQm0V_F1S2aOOC2vL9oCzvqWQ79bBJmkUdHjtUpK35tBe1WAU9RWLU604b_M19VKTfQnNWl1ePxBFRHYDWX74SXO0JaPRrZTvrdvKSaPMfzqSpw2_4yrHttKdajc6hoYWPPxmCz-tXPB2tC6pYBcHOuLKGnO0e4H2PPIGrMAAz3o6G7x6IScMz1SMdbPOAMGMv0QXiouDb0z1Ng37HSWs7ZD3dU6PuSDN1mbaZGpwd0NGJGxDke2XAQY80FbKkeN1IlvSH-Zlb63Dv7GhuuhJyA1n36OSwxfwACu_zE_CD8IRf2wXK2XsYvYIBHx1wQGi02d82-FGxt7ts5tXoPJf9gJv1_Mv-seDDMJS8mrJcFvmkdmPNC34mXqVFlmTVA-2yYuvwd0ead_w1xTd8jVavO9u2YaD-b4w2wIO3O2rTTMvsh8Lk2LYsje-FheLCsO3gCKeH_tqpi69D8Nbs_hk1fceT7KDVznbNjd85Ep5O3bQ753l8F5qg00rU5EZkH8equCOuo_ouJKdm4hyJHgk4qUMgbD6G6tI4zZ-S-GkTv8Rxzb91HMd_hdcemq_ckqc4e0nyenN1O5__BQ) shows it live.

Each color lists where it comes from:

- a **palette key** such as `fg1`. Prefer these in ports, so a palette change
  stays a one-line edit.
- a **blend** such as `mix(@terminal.background, $green, 20%)`: 20% of green
  over the terminal background. Use the hex, or the blend if the app supports
  transparency.
- nothing, for the few terminal-only tones outside the palette.

Contrast ratios are WCAG 2, against the editor background `bg1` (`#0b1f27`).

## Palette

Neutrals run from dark to light: `bg0`–`bg4` are surfaces, `fg0`–`fg3` are
text tones. Accents carry meaning in code; brights are for the terminal.

<!-- BEGIN:palette -->
|  | Key | Hex | Contrast on `bg1` | Used for |
| :-: | --- | --- | --: | --- |
| <img src="../assets/swatches/071921.svg" width="20" height="20" alt=""> | `bg0` | `#071921` |  | Panels, floats, inactive tabs |
| <img src="../assets/swatches/0b1f27.svg" width="20" height="20" alt=""> | `bg1` | `#0b1f27` |  | Editor and terminal background |
| <img src="../assets/swatches/0f272e.svg" width="20" height="20" alt=""> | `bg2` | `#0f272e` |  | Cursor line, status line, menus, ANSI black |
| <img src="../assets/swatches/152f37.svg" width="20" height="20" alt=""> | `bg3` | `#152f37` |  | Visual selection, menu selection |
| <img src="../assets/swatches/26414a.svg" width="20" height="20" alt=""> | `bg4` | `#26414a` |  | Borders, line numbers, terminal selection |
| <img src="../assets/swatches/4e6570.svg" width="20" height="20" alt=""> | `fg0` | `#4e6570` | 2.8:1 | Decoration only (the logo's back pine): too dim for text |
| <img src="../assets/swatches/8796a0.svg" width="20" height="20" alt=""> | `fg1` | `#8796a0` | 5.6:1 | Comments |
| <img src="../assets/swatches/a7b0bb.svg" width="20" height="20" alt=""> | `fg2` | `#a7b0bb` | 7.7:1 | Punctuation, status line text, ANSI white |
| <img src="../assets/swatches/c4c9d0.svg" width="20" height="20" alt=""> | `fg3` | `#c4c9d0` | 10.2:1 | Text, variables, cursor |
| <img src="../assets/swatches/be7356.svg" width="20" height="20" alt=""> | `red` | `#be7356` | 4.7:1 | Keywords, control flow, errors, deletions |
| <img src="../assets/swatches/c98b56.svg" width="20" height="20" alt=""> | `orange` | `#c98b56` | 5.9:1 | Operators, builtins, escapes, current search match |
| <img src="../assets/swatches/c2a55b.svg" width="20" height="20" alt=""> | `yellow` | `#c2a55b` | 7.1:1 | Types, attributes, warnings, current line number |
| <img src="../assets/swatches/8a9a5b.svg" width="20" height="20" alt=""> | `green` | `#8a9a5b` | 5.5:1 | Functions, strings, headings, additions |
| <img src="../assets/swatches/5f9a96.svg" width="20" height="20" alt=""> | `cyan` | `#5f9a96` | 5.3:1 | Tags, macros, regexes, links, hints |
| <img src="../assets/swatches/6f8fa8.svg" width="20" height="20" alt=""> | `blue` | `#6f8fa8` | 5.0:1 | Parameters, properties, modules, info, accent |
| <img src="../assets/swatches/8c84b4.svg" width="20" height="20" alt=""> | `purple` | `#8c84b4` | 4.9:1 | Numbers, constants, booleans |
| <img src="../assets/swatches/c08a9c.svg" width="20" height="20" alt=""> | `pink` | `#c08a9c` | 5.9:1 | Spare accent for app-specific highlights |
| <img src="../assets/swatches/d08a6e.svg" width="20" height="20" alt=""> | `brightRed` | `#d08a6e` | 6.1:1 | ANSI 9 (bright red) |
| <img src="../assets/swatches/a9b97a.svg" width="20" height="20" alt=""> | `brightGreen` | `#a9b97a` | 8.0:1 | ANSI 10 (bright green) |
| <img src="../assets/swatches/dcc27e.svg" width="20" height="20" alt=""> | `brightYellow` | `#dcc27e` | 9.7:1 | ANSI 11 (bright yellow) |
| <img src="../assets/swatches/93afc4.svg" width="20" height="20" alt=""> | `brightBlue` | `#93afc4` | 7.4:1 | ANSI 12 (bright blue) |
| <img src="../assets/swatches/b8a8c6.svg" width="20" height="20" alt=""> | `brightPurple` | `#b8a8c6` | 7.6:1 | ANSI 13 (bright magenta) |
| <img src="../assets/swatches/86bcb6.svg" width="20" height="20" alt=""> | `brightCyan` | `#86bcb6` | 8.0:1 | ANSI 14 (bright cyan), the logo's front pine |
<!-- END:palette -->

## Terminal

<!-- BEGIN:terminal -->
|  | Token | Hex | From |
| :-: | --- | --- | --- |
| <img src="../assets/swatches/0b1f27.svg" width="20" height="20" alt=""> | `background` | `#0b1f27` | `bg1` |
| <img src="../assets/swatches/c4c9d0.svg" width="20" height="20" alt=""> | `foreground` | `#c4c9d0` | `fg3` |
| <img src="../assets/swatches/c4c9d0.svg" width="20" height="20" alt=""> | `cursor` | `#c4c9d0` | `fg3` |
| <img src="../assets/swatches/0b1f27.svg" width="20" height="20" alt=""> | `cursorText` | `#0b1f27` | `bg1` |
| <img src="../assets/swatches/26414a.svg" width="20" height="20" alt=""> | `selectionBg` | `#26414a` | `bg4` |
| <img src="../assets/swatches/d0d1d6.svg" width="20" height="20" alt=""> | `selectionFg` | `#d0d1d6` |  |
| <img src="../assets/swatches/0f272e.svg" width="20" height="20" alt=""> | `ansi0` black | `#0f272e` | `bg2` |
| <img src="../assets/swatches/be7356.svg" width="20" height="20" alt=""> | `ansi1` red | `#be7356` | `red` |
| <img src="../assets/swatches/8a9a5b.svg" width="20" height="20" alt=""> | `ansi2` green | `#8a9a5b` | `green` |
| <img src="../assets/swatches/c2a55b.svg" width="20" height="20" alt=""> | `ansi3` yellow | `#c2a55b` | `yellow` |
| <img src="../assets/swatches/6f8fa8.svg" width="20" height="20" alt=""> | `ansi4` blue | `#6f8fa8` | `blue` |
| <img src="../assets/swatches/9a88a8.svg" width="20" height="20" alt=""> | `ansi5` magenta | `#9a88a8` |  |
| <img src="../assets/swatches/5f9a96.svg" width="20" height="20" alt=""> | `ansi6` cyan | `#5f9a96` | `cyan` |
| <img src="../assets/swatches/a7b0bb.svg" width="20" height="20" alt=""> | `ansi7` white | `#a7b0bb` | `fg2` |
| <img src="../assets/swatches/546b76.svg" width="20" height="20" alt=""> | `ansi8` bright black | `#546b76` |  |
| <img src="../assets/swatches/d08a6e.svg" width="20" height="20" alt=""> | `ansi9` bright red | `#d08a6e` | `brightRed` |
| <img src="../assets/swatches/a9b97a.svg" width="20" height="20" alt=""> | `ansi10` bright green | `#a9b97a` | `brightGreen` |
| <img src="../assets/swatches/dcc27e.svg" width="20" height="20" alt=""> | `ansi11` bright yellow | `#dcc27e` | `brightYellow` |
| <img src="../assets/swatches/93afc4.svg" width="20" height="20" alt=""> | `ansi12` bright blue | `#93afc4` | `brightBlue` |
| <img src="../assets/swatches/b8a8c6.svg" width="20" height="20" alt=""> | `ansi13` bright magenta | `#b8a8c6` | `brightPurple` |
| <img src="../assets/swatches/86bcb6.svg" width="20" height="20" alt=""> | `ansi14` bright cyan | `#86bcb6` | `brightCyan` |
| <img src="../assets/swatches/d0d1d6.svg" width="20" height="20" alt=""> | `ansi15` bright white | `#d0d1d6` |  |
<!-- END:terminal -->

## Syntax

<!-- BEGIN:syntax -->
|  | Token | Hex | From | Style | Contrast |
| :-: | --- | --- | --- | --- | --: |
| <img src="../assets/swatches/8796a0.svg" width="20" height="20" alt=""> | `comment` | `#8796a0` | `fg1` | italic | 5.6:1 |
| <img src="../assets/swatches/be7356.svg" width="20" height="20" alt=""> | `keyword` | `#be7356` | `red` |  | 4.7:1 |
| <img src="../assets/swatches/be7356.svg" width="20" height="20" alt=""> | `control` | `#be7356` | `red` |  | 4.7:1 |
| <img src="../assets/swatches/8a9a5b.svg" width="20" height="20" alt=""> | `function` | `#8a9a5b` | `green` | bold | 5.5:1 |
| <img src="../assets/swatches/8a9a5b.svg" width="20" height="20" alt=""> | `method` | `#8a9a5b` | `green` |  | 5.5:1 |
| <img src="../assets/swatches/8a9a5b.svg" width="20" height="20" alt=""> | `string` | `#8a9a5b` | `green` | italic | 5.5:1 |
| <img src="../assets/swatches/c98b56.svg" width="20" height="20" alt=""> | `escape` | `#c98b56` | `orange` |  | 5.9:1 |
| <img src="../assets/swatches/5f9a96.svg" width="20" height="20" alt=""> | `regex` | `#5f9a96` | `cyan` |  | 5.3:1 |
| <img src="../assets/swatches/8c84b4.svg" width="20" height="20" alt=""> | `number` | `#8c84b4` | `purple` |  | 4.9:1 |
| <img src="../assets/swatches/8c84b4.svg" width="20" height="20" alt=""> | `constant` | `#8c84b4` | `purple` |  | 4.9:1 |
| <img src="../assets/swatches/8c84b4.svg" width="20" height="20" alt=""> | `boolean` | `#8c84b4` | `purple` |  | 4.9:1 |
| <img src="../assets/swatches/c2a55b.svg" width="20" height="20" alt=""> | `type` | `#c2a55b` | `yellow` |  | 7.1:1 |
| <img src="../assets/swatches/c98b56.svg" width="20" height="20" alt=""> | `builtin` | `#c98b56` | `orange` |  | 5.9:1 |
| <img src="../assets/swatches/c4c9d0.svg" width="20" height="20" alt=""> | `variable` | `#c4c9d0` | `fg3` |  | 10.2:1 |
| <img src="../assets/swatches/6f8fa8.svg" width="20" height="20" alt=""> | `parameter` | `#6f8fa8` | `blue` |  | 5.0:1 |
| <img src="../assets/swatches/6f8fa8.svg" width="20" height="20" alt=""> | `property` | `#6f8fa8` | `blue` |  | 5.0:1 |
| <img src="../assets/swatches/c98b56.svg" width="20" height="20" alt=""> | `operator` | `#c98b56` | `orange` |  | 5.9:1 |
| <img src="../assets/swatches/a7b0bb.svg" width="20" height="20" alt=""> | `punctuation` | `#a7b0bb` | `fg2` |  | 7.7:1 |
| <img src="../assets/swatches/5f9a96.svg" width="20" height="20" alt=""> | `tag` | `#5f9a96` | `cyan` |  | 5.3:1 |
| <img src="../assets/swatches/c2a55b.svg" width="20" height="20" alt=""> | `attribute` | `#c2a55b` | `yellow` |  | 7.1:1 |
| <img src="../assets/swatches/6f8fa8.svg" width="20" height="20" alt=""> | `namespace` | `#6f8fa8` | `blue` |  | 5.0:1 |
| <img src="../assets/swatches/5f9a96.svg" width="20" height="20" alt=""> | `macro` | `#5f9a96` | `cyan` |  | 5.3:1 |
| <img src="../assets/swatches/8a9a5b.svg" width="20" height="20" alt=""> | `heading` | `#8a9a5b` | `green` | bold | 5.5:1 |
| <img src="../assets/swatches/5f9a96.svg" width="20" height="20" alt=""> | `link` | `#5f9a96` | `cyan` | underline | 5.3:1 |
<!-- END:syntax -->

## Editor UI

<!-- BEGIN:ui -->
|  | Token | Hex | From |
| :-: | --- | --- | --- |
| <img src="../assets/swatches/0b1f27.svg" width="20" height="20" alt=""> | `editorBg` | `#0b1f27` | `bg1` |
| <img src="../assets/swatches/c4c9d0.svg" width="20" height="20" alt=""> | `editorFg` | `#c4c9d0` | `fg3` |
| <img src="../assets/swatches/071921.svg" width="20" height="20" alt=""> | `panelBg` | `#071921` | `bg0` |
| <img src="../assets/swatches/0f272e.svg" width="20" height="20" alt=""> | `cursorLine` | `#0f272e` | `bg2` |
| <img src="../assets/swatches/26414a.svg" width="20" height="20" alt=""> | `lineNr` | `#26414a` | `bg4` |
| <img src="../assets/swatches/c2a55b.svg" width="20" height="20" alt=""> | `lineNrActive` | `#c2a55b` | `yellow` |
| <img src="../assets/swatches/152f37.svg" width="20" height="20" alt=""> | `selection` | `#152f37` | `bg3` |
| <img src="../assets/swatches/274149.svg" width="20" height="20" alt=""> | `nonText` | `#274149` |  |
| <img src="../assets/swatches/26414a.svg" width="20" height="20" alt=""> | `border` | `#26414a` | `bg4` |
| <img src="../assets/swatches/26414a.svg" width="20" height="20" alt=""> | `matchParen` | `#26414a` | `bg4` |
| <img src="../assets/swatches/464b3c.svg" width="20" height="20" alt=""> | `searchBg` | `#464b3c` | `mix(@terminal.background, $yellow, 35%)` |
| <img src="../assets/swatches/c98b56.svg" width="20" height="20" alt=""> | `curSearchBg` | `#c98b56` | `orange` |
| <img src="../assets/swatches/6f8fa8.svg" width="20" height="20" alt=""> | `accent` | `#6f8fa8` | `blue` |
| <img src="../assets/swatches/0f272e.svg" width="20" height="20" alt=""> | `statusBg` | `#0f272e` | `bg2` |
| <img src="../assets/swatches/a7b0bb.svg" width="20" height="20" alt=""> | `statusFg` | `#a7b0bb` | `fg2` |
| <img src="../assets/swatches/0f272e.svg" width="20" height="20" alt=""> | `pmenuBg` | `#0f272e` | `bg2` |
| <img src="../assets/swatches/152f37.svg" width="20" height="20" alt=""> | `pmenuSel` | `#152f37` | `bg3` |
| <img src="../assets/swatches/071921.svg" width="20" height="20" alt=""> | `tabInactiveBg` | `#071921` | `bg0` |
| <img src="../assets/swatches/be7356.svg" width="20" height="20" alt=""> | `error` | `#be7356` | `red` |
| <img src="../assets/swatches/c2a55b.svg" width="20" height="20" alt=""> | `warning` | `#c2a55b` | `yellow` |
| <img src="../assets/swatches/6f8fa8.svg" width="20" height="20" alt=""> | `info` | `#6f8fa8` | `blue` |
| <img src="../assets/swatches/5f9a96.svg" width="20" height="20" alt=""> | `hint` | `#5f9a96` | `cyan` |
| <img src="../assets/swatches/8a9a5b.svg" width="20" height="20" alt=""> | `ok` | `#8a9a5b` | `green` |
| <img src="../assets/swatches/223533.svg" width="20" height="20" alt=""> | `diffAdd` | `#223533` | `mix(@terminal.background, $green, 20%)` |
| <img src="../assets/swatches/192e38.svg" width="20" height="20" alt=""> | `diffChange` | `#192e38` | `mix(@terminal.background, $blue, 15%)` |
| <img src="../assets/swatches/2e3032.svg" width="20" height="20" alt=""> | `diffDelete` | `#2e3032` | `mix(@terminal.background, $red, 20%)` |
| <img src="../assets/swatches/2b4351.svg" width="20" height="20" alt=""> | `diffText` | `#2b4351` | `mix(@terminal.background, $blue, 35%)` |
| <img src="../assets/swatches/8a9a5b.svg" width="20" height="20" alt=""> | `gitAdd` | `#8a9a5b` | `green` |
| <img src="../assets/swatches/6f8fa8.svg" width="20" height="20" alt=""> | `gitChange` | `#6f8fa8` | `blue` |
| <img src="../assets/swatches/be7356.svg" width="20" height="20" alt=""> | `gitDelete` | `#be7356` | `red` |
<!-- END:ui -->

## Guidelines for ports

1. **Surfaces step up, panels step down.** `bg1` is the canvas. Raised
   surfaces (cursor line, status line, menus) use `bg2`, selections `bg3`.
   Recessed ones (sidebars, floating windows, inactive tabs) use `bg0`.
2. **Style carries meaning.** Functions and strings share green: functions
   are bold, strings italic. Comments are italic `fg1`. Keep bold and italic
   wherever the app supports them.
3. **Brights are for the terminal.** `brightRed` … `brightCyan` are ANSI 9–14.
   Syntax and UI use the normal accents.
4. **`fg0` is not a text color.** At 2.8:1 it is reserved for decoration.
5. **ANSI 0 is `bg2`, not the background,** so black-on-default output stays
   visible. ANSI 8 (`#546b76`) is the terminal's dim gray and ANSI 15
   (`#d0d1d6`) its brightest white.
6. **Blends stay blends.** Diff and search backgrounds are an accent over
   `bg1`; recompute them rather than picking new colors.
7. **Name it `mistpine`** in the app's theme list, and the repository
   `mistpine.<app>` ([brand](brand.md#port-lockups)).
