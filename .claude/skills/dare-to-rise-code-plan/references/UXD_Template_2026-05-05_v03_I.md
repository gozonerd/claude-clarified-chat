---
name: User Experience Document — Template
description: Reusable template for authoring a UXD as a fifth prerequisite input to /dare-to-rise-code-plan. Defines the visual design system, interaction patterns, accessibility-as-delight criteria (legal floor WCAG 2.1 AA + LIVED floor — cognitive ADHD-conscious design / reading dyslexia-conscious typography / vision user-controlled theme toggle, per v03 expansion), catastrophic state polish, and locale-specific visual treatment. Filled-in instances feed into Stage 00 research and Stage NN+1 Design Polish.
type: template
skill: dare-to-rise-code-plan
version: v03_I
date: 2026-05-05
methodology_version: 0.3.0
supersedes: UXD_Template_2026-04-26_v02_I.md (moved to references/deprecated/ on 2026-05-05 per D2R Accessibility Floor Update — §5 accessibility-as-delight expansion from "ARIA + keyboard + screen-reader + motion-sensory criteria" baseline to the FULL LIVED FLOOR codifying cognitive ADHD-conscious design + reading dyslexia-conscious typography + vision user-controlled theme toggle as design-layer specifications.)
v03_changes: §5 Accessibility-As-Delight expanded from 4 sub-sections (ARIA / Keyboard / Screen Reader / Motion-Sensory) to 7 sub-sections — adds §5.5 Cognitive Accessibility Design (zen-focus default; modal-discipline; cognitive-load-aware defaults; friction-at-entry minimization), §5.6 Reading Accessibility Design (dyslexic-friendly font pick from candidate set Lexend/OpenDyslexic/Atkinson Hyperlegible; tunable letter-spacing/line-height/paragraph-width; code-surfaces-excluded discipline; font-option persistence), §5.7 Vision Accessibility Design (theme toggle as MANDATORY design element; both themes WCAG 2.1 AA contrast; theme persistence; no surprise re-themes). New §3.5 Theme System (codifies the visual rendering of dark/light themes as a load-bearing UXD design-system specification, NOT a post-hoc color toggle). New §5.8 Lived-Floor Refusal Table at gate (UXD that omits dyslexic-font option for WYSIWYG/rich-text apps → REFUSE HIGH; UXD §3.5 that specifies one theme palette only → REFUSE CRITICAL; etc.). Empirical motivation: lived-floor accessibility is what users with real accessibility profiles need to USE the app as a daily-driver instrument — not merely to legally access it. Apps shipping with only the legal floor are MVP-deployable-failed regardless of WCAG compliance because they fail at scale when the lived floor is missing. Methodology applies to ALL D2R apps, not Krystal-specific.
---

# User Experience Document — Template

## How To Use This Template

Copy this file. Rename to `[ProjectPrefix]_UXD_[YYYY-MM-DD]_v01_I.md`. Fill in every required section. Mark optional sections as NA if not applicable with a one-line reason.

Required sections must be completed before `/dare-to-rise-code-plan` Stage 00 can run. Incomplete UXDs produce implementations that pass acceptance tests against unspecified visual character — internally consistent, externally bland. The UXD is the F13-equivalent reality anchor for the visual layer: without it, the implementer falls back to generic-component-library defaults regardless of what the PRD/TRD/AVD specify.

Every section has instructions (italic) and a placeholder format. Replace instructions with the filled-in content. Keep the section headers.

### Heading-Prefix IDs

Per `references/Heading_Prefix_ID_Grammar_2026-04-26_v01_I.md`, every load-bearing item appears as a heading with a strict ID prefix. UXD uses these TYPE prefixes:

- **UC** — Component (§2.4)
- **UN** — Component State (§3.1, §3.2 — distinct from PRD-US Segment)
- **UA** — Anti-pattern (§7)
- **UP** — Polish criterion (§1.3)
- **UD** — Design-system token (§2.1, §2.2, §2.3, §3.5 — uses semantic naming, e.g., `UXD-UD-color-surface-primary`)
- **AR** — Aesthetic Anchor Reference (§1.1)

Example: `### UXD-UC-button-primary: Primary Button Component`. Cross-doc references use the fully-qualified form: `references UXD-UC-button-primary + UXD-UA-purple-gradients`.

### Authorship Parallelization Markers

Each section header carries a marker indicating dependency for team-scaled authorship:

- `[independent]` — can be authored at any time
- `[parallelizable-with X]` — can be authored concurrently with X
- `[requires §X]` — must be authored after §X

---

## 1. Aesthetic Anchors (Reality Anchor) `[parallelizable-with PRD §2]`

### 1.1 Reference Apps With Screenshots

*Name 2-5 existing apps that capture the visual + interaction character this product should embody. The reference set is the load-bearing reality anchor that prevents generic-default output.*

*Author one heading per reference (e.g., `### UXD-AR-01: Linear — Keyboard-First Command Palette`). Required fields:*
- *What specifically is being referenced (layout / typography / interaction feel / state design / animation / etc.)*
- *Screenshot path or URL*
- *What from this reference does NOT apply to this product (avoids over-cloning)*

> **Stop & Verify before continuing past §1.1.** Confirm:
> - At least 2 reference apps named with screenshots
> - Each reference has IDs assigned (`UXD-AR-NN`)
> - Each reference has what-specifically-is-the-anchor named (not "I like how it looks")
> - Each reference has what-does-NOT-apply named

### 1.2 Brand Voice Expressed Visually

