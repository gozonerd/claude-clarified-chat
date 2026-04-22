---
document_type: Build Entrypoint Prompt (Instantiated)
title: Claude Clarified Chat MVP v1.0 — Build Entrypoint
version: v01_I
created: 2026-04-22
based_on: _experiments/protocols/Hardened_Build_Entrypoint_Template_2026-04-22_v01_I.md v01_I
distribution: INTERNAL (paste into Claude Desktop Max 20 chat)
---

# Claude Clarified Chat MVP v1.0 — Build Entrypoint

## Usage

1. Open a new Claude Desktop chat on Max 20 account (authenticated to `nerdykrystal`)
2. Copy everything between the `------------- PROMPT BEGIN -------------` and `------------- PROMPT END -------------` markers below
3. Paste into the fresh chat
4. Monitor for `BUILD COMPLETE` or `BUILD HALTED`
5. Post-build: harvest via `bash helpers/harvest-thread-data.sh --worktree <path-to-worktree> --label ccc-production-v01 --transcript <session.jsonl>` (if you want to preserve it for later analysis)

------------- PROMPT BEGIN -------------

# Build Claude Clarified Chat MVP v1.0

## Step 1 — Verify or fetch inputs (do NOT skip)

Your task is to build Claude Clarified Chat MVP v1.0 per the five prerequisite planning documents. Before anything else, run this verification and setup in your terminal:

```
# Create directories
mkdir -p inputs workspace

# Fetch the 5 prerequisite planning docs from the pinned source
TMP_INPUTS=$(mktemp -d)
git clone --quiet --no-checkout https://github.com/nerdykrystal/claude-clarified-chat.git "$TMP_INPUTS/repo"
(cd "$TMP_INPUTS/repo" && git checkout --quiet 5dfef4c3f916f39210b0f629cd94d74696df48a9 -- docs/planning/)
cp "$TMP_INPUTS/repo/docs/planning/"CCC_*.md inputs/
rm -rf "$TMP_INPUTS"

# Assert exactly the expected files are present
EXPECTED="CCC_AVD_2026-04-22_v01_I.md
CCC_PRD_2026-04-22_v01_I.md
CCC_Phase1_Ideation_Summary_2026-04-22_v01_I.md
CCC_TQCD_2026-04-22_v01_I.md
CCC_TRD_2026-04-22_v01_I.md"
ACTUAL=$(ls inputs/ | sort | tr '\n' '\n')
EXPECTED_SORTED=$(echo "$EXPECTED" | sort | tr '\n' '\n')
if [[ "$ACTUAL" != "$EXPECTED_SORTED" ]]; then
  echo "inputs/ verification FAILED"
  echo "Expected: $EXPECTED_SORTED"
  echo "Actual:   $ACTUAL"
  echo ""
  echo "BUILD HALTED: inputs/ does not contain the expected 5 Claude Clarified Chat MVP v1.0 planning documents at the pinned source nerdykrystal/claude-clarified-chat@5dfef4c3f916f39210b0f629cd94d74696df48a9"
  exit 1
fi
echo "✓ inputs/ verified: 5/5 expected files present"

# Fetch the skill bundle at the pinned SHA
TMP_SKILLS=$(mktemp -d)
git clone --quiet --no-checkout https://github.com/nerdykrystal/repos.git "$TMP_SKILLS/repo"
(cd "$TMP_SKILLS/repo" && git checkout --quiet 0d79e98999d13568f8886b419379622c63886cec -- .claude/skills/)
mkdir -p .claude/skills
cp -r "$TMP_SKILLS/repo/.claude/skills/"* .claude/skills/
rm -rf "$TMP_SKILLS"
echo "✓ Skill bundle installed at 0d79e98999d13568f8886b419379622c63886cec"

# Initialize the workspace as a git repo on main
(cd workspace && git init -q -b main && git commit --allow-empty -q -m "Initial empty workspace for Claude Clarified Chat MVP v1.0")
echo "✓ workspace/ initialized as git repo on main"

# Final verification
echo "=== Verification ==="
echo "inputs/:"; ls inputs/
echo "skills/:"; ls .claude/skills/ | head -20
echo "workspace/:"; ls -la workspace/
```

**If ANY of the above failed, emit `BUILD HALTED: <specific reason>` and stop. Do NOT search for alternative inputs. Do NOT substitute other files. Do NOT proceed to Step 2 under any circumstances.**

## Step 2 — Read all 5 inputs before writing any code

The five prerequisite documents in `./inputs/` (read in this order):

1. `inputs/CCC_Phase1_Ideation_Summary_2026-04-22_v01_I.md` — context and ideation summary
2. `inputs/CCC_PRD_2026-04-22_v01_I.md` — Product Requirements
3. `inputs/CCC_TRD_2026-04-22_v01_I.md` — Technical Requirements
4. `inputs/CCC_AVD_2026-04-22_v01_I.md` — Architecture Vision
5. `inputs/CCC_TQCD_2026-04-22_v01_I.md` — Testing & Quality Criteria

Read each file end-to-end before writing any implementation code.

## Step 3 — Build Claude Clarified Chat MVP v1.0

