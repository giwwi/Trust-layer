from __future__ import annotations

import io
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree


PDF_UNSUPPORTED_MESSAGE = "PDF support is not available in this demo yet. Please upload .txt, .md, or .docx."
UNSUPPORTED_TYPE_MESSAGE = "Unsupported file type. Please upload .txt, .md, or .docx."


class ExtractionError(Exception):
    """Raised when file extraction fails."""


class UnsupportedFileTypeError(ExtractionError):
    """Raised when the uploaded file type is not supported."""


def normalize_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"[ \t]*\n[ \t]*", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_text(filename: str, payload: bytes) -> str:
    suffix = Path(filename or "").suffix.lower()
    if suffix == ".pdf":
        raise UnsupportedFileTypeError(PDF_UNSUPPORTED_MESSAGE)
    if suffix not in {".txt", ".md", ".docx"}:
        raise UnsupportedFileTypeError(UNSUPPORTED_TYPE_MESSAGE)
    if suffix in {".txt", ".md"}:
        return _extract_plain_text(payload)
    return _extract_docx_text(payload)


def _extract_plain_text(payload: bytes) -> str:
    for encoding in ("utf-8", "utf-8-sig", "cp1251", "latin-1"):
        try:
            return normalize_text(payload.decode(encoding))
        except UnicodeDecodeError:
            continue
    raise ExtractionError("Could not decode the uploaded text file.")


def _extract_docx_text(payload: bytes) -> str:
    try:
        with zipfile.ZipFile(io.BytesIO(payload)) as archive:
            document_xml = archive.read("word/document.xml")
    except KeyError as exc:
        raise ExtractionError("The .docx file is missing document text.") from exc
    except zipfile.BadZipFile as exc:
        raise ExtractionError("The uploaded .docx file could not be read.") from exc

    try:
        root = ElementTree.fromstring(document_xml)
    except ElementTree.ParseError as exc:
        raise ExtractionError("The uploaded .docx file contains invalid XML.") from exc

    namespace = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    paragraphs: list[str] = []

    for paragraph in root.findall(".//w:p", namespace):
        runs = [node.text for node in paragraph.findall(".//w:t", namespace) if node.text]
        text = "".join(runs).strip()
        if text:
            paragraphs.append(text)

    if not paragraphs:
        raise ExtractionError("No readable text was found in the uploaded .docx file.")

    return normalize_text("\n\n".join(paragraphs))
