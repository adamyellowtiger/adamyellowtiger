import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateHintResponse } from '@/lib/guardrails';
import type { HintRequest } from '@/lib/types';
import { SAFE_REFUSAL } from '@/lib/types';

const requestSchema = z
  .object({
    problem: z.string().min(1).max(5000),
    attempt: z.string().max(5000).nullable().optional(),
    strictness: z.enum(['light', 'medium', 'strict']),
    redTeamMode: z.boolean().nullable().optional()
  })
  .strict();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid request body. Ensure problem is present and lengths are <= 5000.'
        },
        { status: 400 }
      );
    }

    const data = parsed.data as HintRequest;
    const result = await generateHintResponse(data);
    return NextResponse.json(result.payload, { status: 200 });
  } catch {
    return NextResponse.json(SAFE_REFUSAL, { status: 500 });
  }
}
