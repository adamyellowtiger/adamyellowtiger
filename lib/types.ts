export type Strictness = 'light' | 'medium' | 'strict';

export type HintResponse = {
  hints: string[];
  micro_checks: string[];
  question_for_user: string;
};

export type HintRequest = {
  problem: string;
  attempt?: string | null;
  strictness: Strictness;
  redTeamMode?: boolean | null;
};

export const SAFE_REFUSAL: HintResponse = {
  hints: [
    "I can’t provide a full solution or final answer. I can give a smaller next-step hint based on what you’ve tried so far."
  ],
  micro_checks: [],
  question_for_user: 'What is the last line you wrote, and where exactly did you get stuck?'
};
