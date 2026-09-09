# SignalVerse AI Log

A private, GitHub-based reporting channel between ChatGPT (planning/supervision) and Claude Code (local implementation/investigation) for the SignalVerse project. This repository is **reports only** - it is not a code repository, not an MCP server, and not part of AI-Bridge or either SignalVerse repository.

## Why this exists

ChatGPT (on the account's current plan) cannot connect directly to the local AI-Bridge/MCP server running on this machine. Instead of manual copy/paste of full outputs back and forth, this repository gives Claude Code a place to write structured, permanent, evidence-based reports that ChatGPT can read directly from GitHub.

## Workflow

```
ChatGPT (planning, research, supervision)
    ↓
User manually copies only the task/prompt to Claude Code
    ↓
Claude Code performs the repository analysis / implementation / testing
    ↓
Claude Code writes a structured report to this repository and pushes it
    ↓
User tells ChatGPT: "Read the latest report"
    ↓
ChatGPT reads the report directly from GitHub and continues supervision
```

The user is the only link between ChatGPT and Claude Code - this repository does not automate that handoff, it only makes the Claude Code → ChatGPT direction reliable, structured, and permanent instead of relying on copy/pasted chat output.

## What belongs here

- Claude Code work reports (implementation, investigation, audit, bug reports)
- Architecture findings
- Test results
- Decisions
- Project status snapshots

## What must never be committed here

- SignalVerse source code
- API keys, tokens, passwords, private keys
- `.env` files or any file containing credentials
- Database dumps
- `node_modules/` or build artifacts

If a report needs to reference a secret-shaped value as evidence, redact it, e.g. `sk-proj-xxxxxxxx...REDACTED`. See "Secret scanning" below - this is a required step before every commit, not optional.

## Structure

```
SignalVerse-AI-Log/
  README.md
  reports/
    futures/
    spot/
    prediction/
    exchange/
    infrastructure/
    security/
    general/
  decisions/
  project-status/
  templates/
    report-template.md
    decision-template.md
    project-status-template.md
  scripts/
    new-report.mjs      helper to create a new report from the template
    scan-secrets.mjs     helper to scan a file for obvious secret patterns
```

## Creating a new report

Use the template directly, or the helper script (plain Node, no dependencies):

```bash
node scripts/new-report.mjs <module> <short-description>
# example:
node scripts/new-report.mjs futures binance-order-audit
```

This creates `reports/<module>/YYYY-MM-DD-HHMM-<module>-<short-description>.md` (local system time) from `templates/report-template.md`, with the Date/Module fields pre-filled, under the matching `reports/` subfolder (falls back to `reports/general/` if `<module>` isn't one of the known categories).

Decisions and project-status snapshots use `templates/decision-template.md` and `templates/project-status-template.md` directly - copy them into `decisions/` or `project-status/` with a similarly dated filename.

## Truthfulness rule

Reports must never claim "verified," "confirmed," "tested," or "working" unless that action was actually performed. Every report must distinguish what was actually executed, what was inspected only, what was inferred, and what was not tested. Failed tests and errors must be reported, not summarized away.

## Git workflow

1. Create the report file (from the template or the helper script).
2. Review it for secrets - see "Secret scanning" below.
3. `git add` only the intended report file(s) - never a broad `git add -A`.
4. `git diff --cached` - read the actual diff before committing.
5. `git commit` with a clear message, e.g. `report(futures): add Binance execution audit`.
6. `git push`.

Do not force-push. Do not rewrite history. Do not delete previous reports - they are permanent historical records.

## Secret scanning

Before every commit, scan the report content for obvious secrets and credentials (API keys, passwords, tokens, private keys, database URLs with embedded credentials, Telegram bot tokens, exchange credentials). A lightweight helper is provided:

```bash
node scripts/scan-secrets.mjs <file-or-directory>
```

This is a pattern-based best-effort check, not a guarantee - always also read the diff yourself before pushing.
