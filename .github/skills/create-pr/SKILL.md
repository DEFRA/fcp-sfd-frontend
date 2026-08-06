---
name: create-pr
description: Analyse the current git branch, commits, and diff to generate a branch name, PR title, and PR description, then create the branch, commit, and open a draft PR. Use when asked to create a PR, open a pull request, or prepare a branch for review.
argument-hint: [FLS2-ticket] [jira-url]
context: fork
---

# Generate GitHub PR metadata and create PR

Analyse the current git branch, commits, and diff to produce a branch name, PR title, and PR description — then create the branch, commit, and open the PR.

## Prerequisites (first-time setup)

The optional Jira ticket feature needs three values. The API token is a secret and lives in the macOS Keychain; the other two are not secret.

- **`JIRA_TOKEN`** — read from Keychain at runtime, never stored in the repo:
  ```bash
  JIRA_TOKEN=$(security find-generic-password -a "$USER" -s jira-api-token -w)
  ```
  One-time add (generate a token at https://id.atlassian.com/manage-profile/security/api-tokens):
  ```bash
  security add-generic-password -a "$USER" -s jira-api-token -w '<your-token>' -U
  ```
- **`JIRA_BASE_URL`** — defaults to `https://eaflood.atlassian.net`.
- **`JIRA_EMAIL`** — your Defra email. Set it in your personal user instructions rather than here, since this skill is shared.

Before any Jira call, fail loudly if the token is missing:
```bash
: "${JIRA_TOKEN:?JIRA_TOKEN not set — run: security add-generic-password -a \$USER -s jira-api-token -w '<token>' -U}"
```
Never commit credentials to the repo.

## Step 1: Gather git context

Run these before generating anything:

- `git log --oneline -10` — check recent commit message style
- `git status` — see what's staged/changed
- `git diff --stat HEAD` — understand scope of changes
- `git log --oneline main..HEAD` — commits on this branch vs main

If an open PR already exists for the branch, note its title/body for alignment.

## Step 2: Detect Jira ticket

Look for ticket patterns in branch name, commits, or $ARGUMENTS:

- Patterns: `FLS2-123`, `fls2-123`, `FLS2_123`, branch segments like `fls2-639-...`
- $ARGUMENTS may contain a ticket ID and/or URL, e.g. `"FLS2-1006 https://eaflood.atlassian.net/browse/FLS2-1006"`

**If no ticket detected — stop and ask once:**
> "Do you have a Jira ticket for this work? Adding one improves traceability and naming consistency."

- If user says no ticket → use non-ticket branch/title rules below
- If user provides one → use ticket-prefixed rules and include Jira link in description

## Step 2b: Create Jira ticket (if none detected and user wants one)

If the user says they don't have a ticket but would like one created, create it via the Jira REST API:

- Uses: `$JIRA_EMAIL`, `$JIRA_TOKEN` (from Keychain), `$JIRA_BASE_URL`
- Project key: FLS2
- Issue type: inferred from change classification (Task for refactors/chores, Story for features, Bug for fixes)
- Summary: derived from the PR title
- Description: ADF-formatted summary of changes + link to PR once created

**Auth:** Basic auth with base64-encoded `"$JIRA_EMAIL:$JIRA_TOKEN"`
**Endpoint:** `POST $JIRA_BASE_URL/rest/api/3/issue`

```bash
curl -s -X POST "$JIRA_BASE_URL/rest/api/3/issue" \
  -H "Authorization: Basic $(printf '%s' "$JIRA_EMAIL:$JIRA_TOKEN" | base64 | tr -d '\n')" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "project": { "key": "FLS2" },
      "summary": "<ticket title>",
      "description": { "type": "doc", "version": 1, "content": [] },
      "issuetype": { "name": "<Task|Story|Bug>" }
    }
  }'
```

After creation, use the returned ticket key (e.g. FLS2-42) to prefix the branch name and PR title as normal.

## Step 3: Classify the change

Infer from diff and commits:

- Type: feature | bug fix | refactor | chore | config/dev-env | test-only | data-only
- Scope: very small | medium | large/architectural
- Refactor vs behaviour change; config-only vs app logic; dependency upgrades; breaking vs non-breaking

## Step 4: Generate branch name, title, description

### Branch naming

**With ticket:**
- Format: `fls2-<ticket-number>-<short-kebab-description>`
- Example: `fls2-1006-disable-redis-ready-check`
- Lowercase, kebab-case, concise, reflects intent not implementation trivia

**Without ticket:**
- `<type>/<short-description>` e.g. `refactor/update-address-change-service`
- or `fls2-<short-description>` e.g. `fls2-update-docker-compose-config`

### PR title

**With ticket:**
- Format: `FLS2-<ticket>: <Clear Action Statement>`
- Example: `FLS2-1006: Disable Redis Ready Check`

**Without ticket:**
- Concise human-readable title, no ticket prefix
- Example: `Fix 500 Error on Re-login After Interruptor Journey`

### PR description (GitHub Markdown)

**Tone:** professional, concise, engineering-focused — explain **why** and **what**, not file-by-file narration.

**When ticket exists** — put the Jira URL at the very top (before any section):
```
https://eaflood.atlassian.net/browse/FLS2-<ticket>
```

**Required sections (always):**
- `## Summary` — include the **why** here: what problem this solves, what was happening before, and why the approach was chosen. Do not use a separate `## Problem` section; fold all context into Summary.
- `## Changes` (bullet list)

**Optional sections** — add only when they add value:
- `## Behaviour` — user-visible or system behaviour changes
- `## Testing` — what was run or how to verify
- `## Notes` — rollout, follow-ups, risk

**Size guidance:**

| Size | Approach |
|------|----------|
| Very small | Short summary paragraph (with why) + tight bullet list; note if data-only / test-only / no functional change |
| Medium | Summary paragraph + structured `## Changes` bullets |
| Large / architectural | Summary + Changes + Behaviour + Testing where applicable |

## Step 5: Confirm before writing to the remote

Before touching origin or opening a PR, **stop and show the user** the generated branch name, commit message, PR title, and PR description body. Ask for explicit confirmation to proceed. Do not run the push or `gh pr create` until the user approves.

## Step 6: Create branch, commit, and open PR (after confirmation)

1. Create and switch to the generated branch name
2. Stage and commit changes with message: `<Description>` (title-cased, no ticket prefix — ever)
3. Push branch to origin with `-u`
4. Run `gh pr create --draft --assignee @me` with the generated title and description body. `@me` assigns the PR to whoever runs the skill.

## Rules

- If no changes are staged, ask what to include before proceeding
- Scale PR description detail to PR size; avoid marketing language
- Prefer intent and impact over listing every changed path
