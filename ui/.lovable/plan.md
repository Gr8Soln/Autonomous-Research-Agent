
# Refocus: from "AI platform" to "engineering lab + interactive portfolio"

The current build treats the app as an internal AI platform that opens straight onto an auth gate. The corrected vision is **Read → Understand → Test Live**: a public landing page is the front door, auth is a lightweight step only required when someone actually wants to run a system, and the dashboard/workspaces become the "lab floor" behind it.

This plan keeps the existing dark engineering aesthetic and component primitives (`Panel`, `MetricTile`, `StatusDot`, workspaces, command palette) — they already match the brief. The changes are structural (routing, landing page, auth posture, project page framing, creator identity) rather than a visual reset.

## 1. Routing restructure

```text
src/routes/
  __root.tsx                  shell (unchanged)
  index.tsx                   PUBLIC LANDING PAGE  ← new content (replaces redirect)
  systems.index.tsx           PUBLIC systems catalog (read-only browse)
  systems.$slug.tsx           PUBLIC project page (overview + "Run live" CTA)
  login.tsx                   Google OAuth only (unchanged)
  _authenticated.tsx          auth gate
  _authenticated/
    lab.tsx                   authenticated systems hub (was /dashboard)
    lab.$slug.tsx             live experimentation workspace
    settings.tsx
```

Key shift: every system has a **public overview route** (`/systems/research-agent`) describing what it is, the architecture, and what you can do with it. A "Run live" / "Open in Lab" CTA on that page sends users through Google OAuth and lands them in `/lab/research-agent` — the actual interactive workspace. Recruiters and learners can read everything without ever signing in; auth is only the door to interaction.

`/dashboard` is renamed to `/lab` to reinforce the "engineering laboratory" framing, and `/` is no longer a session-based redirect.

## 2. Landing page (`/`)

A single, long-form page designed to convert recruiters and inspire learners in one scroll. Dark, technical, motion-restrained.

Sections, in order:

1. **Hero** — wordmark "autonomous-ai-systems", one-line positioning ("A growing lab of practical autonomous AI systems — read the architecture, then run them live."), two CTAs: `Explore systems` (→ `/systems`) and `Open the lab` (→ `/login`). Background: subtle animated grid + drifting conic mesh (already built in `AuthBackdrop`, reusable).
2. **Philosophy strip** — three short statements: *Practical, not theoretical · Architecture-first · Interactive by default*. Mono labels, generous spacing.
3. **What this is** — two-column prose: left explains the project as a continuous engineering initiative; right shows a small "lab log" of recent updates / versions (static for now).
4. **Systems showcase** — the existing `ProjectCard` grid, split into **Live systems** (Research Agent, Codebase Intelligence) and **In design** (Self-Correcting, Orchestrator, Observability). Each card links to its public overview page.
5. **How a system works (architecture visual)** — one annotated diagram (SVG) showing the generic pattern: *Input → Planner → Tool loop → Critic → Output → Trace*. Reinforces the "engineering depth" signal at a glance.
6. **About the engineer** — short bio block: name, AI systems engineering focus, backend/systems background, one-paragraph philosophy ("Practical AI engineering — built, explained, and exposed interactively"). Avatar optional. Links: GitHub, LinkedIn, Medium/blog, portfolio.
7. **Footer** — repo link, version + build hash, copyright, secondary nav.

Tone rules: no marketing gradients, no "Get started free", no testimonials, no feature checklists. Copy reads like a README, not a pitch.

## 3. Public project overview pages (`/systems/$slug`)

A new layout, distinct from the interactive workspace:

```text
┌─ Header: name · status pill · capability tags · "Run live →" CTA ─┐
├─ Tagline + 2–3 paragraph explainer                                 │
├─ Architecture diagram (per-project SVG)                            │
├─ Capabilities grid + tech stack tags                               │
├─ "What you can do in the lab" — bullet list of interactions        │
├─ Related writing (Medium links, optional)                          │
└─ Footer CTA: Open in Lab (auth-gated) · View on GitHub             ┘
```

