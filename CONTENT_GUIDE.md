# Content guide

This is the spec for generating new shorts — followed by hand this whole session,
now the source of truth for every new batch. Read this before drafting anything.

## Pipeline

Run `/generate-batch` in Claude Code from this repo whenever you want a new
batch (there's also a 6am macOS notification reminding you, but it's not
automatic — you run it yourself so you can review before anything renders).
A single run does:

1. Read `src/content/history.json` — don't repeat a topic/category that's appeared
   in the last ~7 days.
2. Draft 5–10 entries into `src/content/queue.json` (this file is **rotated
   per batch** — overwrite it with the new batch, don't accumulate old entries in it).
3. Self-review every entry for **technical accuracy** (see below) and only then
   set `"accuracyReviewed": true` on it — this is a judgment step the validator
   can't do for you, but it gates on the flag being present.
4. Run `npm run validate` — **this is a hard gate, not advisory.** It checks
   structure, that every entry has `accuracyReviewed: true`, that every question
   ends in an emoji, and that the estimated rendered layout fits the frame
   (see Visual conventions). Fix every error it reports before moving on —
   don't render or commit anything that fails it.
5. Append the batch's entries to `src/content/history.json` (permanent, append-only).
6. Stop and let you review the drafted questions before rendering anything.

Once you're happy with the batch, run `npm run render:all` yourself →
renders each entry to `out/<date>/<id>.mp4` for you to pick a favorite from.

## Schema

See `src/content/types.ts`. One JSON object per short:

```json
{
  "id": "kebab-case-slug",
  "category": "DOCKER",
  "icon": "Layers",
  "question": ["One line changes.", "Everything re-downloads. Why? 🐳"],
  "codeSnippet": ["COPY . .", "RUN npm install"],
  "answers": ["...", "...", "...", "..."],
  "correctIndex": 0,
  "explanation": ["...", "...", "..."],
  "accuracyReviewed": true
}
```

`icon` must be one of the names in `src/content/icons.ts`. Adding a new category
means adding its icon there and to the `IconName` union in `types.ts` first.

`accuracyReviewed` must be `true` and only set after you've actually done the
accuracy review below — `npm run validate` fails any entry missing it.

## Brevity (the single most-corrected thing this session)

- **Question**: 1–2 short lines, ~10–12 words max. Cut connective tissue
  ("you accidentally ran...") down to the bare scenario + "Why?". A category
  pill already gives context — don't repeat it in the question text. **The
  last line must end with an emoji** that hints at the topic (🐳 Docker, 🔁
  repeat/duplicate, 🕘 timing, 📉 a metric dropping, etc.) — the validator
  rejects a question with no emoji.
- **Every question line must be as compact as possible and MUST be
  visually verified before finalizing — this is not optional.** Each entry in
  the `question` array renders as one forced line break; if that entry's text
  is too wide for the frame, the browser wraps it *again* mid-entry, which
  usually orphans one short word onto its own line (e.g.
  `"Listing 100 users fires 101"` → `"Listing 100 users fires" / "101"`).
  That's the single most common visual bug in this project's history — it
  has happened repeatedly. `npm run validate` only gives a soft, unreliable
  character-count *warning* on this (see the comment in
  `scripts/validate-content.js` — wrapping depends on actual word widths, not
  character count, so the heuristic has both false positives and false
  negatives and cannot be trusted on its own). The only real check is:
  1. Render the entry: `npx remotion render src/index.ts <id> /tmp/check.mp4`
  2. Grab a frame: `ffmpeg -y -ss 2 -i /tmp/check.mp4 -frames:v 1 /tmp/check.png`
  3. Look at the image (Read tool). Confirm the question is exactly as many
     lines as the `question` array has entries — zero extra wraps, zero
     orphaned words.
  4. If it wraps, shorten that line or rephrase it — don't just shave one
     character at a time, meaningfully cut words. Re-render and re-check
     until it's clean.

  Do this for every new/changed question before considering a batch done,
  not just the ones the soft warning flags.
- **Answers**: exactly 4, each ~4–6 words. All four should read as similarly
  short — if the correct one is visibly longer than the distractors, shorten it.
  The validator warns if answer lengths spread by more than 25 characters.
- **Explanation**: 2–4 short lines. State the mechanism, not a tutorial.

## Answer design

- Exactly 4 options, `correctIndex` 0–3.
- **Vary the correct answer's position across the batch.** Don't default to
  always-last — if every short has the same answer in the same slot, repeat
  viewers learn to guess the slot instead of thinking. Mix it up.
- Distractors must be *plausible* (a real near-miss a junior engineer might
  pick) but clearly wrong once you read the explanation. Avoid filler options
  that nobody would seriously consider.

## Accuracy bar — mandatory, not a nice-to-have

This is the single most important rule in this file. A short with a slick
animation and a wrong explanation is worse than no short — it actively
misleads viewers. `npm run validate` enforces an `accuracyReviewed: true`
flag per entry specifically so this step can't be silently skipped.

Every question must describe a **real, well-known engineering gotcha** —
something you could verify against documentation or a postmortem, not a
plausible-sounding fabrication. Before queuing, ask: would a senior engineer
in that domain agree this is the actual root cause, not just *a* contributing
factor? If a distractor is also a partial truth (e.g. "scrape interval is too
long" next to the real answer "gauges are point-in-time"), that's fine — it's
a deliberate near-miss — but the *correct* answer must be unambiguously,
fully correct.

## Visual conventions

- **Doesn't overflow the frame.** The validator estimates the rendered height
  of the question/code-snippet/answers/explanation against the actual
  1080x1920 frame (see the constants at the top of
  `scripts/validate-content.js`, kept in sync with `src/Short.tsx`'s real
  styles) and fails any entry that would overflow. If you hit this, shorten
  the question or explanation rather than override it — the budget is
  generous (~1700px) so hitting it usually means an entry genuinely needs
  trimming.
- **Question style**: plain bold white text on the dark background, same
  treatment as the answers. If the question needs a code snippet (e.g. a
  Dockerfile line), use the small inline monospace chip (`codeSnippet` field)
  — **never** a full terminal-window mockup with title-bar dots. That was
  tried and explicitly rejected for breaking the visual consistency with the
  rest of the card.
- **No persistent watermark** on the main question/answer card. Tried (a
  small "Sharpen" pill in the corner) and rejected as repetitive and too
  small to matter.
- **No explicit "Think… 🤔" countdown beat.** Tried twice as a distinct paced
  pause before the reveal and rejected both times as unnecessary — the
  ordinary progress bar covers this.
- **End card**: background is the *same* `#0B1220` as the main card (not the
  darker official-site `#05060A` — that caused a jarring color cut). Shows a
  pill badge reading "Sharpen" (purple→teal gradient border, no icon/logo —
  the real sharpen.sh site doesn't use one), the `sharpen.sh` link, and the
  tagline "One engineering challenge a day". This matches the actual brand
  pulled from sharpen.sh's source (colors: `--accent: #8a7bff`,
  `--accent-2: #63e6be`).

## Timing

Defaults live in `src/content/duration.ts`: 14s pre-reveal (progress bar),
7s explanation, 1.5s end-card fade ≈ 22.5s total. Override per-entry via the
optional `timing.revealSeconds` / `timing.explanationSeconds` fields if a
question has an unusually long explanation or code snippet that needs more
read time — don't change the global defaults for one short.

## Audio

`src/components/Music.tsx` loops `public/audio/background-music.mp4` under
every short at a low peak volume (0.18) with a short fade in/out. This is
automatic — don't add per-entry audio handling.

## What's NOT automatable

Pinning the `sharpen.sh` link as the first comment on each uploaded Short is
a manual step in YouTube Studio after upload. Nothing in this repo can do
that — don't try to script around it.
