#!/usr/bin/env node
/**
 * Renders every entry in src/content/queue.json to out/<date>/<id>.mp4
 * so you can review the day's batch and pick the ones you like.
 *
 * Usage: npm run render:all
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const QUEUE_PATH = path.join(ROOT, "src", "content", "queue.json");

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));

if (!Array.isArray(queue) || queue.length === 0) {
  console.log("queue.json is empty, nothing to render.");
  process.exit(0);
}

const date = new Date().toISOString().slice(0, 10);
const outDir = path.join(ROOT, "out", date);
fs.mkdirSync(outDir, { recursive: true });

console.log(`Rendering ${queue.length} short(s) to out/${date}/\n`);

let failed = 0;

for (const entry of queue) {
  const outPath = path.join(outDir, `${entry.id}.mp4`);
  console.log(`-> ${entry.id}`);
  try {
    execFileSync(
      "npx",
      ["remotion", "render", "src/index.ts", entry.id, outPath],
      { cwd: ROOT, stdio: "inherit" }
    );
  } catch (e) {
    failed += 1;
    console.error(`Failed to render ${entry.id}`);
  }
}

if (failed) {
  console.error(`\n${failed} of ${queue.length} render(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${queue.length} short(s) rendered to out/${date}/`);
