#!/usr/bin/env node
/**
 * Structural validation for src/content/queue.json.
 * Run via `npm run validate` (also runs `tsc --noEmit`).
 */
const fs = require("fs");
const path = require("path");

const QUEUE_PATH = path.join(__dirname, "..", "src", "content", "queue.json");
const ICONS_PATH = path.join(__dirname, "..", "src", "content", "icons.ts");

// Question lines render at 72px bold. Whether a given line wraps mid-entry
// (and orphans a short word onto its own line) depends on actual word widths,
// not just character count — verified against real rendered frames, lines of
// the same length wrap differently depending on which words are in them. This
// constant is a cheap, IMPERFECT early warning, not a precise predictor —
// it has both false positives and false negatives. Treat it as "maybe check
// this one visually," not a verdict. The real gate is rendering a frame and
// looking at it (see CONTENT_GUIDE.md "Visual conventions").
const MAX_QUESTION_LINE_CHARS = 24;
const MAX_ANSWER_CHARS = 45;
const MAX_EXPLANATION_LINE_CHARS = 45;
const MAX_QUESTION_LINES = 3;
const MAX_EXPLANATION_LINES = 4;

const EMOJI_RE = /\p{Extended_Pictographic}/u;

// Layout estimate, mirrors the actual styles in src/Short.tsx. Used to catch
// content that would overflow the 1080x1920 frame before it ever gets rendered.
const FRAME_HEIGHT = 1920;
const OUTER_PADDING = 32 + 32; // AbsoluteFill paddingTop + paddingBottom
const CONTENT_PADDING_TOP = 140;
const AVAILABLE_HEIGHT = FRAME_HEIGHT - OUTER_PADDING - CONTENT_PADDING_TOP;

const CATEGORY_HEIGHT = 30 * 1.2 + 24 + 28; // fontSize*lineHeight + padding + marginBottom
const QUESTION_LINE_HEIGHT = 72 * 1.1;
const QUESTION_BLOCK_MARGIN_BOTTOM = 70;
const CODE_SNIPPET_CHROME = 20 + 20 + 14 * 2; // margins + padding top/bottom
const CODE_SNIPPET_LINE_HEIGHT = 40 * 1.2;
const ANSWERS_HEIGHT = 4 * (72 + 18 * 2) + 3 * 18; // 4 rows (letter circle dominates) + 3 gaps
const PROGRESS_BAR_HEIGHT = 70 + 24;
const EXPLANATION_CHROME = 40 + 30 * 2 + (36 * 1.2 + 12); // margin + padding + heading
const EXPLANATION_LINE_HEIGHT = 40 * 1.25;

const errors = [];
const warnings = [];

const fail = (id, msg) => errors.push(`[${id || "?"}] ${msg}`);
const warn = (id, msg) => warnings.push(`[${id || "?"}] ${msg}`);

if (!fs.existsSync(QUEUE_PATH)) {
  console.error(`Queue file not found at ${QUEUE_PATH}`);
  process.exit(1);
}

const iconsSource = fs.readFileSync(ICONS_PATH, "utf8");
const allowedIcons = [...iconsSource.matchAll(/^\s{2}(\w+),$/gm)].map((m) => m[1]);

let queue;
try {
  queue = JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));
} catch (e) {
  console.error(`queue.json is not valid JSON: ${e.message}`);
  process.exit(1);
}

if (!Array.isArray(queue)) {
  console.error("queue.json must be an array of ShortContent entries.");
  process.exit(1);
}

const seenIds = new Set();

