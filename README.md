# Trust Layer

A bounded first-reading prototype for analytical texts when AI makes writing cheap and human review scarce.

Trust Layer is a public demo and concept prototype. It is meant to show one narrow loop: add an analytical text, get a provisional first reading, check it against the source, and turn it into a human review note only when that is useful.

## Quick Start

The fastest way to understand Trust Layer is to open the demo and choose Example Mode.

For private or longer documents, run it locally:

1. Clone this repository.
2. Start the backend with your own server-side API key.
3. Open `trust-layer-preview.html`.
4. Use the built-in example first, then test short excerpts.

Do not paste confidential material into the public demo.

## What It Does

- Accepts or shows an analytical text.
- Creates a provisional first reading.
- Identifies main claims, what needs attention, and the next review step.
- Supports human correction of the AI draft.
- Creates a review note only when needed.

The intended use is early review of analytical texts such as research drafts, policy memos, white papers, analytical essays, and book proposals.

## What It Is Not

- Not a truth engine.
- Not an AI detector.
- Not expert review.
- Not a universal trust system.
- Not a replacement for human judgment.

Trust Layer does not determine whether a text is true. It helps structure an early reading so that human attention can be routed more carefully.

## Why Genre Matters

Different texts need different kinds of first reading.

A policy memo may need attention to evidence, risks, and decision relevance. A conceptual essay may need attention to distinctions, internal logic, and possible alternative readings. A book proposal may need attention to promise, audience, and narrative architecture.

Trust Layer therefore treats text type as a provisional reading choice, not as an AI verdict. The suggested type can be changed by the user.

## Public Demo Modes

### 1. Example Mode

Works immediately. No setup is needed. It sends no user text to an AI provider.

This is the safest way to explore the full workflow without sending any text to an AI provider.

### 2. Public Live Demo

Uses a small shared budget. Short, non-confidential excerpts only.

The public live path has input limits, per-client rate limits, and a daily demo budget. If the live demo is unavailable or the budget is exhausted, the app should fall back to the built-in example.

The public demo should be treated as a demonstration of the workflow, not as a safe place for sensitive documents.

### 3. Local Run

For private, longer, or sensitive documents, run the prototype locally.

The public demo should not ask visitors to paste provider credentials into an unfamiliar website. Local use keeps that boundary clearer: clone the repository, configure server-side environment variables, and run the demo on your own machine.

Never put `OPENAI_API_KEY` in frontend code.

## Privacy

Do not paste confidential material into the public demo.

When live AI mode is used, submitted text is sent to the AI provider for analysis. This demo does not store submitted text.

The backend logs only minimal metadata:

- timestamp;
- request length;
- success or failure.

It does not log the full submitted text.

## Local Setup

Install backend dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

Set the server-side API key:

```bash
export OPENAI_API_KEY=your_key_here
```

Optional public-demo settings:

```bash
export PUBLIC_DEMO_MODEL=gpt-4o-mini
export MAX_INPUT_CHARS=20000
export MAX_OUTPUT_TOKENS=1200
export MAX_REQUESTS_PER_IP_PER_DAY=3
export PUBLIC_DAILY_REQUEST_LIMIT=200
```

Run the backend:

```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Open the prototype:

```bash
open trust-layer-preview.html
```

The frontend calls the backend API. Provider calls should remain server-side.

## Limitations

Trust Layer can produce false negatives. Unusual or early-stage ideas may look weak if they do not fit standard review patterns.

Genre mismatch can distort the first reading. A philosophical text, policy memo, market report, and book proposal should not be parsed in the same way.

AI output can create anchoring bias. Labels and structured fields may look more authoritative than they are. The result should be checked and edited by a human.

Reviewer scarcity remains the underlying problem. The prototype helps route attention, but it does not create expertise or guarantee fair allocation of review time.

Institutional legitimacy cannot be solved by interface design alone. Any real deployment would need governance, review of reviewer behavior, and periodic review of the workflow itself.

## License

The prototype code is licensed under the MIT License. See [LICENSE](LICENSE).

Included source excerpts, book references, and third-party analytical texts may be governed by their original rights and licenses. The MIT License applies to the prototype code, not necessarily to every referenced document.