Build the application as specified in the documents. The build must satisfy every acceptance criterion in `inputs/CCC_TQCD_2026-04-22_v01_I.md`.

Produce working software committed to `./workspace/` on branch `main`.

## Step 4 — Required discipline (non-negotiable)

- **Commit everything to ./workspace/ on main.** Incremental commits as you work are encouraged; a final commit is acceptable.
- **Use branded terminology throughout.** Folder names, filenames, commit messages, log messages, test names, identifier names, inline comments — all branded. No acronym expansions (never write "ai-self-audit-edit", "self-audit-edit", "self-audit-log", or similar). No methodology paraphrase. No references to internal concepts.
- **If you substitute any framework, tool, library, or input for any reason, you MUST state the deviation, the reason, and the substitution explicitly in your response.** Silent substitution is a protocol breach. Use the format: `DEVIATION: <what you substituted> for <what was specified>, because <reason>.` This text must appear in your final output before BUILD COMPLETE.
- **If any dependency, tool, or input is missing or unavailable, emit `BUILD HALTED: <specific reason>`.** Do not substitute alternatives silently.
- **Respect the pinned skill bundle.** Skills in `./.claude/skills/` are at a specific commit; do not upgrade, modify, or replace them.
- **Invoke `/dare-to-rise-code-plan`** as your first action after reading the 5 inputs. Produce the structured plan BEFORE writing any implementation code. The plan document goes to `./workspace/docs/d2r-plan.md` (or wherever TRD/AVD specify).
- **Invoke `/asae`** at every D2R stage boundary: after Stage 01a (skeleton plan), after Stage 01b (full plan), after Stage 02 (scaffold), after each Stage 03+ feature group, and before BUILD COMPLETE. Use domain=`document` for plan audits and domain=`code` for code audits. Severity policy: strict. Threshold: 2 for stage gates, 3 for the final pre-BUILD-COMPLETE gate. If ASAE fails to converge at any gate, emit `BUILD HALTED: ASAE non-convergence at <stage>`.

## Step 5 — IP-clean verification (automatic, before BUILD COMPLETE)

Before emitting BUILD COMPLETE, run this in your terminal:

```
grep -riE "self.audit.edit|ai.self.audit|audit.edit.loop|stahl.systems|\\bPUMS\\b" ./workspace/ --exclude-dir=node_modules --exclude-dir=.git 2>&1 | head -20
```

**If grep returns ANY matches, emit `BUILD HALTED: IP-clean verification failed — workspace contains methodology-revealing terms` and stop.** Do not attempt to fix by deletion — diagnose WHERE the leakage came from (a template, a library, something else) and halt with that diagnosis.

Also verify commit messages:

```
(cd workspace && git log --all --format=%B | grep -iE "self.audit.edit|ai.self.audit|stahl" > /tmp/commit-ip-check.txt && \
  if [ -s /tmp/commit-ip-check.txt ]; then echo "IP-CLEAN FAILURE in commit messages"; cat /tmp/commit-ip-check.txt; else echo "✓ commit messages IP-clean"; fi)
```

If commit messages contain expansions, use `git commit --amend` (for the last commit) or squash the history into one clean commit before BUILD COMPLETE.

## Step 6 — Emit sentinel

When the build is complete, every acceptance criterion in `inputs/CCC_TQCD_2026-04-22_v01_I.md` is satisfied (tests pass, build succeeds, quality metrics meet thresholds, accessibility clean, IP-clean verification passes), and all D2R + ASAE gates have converged, emit exactly:

```
BUILD COMPLETE
```

If at any point you cannot proceed, emit:

```
BUILD HALTED: <one-line specific reason>
```

Do NOT emit BUILD COMPLETE unless every criterion is objectively satisfied.

------------- PROMPT END -------------

## Post-Build Checklist (for Krystal after BUILD COMPLETE)

- [ ] Inspect the workspace — verify Claude Clarified Chat MVP v1.0 is functionally correct
- [ ] Review the D2R plan document and ASAE audit logs (should be committed into workspace/)
- [ ] Verify commits on `main` in workspace/ look clean
- [ ] Run IP-clean grep manually as a second check
- [ ] Optional: harvest the thread data via `harvest-thread-data.sh` for the variance-study records
- [ ] Optional: push the built workspace to `nerdykrystal/claude-clarified-chat` as a dedicated branch or merge to master
- [ ] Optional: run the Pre-Publication IP Scrub Checklist if making the repo public

## Known Risks

Per 2026-04-22 variance findings (F6): even when the skill bundle is present, Opus may opt to build directly without invoking `/dare-to-rise-code-plan` or `/asae` as skill calls. The Step 4 explicit-invocation clauses are the enforcement mechanism. If the thread ignores them and builds directly anyway, that is a protocol breach worth noting in a post-hoc review — but if the output build is functionally correct, it's still a usable artifact (just not a clean factorial data point).

Per F5: ambient contamination from the Claude Desktop auto-worktree's parent repo contents remains possible. Step 1's verification step forces the thread to focus on `./inputs/` as the authoritative source, mitigating this.
