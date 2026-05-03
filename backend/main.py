from __future__ import annotations

import logging
from dataclasses import replace
from datetime import datetime, timezone
from threading import Lock

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .analyze import AnalyzeError, analyze_text
from .config import settings
from .extractors import ExtractionError, extract_text, normalize_text
from .llm import LLMError, OpenAILLMClient
from .schemas import AnalyzeRequest, ExtractResponse, HealthResponse, TriageResult


logger = logging.getLogger("trust_layer.public_demo")


class PublicDemoLimitError(Exception):
    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code


class PublicDemoLimiter:
    def __init__(self) -> None:
        self._lock = Lock()
        self._day = self._today()
        self._requests_by_ip: dict[str, int] = {}
        self._total_requests = 0

    def check_and_increment(self, client_ip: str) -> None:
        with self._lock:
            self._reset_if_new_day()

            if settings.public_daily_request_limit > 0 and self._total_requests >= settings.public_daily_request_limit:
                raise PublicDemoLimitError(
                    "budget_exhausted",
                    "Live AI budget reached for today. You can still explore the workflow with a built-in example.",
                )

            current_ip_count = self._requests_by_ip.get(client_ip, 0)
            if settings.max_requests_per_ip_per_day > 0 and current_ip_count >= settings.max_requests_per_ip_per_day:
                raise PublicDemoLimitError(
                    "rate_limited",
                    "Daily live AI request limit reached for this client. Please use the example or try again tomorrow.",
                )

            self._requests_by_ip[client_ip] = current_ip_count + 1
            self._total_requests += 1

    def _reset_if_new_day(self) -> None:
        today = self._today()
        if today == self._day:
            return
        self._day = today
        self._requests_by_ip.clear()
        self._total_requests = 0

    def _today(self) -> str:
        return datetime.now(timezone.utc).date().isoformat()


app = FastAPI(title="Trust Layer Demo API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm_client = OpenAILLMClient(settings)
limiter = PublicDemoLimiter()


def public_error(code: str, message: str, status_code: int) -> HTTPException:
    return HTTPException(status_code=status_code, detail={"code": code, "message": message})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={"detail": {"code": "invalid_input", "message": "Invalid request for this public demo."}},
    )


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", model=settings.model_name)


@app.post("/extract", response_model=ExtractResponse)
async def extract(file: UploadFile = File(...)) -> ExtractResponse:
    try:
        payload = await file.read()
        text = extract_text(file.filename or "", payload)
    except ExtractionError as exc:
        raise public_error("invalid_input", str(exc), 400) from exc

    return ExtractResponse(text=text)


@app.post("/analyze", response_model=TriageResult)
def analyze(request: Request, payload: AnalyzeRequest) -> TriageResult:
    request_length = len(payload.text or "")
    try:
        cleaned = normalize_text(payload.text)
        supplied_api_key = (payload.api_key or "").strip()
        _validate_public_demo_text(cleaned, has_own_key=bool(supplied_api_key))
        client = llm_client
        effective_settings = settings

        if supplied_api_key:
            input_size = max(len(cleaned), settings.max_input_chars, settings.chunk_size_chars)
            effective_settings = replace(
                settings,
                api_key=supplied_api_key,
                max_input_chars=input_size,
                chunk_size_chars=input_size,
            )
            client = OpenAILLMClient(effective_settings)
        else:
            limiter.check_and_increment(_client_ip(request))

        result = analyze_text(cleaned, effective_settings, client, payload.language.value)
        log_public_demo_request(request_length, True)
        return result
    except PublicDemoLimitError as exc:
        log_public_demo_request(request_length, False)
        status_code = 402 if exc.code == "budget_exhausted" else 429
        raise public_error(exc.code, str(exc), status_code) from exc
    except AnalyzeError as exc:
        log_public_demo_request(request_length, False)
        raise public_error("invalid_input", str(exc), 400) from exc
    except LLMError as exc:
        log_public_demo_request(request_length, False)
        status_code = 429 if exc.code == "rate_limited" else 402 if exc.code == "budget_exhausted" else 502
        raise public_error(exc.code, str(exc), status_code) from exc


def _validate_public_demo_text(text: str, has_own_key: bool = False) -> None:
    if not text:
        raise AnalyzeError("Please paste text or upload a supported file before running analysis.")
    if len(text) < settings.min_input_chars:
        raise AnalyzeError(
            f"Text is too short for this demo. Please provide at least {settings.min_input_chars} characters of analytical text."
        )
    if has_own_key:
        return
    max_chars = settings.max_input_chars
    if len(text) > max_chars:
        raise AnalyzeError(
            f"This demo accepts at most {max_chars} characters. Please shorten the text or use the example."
        )


def _client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for", "")
    if forwarded_for:
        return forwarded_for.split(",", 1)[0].strip() or "unknown"
    return request.client.host if request.client else "unknown"


def log_public_demo_request(request_length: int, success: bool) -> None:
    logger.info(
        "public_demo_request timestamp=%s request_length=%s success=%s",
        datetime.now(timezone.utc).isoformat(),
        request_length,
        success,
    )