*State 5-10 concrete visual decisions that express the brand voice. Each gets ID `UXD-UD-brand-NN` or relevant token type. Not "modern look" — concrete: "rounded corners on interactive elements, sharp on data-display surfaces"; "generous whitespace, never crowded"; "no purple gradients, ever"; "monospace only for data, never for prose". Named anti-patterns belong here too.*

> **Stop & Verify before continuing past §1.2.** Confirm:
> - 5+ concrete visual decisions stated (not adjectives like "modern" or "clean")
> - Each decision has IDs assigned (`UXD-UD-brand-NN`)
> - Anti-patterns within brand voice are named explicitly

### 1.3 Polish Criteria — Qualitative Bar With Examples

*State the qualitative bar for "feels finished." Reference apps in §1.1 are anchors; this section is the explicit checklist a human reviewer would use to call the build complete. Use concrete tests, not adjectives.*

*Author one heading per criterion (e.g., `### UXD-UP-01: Empty States Suggest Concrete Next Action`). Required fields:*
- *Specific observable property*
- *How a reviewer would test it (a specific 3-step check)*
- *What "finished" looks like vs. what "needs more" looks like (with reference to §1.1 anchors when possible)*

---

## 2. Visual Design System `[requires §1]`

### 2.1 Color Palette

*Define the full color system. Author one heading per color token (e.g., `### UXD-UD-color-surface-primary: Primary Surface`). Required fields:*
- *Hex value (light mode)*
- *Hex value (dark mode — REQUIRED per §3.5 v03 expansion; theme toggle is mandatory accessibility floor element per §5.7)*
- *Where it appears (which surfaces use this token)*
- *Contrast ratio against text it appears with (WCAG 2.1 AA minimum) IN BOTH MODES (per §5.7 + TQVCD §6.7 — single-theme passing is not passing)*

> **Stop & Verify before continuing past §2.1.** Confirm:
> - Every color token has hex value (BOTH light AND dark mode) AND contrast ratio against text it appears with
> - Every token has IDs assigned (`UXD-UD-color-NN`)
> - Dark-mode counterparts present per §3.5 (theme toggle is mandatory per v03 expansion; dark-mode is no longer "if applicable")
> - Tokens use semantic naming (`color-surface-primary` not `gray-100`)
> - BOTH themes pass contrast checks per §5.7 / TQVCD §6.7

### 2.2 Typographic Scale

*Define the type system. Author one heading per type token (e.g., `### UXD-UD-text-heading-xl: Extra Large Heading`). Required fields:*
- *Font family (default — distinct from §5.6 dyslexic-friendly alternative font)*
- *Font size (rem or px)*
- *Font weight*
- *Line height*
- *Letter spacing (if non-default)*
- *Where it appears*

*Justify the scale (why these sizes and not others) at the end of the section.*

*Per §5.6: if the product has rich-text/WYSIWYG/prose/document-viewer surfaces, the typographic scale MUST account for the dyslexic-friendly alternative font (Lexend / OpenDyslexic / Atkinson Hyperlegible — pick one+) — verify that scale tokens render legibly with the alternative font and that user-tunable letter-spacing/line-height/paragraph-width tokens exist.*

### 2.3 Spacing System

*Define the spacing scale. Required:*
- *Base unit (e.g., 4px, 8px) — author as `### UXD-UD-space-base: Base Unit`*
- *Scale steps as individual tokens (e.g., `### UXD-UD-space-tight: 4-8px Range`, `### UXD-UD-space-default: 16-24px`, `### UXD-UD-space-loose: 32-64px`)*
- *Rationale for the scale*

### 2.4 Component Tokens

*List the base components the product needs. Author one heading per component (e.g., `### UXD-UC-button-primary: Primary Button`). Required fields:*
- *Visual spec (color tokens used FROM BOTH THEMES per §3.5, typography tokens used, spacing tokens used, border radius if any, shadow if any)*
- *Default size / measurements*
- *Where it appears in the product*
- *Theme-toggle behavior (does the component re-render on theme change? does the component carry theme-specific state?)*

This is the "atoms and molecules" layer that implementation maps onto directly. Each component referenced in §3 State Catalog must appear here. **Per §3.5 + §5.7**, every component token's color choices must specify BOTH light-mode AND dark-mode hex values.

---

## 3. Interaction Patterns `[requires §2]`

### 3.1 State Catalog (Per Component Class)

*For every interactive component class, specify all states. Author one heading per component-state combination (e.g., `### UXD-UN-button-primary-hover: Primary Button Hover State`). States: default, hover, focus (keyboard), focus-visible, active, disabled, loading, empty, error, success.*

*Required fields per state:*
- *Visual spec (referencing §2.1, §2.2, §2.3 tokens — verify both light AND dark theme renderings per §3.5)*
- *Transition between states (timing function, duration)*

> **Stop & Verify before continuing past §3.1.** Confirm:
> - Every interactive component class has all 10 standard states declared (or marked NA per state)
> - Every state has IDs assigned (`UXD-UN-component-state`)
> - Transition timing/curve specified for each state
> - Each state's visual spec references color tokens that have BOTH-theme values per §3.5 + §5.7

### 3.2 Empty / Loading / Error / Success / Catastrophic State Catalog

*Every screen and every data surface needs explicit empty / loading / error / success states AND a catastrophic state. Author one heading per screen-or-surface-state combination (e.g., `### UXD-UN-document-editor-catastrophic: Document Editor Catastrophic State`).*

