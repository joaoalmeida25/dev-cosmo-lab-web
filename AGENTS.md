# AGENTS.md - Dev Cosmo Lab Web

## 1. Purpose and scope

This repository implements the **Dev Cosmo Lab** institutional website and digital-product experience. Prioritize predictable architecture, maintainable React components, accessible interfaces, visual fidelity, and performance over premature abstraction.

This file governs **new implementations and authorized refactors**. It does not, by itself, authorize a repository-wide migration, scope expansion, dependency installation, publication, commit, or push.

Before changing anything:

1. Identify the feature, route, and runtime behavior affected.
2. Read nearby implementation, types, styling, translations, tests, and design references.
3. Check current Git branch, HEAD, staged/unstaged/untracked files, and the scope requested.
4. Preserve all unrelated and pre-existing work, including staged files.
5. Implement the smallest coherent change and validate affected behavior.

Keep product decisions and delivery phases aligned with the current roadmap in Notion. The website belongs to **Thread 5 — Plataforma Web**. Visual decisions belong to **Thread 2 — Identidade Visual**. Do not revive the discontinued Thread 6.

## 2. Stack and framework contracts

- **Next.js App Router**, React, TypeScript (`strict`), **Tailwind CSS 4**, and `next-intl`.
- Node.js 24 and npm 11, as recorded by project configuration.
- ESLint and Prettier; use the existing npm scripts.
- Use **Server Components by default**; add `'use client'` only to the smallest component requiring browser state, effects, context, or interaction.
- Preserve Next.js route conventions and the existing internationalization/theme architecture.
- Do **not** add styled-components, a second CSS framework, animation frameworks, or other dependencies merely to copy patterns from a reference project.

Inspect `package.json` before assuming a command, dependency, test runner, or script exists.

## 3. Repository organization and ownership

```text
src/
├── app/                         # Next.js routes, layouts, metadata, framework files
├── features/
│   ├── home/                    # Home-only components, hooks, utils, models and tests
│   └── products/                # Product-domain contracts and shared product behavior
├── components/
│   ├── shared/                  # Reusable application-level components
│   └── ui/                      # Generic design-system primitives
├── hooks/                       # Truly cross-feature hooks only
├── services/                    # Truly cross-feature services, if needed
├── utils/                       # Truly cross-feature pure utilities, if needed
├── constants/                   # Cross-feature constants, if needed
├── i18n/                        # Routing and next-intl configuration
├── messages/                    # Locale messages: pt-BR, en, es
├── styles/                      # Global CSS, Tailwind integration and tokens
└── types/                       # Cross-feature contracts only, if needed
```

### Ownership rules

- Keep **feature-specific** components, services, hooks, mappers, utilities, constants, fixtures and tests **inside the owning feature**.
- Place code in `src/components/shared`, `src/components/ui`, `src/hooks`, `src/services`, or `src/utils` **only when it has real cross-feature usage or a genuinely generic contract**.
- Reuse an existing generic component when its semantics and API fit. Improve or extend the shared primitive rather than duplicating it in individual features.
- Do not make one feature depend on another feature's presentation component or private types merely to save a file. Move genuinely shared contracts to a neutral owner.
- Keep `src/app/` thin: routing, metadata, page-level composition and framework integration. Business/UI sections live in features.
- Use one folder per meaningful component; a component's controller and view belong in the **same component folder**. Child components own their own folders.
- Do not create directories, abstractions, context providers, or layers with no current use.

Example:

```text
src/features/home/
├── home.component.tsx
├── home-view.component.tsx
├── home.types.ts                    # Only when shared types justify extraction
└── components/
    └── hero/
        ├── hero.component.tsx       # Controller, if required
        ├── hero-view.component.tsx  # Presentational view
        ├── hero-view.module.css     # Only for complex local styles
        ├── hero.component.spec.tsx  # When an appropriate test runner exists
        └── hero.types.ts           # Only when genuinely shared
```

The example is a naming guide, **not** a requirement to create all files for every component.

## 4. Naming, exports and imports

