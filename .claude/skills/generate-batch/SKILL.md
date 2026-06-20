---
name: generate-batch
description: Draft, accuracy-review, and validate a new batch of 5-10 sharpen-shorts into src/content/queue.json, ready for the user to review before rendering.
---

Generate today's batch of sharpen-shorts.

Steps:

1. Read `CONTENT_GUIDE.md` at the repo root in full — it's the complete content
   spec (brevity rules, answer design, accuracy bar, visual conventions,
   schema, timing, audio). Follow it precisely.
2. Read `src/content/history.json` — avoid repeating a topic or
   over-clustering on one category from the last ~7 days of entries.
3. Draft 5-10 new entries matching the `ShortContent` schema in
   `src/content/types.ts`. Use only icons already listed in
   `src/content/icons.ts`; if a new category needs a new icon, add it there
   and to the `IconName` union in `types.ts` first. Vary `correctIndex`
   across entries (0-3) — don't always place the correct answer in the same
   slot. Every question's last line must end with an emoji.
4. Before writing anything, self-review each draft for technical accuracy per
   the "Accuracy bar" section of CONTENT_GUIDE.md. Each question must
   describe a real, verifiable engineering gotcha; the correct answer must be
   unambiguously, fully correct, not just one plausible take among several.
   Rewrite or drop any entry that doesn't clear this bar. Only set
   `"accuracyReviewed": true` on entries you've actually verified this way —
   never set it as a default/formality.
5. Replace the entire contents of `src/content/queue.json` with just this
   batch — that file holds only the current batch, not a running
   accumulation of every batch ever generated.
6. Run `npm run validate`. This is a hard gate (structure, accuracyReviewed
   flag, emoji-ending questions, and estimated frame-overflow) — fix every
   error before continuing, don't work around it. It will also print soft
   warnings about question lines that might wrap badly — those are NOT
   reliable enough to trust or ignore on their own (see step 7).
7. For every entry in this batch, visually verify the question doesn't wrap
   into extra lines or orphan a word — this has been the single most common
   visual bug in this project, and the validator's character-count warning
   cannot reliably catch it (wrapping depends on actual word widths, not
   character count — it has false positives and false negatives). For each
   entry: render it (`npx remotion render src/index.ts <id> /tmp/check.mp4`),
   grab a frame (`ffmpeg -y -ss 2 -i /tmp/check.mp4 -frames:v 1
   /tmp/check.png`), and look at it. The question must render as exactly as
   many lines as its `question` array has entries — no more. If it wraps,
   shorten or rephrase that line (don't just trim one character) and
   re-render until clean. Do this for every entry, not just ones the warning
   flagged.
8. Append this batch's entries to `src/content/history.json` (fields: id,
   category, topic, date — today's date, YYYY-MM-DD). Don't remove existing
   history entries, only append.
9. Ask me before running `npm run render:all` or committing/pushing anything
   — I want to review the drafted questions first.
