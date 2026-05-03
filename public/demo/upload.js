(function () {
  const ACCEPT = ".txt,.md,.docx";

  async function extractFile(file) {
    if (!file) {
      throw new Error("No file selected.");
    }

    const extension = fileExtension(file.name);
    if (extension === ".pdf") {
      throw new Error("PDF support is not available in this demo yet. Please paste text or upload .txt, .md, or .docx.");
    }

    if (extension === ".txt" || extension === ".md") {
      return ensureReadableText(await file.text());
    }

    if (extension === ".docx") {
      try {
        return ensureReadableText(await extractDocxInBrowser(file));
      } catch (localError) {
        const backendText = await tryBackendExtraction(file);
        if (backendText) return backendText;
        throw localError;
      }
    }

    throw new Error("Unsupported file type. Please upload .txt, .md, or .docx.");
  }

  function fileExtension(fileName) {
    const match = String(fileName || "").toLowerCase().match(/\.[^.]+$/);
    return match ? match[0] : "";
  }

  async function tryBackendExtraction(file) {
    try {
      const response = await window.TrustLayerAPI?.extract?.(file);
      return normalizeText(response?.text || "");
    } catch (_error) {
      return "";
    }
  }

  async function extractDocxInBrowser(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const entry = findZipEntry(bytes, "word/document.xml");
    if (!entry) {
      throw new Error("Could not extract this .docx in the browser. Please paste text or upload .txt/.md.");
    }

    const compressed = bytes.slice(entry.dataOffset, entry.dataOffset + entry.compressedSize);
    const xmlBytes =
      entry.compressionMethod === 0
        ? compressed
        : entry.compressionMethod === 8
          ? await inflateRaw(compressed)
          : null;

    if (!xmlBytes) {
      throw new Error("Could not extract this .docx in the browser. Please paste text or upload .txt/.md.");
    }

    const xml = new TextDecoder("utf-8").decode(xmlBytes);
    return extractTextFromDocumentXml(xml);
  }

  function findZipEntry(bytes, wantedName) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const eocdOffset = findEndOfCentralDirectory(view);
    if (eocdOffset < 0) return null;

    const centralOffset = view.getUint32(eocdOffset + 16, true);
    const centralSize = view.getUint32(eocdOffset + 12, true);
    let offset = centralOffset;
    const end = centralOffset + centralSize;
    const decoder = new TextDecoder("utf-8");

    while (offset + 46 <= end && view.getUint32(offset, true) === 0x02014b50) {
      const compressionMethod = view.getUint16(offset + 10, true);
      const compressedSize = view.getUint32(offset + 20, true);
      const fileNameLength = view.getUint16(offset + 28, true);
      const extraLength = view.getUint16(offset + 30, true);
      const commentLength = view.getUint16(offset + 32, true);
      const localHeaderOffset = view.getUint32(offset + 42, true);
      const nameStart = offset + 46;
      const nameEnd = nameStart + fileNameLength;
      const entryName = decoder.decode(bytes.slice(nameStart, nameEnd));

      if (entryName === wantedName) {
        if (view.getUint32(localHeaderOffset, true) !== 0x04034b50) return null;
        const localNameLength = view.getUint16(localHeaderOffset + 26, true);
        const localExtraLength = view.getUint16(localHeaderOffset + 28, true);
        const dataOffset = localHeaderOffset + 30 + localNameLength + localExtraLength;
        return {
          compressionMethod,
          compressedSize,
          dataOffset
        };
      }

      offset = nameEnd + extraLength + commentLength;
    }

    return null;
  }

  function findEndOfCentralDirectory(view) {
    const minOffset = Math.max(0, view.byteLength - 65557);
    for (let offset = view.byteLength - 22; offset >= minOffset; offset -= 1) {
      if (view.getUint32(offset, true) === 0x06054b50) return offset;
    }
    return -1;
  }

  async function inflateRaw(bytes) {
    if (typeof DecompressionStream === "undefined") {
      throw new Error("Could not extract this .docx in the browser. Please paste text or upload .txt/.md.");
    }

    const formats = ["deflate-raw", "deflate"];
    for (const format of formats) {
      try {
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(format));
        return new Uint8Array(await new Response(stream).arrayBuffer());
      } catch (_error) {
        // Some browsers support only one of the two deflate labels.
      }
    }

    throw new Error("Could not extract this .docx in the browser. Please paste text or upload .txt/.md.");
  }

  function extractTextFromDocumentXml(xml) {
    const paragraphs = String(xml || "").match(/<w:p[\s\S]*?<\/w:p>/g) || [];
    const lines = paragraphs
      .map((paragraph) => {
        const runs = [];
        paragraph.replace(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g, (_match, text) => {
          runs.push(decodeXml(text));
          return "";
        });
        return runs.join("");
      })
      .map((line) => line.trim())
      .filter(Boolean);

    return normalizeText(lines.join("\n\n"));
  }

  function decodeXml(value) {
    return String(value || "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)))
      .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCharCode(parseInt(code, 16)));
  }

  function ensureReadableText(text) {
    const normalized = normalizeText(text);
    if (!normalized) {
      throw new Error("No readable text was found in the uploaded file.");
    }
    return normalized;
  }

  function normalizeText(text) {
    return String(text || "")
      .replace(/\u0000/g, "")
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  window.TrustLayerUpload = {
    ACCEPT,
    extractFile
  };
})();
