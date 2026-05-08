from __future__ import annotations

import json
import ssl
import urllib.error
import urllib.request
from typing import Any

import certifi

from .config import Settings
from .schemas import TriageResult


SYSTEM_PROMPT = """You are generating a bounded first-pass triage reading for an analytical text.
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
- examples: "internal outreach transfer memo / project operating document", "concept note for a book proposal", "policy memo draft".

Field style:
- probable_central_argument: one sentence, maximum 25 words.
- claim_zones: 2-4 zones; each summary maximum 18 words; describe what the zone does for triage, not a long content summary.
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
- a good source_snippet usually includes the relevant claim or formula, one nearby sentence explaining it, and enough context to check whether the interpretation is plausible.
- if the relevant passage is mathematical, include the surrounding prose. A formula by itself is usually insufficient.
- do not return only a formula, heading, or isolated sentence unless no surrounding context exists.
- keep source_snippet under 1200 characters unless the passage would become misleading without slightly more context.
- source_snippet is not proof, validation, or a formal citation.
- use verbatim or near-verbatim source text from the input; do not fabricate or paraphrase source text as if it were quoted.
- keep source_snippet in the original wording and original language.
- include source_location when easy, such as a section heading, proposition name, or nearby heading; otherwise return an empty string.
- if no grounded fragment is available, return an empty string rather than inventing one.
- better to return fewer but more checkable source traces than many decorative micro-links.

Review note guidance:
- not_warranted: most texts; short triage or bounded review is enough.
- optional: use when a review note may help only if the case is contested, institutionally important, or used across reviewers.
- warranted: use only when the text is consequential, contested, or clearly merits a durable review artifact.

Return only valid JSON matching the required schema."""


LANGUAGE_INSTRUCTIONS = {
    "en": (
        "Return every human-readable string strictly in English, regardless of the source document language. "
        "If the source text is Russian or another language, translate the triage reading into English. "
        "Exception: source_snippet and source_location should preserve original source wording and language where appropriate."
    ),
    "ru": (
        "Return every human-readable string strictly in Russian, regardless of the source document language. "
        "Do not write English sentences or English headings. Translate the triage reading into natural Russian. "
        "Only fixed enum values may remain in English. "
        "Exception: source_snippet and source_location should preserve original source wording and language where appropriate."
    ),
}


TRIAGE_JSON_SCHEMA: dict[str, Any] = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "document_type": {"type": "string"},
        "probable_central_argument": {"type": "string"},
        "claim_zones": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "heading": {"type": "string"},
                    "summary": {"type": "string"},
                    "source_snippet": {"type": "string"},
                    "source_location": {"type": "string"},
                },
                "required": ["heading", "summary", "source_snippet", "source_location"],
            },
        },
        "evidence_areas": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "heading": {"type": "string"},
                    "summary": {"type": "string"},
                    "source_snippet": {"type": "string"},
                    "source_location": {"type": "string"},
                },
                "required": ["heading", "summary", "source_snippet", "source_location"],
            },
        },
        "uncertainty_zones": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "heading": {"type": "string"},
                    "summary": {"type": "string"},
                    "source_snippet": {"type": "string"},
                    "source_location": {"type": "string"},
                },
                "required": ["heading", "summary", "source_snippet", "source_location"],
            },
        },
        "review_focus": {
            "type": "array",
            "items": {"type": "string"},
        },
        "route_recommendation": {
            "type": "string",
            "enum": ["stop_here", "bounded_review", "escalate"],
        },
        "route_reason": {"type": "string"},
        "review_note_recommendation": {
            "type": "string",
            "enum": ["not_warranted", "optional", "warranted"],
        },
        "review_note_reason": {"type": "string"},
        "confidence_note": {"type": "string"},
    },
    "required": [
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
        "confidence_note",
    ],
}


class LLMError(Exception):
    """Raised when the LLM request or response fails."""

    def __init__(self, message: str, code: str = "provider_error"):
        super().__init__(message)
        self.code = code


