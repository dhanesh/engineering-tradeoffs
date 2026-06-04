# interactive-sysdesign-docs

## Outcome

Build an interactive, browser-based documentation site that teaches System Design
patterns and practices through interactive presentations (using MDX and related
technologies). Key requirements captured from the initiating request:

- **Distribution & launch:** A user can clone the repo and run `make run` in the
  folder to launch a browser tab and browse the documentation locally.
- **Format:** Interactive presentations in the browser — MDX-driven, with room for
  interactive components (diagrams, live examples, steppers) rather than static prose.
- **Breadth of content (all aspects of software/system design), including but not
  limited to:**
  - Design Patterns
  - Event-Driven Architecture — message brokers and their types; when to use which and why
  - CAP theorem for databases — tradeoffs and selection guidance
  - Performance improvement techniques — caching: types of caching, when/why to use each
  - Search indexes — Elasticsearch, Solr, and others; comparison and when to use which
- **Pedagogical framing:** Each topic should explain not just *what* a component is
  but *when to use it and why* (decision-oriented guidance).
- **Extensibility via a skill:** Contributors can run a skill that scaffolds and adds
  documentation for a new, relevant topic — keeping the docs growable in a consistent shape.
- **Skill location:** The contribution skill must be added to `~/code/grayquest-finance/agent-skills`.

### Decisions locked during constraint discovery (m1)

| Decision | Choice |
|---|---|
| Framework / format | **Astro Starlight** (docs-first MDX with interactive React islands) |
| v1 content scope | **All 5 named clusters fully authored** + working contributor skill |
| Deploy scope | **Local (`make run`) + static deploy (`make build` → `./dist`)** |
| Package manager | **npm** (committed `package-lock.json`) |
| Interactivity | **Mermaid diagrams + reusable widget library** (DecisionTree, CompareMatrix, WhenWhyTabs, TradeoffSlider) |
| Skill behavior | **Interactive scaffolder** — prompts topic/cluster, emits MDX from template, wires sidebar |
| Template source | **Canonical in docs repo; skill carries a synced copy + VERSION marker** |
| Topic structure | **Fixed section skeleton** for every topic |

---

## Constraints

### Business

#### B1: Site is genuinely useful at v1
The five named topic clusters (Design Patterns; Event-Driven Architecture + message
brokers; CAP theorem / database selection; caching types; search indexes) are fully
authored as decision-oriented "when/why" pages — not stubs.
> **Rationale:** A docs site with only scaffolding has no adoption pull and gives the
> contributor skill no real exemplar to mirror. (type: goal)