for (const entry of queue) {
  const id = entry.id;

  if (!id || typeof id !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
    fail(id, "id must be a non-empty kebab-case slug");
  } else if (seenIds.has(id)) {
    fail(id, "duplicate id in queue.json");
  } else {
    seenIds.add(id);
  }

  if (!entry.category || typeof entry.category !== "string") {
    fail(id, "category is required");
  } else if (entry.category.length > 22) {
    warn(id, `category "${entry.category}" is long for a pill label`);
  }

  if (!allowedIcons.includes(entry.icon)) {
    fail(id, `icon "${entry.icon}" is not in the allowed list (${allowedIcons.join(", ")}). Add it to src/content/icons.ts and types.ts first.`);
  }

  if (!Array.isArray(entry.question) || entry.question.length === 0) {
    fail(id, "question must be a non-empty array of lines");
  } else {
    if (entry.question.length > MAX_QUESTION_LINES) {
      warn(id, `question has ${entry.question.length} lines, keep it to ${MAX_QUESTION_LINES} or fewer`);
    }
    for (const line of entry.question) {
      if (typeof line !== "string" || !line.trim()) {
        fail(id, "question lines must be non-empty strings");
      } else if (line.length > MAX_QUESTION_LINE_CHARS) {
        warn(
          id,
          `question line "${line}" is ${line.length} chars (soft limit ${MAX_QUESTION_LINE_CHARS}) — ` +
            `may wrap mid-line and orphan a word onto its own line. Render this entry and check ` +
            `a frame before finalizing (see CONTENT_GUIDE.md).`
        );
      }
    }
    const lastLine = entry.question[entry.question.length - 1];
    if (typeof lastLine === "string" && !EMOJI_RE.test(lastLine)) {
      fail(id, `question must end with an emoji — last line "${lastLine}" has none`);
    }
  }

  if (entry.codeSnippet !== undefined) {
    if (!Array.isArray(entry.codeSnippet) || entry.codeSnippet.some((l) => typeof l !== "string")) {
      fail(id, "codeSnippet, if present, must be an array of strings");
    }
  }

  if (!Array.isArray(entry.answers) || entry.answers.length !== 4) {
    fail(id, "answers must be an array of exactly 4 strings");
  } else {
    const trimmed = entry.answers.map((a) => (typeof a === "string" ? a.trim() : ""));
    if (trimmed.some((a) => !a)) {
      fail(id, "all 4 answers must be non-empty strings");
    }
    if (new Set(trimmed.map((a) => a.toLowerCase())).size !== trimmed.length) {
      fail(id, "answers must be unique");
    }
    for (const a of trimmed) {
      if (a.length > MAX_ANSWER_CHARS) {
        warn(id, `answer "${a}" is ${a.length} chars, keep answers short`);
      }
    }
    const lengths = trimmed.map((a) => a.length);
    const spread = Math.max(...lengths) - Math.min(...lengths);
    if (spread > 25) {
      warn(id, "answers vary a lot in length — the correct one shouldn't stand out");
    }
  }

  if (
    typeof entry.correctIndex !== "number" ||
    !Number.isInteger(entry.correctIndex) ||
    entry.correctIndex < 0 ||
    entry.correctIndex > 3
  ) {
    fail(id, "correctIndex must be an integer 0-3");
  }

  if (!Array.isArray(entry.explanation) || entry.explanation.length === 0) {
    fail(id, "explanation must be a non-empty array of lines");
  } else {
    if (entry.explanation.length > MAX_EXPLANATION_LINES) {
      warn(id, `explanation has ${entry.explanation.length} lines, keep it to ${MAX_EXPLANATION_LINES} or fewer`);
    }
    for (const line of entry.explanation) {
      if (typeof line !== "string" || !line.trim()) {
        fail(id, "explanation lines must be non-empty strings");
      } else if (line.length > MAX_EXPLANATION_LINE_CHARS) {
        warn(id, `explanation line "${line}" is ${line.length} chars, aim for <= ${MAX_EXPLANATION_LINE_CHARS}`);
      }
    }
  }

  if (entry.timing !== undefined) {
    const { revealSeconds, explanationSeconds } = entry.timing;
    if (revealSeconds !== undefined && (typeof revealSeconds !== "number" || revealSeconds <= 0)) {
      fail(id, "timing.revealSeconds must be a positive number");
    }
    if (
      explanationSeconds !== undefined &&
      (typeof explanationSeconds !== "number" || explanationSeconds <= 0)
    ) {
      fail(id, "timing.explanationSeconds must be a positive number");
    }
  }

  if (entry.accuracyReviewed !== true) {
    fail(
      id,
      "accuracyReviewed must be explicitly set to true — and only after you've actually " +
        "verified the question/answer/explanation against CONTENT_GUIDE.md's Accuracy bar. " +
        "This is a deliberate gate, not a formality."
    );
  }

  // Layout overflow estimate (mirrors src/Short.tsx styles).
  if (Array.isArray(entry.question)) {
    const questionLines = entry.question.length;
    const codeLines = Array.isArray(entry.codeSnippet) ? entry.codeSnippet.length : 0;
    const codeHeight = codeLines > 0 ? CODE_SNIPPET_CHROME + codeLines * CODE_SNIPPET_LINE_HEIGHT : 0;
    const questionBlockHeight =
      CATEGORY_HEIGHT +
      questionLines * QUESTION_LINE_HEIGHT +
      codeHeight +
      QUESTION_BLOCK_MARGIN_BOTTOM;

    const preRevealHeight = questionBlockHeight + ANSWERS_HEIGHT + PROGRESS_BAR_HEIGHT;
    if (preRevealHeight > AVAILABLE_HEIGHT) {
      fail(
        id,
        `estimated pre-reveal layout is ~${Math.round(preRevealHeight)}px tall, ` +
          `frame only fits ${AVAILABLE_HEIGHT}px (over by ${Math.round(preRevealHeight - AVAILABLE_HEIGHT)}px) — shorten the question/code snippet`
      );
    }

    if (Array.isArray(entry.explanation) && entry.explanation.length > 0) {
      const explanationHeight =
        EXPLANATION_CHROME + entry.explanation.length * EXPLANATION_LINE_HEIGHT;
      const postRevealHeight = questionBlockHeight + ANSWERS_HEIGHT + explanationHeight;
      if (postRevealHeight > AVAILABLE_HEIGHT) {
        fail(
          id,
          `estimated reveal-state layout is ~${Math.round(postRevealHeight)}px tall, ` +
            `frame only fits ${AVAILABLE_HEIGHT}px (over by ${Math.round(postRevealHeight - AVAILABLE_HEIGHT)}px) — shorten the question/explanation`
        );
      }
    }
  }
}

if (warnings.length) {
  console.warn(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.warn(`  - ${w}`);
}

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error(`\nFix the above before rendering.`);
  process.exit(1);
}

console.log(`\n${queue.length} entr${queue.length === 1 ? "y" : "ies"} in queue.json, structurally valid.`);