*Required fields per screen-or-surface state (empty/loading/error/success):*
- *Visual treatment (layout, illustration if any, copy)*
- *Copy (the actual text the user sees)*
- *Actions available (buttons, links, etc. — what can the user do from this state)*

*Required fields per catastrophic state (additional 2 fields beyond empty/loading/error/success):*
- *Visual treatment, copy, actions available (as above)*
- *`data_preservation_strategy` — what gets persisted locally / queued / saved-to-export / nothing during the catastrophic event*
- *`recovery_communication` — how the product communicates when the catastrophic state resolves*

The catastrophic state is required for every screen/surface OR NA-with-justification. The justification must reference TQVCD §2.2 stress-test categories declared YES — if the system has a stress category mapped to YES, every surface affected by that failure must have a catastrophic state.

*Worked example:*

#### UXD-UN-document-editor-catastrophic: Document Editor Catastrophic State

**Trigger:** Network connection lost for 2+ minutes during active editing OR database write failure on autosave OR auth session expired mid-action.

**Visual treatment:** Persistent banner (color: `UXD-UD-color-warning`, never `UXD-UD-color-danger` — danger reserved for true loss). Editor remains usable; saves to local-IndexedDB queue. Sync-pending indicator in status bar.

**Copy:** "Connection dropped at 3:14:22 PM. Your last 47 actions are saved locally. We'll auto-retry every 30 seconds. You can also click 'Retry now' or 'Save & log out' if you'd rather come back later."

**Actions available:** Retry now (button); Save & log out (button); Continue editing (default; saves keep queueing).

**`data_preservation_strategy`:** All edits since last successful sync are persisted to local IndexedDB queue keyed by user-session-id. Queue replays automatically on reconnect. User can export queue contents to a .json file via Save & log out.

**`recovery_communication`:** When connection restores, banner transitions through "Reconnecting..." (`UXD-UD-color-info`, ~500ms) → "Caught up. 47 changes synced." (`UXD-UD-color-success`, auto-dismiss after 3s).

### 3.3 Animation + Transition Guidelines

*State the policy on motion. When is animation allowed, how much, what curves, what durations? Specify the `prefers-reduced-motion` honoring strategy.*

*Required fields:*
- *Allowed motion categories (e.g., subtle hover transitions; entrance/exit fades; scrolling parallax — ALLOWED or FORBIDDEN per category)*
- *Default durations (e.g., 150ms for hover, 250ms for entrance)*
- *Default timing curves (e.g., `cubic-bezier(0.4, 0, 0.2, 1)` for ease-out)*
- *`prefers-reduced-motion` policy: which animations are disabled / replaced / unchanged when reduced motion is requested*

### 3.4 Catastrophic Failure Voice

*The brand voice from §1.2 has a failure-state expression. "Something went wrong" is the default; specify the not-default for this product. Author one heading per voice rule (e.g., `### UXD-UA-catastrophic-voice-01: Always Include Timestamp`).*

*Required: 3-5 concrete voice rules for catastrophic moments. Each rule must reference at least one §1.2 brand voice decision.*

*Example rules:*
- *`### UXD-UA-catastrophic-voice-01`: Always include the timestamp of the failure event in user-readable form (e.g., 'at 3:14:22 PM' not 'at timestamp 1714670062')*
- *`### UXD-UA-catastrophic-voice-02`: Always tell the user what's been preserved (count of saved actions, number of cached records, last successful save time)*
- *`### UXD-UA-catastrophic-voice-03`: Never use technical error names in user-facing copy ('NetworkError' becomes 'Connection dropped'; 'AuthExpiredError' becomes 'Your sign-in session ended')*
- *`### UXD-UA-catastrophic-voice-04`: Always offer at least 2 next-actions; one for users who want to retry, one for users who want to bail out gracefully*
- *`### UXD-UA-catastrophic-voice-05`: Never silently retry without telling the user*

### 3.5 Theme System (Dark/Light Toggle — MANDATORY, NEW v03)

**v03 expansion (load-bearing).** Theme system is a load-bearing UXD design-system specification, not a post-hoc color toggle. The theme toggle is part of the LIVED accessibility floor (per §5.7 + TQVCD §6.7); apps with significant text content MUST ship with user-controlled dark/light theme toggle.

*Required fields:*

- **`### UXD-UD-theme-light: Light Mode Theme.`** Full color palette in light mode (hex values for every §2.1 token). Default contrast ratios verified WCAG 2.1 AA for body text + code (where applicable).
- **`### UXD-UD-theme-dark: Dark Mode Theme.`** Full color palette in dark mode (hex values for every §2.1 token). Default contrast ratios verified WCAG 2.1 AA for body text + code (where applicable). NOT just "invert the light palette" — dark mode is its own first-class palette with its own design intent (dark mode is not always darker; it is a separate visual mode with its own accessibility considerations: pure black backgrounds cause halation in some users, pure white on pure black causes more eye strain than slightly-off-black on slightly-off-white, etc.).
- **`### UXD-UD-theme-toggle-control: Theme Toggle Control.`** Where the toggle lives in the IA (settings panel? top-right corner? command palette?); what its visual treatment is (icon? text? both?); what the toggle states are (light / dark / system-follow — the latter MAY be one option but NOT the only option).
- **`### UXD-UD-theme-persistence: Theme Persistence.`** How the user's choice is persisted (localStorage / user-account-setting / both); behavior on first launch (system-follow default, light default, dark default — designer's choice with rationale); behavior across devices (per-device or synced).
- **`### UXD-UD-theme-no-surprise: No Surprise Re-Themes.`** Policy: app does not auto-switch themes mid-session without explicit user action (excluding system-follow mode where the user has opted into following OS). Auto-switch on day/night system change in system-follow mode is acceptable; auto-switch otherwise (e.g., based on time of day even in user-explicit-light mode) is forbidden.