#### B2: Opinionated guidance must be dated and reviewable
Every topic that makes recommendations (e.g. "use Kafka when…", "prefer Elasticsearch
over Solr when…") carries machine-readable `last-reviewed` metadata in frontmatter so
stale guidance is detectable.
> **Rationale:** Pre-mortem — broker/DB/search recommendations rot; undated advice
> silently misleads readers months later. (type: invariant, source: pre-mortem)

#### B3: Docs are extensible by external contributors
A non-author contributor can add a new, consistent topic with low friction via the skill.
> **Rationale:** Growth of coverage cannot depend on the original author; the skill is
> the mechanism that keeps contribution barrier low. (type: goal)

### Technical

#### T1: Astro Starlight + MDX as the static-site foundation
The site is built on Astro Starlight, authored in MDX, producing a static site with
interactive component islands.
> **Rationale:** Chosen in m1 — browsable docs tree + interactive islands without
> Slidev's deck-only limitation. (type: boundary, challenger: technical-reality)

#### T2: npm as the package manager
Dependency management uses npm; `package-lock.json` is committed for reproducible clones.
> **Rationale:** Chosen in m1 (revised from bun) — maximum compatibility and zero
> surprises for anyone cloning the repo. (type: boundary)

#### T3: `make run` is the single launch command
`make run` installs dependencies, starts the Astro dev server, and opens a browser tab
to the running site.
> **Rationale:** The core distribution promise: clone → `make run` → browsing.
> (type: invariant)

#### T4: `make build` produces a deployable static bundle
`make build` emits a static site (`./dist`) deployable to GitHub Pages / Netlify / any
static host.
> **Rationale:** Static deploy chosen in m1; near-zero extra cost on Astro and
> future-proofs sharing. (type: goal)

#### T5: Interactivity = Mermaid + a reusable island library
Diagrams use Mermaid; interactivity is delivered through a small reusable component
library (DecisionTree, CompareMatrix, WhenWhyTabs, TradeoffSlider) that topics compose.
> **Rationale:** Delivers the "interactive" goal without each page becoming a bespoke
> build. (type: boundary)

#### T6: Skill output must build cleanly
Pages generated by the contributor skill must be valid MDX and produce a passing
`make build`; the build is the integrity gate.
> **Rationale:** Pre-mortem — a contributor's bad MDX/sidebar entry must not be able to
> break the deployable site. (type: invariant, source: pre-mortem)

> **GAP-03 (Core Data Path):** Two data paths exist. (1) **Build pipeline:** MDX source
> → Astro/Starlight build → static HTML in `./dist`. (2) **Contribution path:** skill
> input → new MDX file + sidebar config entry → build. The only boundary crossings are
> file writes (skill) and the build step; both are covered by T6 + O2 (CI build) with the
> fallback being a failed build that blocks merge/deploy rather than shipping broken pages.

### User Experience

#### U1: Every topic follows the fixed section skeleton
Order: Overview → Mental model → Types/Variants → When to use / When NOT → Tradeoffs →
Diagram (Mermaid) → Try it (widget) → Real-world examples → Further reading.
> **Rationale:** Consistency makes the docs scannable and lets the skill template the
> page predictably. (type: invariant)

#### U2: `make run` lands the user in the browser with zero extra steps
After `make run`, the user's browser is open on the running site — no manual URL entry,
no extra commands.
> **Rationale:** Pre-mortem — onboarding friction at first run is where new users bounce.
> (type: goal, source: pre-mortem)

#### U3: Accessibility & no-JS baseline for interactive content
Interactive islands are keyboard-navigable, and core topic content is readable without
JavaScript (islands enhance, not gate, the content).
> **Rationale:** Pre-mortem — widgets that aren't keyboard-accessible or that hide content
> behind JS exclude users and tank usability. (type: invariant, source: pre-mortem)

#### U4: Browsable left-nav docs tree
The site presents as a navigable docs tree (clusters → topics) so all aspects are
discoverable by browsing.
> **Rationale:** "Browse through all aspects" is an explicit outcome requirement.
> (type: goal)

### Security

#### S1: Contributor skill writes only within repo content/config paths
The skill validates its inputs (topic name → safe slug, reject path traversal) and writes
only to the docs repo's content and sidebar-config locations; it does not execute
untrusted input.
> **Rationale:** The skill is the one component that writes files; it must not become a
> path-traversal or arbitrary-write vector. (type: invariant; covers GAP-14 input
> validation)

#### S2: Dependencies pinned via committed lockfile
All dependencies are pinned through the committed `package-lock.json` for supply-chain
reproducibility across clones.
> **Rationale:** A static site has no runtime auth surface; the realistic supply-chain
> risk is unpinned build dependencies drifting between clones. (type: boundary)

> **GAP-09 (Crypto/Auth): SKIPPED** — no authentication or cryptography in a static
> educational docs site.
> **GAP-10 (Resource Exhaustion): SKIPPED** — static site; no unauthenticated runtime
> endpoints consuming server resources.
> **GAP-11 (External Dependency Resilience): SKIPPED** — no runtime external HTTP
> dependencies; build-time deps pinned via lockfile (S2).
> **GAP-17 (Concurrency): SKIPPED** — static output; no shared mutable runtime state.

### Operational

#### O1: Fresh-clone reproducibility
Prerequisites (Node version, npm) are documented; the lockfile is committed; `make run`
is verified to work from a clean checkout.
> **Rationale:** Pre-mortem — "clone-and-run fails on a fresh machine" is the fastest
> adoption-killer. (type: invariant, source: pre-mortem)

#### O2: CI builds the site on every PR
Continuous integration runs `make build` on every pull request and fails on broken MDX
or invalid sidebar entries.
> **Rationale:** Pre-mortem — a skill-generated page that breaks the build must be caught
> before merge/deploy, not after. (type: invariant, source: pre-mortem)

#### O3: Template canonical in docs repo, skill copy version-marked
The topic template lives canonically in the docs repo; the skill (in agent-skills) carries
a synced copy stamped with a VERSION marker, and the sync/drift check is documented.
> **Rationale:** Pre-mortem — two template copies will drift; a version marker makes drift
> visible rather than silent. (type: boundary, source: pre-mortem)

#### O4: Skill conforms to the agent-skills convention and location
The contributor skill is added to `~/code/grayquest-finance/agent-skills`, following that
repo's `SKILL.md` + folder convention and `CONTRIBUTING.md`.
> **Rationale:** Explicit stakeholder requirement; the skill must be installable and
> discoverable alongside the other GrayQuest agent skills. (type: invariant)

---

## Tensions

### TN1: Canonical template vs portable skill (template drift)
The topic template is canonical in the docs repo (O3), but the skill lives in a separate
repo (O4, `agent-skills`) and must be self-contained/portable (B3) while its output must
build cleanly (T6). Two copies of the template will drift apart over time.
- **Type:** trade_off (Standardisation vs Flexibility) — TRIZ P1 Segmentation, P24 Intermediary, P10 Prior action
> **Resolution:** The skill bundles a copy of the template stamped with a `VERSION`
> marker equal to the canonical template's version. CI hashes both copies and **fails the
> PR when they diverge**. The skill stays portable; drift becomes loud and automatic
> instead of silent.
> **Validation:** (1) bundled template VERSION == canonical VERSION; (2) CI fails on hash mismatch.
> **Propagation:** O3 LOOSENED (drift detectable) · T6 TIGHTENED (CI adds drift check) · B3 LOOSENED (no runtime fetch).
> **Failure cascade (GAP-06):** drift check fails → PR blocked → contributor re-syncs copy (human intervention path exists).

### TN2: Exhaustive content vs build effort
"All 5 clusters fully authored" (B1) competes with the effort to write them; the fixed
skeleton (U1) bounds per-page scope.
- **Type:** resource_tension (Cost vs Quality) — TRIZ P1 Segmentation, P10 Prior action, P27 Cheap short-living
> **Resolution:** Author all 5 clusters to **exhaustive depth** (every
> skeleton section substantively filled with concrete decision criteria + real-world
> examples), accepting a **longer timeline**. This raises B1's bar above the original
> "useful" target.
> **Validation:** (1) all 5 clusters present, every skeleton section substantively filled;
> (2) opinionated sections cite concrete decision criteria + examples.
> **Propagation:** B1 TIGHTENED (exhaustive bar; enlarges m4 scope + timeline — accepted with awareness).

### TN3: Interactive islands vs no-JS readability + fast first run
Mermaid + React islands (T5) add JavaScript that can break no-JS readability/a11y (U3)
and slow the first run (U2).
- **Type:** trade_off (Simplicity vs Capability) — TRIZ P1 Segmentation, P15 Dynamization, P11 Beforehand cushioning
> **Resolution:** **Progressive enhancement via Astro partial hydration.** Each widget
> ships meaningful static HTML (e.g. `<CompareMatrix>` renders a plain `<table>`); the
> island hydrates on visibility (`client:visible`) to layer interactivity. No-JS users get
> full content; JS users get interactivity; first paint stays fast.
> **Validation:** (1) each widget renders complete content with JS disabled; (2) islands
> hydrate deferred (client:visible); (3) every island is keyboard-navigable.
> **Propagation:** U2 LOOSENED (deferred hydration) · U3 LOOSENED (static-first by construction) · T5 TIGHTENED (each widget needs a static fallback).

### TN4: Skill nav-wiring vs bounded write scope (hidden dependency)
The skill auto-wires the sidebar to reduce contribution friction (B3), but must only write
to safe paths (S1). B3's auto-wiring **depends on** S1's allowlist permitting the sidebar
config file.
- **Type:** hidden_dependency — TRIZ P1 Segmentation (scope the write surface)
> **Resolution:** S1's allowlist **explicitly enumerates** exactly the topics content
> directory (`src/content/docs/**`) and the single sidebar config file; the skill validates
> the topic name into a safe slug and rejects path traversal, and writes nowhere else.
> **Validation:** (1) skill writes only within `src/content/docs/**` + sidebar config; (2)
> topic input sanitized to safe slug, path-traversal rejected.
> **Propagation:** S1 TIGHTENED (allowlist enumerated) · B3 SAFE (auto-wiring preserved).
> **Blocking dependency exported to m3:** S1 (blocker) → B3 (blocked).

---

## Required Truths

Backward-reasoned from the outcome. Status legend: NOT_SATISFIED (must be built),
SPECIFICATION_READY (design fully pinned by constraints; ready for m4 to generate).

### RT-1: Reproducible one-command launch
`make run`, on a freshly cloned repo with only documented prerequisites (Node + npm),
installs dependencies, starts the Astro dev server, and opens a browser tab on the site.
**Maps to:** T3, O1, U2, T2 · **Status:** NOT_SATISFIED
**Gap:** No project, `package.json`, or `Makefile` exists yet (greenfield).

### RT-2: Browsable cluster → topic docs tree
The site presents a left-nav tree (clusters → topics) so all content is discoverable by browsing.
**Maps to:** U4, T1 · **Status:** NOT_SATISFIED
**Gap:** No Astro/Starlight config or sidebar structure exists.

### RT-3: Static-first, accessible interactive widgets
Every interactive widget renders complete content with JS disabled and is keyboard-navigable;
islands hydrate deferred (`client:visible`) so first paint is not blocked.
**Maps to:** U3, T5 · **Status:** SPECIFICATION_READY (pattern fixed by TN3-A)
**Gap:** Component library not yet implemented.

### RT-4: Single canonical topic template (skeleton) — ★ BINDING CONSTRAINT
One canonical template encodes the fixed section skeleton (Overview → Mental model → Types →
When to use/NOT → Tradeoffs → Diagram → Try it → Real-world → Further reading) and is the
single source consumed by both authored docs and the contributor skill.
**Maps to:** U1, B3, O3 · **Status:** SPECIFICATION_READY (skeleton fully defined in U1)
**Gap:** Template file not yet authored.
**Why binding:** Authoring (RT-6), skill scaffolding (RT-7), and drift detection (RT-10) all
depend on this existing and being well-shaped. Theory-of-Constraints bottleneck — close it first.

### RT-5: Machine-readable review metadata
Each opinionated topic carries a `last_reviewed` field (and validated frontmatter schema) so
stale recommendations are detectable.
**Maps to:** B2 · **Status:** SPECIFICATION_READY
**Gap:** Content collection schema not yet defined.

### RT-6: Five clusters authored to exhaustive depth
All five clusters (Design Patterns; EDA + message brokers; CAP/DB selection; caching; search
indexes) are authored with every skeleton section substantively filled — exhaustive, not stubs.
**Maps to:** B1 · **Status:** NOT_SATISFIED
**Gap:** No content written. (Largest single effort; depends on RT-4.)

### RT-7: Contributor skill scaffolds a topic
A skill in `~/code/grayquest-finance/agent-skills` (SKILL.md convention) prompts for topic +
cluster, generates an MDX page from the template, and wires it into the sidebar.
**Maps to:** O4, B3 · **Status:** NOT_SATISFIED
**Gap:** Skill does not exist; depends on RT-4.

### RT-8: Bounded, validated skill write-scope (m2 blocker S1→B3)
The skill writes only within `src/content/docs/**` and the single sidebar config file, validates
the topic name into a safe slug, and rejects path traversal.
**Maps to:** S1 · **Status:** SPECIFICATION_READY (allowlist enumerated in TN4-A)
**Gap:** Not implemented. Exported from m2 as the blocking dependency.

### RT-9: CI build gate on every PR
CI runs `make build` on every pull request and fails on broken MDX or invalid sidebar entries.
**Maps to:** T6, O2 · **Status:** NOT_SATISFIED
**Gap:** No CI workflow exists.

### RT-10: Template drift detection
The canonical template carries a `TEMPLATE_VERSION` marker; CI hashes the canonical template and
the skill's bundled copy and fails when they diverge.
**Maps to:** O3 (impl. of TN1-A) · **Status:** SPECIFICATION_READY
**Gap:** No version marker or drift-check job exists.

### RT-11: Deployable static build with pinned deps
`make build` produces a deployable static bundle (`./dist`); dependencies are pinned via a
committed `package-lock.json`.
**Maps to:** T4, T2, S2 · **Status:** NOT_SATISFIED
**Gap:** No build setup or lockfile exists.

---

## Solution Space

### Option A: Bundled-and-synced template + CI drift check ← Recommended (SELECTED)
Template canonical in the docs repo; the skill (in `agent-skills`) bundles a `TEMPLATE_VERSION`-
stamped copy; docs-repo CI runs build + a hash-based drift check.
- **Satisfies:** RT-1 … RT-11 (all)
- **Complexity:** Medium · **Reversibility:** TWO_WAY
- **Tension check:** TN1 ✓ TN2 ✓ TN3 ✓ TN4 ✓ (all CONFIRMED) — implements TN1-A directly.

### Option B: Template-as-versioned-package
Extract the skeleton into a small versioned npm package both repos depend on; drift handled via
semver instead of a hash check.
- **Satisfies:** all (RT-10 reframed as package-version pinning)
- **Complexity:** High (publish/maintain a package) · **Reversibility:** REVERSIBLE_WITH_COST
- **Tension check:** TN1 satisfied differently; adds package-maintenance overhead not in scope.

### Option C: Skill fetches template at runtime
Skill pulls the canonical template from the docs repo when run; no bundled copy.
- **Satisfies:** most, but weakens skill portability/offline use
- **Complexity:** Low–Medium · **Reversibility:** TWO_WAY
- **Tension check:** **REOPENS TN1** (which chose a bundled copy) — rejected.

> **Recommendation:** **Option A** — it directly implements the m2 tension resolutions, keeps the
> skill self-contained, and confirms all four tensions. Binding constraint RT-4 is addressed first.
