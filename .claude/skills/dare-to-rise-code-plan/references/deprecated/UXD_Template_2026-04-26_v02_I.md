---
name: User Experience Document — Template
description: Reusable template for authoring a UXD as a fifth prerequisite input to /dare-to-rise-code-plan. Defines the visual design system, interaction patterns, accessibility-as-delight criteria, catastrophic state polish, and locale-specific visual treatment. Filled-in instances feed into Stage 00 research and Stage NN+1 Design Polish.
type: template
skill: dare-to-rise-code-plan
version: v02_I
date: 2026-04-26
methodology_version: 0.3.0
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
- **UD** — Design-system token (§2.1, §2.2, §2.3 — uses semantic naming, e.g., `UXD-UD-color-surface-primary`)
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
- *Hex value (dark mode, if applicable)*
- *Where it appears (which surfaces use this token)*
- *Contrast ratio against text it appears with (WCAG 2.1 AA minimum)*

> **Stop & Verify before continuing past §2.1.** Confirm:
> - Every color token has hex value AND contrast ratio against text it appears with
> - Every token has IDs assigned (`UXD-UD-color-NN`)
> - Dark-mode counterparts present where dark mode is supported
> - Tokens use semantic naming (`color-surface-primary` not `gray-100`)

### 2.2 Typographic Scale

*Define the type system. Author one heading per type token (e.g., `### UXD-UD-text-heading-xl: Extra Large Heading`). Required fields:*
- *Font family*
- *Font size (rem or px)*
- *Font weight*
- *Line height*
- *Letter spacing (if non-default)*
- *Where it appears*

*Justify the scale (why these sizes and not others) at the end of the section.*

### 2.3 Spacing System

*Define the spacing scale. Required:*
- *Base unit (e.g., 4px, 8px) — author as `### UXD-UD-space-base: Base Unit`*
- *Scale steps as individual tokens (e.g., `### UXD-UD-space-tight: 4-8px Range`, `### UXD-UD-space-default: 16-24px`, `### UXD-UD-space-loose: 32-64px`)*
- *Rationale for the scale*

### 2.4 Component Tokens

*List the base components the product needs. Author one heading per component (e.g., `### UXD-UC-button-primary: Primary Button`). Required fields:*
- *Visual spec (color tokens used, typography tokens used, spacing tokens used, border radius if any, shadow if any)*
- *Default size / measurements*
- *Where it appears in the product*

This is the "atoms and molecules" layer that implementation maps onto directly. Each component referenced in §3 State Catalog must appear here.

---

## 3. Interaction Patterns `[requires §2]`

### 3.1 State Catalog (Per Component Class)

*For every interactive component class, specify all states. Author one heading per component-state combination (e.g., `### UXD-UN-button-primary-hover: Primary Button Hover State`). States: default, hover, focus (keyboard), focus-visible, active, disabled, loading, empty, error, success.*

*Required fields per state:*
- *Visual spec (referencing §2.1, §2.2, §2.3 tokens)*
- *Transition between states (timing function, duration)*

> **Stop & Verify before continuing past §3.1.** Confirm:
> - Every interactive component class has all 10 standard states declared (or marked NA per state)
> - Every state has IDs assigned (`UXD-UN-component-state`)
> - Transition timing/curve specified for each state

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

## 5. Accessibility-As-Delight `[requires TRD §3.5 + TQVCD §6.4]`

*WCAG 2.1 AA compliance is hardwired (declared in PRD §6.4 and gated by TQVCD). This section specifies the BEYOND-compliance accessibility quality. Per Track 8 (Accessibility Tooling) outputs, this is the design-layer of the 6-layer accessibility hardwiring chain.*

### 5.1 ARIA Label Quality Criteria

*State the criteria for "well-written" ARIA labels in this product. Examples: action verbs not nouns; describe outcome not mechanism; consistent vocabulary across the product; never abbreviated; reference content state when relevant ("Open menu" → "Open menu, currently closed" if state matters).*

### 5.2 Keyboard Navigation Quality Criteria

*State the criteria for keyboard nav beyond "all interactive elements are reachable by Tab." Examples: focus order matches visual reading order; skip-to-main-content link present and styled; focus-visible always rendered (never `outline: none` without a replacement); shortcuts documented; modal dialogs trap focus; Escape always exits the smallest relevant scope.*

### 5.3 Screen Reader Experience Criteria

*State the criteria for the screen-reader experience. Examples: page landmarks present (header / nav / main / footer); decorative images marked decorative; live regions used for asynchronous status updates; reading order matches visual order; tables have headers; forms have labels; errors are announced.*

### 5.4 Motion + Sensory Preferences

*State the policy for `prefers-reduced-motion`, `prefers-color-scheme`, `prefers-contrast`, and any other sensory preferences. Each preference: how is it detected, what changes when it's on, how is it tested.*

