---
name: sync-profiles
description: Use when the user asks to sync, update or check LinkedIn, X, GitHub or other outside profiles against the profile facts in Sanity (headline, summary, roles, education, skills). Manual only.
disable-model-invocation: true
---

# Sync profiles

Run this only when the user asks for it. It edits accounts that other people see.

Sanity is the source. Outside profiles copy from it. When the user says an outside profile has the correct fact, update Sanity too, so the fact stays in one place.

These steps work with any agent and any browser tool. Where a step names a tool, use the matching tool in your setup (see [Browser tools](#browser-tools)).

## 1. Read the source

The dataset is public, so a read needs no token:

```bash
Q='{
  "profile": *[_id=="profile"][0]{name, headline, location, summary, email, scheduleUrl, socialLinks},
  "experience": *[_type=="experience"]|order(orderRank){_id, role, "org": organization->name, startDate, endDate, workMode, highlights},
  "education": *[_type=="education"]|order(orderRank){_id, "school": organization->name, degree, field, startDate, endDate},
  "skills": *[_type=="skillGroup"]|order(orderRank){name, skills}
}'
curl -s -G "https://lboasusv.apicdn.sanity.io/v2026-11-01/data/query/production" --data-urlencode "query=$Q"
```

Dates are `partialDate` strings (`2025`, `2025-12`). A missing `endDate` means the role is current. Field names come from `packages/sanity/src/schema`. If a field comes back `null` for every document, check the schema before you trust the result.

## 2. Compare, then ask

Read the outside profile first. Show the user a table: section, what the profile shows now, what it will show. Ask before you change anything. These conflicts need the user's answer:

- **Dates.** Sanity often has only a year. Keep the outside profile's month when the year matches. When the years differ, ask which is correct.
- **Text that is only on the outside profile**, such as an extra bullet or an old role. Ask whether to drop it or keep it.
- **Facts that Sanity does not have.** Leave them unless the user says otherwise.

## 3. LinkedIn

LinkedIn has no API for personal profile edits. Edit it in a browser session that the user can watch.

### Session

- The browser must be signed in to the user's account. If it is not, open `https://www.linkedin.com/login`, show the page to the user, and ask them to sign in. Never type their password or 2FA code.
- A browser that the agent cannot reach does not count. This includes a tab in the user's desktop app that your tools cannot list. Say so, and open a tab that you can control.
- In the user's own browser (for example, a Chrome extension), work in a new tab. Leave their other tabs alone.
- Some tools give tab control back to the user at the end of each turn. If an action fails with an ownership error, open a new tab of your own instead of retrying.
- Work at a person's pace. Wait 1–4 seconds after a page load, make one edit at a time, and read each saved value back from the page.

### Where things are

| Section   | How to open                                                                                        |
| --------- | -------------------------------------------------------------------------------------------------- |
| Read all  | `/in/<handle>/`, `/details/experience/`, `/details/education/`, `/details/skills/`                 |
| Headline  | `/in/<handle>/edit/intro/` (the field is `div[contenteditable][aria-label="Headline"]`, 220 chars) |
| About     | `/in/<handle>/edit/forms/summary/new/` (2,600 chars)                                               |
| A role    | the "Edit … at …" link on `/details/experience/`, which goes to `…/experience/edit/forms/<id>/`    |
| New role  | the "Add a position or career break" button, then "Add role"                                       |
| Education | the "Add education" link on `/details/education/`                                                  |
| Skill     | the "Add a skill" link on `/details/skills/`. Opening its URL directly does not open the form.     |

The handle is the last part of the LinkedIn link in `profile.socialLinks`. LinkedIn changes its markup often. If a selector here finds nothing, read the page and find the field by its label.

### Form rules

- Text fields are `contenteditable` divs. A role's bullets are in `div[contenteditable][aria-label^="Highlights"]`. Click the field, press Ctrl+A, then type. Press Enter between bullets and start each bullet with `- `.
- Buttons have generated class names, so you cannot select them by class. Run JavaScript in the page to find the button by its text, and give it a `data-pick` attribute. Then click `[data-pick="…"]` with the browser's own click action, which sends real pointer events. Do the same for typeahead options (`[role=option]`): choose the exact match.
- `[role=dialog]` also matches hidden video player dialogs. Skip elements whose class contains `vjs`.
- Before every save, check these settings:
  - "Notify network" is off.
  - Each "End current position as of now – …" box is clear, unless the user wants that role ended.
- After a save, LinkedIn shows a prompt, such as share, Premium or "people you may know". Navigate away, and do not share.

### Known traps

- **A new current role replaces the headline.** After you add a role, open the intro form and set the headline again.
- **Skill names differ from ours.** Use "Cascading Style Sheets (CSS)", "Electron.js" and "Figma (Software)". LinkedIn has no skill for Bun, so skip it. Link a skill to a role only when that role's Sanity text names it.
- **The "add another skill" prompt blocks clicks.** After each skill, reload `/details/skills/` and click "Add a skill" again.
- **The skills list hides older skills** behind "Show more". Click it before you check that a skill exists.
- **"Open to work" did not open** in an automated browser (T3 preview, 2026-11). Give the user the values to set themselves.

## 4. Write facts back to Sanity

Do one of these:

- **Sanity MCP:** `patch_documents` (this makes a draft), then `publish_documents`. Use project `lboasusv` and dataset `production`.
- **Studio:** give the user the document, field and new value to change by hand (`bun run --filter studio dev`, or the deployed Studio).

Publishing starts a site deploy (see `docs/deploy.md`). For a change across many documents, follow the migration rules in AGENTS.md instead.

## Browser tools

Every step above uses six actions. This table names them in the setups that ran this skill or that it was written for. In any other tool, use the action that does the same thing.

| Action        | T3 preview                                   | Playwright MCP                  |
| ------------- | -------------------------------------------- | ------------------------------- |
| Open a tab    | `preview_open` (`reuseExistingTab: false`)   | `browser_tabs` (new)            |
| Go to a URL   | `preview_navigate`                           | `browser_navigate`              |
| Read the page | `preview_snapshot`, or JS with `innerText`   | `browser_snapshot`              |
| Run JS        | `preview_evaluate`                           | `browser_evaluate`              |
| Click, type   | `preview_act` with `selector`, `clear: true` | `browser_click`, `browser_type` |
| Press a key   | `preview_act` with `action: "press"`         | `browser_press_key`             |

Claude in Chrome, agent-browser and similar tools have the same six actions under other names. Load that tool's own skill or instructions before the first step.

## Other profiles

These platforms have APIs for a script or a later tool:

| Platform | How                                                                      |
| -------- | ------------------------------------------------------------------------ |
| GitHub   | `gh api -X PATCH /user -f bio=… -f blog=… -f location=…` (bio 160 chars) |
| Bluesky  | `putRecord` on `app.bsky.actor.profile` with an app password (256 chars) |
| Mastodon | `PATCH /api/v1/accounts/update_credentials` (500 chars, 4 link fields)   |
| npm      | `npm profile set fullname …`                                             |

X, Hacker News, DEV, Medium, Docker Hub and Steam need manual edits. Give the user the text and its character count.