> **Stop & Verify before continuing past §3.5.** Confirm:
> - Both light + dark palettes specified at full §2.1 token coverage with hex values + contrast ratios
> - Theme toggle control specified (location + visual treatment + states)
> - Theme persistence specified
> - No-surprise-re-themes policy declared
> - System-follow may be ONE option but is NOT the only option (the toggle MUST allow user override of system)

NA permitted ONLY if the product genuinely has no significant text content (e.g., a webcam-only video chat app); NA must reference the product domain rationale, not "we'll add it later" (deferred theme toggle is a violation of the lived floor per §5.7 + TQVCD §6.7).

---

## 4. Information Architecture `[requires PRD §4]`

### 4.1 Hierarchy Rules

*State the rules for visual hierarchy. What gets visual weight at each level? What appears above the fold? What's secondary? How does density scale with content volume?*

*Required:*
- *Hierarchy levels (primary / secondary / tertiary / supporting)*
- *Visual weight signals at each level (size, color, position, density)*
- *Above-the-fold rule (what MUST be visible without scrolling on desktop / mobile)*
- *Density rule (how spacing changes as content volume grows)*

### 4.2 Grouping And Prioritization

*State how related content is grouped visually. What's the rule for when items become a list vs. a grid? When is content tabbed vs. stacked? When does a section become its own page?*

### 4.3 Navigation Pattern

*Specify the primary navigation pattern (sidebar / topbar / tab bar / command palette / etc.) and the rationale. State what's reachable from each navigation surface and what isn't.*

---

## 5. Accessibility-As-Delight — Legal Floor + Lived Floor `[requires TRD §3.5 + TQVCD §6]`

**v03 expansion (load-bearing).** Per the v03 D2R Accessibility Floor Update, this section codifies BOTH the legal floor (WCAG 2.1 AA) accessibility-as-delight criteria (§5.1-§5.4) AND the LIVED floor accessibility-as-delight criteria (§5.5-§5.7). The legal floor is hardwired in PRD §6.4 and gated by TQVCD §6.1-§6.4; this section's first-half (§5.1-§5.4) specifies design-layer behavior for the legal floor. The second-half (§5.5-§5.7) specifies design-layer behavior for the LIVED floor — what users with real accessibility profiles need to USE the app comfortably (not merely to legally access it).

Per Track 8 (Accessibility Tooling) outputs, this is the design-layer of the 6-layer accessibility hardwiring chain documented in `/dare-to-rise-code-plan` skill (extended in v03 to incorporate lived-floor specifications at the design layer).

### 5.1 ARIA Label Quality Criteria (Legal Floor — design layer for WCAG 2.1 AA)

*State the criteria for "well-written" ARIA labels in this product. Examples: action verbs not nouns; describe outcome not mechanism; consistent vocabulary across the product; never abbreviated; reference content state when relevant ("Open menu" → "Open menu, currently closed" if state matters).*

### 5.2 Keyboard Navigation Quality Criteria (Legal Floor — design layer for WCAG 2.1 AA)

*State the criteria for keyboard nav beyond "all interactive elements are reachable by Tab." Examples: focus order matches visual reading order; skip-to-main-content link present and styled; focus-visible always rendered (never `outline: none` without a replacement); shortcuts documented; modal dialogs trap focus; Escape always exits the smallest relevant scope.*

### 5.3 Screen Reader Experience Criteria (Legal Floor — design layer for WCAG 2.1 AA)

*State the criteria for the screen-reader experience. Examples: page landmarks present (header / nav / main / footer); decorative images marked decorative; live regions used for asynchronous status updates; reading order matches visual order; tables have headers; forms have labels; errors are announced.*

### 5.4 Motion + Sensory Preferences (Legal Floor — design layer for WCAG 2.1 AA)

*State the policy for `prefers-reduced-motion`, `prefers-color-scheme`, `prefers-contrast`, and any other sensory preferences. Each preference: how is it detected, what changes when it's on, how is it tested. NOTE: per §5.7 + §3.5, `prefers-color-scheme` is the system-follow signal — it MAY drive the app's default theme on first launch in system-follow mode, but it CANNOT be the ONLY way the user controls theme; user-controlled override per §3.5-theme-toggle-control is mandatory.*

### 5.5 Cognitive Accessibility Design — ADHD-Conscious Design (LIVED FLOOR, NEW v03)

Apps where users do focused work (writing, reading, coding, planning) MUST satisfy the cognitive accessibility design floor. Author one heading per criterion.