Planned systems show the same layout with the interactive CTA replaced by "In design — preview the architecture", linking to a read-only mock.

This is the page recruiters will actually land on from a CV link, so it must stand alone without auth.

## 4. The Lab (`/lab`, authenticated)

Repurpose the current `/dashboard` as the post-auth **systems hub**, renamed to "Lab". Behavior is largely the existing implementation, with two tweaks:

- Breadcrumb reads `autonomous-ai-systems / lab` and the H1 becomes "Lab".
- Each card's primary action is **Open workspace** (live) or **Open preview** (planned), matching today's behavior.
- Add a small persistent banner on first visit: "You're in the lab. Every system here runs against real backends — outputs may vary."

The five workspace components (`ResearchAgent`, `CodebaseIntel`, `SelfCorrecting`, `WorkflowOrchestrator`, `AIObservability`) are kept as-is and mounted under `/lab/$slug`. No changes to their internal composition in this pass.

## 5. Auth posture

- `/login` stays Google-only, unchanged visually.
- After successful auth, redirect to the originally requested `/lab/...` path (via a `redirect` search param) — not a hardcoded `/dashboard`.
- Public routes (`/`, `/systems`, `/systems/$slug`, `/login`) render fully without a session.
- The authenticated layout shows the `AppShell` (sidebar + topbar); public routes use a lighter `PublicShell` (slim top nav: logo · Systems · Lab · GitHub · Sign in).

## 6. Component additions

```text
src/components/
  public/
    PublicShell.tsx           slim top nav + footer for public routes
    LandingHero.tsx
    PhilosophyStrip.tsx
    ArchitectureDiagram.tsx   generic loop SVG (reused on landing + per-system variants)
    SystemsShowcase.tsx       wraps ProjectCard grid with Live/In-design split
    AboutEngineer.tsx
    SocialLinks.tsx
    SystemOverview.tsx        layout for /systems/$slug
  lab/
    LabBanner.tsx             first-visit "you're in the lab" notice
```

Existing `ProjectCard`, `MetricTile`, `Panel`, `StatusDot`, `CapabilityTag`, `AuthBackdrop` are reused unchanged.

## 7. Content model additions to `src/lib/projects.ts`

Extend each `Project` with:
- `longDescription: string` (markdown-ish paragraphs for the overview page)
- `architectureSummary: string[]` (4–6 bullets describing the system loop)
- `interactions: string[]` ("what you can do in the lab" list)
- `techStack: string[]`
- `links?: { github?: string; article?: string }`

Plus a small `creator` constant (name, role, bio, socials) used by `AboutEngineer` and the footer.

## 8. Implementation order

1. Add `PublicShell` + restructure `/` into the landing page (sections 1–7 above with placeholder copy where needed).
2. Add `/systems` catalog + `/systems/$slug` public overview, using the extended `projects.ts` data.
3. Rename `/dashboard` → `/lab` (keep redirect for one release), wire `/lab/$slug` to existing workspaces.
4. Update `/login` to honor `redirect` search param; update any internal links.
5. Polish: motion pass on landing (stagger sections on scroll), responsive check at the current 1273px viewport down to mobile.

## Technical notes

- File-based routing: `systems.index.tsx`, `systems.$slug.tsx` (public, top-level) coexist with `_authenticated/lab.$slug.tsx`. The `_authenticated` layout already redirects unauth users to `/login`.
- No backend changes. No new dependencies — Framer Motion, shadcn, and the existing primitives cover everything.
- SEO: each public route sets its own `head()` with route-specific title/description; landing gets a single `og:image` (to be generated separately).

## Out of scope for this pass

- Real backend wiring for the workspaces (still mocked).
- Mobile-optimized workspace layouts (lab remains desktop-first ≥1280px).
- Blog/article rendering — Medium links only.
- Light theme.