> **Stop & Verify before continuing past §5.** Confirm:
> - Each criterion is observable (testable) not aspirational ("ARIA labels are well-written" → "ARIA labels follow rules X, Y, Z")
> - Cross-references to TRD §3.5 + TQVCD §6.4 accessibility exit criteria are consistent
> - Track 8 (accessibility tooling) outputs are reflected here

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

---

## 8. Reference Design Assets `[requires §1, §2]`

### 8.1 Asset Inventory

*List the reference design assets shipped with this UXD. Assets MUST include: screenshots of reference apps (§1.1), color palette swatches with hex values (§2.1), typographic scale specimens (§2.2), spacing system grid visual (§2.3), and at least one mockup or wireframe of the primary screen of this product.*

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

*Note: UXD §3.2 catastrophic state changes are particularly amendment-sensitive — they tie to TQVCD §2.2 stress categories which gate production-readiness. Any post-Phase-A amendment changing a catastrophic state MUST trigger reliability-chain re-audit per Phase B discipline.*

---

## 9. Stakeholder Approvals `[requires every other section]`

*Who has approved this UXD? Without documented approval, Stage 00 should not begin. Visual design approval is a load-bearing decision; treat the approver as a design stakeholder, not just a project owner.*

*Required format per stakeholder:*
- *Stakeholder name and role*
- *Approval date*
- *Approval notes (any conditions or flags, especially around design-system source-of-truth)*

---

## 10. Open Questions `[independent]`

*What design decisions are not yet made? Author one heading per question (`### UXD-OQ-01: Dark Mode Timing — Now Or Later?`). UXD open questions often include: dark-mode timing; animation library choice; icon library choice; design-system source-of-truth (this UXD or an external system?).*

---

## Validation Checklist (Pre-Stage-00)

Before invoking `/dare-to-rise-code-plan`, verify:

- [ ] All required sections completed
- [ ] NA sections have one-line justifications
- [ ] Heading-prefix IDs assigned to all components / states / anti-patterns / polish criteria / design tokens / aesthetic anchors
- [ ] At least 2 reference apps named with screenshots (§1.1)
- [ ] Brand voice expressed as 5+ concrete visual decisions, not adjectives (§1.2)
- [ ] Polish criteria are observable tests, not adjectives (§1.3)
- [ ] Color palette has semantic role names AND hex values AND contrast ratios (§2.1)
- [ ] Typographic scale has rationale (§2.2)
- [ ] State catalog covers all 10 standard states for every interactive component class (§3.1)
- [ ] Empty / loading / error / success / **catastrophic** states specified for every screen-or-surface (§3.2) OR NA-with-justification matching TQVCD §2.2
- [ ] §3.4 catastrophic failure voice declared (3-5 concrete rules)
- [ ] Accessibility-as-delight criteria are concrete (Sections 5.1 - 5.4)
- [ ] §6.5 locale-specific visual treatment present if Q10 APPLICABLE OR explicit NA-with-Q10-matching-justification
- [ ] Anti-patterns named with concrete replacements (§7)
- [ ] Reference design assets exist at the declared paths (§8.1)
- [ ] Inline validation hooks acknowledged at §1.1, §1.2, §2.1, §3.1, §5, §6.5
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
- **Stage 00 Track 7 (Design System Tooling For The Stack):** scopes against §2 visual design system; tooling lands in TRD §6.7
- **Stage 00 Track 8 (Accessibility Tooling For The 6-Layer Chain):** lands its outputs into §5 accessibility-as-delight criteria; design-layer of the 6-layer chain
- **Stage 00 Track 18 (Internationalization, applicability-gated):** lands locale-specific visual outputs into §6.5
- **Stage 01b (Full Plan):** writes Deep-spec content for Stage NN+1 Design Polish referencing UXD `UC-NN` + `UN-NN` + `UD-NN` IDs
- **Stage NN+1 Design Polish:** runs `/asae` `domain=design` against UXD; iterates with `/asae` until ASAE Certainty Threshold of 3 consecutive clean cycles
- **Stage QA convergence:** reliability stress-test categories declared YES in TQVCD §2.2 must have matching catastrophic states in UXD §3.2

**Cross-doc alignment chains (Phase 02 of `/ideate-to-d2r-ready` audit):**
- **Three-way standards alignment:** TRD ↔ UXD §5 ↔ TQVCD §6.4 (accessibility), and any other standard declared in TRD that has a design-layer expression
- **i18n applicability chain:** Phase 1 Q10 ↔ PRD §6.6 ↔ TRD §3.11 ↔ TQVCD §7.6 ↔ UXD §6.5
- **Reliability ↔ Design Polish chain:** TQVCD §2.2 stress categories declared YES ↔ AVD §3.1 queue/auth/observability components ↔ UXD §3.2 catastrophic states (every TQVCD-YES stress category must have a UXD catastrophic-state on every affected surface)
- **UXD component-token alignment with AVD:** UXD §2.4 component tokens (`UC-NN`) ↔ AVD §3.1 component inventory (`AC-NN`)