- **`### UXD-UP-Cog-01: Zen-focus default mode.`** App ships with minimal-chrome default; visible UI elements limited to those required for the immediate task; quiet visual environment (no animations or color changes that pull attention without user intent). Design specification: identify chrome elements that can be hidden in default mode and shown on user demand (settings panel collapsed; secondary toolbar reachable via keystroke; status indicators silent unless changed-state).
- **`### UXD-UP-Cog-02: No unsolicited modal interruption.`** Modals fire on user action only, never on autoplay or scheduled timers (excluding security/safety-critical events documented in TRD). Design specification: enumerate every modal in the product; for each, declare the user action that triggers it (button click, keyboard shortcut, etc.); REFUSE any modal that lacks a user-action trigger.
- **`### UXD-UP-Cog-03: Cognitive-load-aware defaults.`** Settings ship with sensible defaults so the user does not have to make decisions before working. First-launch experience is "open the app and use it," not "configure 12 things first." Design specification: enumerate first-launch decisions the user is asked to make; for each, declare the sensible default and the rationale; minimize the count.
- **`### UXD-UP-Cog-04: Friction-at-entry minimized.`** Time-to-first-productive-action measurable and bounded; specific bound declared in PRD §1.4 (non-visual excellence anchors). Design specification: identify the primary user action; design the shortest path from app-open to that action; specify the path in this section so Stage NN+1 Design Polish has a target.

NA permitted ONLY when the product genuinely has no focused-work surface (e.g., a webcam thumbnail-grid viewer); NA must reference the product domain rationale.

### 5.6 Reading Accessibility Design — Dyslexia-Conscious Typography (LIVED FLOOR, NEW v03)

Apps with rich-text, WYSIWYG, prose-rendering, or document-viewer surfaces MUST satisfy the reading accessibility design floor. Author one heading per criterion.

- **`### UXD-UP-Read-01: Dyslexic-friendly typography option.`** At least one research-backed dyslexic-friendly font available as user-selectable option on rich-text/WYSIWYG content surfaces. Pick one or more from the candidate set:
  - **Lexend** — strongest reading-speed evidence (Renaissance Learning et al.); broad-spectrum reading improvement; OFL-licensed (free).
  - **OpenDyslexic** — most-known but mixed empirical evidence; strong opt-in user familiarity; SIL OFL (free).
  - **Atkinson Hyperlegible** — BVI-anchored (Braille Institute); works for some dyslexic readers; strong contrast properties; OFL (free).
  - All three are free / open-license; the floor mandates AT LEAST ONE; per-app UXD picks. Honest gap: dyslexia-font research has live debate; don't relitigate the research in the design spec — pick at least one and ship it as a user-selectable option.
- **`### UXD-UP-Read-02: Tunable typography on rich-text surfaces.`** App provides reasonable defaults but allows user override on rich-text surfaces for: letter-spacing, line-height, paragraph-width. Design specification: tokens + UI control surface (settings panel section / inline reading-controls / etc.).
- **`### UXD-UP-Read-03: Code surfaces excluded from font swap.`** Code blocks/inline-code retain monospace; dyslexic-friendly font applies to prose/rich-text only. Rationale: code semantics depend on monospace alignment. Design specification: explicit token boundary between prose-typography (swappable) and code-typography (always-monospace).
- **`### UXD-UP-Read-04: Font + tuning preference persistence.`** User's font + tuning choices persist across sessions. Design specification: where these preferences live (settings panel; per-document override; both); persistence mechanism cross-references §3.5 theme persistence.

NA permitted ONLY when the product genuinely has no rich-text/WYSIWYG/prose/document surface (e.g., a CLI-only tool with no GUI prose rendering; a numeric dashboard with chart-only content); NA must reference the product domain rationale.

### 5.7 Vision Accessibility Design — Theme Toggle MANDATORY (LIVED FLOOR, NEW v03)

Apps with significant text content MUST satisfy the vision accessibility design floor. Author one heading per criterion. (Operationalizes §3.5 theme system as accessibility floor; cross-references TQVCD §6.7.)

- **`### UXD-UP-Vis-01: Dark/light theme toggle is MANDATORY (design surface present).`** The toggle is a designed UI element (per §3.5 UXD-UD-theme-toggle-control), not a developer-only preference. Users must be able to switch themes from a discoverable control surface in the app, NOT only via system-level settings.
- **`### UXD-UP-Vis-02: Both themes WCAG 2.1 AA contrast (design verified).`** Body text AND code (where applicable) hit AA contrast in BOTH themes. Single-theme passing is not passing. Design specification: every §2.1 + §3.5 color token has both-theme contrast ratios documented + verified at design time (not deferred to QA discovery).
- **`### UXD-UP-Vis-03: Theme persistence (design specifies behavior).`** User's theme choice persists across sessions; first-launch behavior specified; cross-device behavior specified per §3.5 UXD-UD-theme-persistence.
- **`### UXD-UP-Vis-04: No surprise re-themes (design specifies non-events).`** Designed-in: app does not auto-switch themes mid-session without explicit user action (excluding system-follow mode where the user has opted into following OS). Design specification names the time-of-day / lighting / accessibility events the app explicitly does NOT respond to with theme changes.

NA permitted ONLY when the product genuinely has no significant text content (e.g., a webcam-only video chat); NA must reference the product domain rationale.

### 5.8 Lived-Floor Refusal Table At Gate (NEW v03)

The following conditions REFUSE at the UXD authorship gate (`/asae` `domain=design`) AND at the cross-doc audit gate (`/ideate-to-d2r-ready` Phase 02):

