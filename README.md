# System Design Primer

An interactive, decision-oriented system design documentation site built with
[Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/).
MDX-authored, statically rendered, with React component islands for
interactivity and a static-first Mermaid diagram renderer.

## Prerequisites

- **Node.js 20+** (developed on Node 24)
- **npm** (the project's package manager; `package-lock.json` is committed)

## Usage

```bash
make run     # npm install, then start the dev server and open a browser tab
make build   # npm install, then build the static site to ./dist
make preview # preview the built site locally
make check   # type-check the project (astro check)
```

Equivalent raw npm commands:

```bash
npm install
npm run dev -- --open
npm run build
```

## Structure

- `src/content/docs/` — MDX docs, organized into five clusters:
  Design Patterns, Event-Driven Architecture, Databases & CAP,
  Caching & Performance, and Search Indexes.
- `src/content.config.ts` — Starlight docs schema, extended with
  `last_reviewed` (date) and `decision_guidance` (boolean) frontmatter.
- `src/components/Mermaid.astro` — static-first Mermaid diagram island.
- `templates/topic.mdx` — **canonical topic template**. Copy it to author a new
  topic. Keep the section order fixed and bump `TEMPLATE_VERSION` on structural
  changes (CI drift-checks the marker).
- `astro.config.mjs` — Starlight + React integrations and the sidebar.

## Authoring a new topic

1. Copy `templates/topic.mdx` into the appropriate
   `src/content/docs/<cluster>/` directory.
2. Fill in the frontmatter and each fixed `##` section.
3. Do **not** reorder or rename the section headings unless you also bump
   `TEMPLATE_VERSION`.
