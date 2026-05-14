from __future__ import annotations

import os
from dataclasses import dataclass


def _get_int(name: str, default: int) -> int:
    value = os.getenv(name)
    if value is None:
        return default
    try:
        return int(value)
    except ValueError:
        return default


def _get_float(name: str, default: float) -> float:
    value = os.getenv(name)
    if value is None:
        return default
    try:
        return float(value)
    except ValueError:
        return default


@dataclass(frozen=True)
class Settings:
    api_key: str = os.getenv("OPENAI_API_KEY") or ""
    model_name: str = os.getenv("PUBLIC_DEMO_MODEL") or os.getenv("OPENAI_MODEL") or "gpt-4o-mini"
    responses_url: str = os.getenv("OPENAI_RESPONSES_URL") or "https://api.openai.com/v1/responses"
    min_input_chars: int = _get_int("TRUST_LAYER_MIN_INPUT_CHARS", 150)
    max_input_chars: int = _get_int("MAX_INPUT_CHARS", 20000)
    chunk_size_chars: int = _get_int("TRUST_LAYER_CHUNK_SIZE_CHARS", 8000)
    timeout_seconds: float = _get_float("OPENAI_TIMEOUT_SECONDS", 60.0)
    max_chunks: int = _get_int("TRUST_LAYER_MAX_CHUNKS", 1)
    max_output_tokens: int = _get_int("MAX_OUTPUT_TOKENS", 1200)
    max_requests_per_ip_per_day: int = _get_int("MAX_REQUESTS_PER_IP_PER_DAY", 3)
    public_daily_request_limit: int = _get_int("PUBLIC_DAILY_REQUEST_LIMIT", 200)


settings = Settings()
