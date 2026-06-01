# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)
1. **[2026-06-01] Keep edits focused and minimal**
   Do instead: apply the smallest change that satisfies the request and verify impacted UI.

## Shell & Command Reliability
1. **[2026-06-01] Prefer editor tools over shell for file ops**
   Do instead: use workspace tools (read_file/apply_patch) before terminal commands.

## Domain Behavior Guardrails
1. **[2026-06-01] Respect existing UX animation behavior**
   Do instead: adjust animation logic incrementally and validate in the target browser.

## User Directives
1. **[2026-06-01] Implement step-by-step only**
   Do instead: ask for required inputs before proceeding to the next change.
2. **[2026-06-01] Suggest a commit message after changes**
   Do instead: include a short commit suggestion in responses that modify code.
