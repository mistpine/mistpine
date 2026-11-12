<!--
Title: a Conventional Commit header, e.g. `fix: round the searchBg blend`.
PRs are squash-merged and the title becomes the commit on main: lowercase,
imperative, 72 characters at most (aim for 50).

Keep every heading. Tick a box only for a command you ran on this branch;
otherwise leave it unticked and say why below it.
-->

## What and why

<!-- What changes and the problem it solves. Link the issue: `Closes #123`. -->

## Checks

- [ ] `pnpm lint && pnpm typecheck`
- [ ] `pnpm check` (generated files are up to date)

## For color changes

<!-- Delete this section if no color changes. -->

- [ ] Edited `mistpine.theme.json`, then ran `pnpm sync` and `pnpm build`
      (generated files are never edited by hand)
- [ ] Text colors still clear 4.5:1 (ratios before and after below)
- [ ] Listed the ports that need a sync afterwards (Ghostty, Neovim, Obsidian)

## Screenshots

<!-- Before and after for anything visible: palette, logos, README images.
Delete if nothing visible changed. -->
