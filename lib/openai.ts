import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

export const model = process.env.OPENAI_MODEL ?? 'gpt-5-mini';

export function getOpenAIClient(): OpenAI {
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({ apiKey });
}
