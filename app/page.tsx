'use client';

import { useState } from 'react';

type Strictness = 'light' | 'medium' | 'strict';

type HintResponse = {
  hints: string[];
  micro_checks: string[];
  question_for_user: string;
};

const examples = [
  {
    label: 'Algebra: quadratic roots relation',
    problem:
      'If x and y are roots of t^2 - 7t + 10 = 0, find x^2 + y^2 without solving for each root directly.',
    attempt: 'I know x + y = 7 and xy = 10, but I am not sure how to use these.'
  },
  {
    label: 'Geometry: triangle angle chase',
    problem:
      'In triangle ABC, angle A = 40° and angle B = 65°. A point D lies inside so that angle DAB = 15°. Find angle ADC.',
    attempt: 'I drew the figure and found angle C = 75°, but got stuck.'
  },
  {
    label: 'Number theory: divisibility',
    problem:
      'Show that for any integer n, n^5 - n is divisible by 30.',
    attempt: 'I tried factoring n(n^4-1), then n(n^2-1)(n^2+1).'
  }
];

export default function HomePage() {
  const [problem, setProblem] = useState(examples[0].problem);
  const [attempt, setAttempt] = useState(examples[0].attempt);
  const [strictness, setStrictness] = useState<Strictness>('medium');
  const [redTeamMode, setRedTeamMode] = useState(false);
  const [data, setData] = useState<HintResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem,
          attempt,
          strictness,
          redTeamMode
        })
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Request failed');
        return;
      }
      setData(json as HintResponse);
    } catch {
      setError('Unexpected network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Hint-Only Tutor</h1>
      <p>
        No full solutions. No direct final answers. Get only safe next-step hints with micro-checks.
      </p>

      <div className="grid">
        <section className="card">
          <label htmlFor="problem">Problem text</label>
          <textarea id="problem" value={problem} onChange={(e) => setProblem(e.target.value)} maxLength={5000} />

          <label htmlFor="attempt">Your attempt/work (optional)</label>
          <textarea id="attempt" value={attempt} onChange={(e) => setAttempt(e.target.value)} maxLength={5000} />

          <label htmlFor="strictness">Strictness</label>
          <select id="strictness" value={strictness} onChange={(e) => setStrictness(e.target.value as Strictness)}>
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="strict">Very Strict</option>
          </select>

          <label style={{ marginTop: '0.7rem' }}>
            <input
              type="checkbox"
              checked={redTeamMode}
              onChange={(e) => setRedTeamMode(e.target.checked)}
              style={{ width: 'auto', marginRight: '0.5rem' }}
            />
            I&apos;m being red-teamed (extra strict, shorter hints)
          </label>

          <div style={{ marginTop: '0.9rem' }}>
            <button disabled={loading} onClick={submit}>
              {loading ? 'Generating safe hint...' : 'Get Hint'}
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </section>

        <section className="card">
          <h2>Output</h2>
          {!data ? (
            <p>Your hints will appear here.</p>
          ) : (
            <>
              <h3>Hints</h3>
              <ul>
                {data.hints.map((hint, i) => (
                  <li key={i}>{hint}</li>
                ))}
              </ul>
              <h3>Micro-checks</h3>
              <ul>
                {data.micro_checks.length === 0 ? <li>None</li> : data.micro_checks.map((check, i) => <li key={i}>{check}</li>)}
              </ul>
              <h3>Question for you</h3>
              <pre>{data.question_for_user}</pre>
            </>
          )}
        </section>
      </div>

      <section className="card examples" style={{ marginTop: '1rem' }}>
        <h2>Demo examples</h2>
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => {
              setProblem(ex.problem);
              setAttempt(ex.attempt);
            }}
          >
            {ex.label}
          </button>
        ))}
      </section>
    </main>
  );
}
