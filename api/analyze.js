const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

const systemPrompt = `You are generating a bounded first-pass triage reading for an analytical text.
You are not a truth engine, not an AI detector, and not an expert reviewer.
Your job is to help route scarce human review attention.

Write for triage, not summary.
Be brief, concrete, and decision-relevant.
Do not produce a polished essay about the document.
Do not give a score.
Do not validate truth.
Do not invent structure that the text does not support.

Document type:
- infer the most specific practical type you can from title, headings, genre, and purpose.
- avoid vague labels such as "combined text", "document", or "analytical text" unless no better label is available.

Field style:
- probable_central_argument: one sentence, maximum 25 words.
- claim_zones: 2-4 zones; each summary maximum 18 words.
- evidence_areas: 1-3 areas; each summary maximum 18 words.
- uncertainty_zones: 1-3 zones; each summary maximum 18 words.
- review_focus: 2-4 short imperative checks.
- route_reason: maximum 25 words.
- review_note_reason: maximum 25 words.
- confidence_note: one short caution.

Source trace:
- for each claim_zones, evidence_areas, and uncertainty_zones item, include source_snippet.
- source_snippet must be a context-bearing excerpt, not a minimal citation.
- preferred source_snippet length is 2-5 sentences when available, or roughly 500-1200 characters.
- include enough surrounding context for a human reviewer to understand why the AI made this reading.
- if the relevant passage is mathematical, include the surrounding prose.
- source_snippet is not proof, validation, or a formal citation.
- use verbatim or near-verbatim source text from the input; do not fabricate source text.
- keep source_snippet in the original wording and original language.
- include source_location when easy; otherwise return an empty string.

Review note guidance:
- not_warranted: most texts; short triage or bounded review is enough.
- optional: use when a review note may help only if the case is contested, institutionally important, or used across reviewers.
- warranted: use only when the text is consequential, contested, or clearly merits a durable review artifact.

Return only valid JSON matching the required schema.`;

const languageInstructions = {
  en:
    "Return every human-readable string strictly in English, regardless of the source document language. Exception: source_snippet and source_location should preserve original source wording and language where appropriate.",
  ru:
    "Return every human-readable string strictly in Russian, regardless of the source document language. Do not write English sentences or English headings. Only fixed enum values may remain in English. Exception: source_snippet and source_location should preserve original source wording and language where appropriate."
};

const triageJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    document_type: { type: "string" },
    probable_central_argument: { type: "string" },
    claim_zones: { type: "array", items: zoneSchema() },
    evidence_areas: { type: "array", items: zoneSchema() },
    uncertainty_zones: { type: "array", items: zoneSchema() },
    review_focus: { type: "array", items: { type: "string" } },
    route_recommendation: { type: "string", enum: ["stop_here", "bounded_review", "escalate"] },
    route_reason: { type: "string" },
    review_note_recommendation: { type: "string", enum: ["not_warranted", "optional", "warranted"] },
    review_note_reason: { type: "string" },
    confidence_note: { type: "string" }
  },
  required: [
    "document_type",
    "probable_central_argument",
    "claim_zones",
    "evidence_areas",
    "uncertainty_zones",
    "review_focus",
    "route_recommendation",
    "route_reason",
    "review_note_recommendation",
    "review_note_reason",
    "confidence_note"
  ]
};

const requestsByIp = new Map();
let dailyCount = { day: today(), count: 0 };

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    json(res, 405, { detail: { code: "invalid_input", message: "Method not allowed." } });
    return;
  }

  let payload;
  try {
    payload = await readJson(req);
  } catch (_error) {
    json(res, 422, { detail: { code: "invalid_input", message: "Invalid request for this public demo." } });
    return;
  }

  const text = normalizeText(payload.text || "");
  const suppliedApiKey = String(payload.api_key || "").trim();
  const language = payload.language === "ru" ? "ru" : "en";
  const minChars = numberEnv("TRUST_LAYER_MIN_INPUT_CHARS", 150);
  const publicMaxChars = numberEnv("MAX_INPUT_CHARS", 20000);

  if (!text) {
    json(res, 400, {
      detail: { code: "invalid_input", message: "Please paste text or upload a supported file before running analysis." }
    });
    return;
  }

  if (text.length < minChars) {
    json(res, 400, {
      detail: {
        code: "invalid_input",
        message: `Text is too short for this demo. Please provide at least ${minChars} characters of analytical text.`
      }
    });
    return;
  }

  if (!suppliedApiKey && text.length > publicMaxChars) {
    json(res, 400, {
      detail: {
        code: "invalid_input",
        message: `This demo accepts at most ${publicMaxChars} characters. Please shorten the text or use the example.`
      }
    });
    return;
  }

  const apiKey = suppliedApiKey || process.env.OPENAI_API_KEY || "";
  if (!apiKey) {
    json(res, 502, { detail: { code: "provider_error", message: "Live AI is not configured for this demo." } });
    return;
  }

  if (!suppliedApiKey) {
    const limited = applyPublicLimits(req, text.length, res);
    if (limited) return;
  }

  try {
    const result = await callOpenAI(text, language, apiKey, Boolean(suppliedApiKey));
    logRequest(text.length, true);
    json(res, 200, result);
  } catch (error) {
    logRequest(text.length, false);
    const code = classifyProviderError(error);
    const status = code === "rate_limited" ? 429 : code === "budget_exhausted" ? 402 : 502;
    json(res, status, { detail: { code, message: "The AI provider could not complete the request." } });
  }
};

function zoneSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      heading: { type: "string" },
      summary: { type: "string" },
      source_snippet: { type: "string" },
      source_location: { type: "string" }
    },
    required: ["heading", "summary", "source_snippet", "source_location"]
  };
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function applyPublicLimits(req, requestLength, res) {
  const day = today();
  if (dailyCount.day !== day) dailyCount = { day, count: 0 };

  const dailyLimit = numberEnv("PUBLIC_DAILY_REQUEST_LIMIT", 200);
  if (dailyLimit > 0 && dailyCount.count >= dailyLimit) {
    logRequest(requestLength, false);
    json(res, 402, {
      detail: {
        code: "budget_exhausted",
        message: "Live AI budget reached for today. You can still explore the workflow with a built-in example."
      }
    });
    return true;
  }

  const ip = String(req.headers["x-forwarded-for"] || "").split(",", 1)[0].trim() || "unknown";
  const ipLimit = numberEnv("MAX_REQUESTS_PER_IP_PER_DAY", 3);
  const current = requestsByIp.get(ip);
  const nextCount = current?.day === day ? current.count + 1 : 1;

  if (ipLimit > 0 && nextCount > ipLimit) {
    logRequest(requestLength, false);
    json(res, 429, {
      detail: {
        code: "rate_limited",
        message: "Daily live AI request limit reached for this client. Please use the example or try again tomorrow."
      }
    });
    return true;
  }

  requestsByIp.set(ip, { day, count: nextCount });
  dailyCount.count += 1;
  return false;
}

async function callOpenAI(text, language, apiKey, hasOwnKey) {
  const response = await fetch(process.env.OPENAI_RESPONSES_URL || "https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.PUBLIC_DEMO_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini",
      max_output_tokens: hasOwnKey ? numberEnv("BYOK_MAX_OUTPUT_TOKENS", 2200) : numberEnv("MAX_OUTPUT_TOKENS", 1200),
      input: [
        { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Read the following text and return a compact first-pass triage JSON object.\n" +
                "Prefer routing usefulness over summary completeness.\n\n" +
                `CRITICAL OUTPUT LANGUAGE REQUIREMENT: ${languageInstructions[language]}\n\n` +
                `TEXT:\n${text}`
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "trust_layer_triage",
          strict: true,
          schema: triageJsonSchema
        }
      }
    })
  });

  const raw = await response.text();
  if (!response.ok) throw new ProviderError(raw, response.status);

  const responseJson = JSON.parse(raw);
  if (responseJson.error) throw new ProviderError(JSON.stringify(responseJson.error), response.status);
  return JSON.parse(extractOutputText(responseJson));
}

function extractOutputText(responseJson) {
  if (typeof responseJson.output_text === "string" && responseJson.output_text.trim()) return responseJson.output_text;

  const fragments = [];
  for (const item of responseJson.output || []) {
    for (const content of item.content || []) {
      if ((content.type === "output_text" || content.type === "text") && content.text) fragments.push(content.text);
    }
  }

  if (fragments.length) return fragments.join("");
  throw new ProviderError("The model response did not contain structured output text.", 502);
}

function setCors(res) {
  for (const [key, value] of Object.entries(corsHeaders)) res.setHeader(key, value);
}

function json(res, status, payload) {
  res.status(status).json(payload);
}

function normalizeText(text) {
  return String(text || "")
    .replace(/\u0000/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function numberEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function logRequest(requestLength, success) {
  console.info(`public_demo_request timestamp=${new Date().toISOString()} request_length=${requestLength} success=${success}`);
}

class ProviderError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

function classifyProviderError(error) {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  const status = error instanceof ProviderError ? error.status : 502;
  if (message.includes("insufficient_quota") || message.includes("quota") || message.includes("billing")) {
    return "budget_exhausted";
  }
  if (status === 429 || message.includes("rate limit") || message.includes("rate_limit")) {
    return "rate_limited";
  }
  return "provider_error";
}
