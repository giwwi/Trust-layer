(function () {
  const DEFAULT_BASE_URL = window.TRUST_LAYER_API_BASE || "http://127.0.0.1:8000";

  async function parseResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("__INVALID_RESPONSE__");
    }

    try {
      return await response.json();
    } catch (error) {
      throw new Error("__INVALID_RESPONSE__");
    }
  }

  async function request(path, options) {
    let response;

    try {
      response = await fetch(`${DEFAULT_BASE_URL}${path}`, options);
    } catch (error) {
      throw new Error("__NETWORK__");
    }

    const payload = await parseResponse(response);

    if (!response.ok) {
      const detailObject = payload?.detail && typeof payload.detail === "object" ? payload.detail : {};
      const code =
        typeof detailObject.code === "string"
          ? detailObject.code
          : typeof payload?.code === "string"
            ? payload.code
            : "";
      const detail =
        typeof detailObject.message === "string"
          ? detailObject.message
          : typeof payload?.message === "string"
            ? payload.message
            : typeof payload?.detail === "string"
              ? payload.detail
              : `Request failed with status ${response.status}.`;
      const error = new Error(detail);
      if (code) error.code = code;
      error.status = response.status;
      throw error;
    }

    return payload;
  }

  async function health() {
    return request("/health", { method: "GET" });
  }

  async function extract(file) {
    const formData = new FormData();
    formData.append("file", file);
    return request("/extract", {
      method: "POST",
      body: formData
    });
  }

  async function analyze(text, language, apiKey) {
    const body = { text, language: language || "en" };
    if (apiKey) body.api_key = apiKey;

    return request("/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  }

  window.TrustLayerAPI = {
    health,
    extract,
    analyze,
    getBaseUrl: function () {
      return DEFAULT_BASE_URL;
    }
  };
})();
