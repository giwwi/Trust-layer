from __future__ import annotations

import math
from typing import Any

from .config import Settings
from .extractors import normalize_text
from .llm import OpenAILLMClient
from .schemas import TriageResult


class AnalyzeError(Exception):
    """Raised when analysis cannot be completed."""


def analyze_text(text: str, settings: Settings, client: OpenAILLMClient, language: str = "en") -> TriageResult:
    cleaned = normalize_text(text)
    _validate_text(cleaned, settings)

    truncated = False

    if len(cleaned) <= settings.chunk_size_chars:
        result = client.analyze_text(cleaned, language)
        if truncated:
            result.confidence_note = f"{result.confidence_note} Source text was truncated for this demo."
        return result

    chunks = split_into_chunks(cleaned, settings.chunk_size_chars, settings.max_chunks)
    partials: list[dict[str, Any]] = []
    for index, chunk in enumerate(chunks, start=1):
        partial_result = client.analyze_text(
            f"Chunk {index} of {len(chunks)}.\n\n{chunk}",
            language,
        )
        partials.append(partial_result.model_dump())

    return client.synthesize_partials(partials, truncated, language)


def split_into_chunks(text: str, chunk_size: int, max_chunks: int) -> list[str]:
    paragraphs = [paragraph.strip() for paragraph in text.split("\n\n") if paragraph.strip()]
    if not paragraphs:
        paragraphs = [text]

    chunks: list[str] = []
    current: list[str] = []
    current_size = 0

    for paragraph in paragraphs:
        candidate_size = current_size + len(paragraph) + 2
        if current and candidate_size > chunk_size:
            chunks.append("\n\n".join(current))
            current = [paragraph]
            current_size = len(paragraph)
        else:
            current.append(paragraph)
            current_size = candidate_size

        if len(chunks) >= max_chunks:
            break

    if current and len(chunks) < max_chunks:
        chunks.append("\n\n".join(current))

    if not chunks:
        approximate_chunks = max(1, math.ceil(len(text) / chunk_size))
        approximate_chunks = min(approximate_chunks, max_chunks)
        chunk_length = max(1, len(text) // approximate_chunks)
        chunks = [text[index : index + chunk_length] for index in range(0, len(text), chunk_length)][:max_chunks]

    return chunks


def _validate_text(text: str, settings: Settings) -> None:
    if not text:
        raise AnalyzeError("Please paste text or upload a supported file before running analysis.")
    if len(text) < settings.min_input_chars:
        raise AnalyzeError(
            f"Text is too short for this demo. Please provide at least {settings.min_input_chars} characters of analytical text."
        )
    if len(text) > settings.max_input_chars:
        raise AnalyzeError(
            f"This demo accepts at most {settings.max_input_chars} characters. Please shorten the text or use the example."
        )