- Use **English** for identifiers, directories, files, domain contracts, hooks, and implementation code.
- Use **kebab-case** for filenames and directories, with descriptive names; avoid generic `utils.ts`, `service.ts`, `Page.tsx` and `hooks.ts`.
- Component: `feature-name.component.tsx`; presentational view: `feature-name-view.component.tsx`.
- Local CSS Module, when warranted: `feature-name-view.module.css` (or `feature-name.module.css` for a standalone component).
- Hook: `use-feature-name.hook.ts`; service: `verb-domain.service.ts`; utility: `feature-name.util.ts`; mapper: `feature-name.mapper.ts`; types: `feature-name.types.ts`.
- Co-located tests: `*.component.spec.tsx`, `*.hook.spec.ts`, `*.service.spec.ts`, `*.util.spec.ts`, etc.
- Prefer `@/` aliases for application imports and consistent local relative imports inside a feature.
- Use `const` arrow functions for React components and application functions, unless a framework contract requires something else.
- Use **named exports** for application modules. Keep `default export` only where Next.js or another framework contract requires it (`page.tsx`, `layout.tsx`, etc.).
- Do not rename Next.js reserved files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`).

## 5. Controller / View separation — mandatory trigger

A component **must be split into Controller and View** when it owns **any** of the following:

- React hooks (`useState`, `useEffect`, `useRef`, `useMemo`, custom hooks, etc.).
- React context consumption, application providers, or context-dependent behavior.
- `next-intl` translation access (`useTranslations`, `getTranslations` or equivalent).
- Navigation hooks, routing decisions, handlers with behavioral logic, orchestration, side effects, data fetching, DTO/domain mapping, or nontrivial domain rules.

This applies to **client and server** components. A server controller may be `async` and call `getTranslations`; it should pass prepared strings and other values into its pure View. Do not make the whole tree a Client Component just to create this split.

### Controller (`name.component.tsx`)

- Owns hooks, context, translation access, navigation, state, effects, handlers, orchestration, rules and data preparation.
- Produces explicit, view-ready props; maps external/domain data to a presentation contract where needed.
- Returns the corresponding View and, when justified, composes child controllers.
- Does not accumulate large markup or feature-specific styling rules.
- Is **not** a pass-through wrapper with no behavior. If no controller responsibility exists, use a standalone presentational component instead.

### View (`name-view.component.tsx`)

- Owns declarative JSX, semantic HTML, layout composition and presentation.
- Receives only the values and callbacks it actually needs.
- May invoke callbacks provided by the Controller for UI events.
- **Must not** call React/custom hooks, consume contexts, access translations, invoke services/HTTP, own navigation logic, parse API responses, or apply domain policies.
- May compose other presentational components. A child with its own behavior should have its own Controller.

### Simple components

A **purely visual component** can remain a single `name.component.tsx` file **only if it has no hooks, context, translation access, side effects or business/orchestration logic**. Do not generate an empty Controller/View pair.

### Communication between components

- Keep callbacks with the component that owns the behavior.
- Avoid prop drilling and chains like parent-controller → parent-view → child-controller → child-view when a child can consume an appropriate context directly.
- Pass props from a parent only when the parent actually owns the data or behavior.
- Avoid global context for local-only state and avoid introducing providers merely to eliminate one simple prop.
- Keep Controller and View contracts independent; do not use `IViewProps extends IControllerProps` as a shortcut.

## 6. TypeScript and validation

- Keep TypeScript in **strict mode**. Prefer exact, explicit domain and component contracts.
- Project-owned **interfaces use the `I` prefix**, e.g. `IHeroProps`, `IHeroViewProps`, `IProduct`. Never prefix type aliases, enums or classes with `I`.
- Use **`Array<T>`** (and `ReadonlyArray<T>` when appropriate) for typed arrays, **never `T[]`**, including interface properties, constants and function signatures.
- Avoid `any`, broad casts, non-null assertions, generic object buckets and speculative union widening. Use `unknown` for genuinely untrusted input, narrow it at the boundary.
- Prefer meaningful discriminated unions and exhaustiveness for state variants when justified.
- Keep types local to the file when used only there; introduce `*.types.ts` only for shared contracts or a clear readability benefit.
- Props interfaces describe only the props that layer receives. Do not use component props as domain models or pass unnecessary fields to Views.
- Avoid `as const` unless literal inference is materially needed; do not use casting merely to suppress errors.
- Validate at **system boundaries**: external APIs, query strings, local/session storage, form inputs, external JSON and DTO mappings.
- Once input is mapped into a validated, typed internal object, trust its contract; do not repeat defensive `typeof`/`Number.isFinite` checks in every consumer.
- Keep meaningful product rules and security checks; simplicity must not remove necessary validation.

## 7. Styling and design-system practices

- **Tailwind CSS is the primary styling system.** Do **not** introduce styled-components.
- Prefer Tailwind utilities and the existing semantic design tokens. Use semantic aliases instead of hardcoded primitive colors and spacing where tokens already exist.
- Use **CSS Modules local to a component** when masks, nontrivial animations, unusual selectors, complex compositing or other rules become clearer than long Tailwind class strings.
- Do not introduce `.styled.ts` or style-only component wrappers. A view-specific CSS Module replaces that role when needed.
- Restrict `src/styles/globals.css` to actual global rules, Tailwind integration, semantic tokens and cross-feature styles. Keep section-specific appearance local.
- Avoid unnecessary inline styles; use them only for runtime/dynamic CSS values that cannot be expressed cleanly with utilities. Keep style-only props out of rendered DOM attributes.
- Reuse the project's generic `Button`, `Container`, and other existing primitives. If a generic visual pattern repeats meaningfully, extract one reusable component with a small, semantic API.
- Preserve `data-theme` dark/light switching, CSS semantic tokens, saved preference and the initial theme bootstrap. Avoid flash, hydration mismatch and unnecessary loading of both theme images.
- Keep motion subtle and accessible; respect `prefers-reduced-motion`; avoid scrolljacking and heavy animation dependencies.
- Use appropriate responsive sizing, spacing, imagery, contrast, keyboard focus and touch targets. Do not optimize desktop at the cost of mobile or other supported locales.
- Use valid camelCase JSX/SVG attributes (`strokeWidth`, `strokeLinecap`, etc.).

## 8. Visual assets and fidelity

Before editing a visual component, inspect the **approved current** design references:

- `design-handoff/devcosmo/references/` — approved page mockups.
- `design-handoff/devcosmo/specifications/` — UX/UI, asset usage and motion guidance.
- `design-handoff/devcosmo/manifests/` — asset inventory and integrity.
- `design-handoff/devcosmo/tokens/` — token references; reconcile with decisions already homologated in application CSS.
- `public/assets/devcosmo/` — runtime artwork and brand assets.
- Any later **explicitly approved** incremental design decision, when present.

Older `docs/design/` files may contain historical references; do not assume they are more current than the approved handoff. Resolve conflicts by checking approval, scope and date rather than overwriting working behavior.

- Do not replace approved artwork, generate visual assets, stretch images or redraw the brand without authorization.
- Images of the **Propostas em Dia** kit are promotional/illustrative; it is a digital kit, **not** a web SaaS product. Do not infer product capabilities from artwork.
- Preserve the approved relationship between the Home sections, their curved/straight boundaries, the compact Header, dark/light compositions, and localized layout unless a new design change is approved.
- Never use complete mockup screenshots as production background images.
- Keep private paid product files out of `public/`.
- Provide actual browser captures for visual QA where possible; do not declare visual fidelity solely from a build or static CSS inspection.

## 9. Hooks, services, mappers, and utilities

- **Hooks** own reusable state/effect orchestration, not JSX, layout decisions or raw API contracts. Keep feature-specific hooks in the feature; shared hooks under `src/hooks`.
- **Services** own external integrations and data retrieval. Do not perform HTTP in Views, and avoid duplicating requests across child components.
- Define explicit request/response DTOs at integration boundaries; map meaningful DTO differences into domain objects in a feature-local mapper.
- **Utilities** should be pure and focused; do not hide domain rules in generic helper files.
- Do not create a service/mapper/repository abstraction for static data with no external data source merely to imitate an enterprise architecture.
- Prefer server-side data retrieval where appropriate for the App Router; use browser-side fetching only when interaction truly requires it.
- When a feature involves loading, errors, empty data or success states, model and render its **real** states rather than only the happy path.
- Preserve existing contracts; treat future checkout, catalog or backend functionality as out of scope until authorized.

## 10. Routing, i18n, accessibility and SEO

- Respect Next.js App Router route ownership, `next-intl` routing and existing locale behavior: `pt-BR` is canonical at `/`, with `/en` and `/es` for other locales.
- Localize all user-facing text (including aria labels, navigation, alt text when meaningful, and metadata). Update all three message catalogs together.
- Obtain translations in the **Controller**, including server-side `getTranslations` as appropriate; pass finalized translated strings to Views.
- Preserve navigation and locale changes with canonical URLs, query and fragment when applicable. Do not use `window.history.pushState` as a substitute for real route navigation.
- Do not create dead links, fictitious URLs, `href="#"`, unavailable product destinations or functional controls without an action.
- Use semantic headings and landmarks, accessible names, keyboard behavior, visible focus, sufficient contrast, reduced-motion support and correct native semantics.
- Preserve localized metadata and canonical/alternate URLs. Do not invent a production domain or deploy configuration.

## 11. Tests and quality gates

Test **observable behavior and meaningful rules**, not implementation details or file splitting.

- Prefer specs next to the Controller/component, hook, utility, service or mapper they exercise.
- Controller/component specs should exercise behavior through the public component. Do not write separate View specs by default for purely presentational output.
- Test domain rules, parsers, URL builders, data mapping, persistence, important side effects and boundary validations when meaningful.
- Reuse fixtures/builders; keep feature-specific fixtures near the feature.
- If a test runner is absent, **do not install one unilaterally**. Report missing automated coverage and propose the minimal setup for an explicitly authorized task.
- Critical acceptance flows may use Playwright or the project's existing browser tooling when available. Validate routes, locales, theme, anchors, responsive layout and accessibility as relevant.
- For visual changes, compare real screenshots to approved mockups at the requested viewports. Keep visual review separate from technical validation.

### Existing required commands

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
git diff --check
git diff --cached --check
```