class OpenAILLMClient:
    def __init__(self, settings: Settings):
        self.settings = settings

    def analyze_text(self, text: str, language: str = "en") -> TriageResult:
        language_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])
        user_prompt = (
            "Read the following text and return a compact first-pass triage JSON object.\n"
            "Prefer routing usefulness over summary completeness.\n\n"
            f"CRITICAL OUTPUT LANGUAGE REQUIREMENT: {language_instruction}\n\n"
            f"TEXT:\n{text}"
        )
        result = self._request_structured_result(user_prompt)
        return self._ensure_output_language(result, language)

    def synthesize_partials(self, partials: list[dict[str, Any]], truncated: bool, language: str = "en") -> TriageResult:
        note = "The source text was truncated for this demo before synthesis." if truncated else "Use the partials below as the source material."
        language_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])
        user_prompt = (
            "Combine the following partial first-pass readings into one final provisional triage JSON object.\n"
            "Keep uncertainty visible and do not invent strength beyond what the partials support.\n"
            f"CRITICAL OUTPUT LANGUAGE REQUIREMENT: {language_instruction}\n"
            f"{note}\n\n"
            f"PARTIAL_READINGS:\n{json.dumps(partials, ensure_ascii=False)}"
        )
        result = self._request_structured_result(user_prompt)
        result = self._ensure_output_language(result, language)
        if truncated:
            result.confidence_note = f"{result.confidence_note} Source text was truncated for this demo."
        return result

    def _ensure_output_language(self, result: TriageResult, language: str) -> TriageResult:
        """Recover once when the model ignores the requested interface language."""
        language = language if language in LANGUAGE_INSTRUCTIONS else "en"
        if not self._needs_language_rewrite(result, language):
            return result

        language_instruction = LANGUAGE_INSTRUCTIONS[language]
        rewrite_prompt = (
            "Rewrite this already-structured triage JSON into the required interface language.\n"
            "Preserve the same schema.\n"
            "Preserve route_recommendation and review_note_recommendation enum values exactly.\n"
            "Preserve source_snippet fields as original source traces; do not translate them.\n"
            "Preserve source_location fields when they name a section or nearby heading.\n"
            "Keep the result compact and decision-relevant.\n"
            f"CRITICAL OUTPUT LANGUAGE REQUIREMENT: {language_instruction}\n\n"
            f"TRIAGE_JSON:\n{json.dumps(result.model_dump(mode='json'), ensure_ascii=False)}"
        )
        return self._request_structured_result(rewrite_prompt)

    def _needs_language_rewrite(self, result: TriageResult, language: str) -> bool:
        text = self._result_text(result)
        latin_count = sum(1 for char in text if ("A" <= char <= "Z") or ("a" <= char <= "z"))
        cyrillic_count = sum(1 for char in text if "\u0400" <= char <= "\u04ff")

        if language == "ru":
            return latin_count > 80 and latin_count > max(120, cyrillic_count * 2)
        if language == "en":
            return cyrillic_count > 20
        return False

    def _result_text(self, result: TriageResult) -> str:
        pieces = [
            result.document_type,
            result.probable_central_argument,
            result.route_reason,
            result.review_note_reason,
            result.confidence_note,
            *result.review_focus,
        ]
        for zone_group in (result.claim_zones, result.evidence_areas, result.uncertainty_zones):
            for zone in zone_group:
                pieces.extend([zone.heading, zone.summary])
        return "\n".join(pieces)

    def _request_structured_result(self, user_prompt: str) -> TriageResult:
        if not self.settings.api_key:
            raise LLMError("Live AI is not configured for this demo.", code="provider_error")

        payload = {
            "model": self.settings.model_name,
            "max_output_tokens": self.settings.max_output_tokens,
            "input": [
                {
                    "role": "system",
                    "content": [{"type": "input_text", "text": SYSTEM_PROMPT}],
                },
                {
                    "role": "user",
                    "content": [{"type": "input_text", "text": user_prompt}],
                },
            ],
            "text": {
                "format": {
                    "type": "json_schema",
                    "name": "trust_layer_triage",
                    "strict": True,
                    "schema": TRIAGE_JSON_SCHEMA,
                }
            },
        }

        request = urllib.request.Request(
            self.settings.responses_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.settings.api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        ssl_context = ssl.create_default_context(cafile=certifi.where())

        try:
            with urllib.request.urlopen(request, timeout=self.settings.timeout_seconds, context=ssl_context) as response:
                raw = response.read().decode("utf-8")
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            code = self._classify_provider_error(exc.code, detail)
            raise LLMError("The AI provider could not complete the request.", code=code) from exc
        except urllib.error.URLError as exc:
            raise LLMError("The AI provider is unavailable.", code="provider_error") from exc

        try:
            response_json = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise LLMError("The LLM provider returned invalid JSON.") from exc

        if response_json.get("error"):
            code = self._classify_provider_error(502, json.dumps(response_json["error"], ensure_ascii=False))
            raise LLMError("The AI provider returned an error.", code=code)

        response_text = self._extract_output_text(response_json)
        parsed = self._safe_json_loads(response_text)

        try:
            return TriageResult.model_validate(parsed)
        except Exception as exc:
            raise LLMError("The model returned malformed triage JSON.") from exc

    def _extract_output_text(self, response_json: dict[str, Any]) -> str:
        output_text = response_json.get("output_text")
        if isinstance(output_text, str) and output_text.strip():
            return output_text

        fragments: list[str] = []
        for item in response_json.get("output", []):
            for content in item.get("content", []):
                content_type = content.get("type")
                if content_type in {"output_text", "text"} and content.get("text"):
                    fragments.append(content["text"])
                if content_type == "refusal":
                    raise LLMError(content.get("refusal") or "The model refused the request.")

        if fragments:
            return "".join(fragments)

        choices = response_json.get("choices", [])
        if choices:
            message = choices[0].get("message", {})
            content = message.get("content")
            if isinstance(content, str) and content.strip():
                return content

        raise LLMError("The model response did not contain structured output text.")

    def _safe_json_loads(self, payload: str) -> dict[str, Any]:
        try:
            return json.loads(payload)
        except json.JSONDecodeError:
            start = payload.find("{")
            end = payload.rfind("}")
            if start >= 0 and end > start:
                return json.loads(payload[start : end + 1])
            raise LLMError("The model response could not be recovered as valid JSON.")

    def _classify_provider_error(self, status_code: int, detail: str) -> str:
        detail_lower = detail.lower()
        if "insufficient_quota" in detail_lower or "quota" in detail_lower or "billing" in detail_lower:
            return "budget_exhausted"
        if status_code == 429 or "rate limit" in detail_lower or "rate_limit" in detail_lower:
            return "rate_limited"
        return "provider_error"
