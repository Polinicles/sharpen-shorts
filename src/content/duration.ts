import type { ShortContent } from "./types";

export const DEFAULT_REVEAL_SECONDS = 14;
export const DEFAULT_EXPLANATION_SECONDS = 7;
export const END_CARD_SECONDS = 1.5;

export const getDurationInFrames = (content: ShortContent, fps: number): number => {
  const revealSeconds = content.timing?.revealSeconds ?? DEFAULT_REVEAL_SECONDS;
  const explanationSeconds = content.timing?.explanationSeconds ?? DEFAULT_EXPLANATION_SECONDS;
  return Math.round((revealSeconds + explanationSeconds + END_CARD_SECONDS) * fps);
};