Run all four npm checks for non-trivial application changes. Run targeted tests and browser QA when available and relevant. For docs-only changes, Git diff checks may suffice; report which checks were not run and why.

Do not suppress lint/TypeScript errors, modify snapshots merely to hide regressions or report tests as passed without execution.

## 12. Cleanup and refactoring discipline

- Refactor **within the authorized scope**. Do not use unrelated work as an excuse for a repository-wide rewrite.
- When replacing a component or feature, remove proven dead files, unused imports, stale translations, obsolete references and obsolete tests **only after** confirming no remaining consumers.
- Preserve public component contracts or update all consumers and tests together.
- Avoid speculative abstractions, duplicated UI primitives, unnecessary memoization, comments that simply narrate code, over-defensive guards and pass-through Controllers.
- Write self-explanatory names; use comments **only** to explain non-obvious constraints, architectural reasons, browser quirks, safety guarantees or otherwise unexpressible intent.
- Do not delete design handoffs, historical QA, or other staged materials as “cleanup” without reviewing their provenance and obtaining authorization when needed.
- A Controller/View refactor must preserve HTML semantics, CSS/theme behavior, server/client boundaries, SEO, a11y, locales and user interaction.

## 13. Git, approval and deployment governance

Use **Conventional Commits in English** (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).