| Condition | Severity | Rationale |
|---|---|---|
| UXD §3.5 specifies one theme palette only (no dark/light counterpart) | CRITICAL | Vision-floor violation per §5.7 + TQVCD §6.7; theme toggle is mandatory design-surface; missing palette is missing implementability. |
| UXD that omits dyslexic-font option for WYSIWYG/rich-text apps (§5.6 missing or §5.6.1 NA without rich-text-absence rationale) | HIGH | Reading-floor violation per §5.6; dyslexic users cannot use the app's primary content surface comfortably. |
| UXD §5.7-Vis-01 specified as system-follow-only (no user-controllable toggle in the design) | HIGH | Vision-floor violation per §5.7-Vis-01; users whose system theme doesn't match their needs have no recourse from within the app. |
| UXD §5.5 cognitive accessibility section absent or NA without focused-work-absence rationale | HIGH | Cognitive-floor violation per §5.5; ADHD users (and users in other cognitively-demanding contexts) have no design-spec for the zen-focus / modal-discipline / cognitive-load-aware defaults their workflows need. |
| Any of UXD-UP-Cog-01..04 / Read-01..04 / Vis-01..04 marked NA without explicit rationale tied to product domain | MEDIUM (strict policy) | NA with rationale acknowledged is acceptable; silent NA is the lived-floor-erosion failure mode per the larger principle "accessibility floor = legal floor + lived floor." |
| UXD §2.1 color tokens missing dark-mode hex values (per v03 §3.5 expansion) | HIGH | Design-token-incompleteness; theme toggle cannot be implemented if half the palette is missing; v03 §2.1 made dark-mode counterparts REQUIRED, not "if applicable." |

> **Stop & Verify before continuing past §5.** Confirm:
> - Each criterion (§5.1-§5.7) is observable (testable) not aspirational ("ARIA labels are well-written" → "ARIA labels follow rules X, Y, Z")
> - Cross-references to TRD §3.5 + TQVCD §6 (legal AND lived floor) accessibility exit criteria are consistent
> - Track 8 (accessibility tooling) outputs are reflected here for both legal AND lived floors
> - §5.5/§5.6/§5.7 lived-floor sections have either populated content OR explicit NA-with-product-domain-rationale per §5.8 refusal table
> - §5.8 refusal table conditions audited at this gate AND surfaced for /ideate-to-d2r-ready Phase 02 cross-doc audit

---

## 6. Responsive + Mobile Behavior `[requires §1, §2, §3]`

### 6.1 Breakpoints

*State the breakpoint set (mobile / tablet / desktop / wide-desktop or whatever set the product needs) and the rationale for each.*

### 6.2 Per-Breakpoint Layout Changes

*For each breakpoint, specify what changes: navigation pattern shift (sidebar → bottom-bar?); column count change; component size adjustments; content priority changes (what disappears below a certain width).*

### 6.3 Touch-Target Sizing

*State the minimum touch target size (44x44px per Apple HIG / 48x48dp per Material is standard) and the policy on tappable areas being larger than visual elements when needed.*

### 6.4 Mobile-Only Patterns

*If the product has mobile-specific patterns (pull-to-refresh, swipe-to-action, bottom sheets, etc.), specify them here. Mark NA if the product is desktop-only or fully responsive without mobile-specific patterns.*

### 6.5 Locale-Specific Visual Treatment `[requires TRD §3.11; parallelizable-with §6.1-§6.4]`

*Applicability-gated to: Phase 00 ideation interrogation Q10 declared APPLICABLE OR TRD §3.11 declared ≥2 locales OR any RTL locale OR any CJK locale. If Q10 declared NA, this section is NA — but the NA must match Q10's justification.*

*Required if applicable:*

#### 6.5.1 Content-Length Variance Handling

*What happens when German strings are 30% longer than English; what happens when CJK strings are 30% shorter. Component layout flexibility requirements per breakpoint. Truncation strategy if any (with semantic-truncation rules — never mid-word, never mid-character in CJK).*

#### 6.5.2 RTL Mirror Rendering

