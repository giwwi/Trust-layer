from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field


class RouteRecommendation(str, Enum):
    stop_here = "stop_here"
    bounded_review = "bounded_review"
    escalate = "escalate"


class PassportRecommendation(str, Enum):
    not_warranted = "not_warranted"
    optional = "optional"
    warranted = "warranted"


class OutputLanguage(str, Enum):
    en = "en"
    ru = "ru"


class Zone(BaseModel):
    heading: str = Field(min_length=1, max_length=120)
    summary: str = Field(min_length=1, max_length=420)
    source_snippet: str = Field(default="", max_length=1600)
    source_location: str = Field(default="", max_length=180)


class ExtractResponse(BaseModel):
    text: str


class AnalyzeRequest(BaseModel):
    text: str
    language: OutputLanguage = OutputLanguage.en
    api_key: str | None = Field(default=None, max_length=400)


class TriageResult(BaseModel):
    document_type: str = Field(min_length=1, max_length=180)
    probable_central_argument: str = Field(min_length=1, max_length=420)
    claim_zones: list[Zone] = Field(default_factory=list)
    evidence_areas: list[Zone] = Field(default_factory=list)
    uncertainty_zones: list[Zone] = Field(default_factory=list)
    review_focus: list[str] = Field(default_factory=list)
    route_recommendation: RouteRecommendation
    route_reason: str = Field(min_length=1, max_length=420)
    passport_recommendation: PassportRecommendation
    passport_reason: str = Field(min_length=1, max_length=420)
    confidence_note: str = Field(min_length=1, max_length=420)


class HealthResponse(BaseModel):
    status: str
    model: str
