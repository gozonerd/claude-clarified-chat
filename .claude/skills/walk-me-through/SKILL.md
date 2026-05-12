---
name: walk-me-through
description: "Use this skill when Krystal asks to understand research findings, data, assessments, or any complex body of information she hasn't fully processed yet. Triggers on: 'walk me through', 'walk me through the findings', 'walk me through the research', 'go over the results with me', 'tell me what they say', 'explain the findings', or when Krystal signals she wants to engage with information conversationally rather than reading a wall of text. Do NOT use for explaining concepts or tools (use walk-me-through for research findings; use the existing explanation patterns for concepts)."
---

# Walk Me Through

## Purpose

Present complex research findings, assessment results, or data to Krystal in a conversational, bite-sized format that respects her cognitive load constraints (ADHD, migraine sensitivity, vision limitations) while maximizing her critical engagement with the material.

## Execution Order

This skill has three phases executed in strict sequence:

1. **Phase 1: Claim Extraction** — Extract, concatenate, and deduplicate all claims from the source material
2. **Phase 2: Audit Loop** — Run asae loops until 5 consecutive null-edit passes confirm the claims list is accurate
3. **Phase 3: Conversational Walkthrough** — Present verified claims to Krystal one at a time using the walkthrough pattern

Do NOT skip to Phase 3. Phases 1 and 2 ensure Krystal receives verified, deduplicated findings — not raw AI summaries with hallucinated or duplicated claims.

---

## Phase 1: Claim Extraction

### Step 1: Read All Sources

Read every source document, research output, assessment, or dataset that will be walked through. Do not summarize from memory — read every source in full.

### Step 2: Extract Claims

For each source, extract every discrete claim — factual assertions, findings, statistics, conclusions, recommendations, and judgments. A "claim" is any statement that asserts something is true or measured.

### Step 3: Concatenate

Merge all extracted claims into a single flat list.

### Step 4: Deduplicate

Remove duplicate claims. When two sources make the same claim with different wording, keep the more precise or vivid version. When they make the same claim with different numbers, keep both and flag the discrepancy.

### Output

A numbered list of unique claims, each traceable to its source. This is the **claims list** — the input for Phase 2.

---

## Phase 2: Audit Loop

Run the `asae` loop pattern against the claims list, with one modification: **the exit condition is 5 consecutive null-edit full audit passes, not 1.**

### Each Audit Pass

Re-read the original source material. Compare every claim in the claims list against what the source actually says. Check for:
- Factual errors (claim says X, source says Y)
- Misattributions (claim attributed to wrong source)
- Omitted claims (source contains a finding not in the claims list)
- Inflated or deflated claims (numbers rounded wrong, hedging removed, certainty added)
- Duplicates that survived Phase 1

If errors are found: apply edits, log them, loop back. If zero errors are found: that is one null-edit pass.

### Exit Condition

**5 consecutive full audit passes with zero edits.** Not 5 partial audits. Not 5 audits checking different things. The same comprehensive audit, run 5 times in a row, each confirming zero errors.

### On Exit

Report to Krystal:
- Total audit loops run
- Total edits applied across all loops
- The loop at which the first null-edit pass occurred
- Confirmation: "5 consecutive null-edit passes achieved — claims list verified"

The verified claims list is now the input for Phase 3.

---

## Phase 3: Conversational Walkthrough

### 1. One Finding at a Time

Present exactly ONE finding per message. Not two. Not a summary followed by details. One finding, stated in plain language, with the market's or assessors' actual vocabulary included.

### 2. Plain Language First, Technical Detail on Request

Lead with what the finding MEANS, not what it IS. "Every assessor said hire" before "the composite calibration scores ranged from 7.5 to 9.5." Krystal will ask for the technical detail if she wants it.

### 3. Wait for Reaction

After presenting the finding, stop. Do not proceed to the next finding. Do not suggest moving on. Do not ask "ready for the next one?" — that's FM-30 (Premature Topic Closure). Krystal will react, ask questions, connect to her own work, or tell you to continue.

### 4. Let Reactions Shape Sequence

Krystal's reaction to Finding 1 determines what Finding 2 should be. If she lights up about reliability, go deeper on reliability before moving to costs. If she pushes back, address the pushback before introducing new material. The walkthrough is a conversation, not a presentation.

### 5. Connect to Her Work ONLY When She Does First

Do not preemptively say "and this maps to your DPO because..." Wait for Krystal to make the connection. She often sees connections the AI misses. If she connects a finding to her teaching or her VA work or her organizing, follow HER connection — don't redirect to the AI work.

### 6. No Walls of Text

If a finding requires more than 6-8 lines to present, it needs to be split into sub-findings presented sequentially. Large tables, long lists, and multi-paragraph explanations are walls of text. Break them up.

### 7. Use the Actual Language

When the research or assessors used specific phrases, include them. "Pilot purgatory" is more vivid than "projects that fail to reach production." "Margin erosion" is more concrete than "rising costs." The actual vocabulary gives Krystal material to riff off of for portfolio copy.

### 8. Flag Disagreements Explicitly

When sources disagree, say so clearly: "6 of 8 said STRONG, 2 said MODERATE — and here's why they disagreed." Do not smooth over disagreements into a false consensus.

### 9. Capture Riffs in Real Time

When Krystal riffs on a finding — generates copy ideas, connects to worked examples, has a reaction worth preserving — capture it immediately. Flag it as captured. Do not let riffs disappear into the conversation without being documented.

### 10. Never Summarize Prematurely

Do not offer a "so in summary" before all findings have been walked through. Do not compress the conversation into bullet points mid-walkthrough. Krystal will tell you when she's ready for a summary — or she won't want one at all.

## Anti-Patterns

- Presenting all findings at once in a numbered list
- Saying "ready for the next finding?" or "shall we move on?"
- Pre-connecting findings to Krystal's work before she does
- Smoothing over disagreements between sources
- Offering a summary before being asked
- Treating the walkthrough as a presentation with a fixed sequence
- Ignoring Krystal's reactions to maintain your planned order
- Using generic language when the sources used vivid specific terms

## When to Exit

Krystal signals she's done. This might be "that's enough for now," "let's move on to [other topic]," or simply engaging with something else. Never suggest exiting the walkthrough.
