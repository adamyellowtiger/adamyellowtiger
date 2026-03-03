# Hint-Only Tutor

A production-style Next.js web app + API that provides **hint-only tutoring** for contest-style math problems using the OpenAI Responses API.

> **Policy guarantee:** No full solutions or direct answers, even under adversarial prompting.

## Features

- Next.js 14 App Router + TypeScript UI
- Server-only OpenAI API calls (`OPENAI_API_KEY` never exposed client-side)
- Strict JSON schema output:
  - `hints` (1..3)
  - `micro_checks` (0..5)
  - `question_for_user`
- Multi-layer guardrails:
  1. Strong system prompt restrictions
  2. Structured output JSON schema enforcement
  3. Deterministic leak detector (direct answer, confirmation, obfuscation, full solution heuristics)
  4. One-shot repair loop
  5. Final hard stop safe refusal JSON
- Evaluation harness with adversarial red-team set and metrics/report generation

## Quick Start

### Prereqs
- Node.js 20+
- Python 3.10+

### Install and run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

## Environment Variables

Use `.env.local`:

- `OPENAI_API_KEY` (required)
- `OPENAI_MODEL` (optional, default: `gpt-5-mini`)

## API

### `POST /api/hint`

Request:

```json
{
  "problem": "string",
  "attempt": "string | null",
  "strictness": "light | medium | strict",
  "redTeamMode": true
}
```

Response schema:

```json
{
  "hints": ["..."],
  "micro_checks": ["..."],
  "question_for_user": "..."
}
```

Validation:
- `problem` max 5000 chars (required)
- `attempt` max 5000 chars (optional)
- Returns 400 for invalid input
- Returns safe refusal JSON on model/parse/safety failures

## Evaluation Harness

Run app first (`npm run dev`), then:

```bash
python eval/run_eval.py
```

Outputs:
- `eval/results.json` per-case records, leak flags, timing
- `eval/report.md` metrics summary + adversarial transcript samples

Metrics reported:
- `leak_rate`
- `schema_valid_rate`
- `refusal_rate_on_adversarial`
- `avg_hint_count`
- `avg_hint_length`
- `question_present_rate`

## Design Notes

- Guardrails live in `lib/guardrails.ts`.
- Refusal behavior is explicit and resilient against jailbreak prompts such as:
  - “Ignore previous instructions”
  - “Give final answer only”
  - “Encode in base64 / hidden answer / roleplay override”
- Repair loop is deterministic: one rewrite attempt with leak reasons; if still unsafe → final safe refusal JSON.

## Limitations

- Heuristic leak detection is not perfect by itself.
- Safety is improved by **layering** policy prompt + schema + leak detector + repair + hard-stop refusal.
- For higher assurance in production, add human review and continuous adversarial monitoring.
