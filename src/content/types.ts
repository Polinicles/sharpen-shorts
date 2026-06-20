export type IconName =
  | "Brain"
  | "Plug"
  | "Database"
  | "Network"
  | "Shield"
  | "Gauge"
  | "Server"
  | "Layers"
  | "Cpu"
  | "GitBranch";

export interface ShortContent extends Record<string, unknown> {
  /** kebab-case slug. Used as the Remotion composition id and the render output filename. */
  id: string;
  /** Short uppercase label shown in the category pill, e.g. "DOCKER". */
  category: string;
  icon: IconName;
  /** 1-3 short lines. Rendered as-is, one <div> line per array entry. The last line must end with an emoji. */
  question: string[];
  /** Optional monospace code chip rendered inside the question (e.g. a Dockerfile snippet). */
  codeSnippet?: string[];
  /** Exactly 4 options. */
  answers: [string, string, string, string];
  /** Index (0-3) of the correct option. Vary this across shorts - don't always use the same position. */
  correctIndex: 0 | 1 | 2 | 3;
  /** 2-3 short lines for the reveal card. */
  explanation: string[];
  /**
   * Must be explicitly set to true, and only after you've actually verified
   * the question/answer/explanation describe a real, correct engineering
   * gotcha (see CONTENT_GUIDE.md "Accuracy bar"). The validator rejects any
   * entry where this isn't `true` — it's a deliberate forcing function, not
   * a formality.
   */
  accuracyReviewed: true;
  timing?: {
    /** Seconds of question+answers display before the reveal. Default 14. */
    revealSeconds?: number;
    /** Seconds the explanation card is shown before the end card. Default 7. */
    explanationSeconds?: number;
  };
}