Official workflow:

**Implementation → Validation → Review → Adjustments → Approval → Commit → Push → Next phase**.

- Every finished phase should receive a reviewed commit and be pushed to the authorized GitHub repository **before the next phase**, after explicit approval.
- **Never create a commit, push, deploy, delete large file sets, configure hosting or change commercial settings without explicit authorization.** Approval of code or design alone is not blanket authorization for these actions.
- Do not assume the Git author is correct from the remote alone; verify Git identity before an authorized commit.
- Keep staged, unstaged, and untracked changes intact unless instructed otherwise. Do not run destructive Git commands on an unknown worktree.
- The repository and approved visuals do not authorize implementation of future roadmap phases.
- Treat QA completed, visual approval, editorial approval and operational publication as distinct states.

## 14. Required agent response

After a non-trivial change, respond with:

1. **Scope and diagnosis:** what was inspected and which issue/requirement was addressed.
2. **Changes:** concise list of files and responsibilities changed.
3. **Preserved behavior:** key untouched contracts and components.
4. **Validation:** commands/tests actually run, results, screenshots where applicable.
5. **Git:** branch, HEAD and relevant staged/unstaged status; whether commit/push occurred.
6. **Remaining work:** real blockers, limitations and pending approval only.
7. **Next authorized step:** one precise follow-up; do not start another phase automatically.

For code-review-only requests, do not edit code. For plans or proposals, distinguish recommended rules from approved and executed changes.

## 15. Component implementation checklist

- [ ] Owner chosen correctly: feature-local vs truly shared.
- [ ] One meaningful component per folder; children organized coherently.
- [ ] **Hooks, context, translations, effects or domain behavior → Controller + View.**
- [ ] Pure visual component without logic → a single component is allowed.
- [ ] View renders JSX only; no hooks, context, translations or services.
- [ ] Explicit, minimal Controller/View props; no unnecessary prop chains.
- [ ] Interfaces use `I`; typed lists use `Array<T>` / `ReadonlyArray<T>`.
- [ ] Domain/integration validation occurs at boundaries.
- [ ] Tailwind-first, semantic tokens, local CSS Modules for complex styling.
- [ ] Reuse shared UI primitives rather than duplicating visuals.
- [ ] Small Server/Client boundary and correct Next.js framework contracts.
- [ ] All visible strings localized in PT-BR, EN and ES.
- [ ] Correct semantics, keyboard behavior, focus and reduced motion.
- [ ] Relevant tests, quality scripts and visual QA completed or limitations disclosed.
- [ ] No unrelated scope changes, unauthorized Git actions or deployment.
