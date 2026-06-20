# Sharpen Shorts

A [Remotion](https://www.remotion.dev) project that generates short vertical
quiz videos ("Shorts") about real software engineering gotchas, for
[sharpen.sh](https://sharpen.sh).

Each short is a multiple-choice question (category pill, question, 4
answers, a reveal with explanation, and a branded end card), driven entirely
by data in `src/content/queue.json` — see `CONTENT_GUIDE.md` for the full
content spec (brevity rules, answer design, the accuracy bar, visual
conventions, timing).

## Setup

```console
npm install
```

## Generating a new batch of shorts

This is the day-to-day workflow:

1. **Draft a batch.** In Claude Code, from this repo, run:

   ```
   /generate-batch
   ```

   This drafts 5–10 new questions into `src/content/queue.json`, self-reviews
   each one for technical accuracy, runs the validator, visually checks that
   no title wraps awkwardly, and appends to `src/content/history.json` —
   then stops so you can review the drafted questions before anything renders.

   (There's also a 6am macOS notification reminding you to do this — see
   `~/Library/LaunchAgents/com.sharpenshorts.daily-reminder.plist` — but
   nothing runs automatically; you always trigger generation yourself.)

2. **Validate.** Already run as part of `/generate-batch`, but you can run it
   standalone any time you hand-edit `queue.json`:

   ```console
   npm run validate
   ```

   Hard gate: structure (exactly 4 answers, valid `correctIndex`), every
   entry has `accuracyReviewed: true`, every question ends in an emoji, and
   the estimated layout doesn't overflow the frame. Also prints soft
   warnings about question lines that might wrap badly — see
   `CONTENT_GUIDE.md` for why those need a real visual check, not just the
   warning, before you trust a title is compact.

3. **Render.** Once you're happy with the batch:

   ```console
   npm run render:all
   ```

   Renders every entry in `queue.json` to `out/<date>/<id>.mp4`. Open that
   folder and pick your favorite(s).

4. **Preview in the browser** (optional, for iterating on a single short or
   on `src/Short.tsx` itself):

   ```console
   npm run dev
   ```

   Opens Remotion Studio with one composition per entry in `queue.json`.

## Project structure

- `src/Short.tsx` — the one generic component every short renders through.
- `src/content/queue.json` — the current batch of shorts (data, not code).
  Rotated per batch, not a running accumulation.
- `src/content/history.json` — permanent, append-only log of past topics, so
  future batches don't repeat them.
- `src/content/types.ts` / `icons.ts` — the `ShortContent` schema and the
  allowed icon set.
- `src/content/duration.ts` — timing defaults (14s pre-reveal, 7s
  explanation, 1.5s end card).
- `src/components/Music.tsx` — background music, looped under every short.
- `CONTENT_GUIDE.md` — the full content spec. Read this before drafting
  anything by hand.
- `scripts/validate-content.js` / `scripts/render-all.js` — the two npm
  scripts above.

## What's NOT automated

Pinning the `sharpen.sh` link as the first comment on each uploaded Short is
a manual step in YouTube Studio after upload — nothing here does that.

## Other commands

**Upgrade Remotion**

```console
npx remotion upgrade
```

**Render a single composition directly**

```console
npx remotion render src/index.ts <id> out/<id>.mp4
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