*For RTL-supported locales (ar, he, fa, ur):*
- *Which components mirror, which don't (numerals don't mirror; layouts do; icons sometimes do; logos never do)*
- *Bidirectional text handling (LTR text inside RTL paragraphs)*
- *Directional icons (back-arrow flips; play-button doesn't)*

#### 6.5.3 Script-Specific Typography

*Font fallback chains per writing system (Latin / Cyrillic / CJK / Arabic / Hebrew / etc.). Line-height and letter-spacing adjustments for non-Latin scripts (Arabic typically needs +20% line-height; CJK typically needs +10%).*

#### 6.5.4 Locale-Aware Data Formatting Visuals

*Currency symbol placement (prefix vs suffix per locale). Date order (MDY / DMY / YMD per locale). Decimal separator rendering (period vs comma per locale). Calendar systems (Gregorian / Islamic Hijri / Buddhist Era / Japanese Imperial — when applicable).*

#### 6.5.5 Pseudo-Locale Visual Testing

*Pseudo-locale specification (e.g., en-XA for accent-extended pseudo-translation; Cyrillic transliteration for visual-system pseudo-test). What's tested in pseudo-locale: truncation, overflow, missing glyphs, line-break behavior, RTL mirror integrity.*

*Required: each locale-specific rule gets ID `UXD-UD-locale-NN`.*

> **Stop & Verify before continuing past §6.5.** Confirm:
> - All sub-sections completed for each locale category declared in TRD §3.11 OR explicit NA-with-justification matching Q10's NA
> - Cross-references to TRD §3.11 i18n requirements are consistent (no UXD-named locale absent from TRD; no TRD-named locale absent from UXD)
> - Phase 3 i18n alignment chain (Phase 1 Q10 ↔ PRD §6.6 ↔ TRD §3.11 ↔ TQVCD §7.6 ↔ UXD §6.5) shows COMPLETE legs

---

## 7. Anti-Patterns To Avoid `[requires §1.2, §2, §3]`

*Name the most-likely-bland anti-patterns the implementer is likely to fall into for this product type. Author one heading per anti-pattern (e.g., `### UXD-UA-purple-gradients: Default SaaS Purple Gradients`). Required fields:*
- *What it looks like (concrete example)*
- *Why it's anti (what it lacks vs. the polish criteria in §1.3)*
- *What to do instead (concrete replacement, referencing §1-§6 tokens)*

This section is load-bearing because it prevents the "implementer falls back to generic React defaults" failure mode that produces internally-consistent but externally-bland output.

**Per v03 expansion: include at least one accessibility-floor anti-pattern (e.g., `### UXD-UA-system-follow-only-theme: System-Follow-Only Theme Without User Control` — specific anti-pattern: app uses `prefers-color-scheme` but provides no toggle in app UI; per §5.7-Vis-01 + §5.8 refusal table this REFUSES at gate).**

---

## 8. Reference Design Assets `[requires §1, §2]`

### 8.1 Asset Inventory

*List the reference design assets shipped with this UXD. Assets MUST include: screenshots of reference apps (§1.1), color palette swatches with hex values (§2.1), typographic scale specimens (§2.2), spacing system grid visual (§2.3), and at least one mockup or wireframe of the primary screen of this product.*

*Per v03: BOTH light AND dark theme palette swatches required per §3.5; AND at least one mockup or wireframe of the primary screen RENDERED IN BOTH THEMES.*

*Required format per asset:*
- *Asset name*
- *Asset type (screenshot / mockup / wireframe / palette / specimen / etc.)*
- *Path (relative to UXD location, typically in a sibling `references/` or `mockups/` directory)*
- *What this asset is used for (which UXD section references it)*

### 8.2 Asset Storage And Versioning

*State where the reference assets are stored, how they're versioned, and how downstream stages access them. Default convention: `[planning-directory]/uxd-assets/[YYYY-MM-DD]/` with assets named per file-naming-and-versioning rule.*

---

## Amendment Protocol

*Per `references/Methodology_Versioning_And_Amendment_Protocol_2026-04-26_v01_I.md` §8 (canonical text). Authors of an instance UXD should paste the canonical Amendment Protocol section here. Summary: Phase A (authoring, pre-Stage-00) follows the inline validation hooks above; Phase B (execution amendments, Stage 00 through Stage QA) requires amendment-log entry + cross-doc audit re-run; Phase C (operational amendments, post-Stage-QA) requires amendment-log entry + ORD update if applicable.*

*Note: UXD §3.2 catastrophic state changes are particularly amendment-sensitive — they tie to TQVCD §2.2 stress categories which gate production-readiness. Any post-Phase-A amendment changing a catastrophic state MUST trigger reliability-chain re-audit per Phase B discipline. v03 addition: §3.5 theme-system + §5.5/§5.6/§5.7 lived-floor sections are similarly amendment-sensitive — they tie to TQVCD §6.5/§6.6/§6.7 + Phase 02 accessibility-floor cross-doc chain; post-Phase-A changes here trigger accessibility-chain re-audit.*

---

## 9. Stakeholder Approvals `[requires every other section]`

*Who has approved this UXD? Without documented approval, Stage 00 should not begin. Visual design approval is a load-bearing decision; treat the approver as a design stakeholder, not just a project owner.*

*Required format per stakeholder:*
- *Stakeholder name and role*
- *Approval date*
- *Approval notes (any conditions or flags, especially around design-system source-of-truth)*

---

## 10. Open Questions `[independent]`

*What design decisions are not yet made? Author one heading per question (`### UXD-OQ-01: Dark Mode Timing — Now Or Later?`). UXD open questions often include: animation library choice; icon library choice; design-system source-of-truth (this UXD or an external system?). NOTE per v03: dark-mode timing is no longer a deferrable open question — theme toggle is mandatory per §5.7 + §3.5; open questions about dark-mode TIMING are accessibility-floor violations and should be reframed as open questions about dark-mode SCOPE (e.g., "first-launch default — light or system-follow?" is an open question about default; "do we ship dark mode at all?" is not an open question because the floor mandates it).*

---

## Validation Checklist (Pre-Stage-00)

Before invoking `/dare-to-rise-code-plan`, verify:

- [ ] All required sections completed
- [ ] NA sections have one-line justifications
- [ ] Heading-prefix IDs assigned to all components / states / anti-patterns / polish criteria / design tokens / aesthetic anchors
- [ ] At least 2 reference apps named with screenshots (§1.1)
- [ ] Brand voice expressed as 5+ concrete visual decisions, not adjectives (§1.2)
- [ ] Polish criteria are observable tests, not adjectives (§1.3)
- [ ] Color palette has semantic role names AND hex values (BOTH light + dark per §3.5 v03 expansion) AND contrast ratios IN BOTH MODES (§2.1)
- [ ] Typographic scale has rationale (§2.2), with dyslexic-friendly font alternative considered per §5.6 if rich-text/WYSIWYG/prose surfaces present
- [ ] State catalog covers all 10 standard states for every interactive component class (§3.1) — both-theme rendering verified
- [ ] Empty / loading / error / success / **catastrophic** states specified for every screen-or-surface (§3.2) OR NA-with-justification matching TQVCD §2.2
- [ ] §3.4 catastrophic failure voice declared (3-5 concrete rules)
- [ ] **§3.5 Theme system specified (NEW v03):** light + dark palettes; toggle control; persistence; no-surprise-re-themes; system-follow optional but not exclusive — OR NA-with-no-significant-text-content rationale per §5.8
- [ ] Accessibility-as-delight criteria are concrete (Sections 5.1 - 5.4 LEGAL FLOOR + Sections 5.5 - 5.7 LIVED FLOOR per v03)
- [ ] **§5.5 Cognitive accessibility design (NEW v03):** UXD-UP-Cog-01..04 each populated OR explicit NA-with-no-focused-work-surface rationale
- [ ] **§5.6 Reading accessibility design (NEW v03):** UXD-UP-Read-01..04 each populated OR explicit NA-with-no-rich-text-surface rationale
- [ ] **§5.7 Vision accessibility design (NEW v03):** UXD-UP-Vis-01..04 each populated OR explicit NA-with-no-significant-text-content rationale
- [ ] **§5.8 Lived-floor refusal table audited (NEW v03):** no §5.8 refusal-table conditions present in this UXD instance OR all conditions remediated
- [ ] §6.5 locale-specific visual treatment present if Q10 APPLICABLE OR explicit NA-with-Q10-matching-justification
- [ ] Anti-patterns named with concrete replacements (§7) — including at least one accessibility-floor anti-pattern per v03
- [ ] Reference design assets exist at the declared paths (§8.1) — including BOTH-theme palette swatches + at least one BOTH-theme primary-screen mockup per v03
- [ ] Inline validation hooks acknowledged at §1.1, §1.2, §2.1, §3.1, §3.5 (NEW v03), §5, §6.5
- [ ] Amendment Protocol section present (canonical text from `Methodology_Versioning_And_Amendment_Protocol_2026-04-26_v01_I.md` §8)
- [ ] `methodology_version: 0.3.0` declared in frontmatter
- [ ] Authorship parallelization markers acknowledged
- [ ] Bundle Index sidecar reflects current UXD IDs (if CDCC v1.1.0 available)
- [ ] Stakeholder approval documented (§9)

A UXD missing any of these is not ready for D2R. The validation checklist is the F13-equivalent reality-anchor proof.

---

## Companion Documents

This UXD is one of FIVE prerequisite inputs to `/dare-to-rise-code-plan`. The other four:

- **PRD (Product Requirements Document)** — what the product does
- **TRD (Technical Requirements Document)** — what the system does technically
- **AVD (Architecture Vision Document)** — system architecture, components, data flow
- **TQVCD (Testing & Quality Criteria Document)** — quality gates, testing strategy

The UXD is downstream of PRD (which establishes the user segments + journeys) and complements TRD (which establishes the tech stack the visual system runs on). The UXD is upstream of Stage NN+1 Design Polish in D2R execution.

See template files in the same `references/` directory.

---

## Downstream Use

This UXD feeds directly into:

- **Stage 00 Track 6 (Design System Source-Of-Truth + Reference Curation):** lands its outputs into §1.1 reference apps + §1.2 brand voice + §8 reference assets
- **Stage 00 Track 7 (Design System Tooling For The Stack):** scopes against §2 visual design system + §3.5 theme system; tooling lands in TRD §6.7
- **Stage 00 Track 8 (Accessibility Tooling For The 6-Layer Chain):** lands its outputs into §5 accessibility-as-delight criteria (LEGAL §5.1-§5.4 AND LIVED §5.5-§5.7 per v03); design-layer of the 6-layer chain
- **Stage 00 Track 18 (Internationalization, applicability-gated):** lands locale-specific visual outputs into §6.5
- **Stage 01b (Full Plan):** writes Deep-spec content for Stage NN+1 Design Polish referencing UXD `UC-NN` + `UN-NN` + `UD-NN` IDs (including §3.5 theme tokens)
- **Stage NN+1 Design Polish:** runs `/asae` `domain=design` against UXD; iterates with `/asae` until ASAE Certainty Threshold of 3 consecutive clean cycles; verifies §5.5/§5.6/§5.7 lived-floor design specifications shipped per spec
- **Stage QA convergence:** reliability stress-test categories declared YES in TQVCD §2.2 must have matching catastrophic states in UXD §3.2; accessibility-cross-cut tests in TQVCD §6.8 must have matching design-spec in UXD §5.5/§5.6/§5.7

**Cross-doc alignment chains (Phase 02 of `/ideate-to-d2r-ready` audit):**
- **Three-way standards alignment:** TRD ↔ UXD §5 ↔ TQVCD §6 (accessibility — LEGAL + LIVED per v03), and any other standard declared in TRD that has a design-layer expression
- **i18n applicability chain:** Phase 1 Q10 ↔ PRD §6.6 ↔ TRD §3.11 ↔ TQVCD §7.6 ↔ UXD §6.5
- **Reliability ↔ Design Polish chain:** TQVCD §2.2 stress categories declared YES ↔ AVD §3.1 queue/auth/observability components ↔ UXD §3.2 catastrophic states (every TQVCD-YES stress category must have a UXD catastrophic-state on every affected surface)
- **UXD component-token alignment with AVD:** UXD §2.4 component tokens (`UC-NN`) ↔ AVD §3.1 component inventory (`AC-NN`)
- **Accessibility lived-floor chain (NEW v03):** UXD §3.5 (theme system) + §5.5 (cognitive) + §5.6 (reading) + §5.7 (vision) ↔ TQVCD §6.5/§6.6/§6.7/§6.8/§6.9 ↔ TRD §3.5 (stack support for theme toggle + dyslexic-font tooling + chrome-quietness measurement) — every leg required, missing legs are findings at HIGH severity
