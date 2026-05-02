(function () {
  const demoState = {
    fileName: "",
    extractedText: "",
    pastedText: "",
    phase: "idle",
    error: "",
    result: null,
    trace: null,
    runMode: "example",
    ownApiKey: "",
    textTypeOverride: ""
  };

  const conceptualTypeIds = new Set(["conceptual", "theoretical", "book"]);

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getCopy() {
    return window.TrustLayerRuntime?.getUI?.()?.demo || {
      eyebrow: "Demo",
      title: "Upload or paste text",
      copy: "Upload .txt, .md, or .docx. Then run an AI draft.",
      uploadLabel: "Upload file",
      uploadHint: "Supported: .txt, .md, .docx.",
      runModeLabel: "Run mode",
      runModeExample: "Example",
      runModeExampleHint: "Works immediately. No API key needed.",
      runModePublic: "Public live demo",
      runModePublicHint: "Uses a small shared budget. Short excerpts only.",
      advanced: "Advanced",
      runModeOwnKey: "Own API key",
      runModeOwnKeyHint: "Optional. Your key is used only for this request. Use a temporary low-limit key.",
      ownApiKeyLabel: "OpenAI API key",
      ownApiKeyPlaceholder: "Paste a temporary low-limit key",
      ownApiKeyWarning: "For public demos, use a temporary key with a low spending limit.",
      ownApiKeyRequired: "Paste an API key or choose another run mode.",
      byokFailed: "The request failed. You can still explore the workflow with an example.",
      liveInputNote: "Live AI demo is limited. Paste a short analytical text, not confidential material.",
      privacyNote: "Text is sent to the AI provider for analysis and is not stored by this demo.",
      characterLimit: "Limit: 8,000 characters.",
      tooLong:
        "This demo accepts short excerpts only. Please shorten the text or use the example.",
      analyze: "Run AI draft",
      clear: "Clear",
      loadingExtract: "Reading file...",
      loadingAnalyze: "Running AI draft...",
      emptyState: "Upload a file, then run an AI draft.",
      readyState: "Text extracted. Run AI draft.",
      resultEyebrow: "AI draft",
      provisionalNote: "This is a first reading, not expert review. Please check and edit it.",
      useInWorkflow: "Check and edit",
      continueAsReviewer: "Check and edit",
      sourceTrace: "Where this came from",
      sourceTraceNote: "This excerpt may explain the AI reading. Check it before accepting the result.",
      sourceTraceMissing: "No source trace returned for this item.",
      sourceLocation: "Location",
      close: "Close",
      fileReady: "Selected file",
      documentType: "Document type",
      textTypeLabel: "What kind of text is this?",
      textTypeHelper: "This affects which questions the first reading asks.",
      textTypeResult: "Suggested text type",
      textTypeGuessHelper: "The system guessed this. Change it if the text is being read in the wrong mode.",
      typeCaution: "This reading depends on the text type. If the type is wrong, the result may be misleading.",
      unusualIdeaTitle: "Possible unusual idea",
      unusualIdeaCopy:
        "This text may be unusual rather than simply weak. Do not stop it only because it does not fit the standard structure.",
      textTypes: {
        policy: "Policy / decision memo",
        research: "Research draft",
        conceptual: "Conceptual essay",
        theoretical: "Theoretical / philosophical text",
        book: "Book proposal",
        market: "Market / consulting report",
        not_sure: "Not sure"
      },
      genreLabels: {
        policy: {
          central: "Main claim",
          claims: "What the text relies on",
          attention: "Risks",
          check: "What to check next",
          next: "Suggested next step",
          evidence: "Support details",
          uncertainty: "Risks"
        },
        conceptual: {
          central: "Core idea",
          claims: "New distinction",
          attention: "Where the argument may break",
          check: "Who should review it",
          next: "Suggested next step",
          evidence: "Internal logic",
          uncertainty: "Hidden assumptions"
        },
        theoretical: {
          central: "Central problem",
          claims: "Key concepts",
          attention: "Internal tensions",
          check: "What kind of critique is needed",
          next: "Suggested next step",
          evidence: "Assumptions",
          uncertainty: "Alternative readings"
        },
        book: {
          central: "Main promise",
          claims: "Narrative architecture",
          attention: "What needs attention",
          check: "Best next reader",
          next: "Suggested next step",
          evidence: "Reader value",
          uncertainty: "Originality"
        },
        market: {
          central: "Main claim",
          claims: "What supports it",
          attention: "Template risk",
          check: "What to verify",
          next: "Suggested next step",
          evidence: "Borrowed authority",
          uncertainty: "What needs attention"
        },
        not_sure: {
          central: "What this text is about",
          claims: "Main claims",
          attention: "What needs attention",
          check: "What to check next",
          next: "Suggested next step",
          evidence: "What the text relies on",
          uncertainty: "What needs attention"
        }
      },
      centralArgument: "What this text is about",
      claimZones: "Main claims",
      weakSpots: "What needs attention",
      evidenceAreas: "Evidence",
      uncertaintyZones: "Uncertainty",
      reviewFocus: "What to check next",
      suggestedRoute: "Suggested next step",
      routeReason: "Why this step",
      passportWarranted: "Review note",
      passportReason: "Review note reason",
      confidenceNote: "Caution",
      showDetails: "Show details",
      apiOffline:
        "Live AI demo is unavailable right now. You can still explore the full workflow with a built-in example.",
      liveUnavailable:
        "Live AI demo is unavailable right now. You can still explore the full workflow with a built-in example.",
      budgetExhausted:
        "Live AI budget reached for today. You can still explore the workflow with a built-in example.",
      rateLimited:
        "Live AI demo is busy right now. Please try again later or use the example.",
      invalidInput:
        "This input cannot be analyzed in the public demo. Please shorten it or use the example.",
      providerError:
        "Live AI demo is unavailable right now. You can still explore the full workflow with a built-in example.",
      openExample: "Open example",
      invalidServerResponse: "The server returned an invalid response.",
      routeLabels: {
        stop_here: "Stop here",
        bounded_review: "Short review",
        escalate: "Escalate"
      },
      passportLabels: {
        not_warranted: "Not warranted",
        optional: "Optional",
        warranted: "Warranted"
      }
    };
  }

  function localizeError(error, copy) {
    const code = typeof error?.code === "string" ? error.code : "";
    const raw = String(error?.message || error || "").trim();
    if (!raw) return "";
    const publicDemo = window.PUBLIC_DEMO_CONFIG?.PUBLIC_DEMO_MODE !== false;
    const liveFallback = copy.liveUnavailable || copy.apiOffline || "";
    if (code === "budget_exhausted") return copy.budgetExhausted || liveFallback;
    if (code === "rate_limited") return copy.rateLimited || liveFallback;
    if (code === "provider_error") return copy.providerError || liveFallback;
    if (raw === "__NETWORK__") return publicDemo ? liveFallback : copy.apiOffline;
    if (raw === "__INVALID_RESPONSE__") return publicDemo ? liveFallback : copy.invalidServerResponse;
    if (/^This demo accepts at most/i.test(raw)) return copy.tooLong || copy.invalidInput || raw;
    if (/^Invalid request for this public demo/i.test(raw)) return copy.invalidInput || raw;

    const lang = window.TrustLayerRuntime?.getLang?.() || "en";
    const rules = [
      [/^Unsupported file type/, "Неподдерживаемый формат. Загрузите .txt, .md или .docx."],
      [/^PDF support is not available/, "PDF в этом демо пока не поддерживается. Загрузите .txt, .md или .docx."],
      [/^Please paste text or upload/, "Загрузите файл перед запуском."],
      [/^Text is too short/, "Текст слишком короткий для первого прохода."],
      [/^Missing API key/, liveFallback],
      [/^Could not reach the LLM provider/, liveFallback],
      [/^The model returned malformed triage JSON/, liveFallback],
      [/^The model response could not be recovered/, liveFallback],
      [/certificate verify failed|CERTIFICATE_VERIFY_FAILED|SSL:/i, liveFallback],
      [/Request failed with status/i, liveFallback]
    ];

    for (const [pattern, replacement] of rules) {
      if (pattern.test(raw)) return lang === "en" && replacement !== liveFallback ? raw : replacement;
    }

    if (code === "invalid_input") return copy.invalidInput || raw;
    return publicDemo ? liveFallback : raw;
  }

  function render() {
    const root = document.getElementById("live-demo-root");
    if (!root) return;

    const copy = getCopy();
    const busy = demoState.phase !== "idle";
    const busyLabel = demoState.phase === "extracting" ? copy.loadingExtract : copy.loadingAnalyze;
    const sourceText = getSourceText();
    const tooLong = isInputTooLong(sourceText);
    const canAnalyze = canRunAnalysis();

    root.innerHTML = `
      ${
        copy.hideIntro
          ? ""
          : `
            <div class="eyebrow">${copy.eyebrow}</div>
            <div class="section-title">${copy.title}</div>
            <div class="small" style="margin-top:12px;">${copy.copy}</div>
          `
      }
      <div class="demo-grid">
        <div class="panel-strong demo-panel">
          ${renderRunModes(copy, busy)}
          <div class="eyebrow">${copy.uploadLabel}</div>
          <div class="demo-upload-row">
            <input class="file-field" type="file" data-demo-file accept="${window.TrustLayerUpload.ACCEPT}" ${busy ? "disabled" : ""} />
            <div class="tiny">${copy.uploadHint}</div>
            ${demoState.fileName ? `<div class="tiny">${copy.fileReady}: ${escapeHtml(demoState.fileName)}</div>` : ""}
            <div class="eyebrow" style="margin-top:8px;">${copy.inputLabel || "Text"}</div>
            <textarea class="text-field short" data-demo-paste placeholder="${escapeHtml(copy.inputPlaceholder || "")}" ${busy ? "disabled" : ""}>${escapeHtml(demoState.pastedText)}</textarea>
            <div class="tiny">${escapeHtml(copy.liveInputNote || "")}</div>
            <div class="tiny">${escapeHtml(copy.privacyNote || "")}</div>
            <div class="tiny">${escapeHtml(copy.characterLimit || "")} ${formatCharacterCount(sourceText)}</div>
            ${tooLong ? `<div class="notice warn" style="margin-top:12px;">${escapeHtml(copy.tooLong || "")}<div class="section-actions" style="margin-top:14px;"><button class="cta" data-demo-open-example>${escapeHtml(copy.openExample || "Open example")}</button></div></div>` : ""}
          </div>
          <div class="section-actions">
            <button class="cta primary" data-demo-analyze ${canAnalyze ? "" : "disabled"}>${demoState.runMode === "example" ? escapeHtml(copy.openExample || "Open example") : escapeHtml(copy.analyze)}</button>
            <button class="cta" data-demo-clear ${busy ? "disabled" : ""}>${copy.clear}</button>
          </div>
          ${
            demoState.error
              ? `
                <div class="notice warn" style="margin-top:16px;">
                  ${escapeHtml(demoState.error)}
                  ${isLiveUnavailableError(demoState.error, copy) ? `<div class="section-actions" style="margin-top:14px;"><button class="cta" data-demo-open-example>${escapeHtml(copy.openExample || "Open example")}</button></div>` : ""}
                </div>
              `
              : ""
          }
        </div>

        <div class="panel demo-panel">
          <div class="eyebrow">${copy.resultEyebrow}</div>
          ${renderResult(copy)}
        </div>
      </div>
      ${renderTracePopup(copy)}
    `;

    bind(root);
    window.TrustLayerRuntime?.setFlowStep?.(demoState.result || demoState.phase === "analyzing" ? 2 : 1);
  }

  function renderResult(copy) {
    if (demoState.phase === "analyzing") {
      return `<div class="notice" style="margin-top:16px;">${copy.loadingAnalyze}</div>`;
    }

    if (demoState.phase === "extracting") {
      return `<div class="notice" style="margin-top:16px;">${copy.loadingExtract}</div>`;
    }

    const result = demoState.result;
    if (!result) {
      const empty = getSourceText() ? copy.readyState : copy.emptyState;
      return `<div class="demo-empty" style="margin-top:16px;">${empty}</div>`;
    }

    const suggestedTextTypeId = inferTextTypeId(result);
    const textTypeId = selectedTextTypeId(result);
    const textTypeLabel = textTypeLabelFor(copy, textTypeId);
    const labels = labelsForTextType(copy, textTypeId);
    const showUnusualNotice = conceptualTypeIds.has(textTypeId);

    return `
      <div class="tiny" style="margin-top:14px;">${copy.provisionalNote}</div>
      <div class="helper-strip" style="margin-top:14px;">
        <span class="pill">${escapeHtml(copy.textTypeResult || copy.documentType)}: ${escapeHtml(textTypeLabelFor(copy, suggestedTextTypeId))}</span>
        ${result.document_type ? `<span class="pill">${escapeHtml(copy.documentType)}: ${escapeHtml(result.document_type)}</span>` : ""}
      </div>
      <div class="tiny" style="margin-top:12px;">${escapeHtml(copy.textTypeGuessHelper || copy.typeCaution || "")}</div>
      <div class="field-card" style="margin-top:14px;">
        <strong>${escapeHtml(copy.textTypeLabel || "What kind of text is this?")}</strong>
        <select class="text-input" style="margin-top:10px;" data-demo-text-type>
          ${renderTextTypeOptions(copy, textTypeId)}
        </select>
        <div class="tiny" style="margin-top:8px;">${escapeHtml(copy.textTypeHelper || "")}</div>
      </div>
      <div class="tiny" style="margin-top:12px;">${escapeHtml(copy.typeCaution || "")}</div>
      ${
        showUnusualNotice
          ? `<div class="notice" style="margin-top:14px;"><strong>${escapeHtml(copy.unusualIdeaTitle || "")}</strong><br />${escapeHtml(copy.unusualIdeaCopy || "")}</div>`
          : ""
      }
      <div class="demo-section-list">
        ${summarySection(labels.central, `<p>${escapeHtml(result.probable_central_argument)}</p>`)}
        ${summaryZoneSection(labels.claims, result.claim_zones, "claim_zones", copy)}
        ${summaryRowsSection(labels.attention, weakRows(result), copy)}
        ${summaryListSection(labels.check, result.review_focus)}
        ${summarySection(labels.next, nextStepBody(copy, result))}
        <div class="section-actions" style="margin-top:2px;">
          <button class="cta primary" data-demo-use-workflow>${copy.useInWorkflow || copy.continueAsReviewer}</button>
        </div>
        <details class="demo-details">
          <summary>${escapeHtml(copy.showDetails || "Show details")}</summary>
          <div class="demo-section-list">
            ${section(copy.documentType, `<p>${escapeHtml(result.document_type)}</p>`)}
            ${zoneSection(labels.claims, result.claim_zones, "claim_zones", copy)}
            ${zoneSection(labels.evidence, result.evidence_areas, "evidence_areas", copy)}
            ${zoneSection(labels.uncertainty, result.uncertainty_zones, "uncertainty_zones", copy)}
            ${listSection(labels.check, result.review_focus)}
            ${decisionSection(copy, result)}
            ${section(copy.confidenceNote, `<p>${escapeHtml(result.confidence_note)}</p>`)}
          </div>
        </details>
      </div>
    `;
  }

  function renderTracePopup(copy) {
    if (!demoState.trace) return "";

    return `
      <div class="source-trace-backdrop" data-demo-close-trace>
        <div class="source-trace-card" role="dialog" aria-modal="true" aria-label="${escapeHtml(copy.sourceTrace)}" onclick="event.stopPropagation()">
          <div class="eyebrow">${escapeHtml(copy.sourceTrace)}</div>
          <h3>${escapeHtml(demoState.trace.title || copy.sourceTrace)}</h3>
          <p class="tiny">${escapeHtml(copy.sourceTraceNote)}</p>
          ${demoState.trace.location ? `<div class="tiny" style="margin-top:12px;"><strong>${escapeHtml(copy.sourceLocation)}:</strong> ${escapeHtml(demoState.trace.location)}</div>` : ""}
          <blockquote>${escapeHtml(demoState.trace.snippet || copy.sourceTraceMissing)}</blockquote>
          <div class="section-actions">
            <button class="cta" data-demo-close-trace>${escapeHtml(copy.close)}</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderRunModes(copy, busy) {
    const byokEnabled = window.PUBLIC_DEMO_CONFIG?.BYOK_ENABLED !== false;

    return `
      <div class="field-card" style="margin-bottom:18px;">
        <div class="eyebrow">${escapeHtml(copy.runModeLabel || "Run mode")}</div>
        <label class="tiny" style="display:block; margin-top:10px;">
          <input type="radio" name="trust-layer-run-mode" value="example" data-demo-run-mode ${demoState.runMode === "example" ? "checked" : ""} ${busy ? "disabled" : ""} />
          <strong>${escapeHtml(copy.runModeExample || "Example")}</strong> — ${escapeHtml(copy.runModeExampleHint || "")}
        </label>
        <label class="tiny" style="display:block; margin-top:10px;">
          <input type="radio" name="trust-layer-run-mode" value="public" data-demo-run-mode ${demoState.runMode === "public" ? "checked" : ""} ${busy ? "disabled" : ""} />
          <strong>${escapeHtml(copy.runModePublic || "Public live demo")}</strong> — ${escapeHtml(copy.runModePublicHint || "")}
        </label>
        ${
          byokEnabled
            ? `
              <details style="margin-top:12px;" ${demoState.runMode === "own_key" ? "open" : ""}>
                <summary class="tiny"><strong>${escapeHtml(copy.advanced || "Advanced")}</strong></summary>
                <label class="tiny" style="display:block; margin-top:10px;">
                  <input type="radio" name="trust-layer-run-mode" value="own_key" data-demo-run-mode ${demoState.runMode === "own_key" ? "checked" : ""} ${busy ? "disabled" : ""} />
                  <strong>${escapeHtml(copy.runModeOwnKey || "Own API key")}</strong> — ${escapeHtml(copy.runModeOwnKeyHint || "")}
                </label>
                <div style="margin-top:10px;">
                  <label class="tiny" for="trust-layer-own-key">${escapeHtml(copy.ownApiKeyLabel || "OpenAI API key")}</label>
                  <input id="trust-layer-own-key" class="text-input" type="password" data-demo-own-key placeholder="${escapeHtml(copy.ownApiKeyPlaceholder || "")}" value="${escapeHtml(demoState.ownApiKey)}" ${busy || demoState.runMode !== "own_key" ? "disabled" : ""} autocomplete="off" />
                </div>
                <div class="tiny" style="margin-top:8px;">${escapeHtml(copy.ownApiKeyWarning || "")}</div>
                <div class="tiny" data-demo-own-key-required style="margin-top:8px; ${demoState.runMode === "own_key" && !demoState.ownApiKey.trim() ? "" : "display:none;"}">${escapeHtml(copy.ownApiKeyRequired || "")}</div>
              </details>
            `
            : ""
        }
      </div>
    `;
  }

  function decisionSection(copy, result) {
    const routeLabel = copy.routeLabels[result.route_recommendation] || result.route_recommendation;
    const passportLabel = passportLabelFor(copy, result);

    return section(
      copy.suggestedRoute,
      `
        <p><strong>${escapeHtml(routeLabel)}</strong><br />${escapeHtml(result.route_reason)}</p>
        <p><strong>${escapeHtml(copy.passportWarranted)}: ${escapeHtml(passportLabel)}</strong><br />${escapeHtml(result.passport_reason || "")}</p>
      `
    );
  }

  function passportLabelFor(copy, result) {
    const value = result.passport_recommendation || result.passport_warranted;
    return copy.passportLabels?.[value] || value || "Passport undecided";
  }

  function inferTextTypeId(result) {
    const raw = `${result?.text_type || ""} ${result?.document_type || ""}`.toLowerCase();

    if (/theor|philosoph|formal|ontology|epistem|metaphys|normative|теорет|философ|формальн|онтолог|эпистем/.test(raw)) {
      return "theoretical";
    }
    if (/book|synopsis|chapter|manuscript|книг|книжн|глава|рукопис/.test(raw)) {
      return "book";
    }
    if (/concept|essay|manifesto|reflection|концепт|эссе|манифест|рефлекс/.test(raw)) {
      return "conceptual";
    }
    if (/market|consult|industry|vendor|business|strategy|white paper|рын|консалт|индустр|бизнес|стратег|white paper/.test(raw)) {
      return "market";
    }
    if (/policy|decision|memo|brief|govern|administr|municip|управлен|политич|записк|мемо|администр|муницип/.test(raw)) {
      return "policy";
    }
    if (/research|draft|working paper|paper|study|empirical|method|исслед|черновик|рабоч|стать|эмпир|метод/.test(raw)) {
      return "research";
    }
    return "not_sure";
  }

  function textTypeLabelFor(copy, textTypeId) {
    return copy.textTypes?.[textTypeId] || copy.textTypes?.not_sure || textTypeId || "Not sure";
  }

  function selectedTextTypeId(result) {
    return demoState.textTypeOverride || inferTextTypeId(result);
  }

  function renderTextTypeOptions(copy, selectedId) {
    const ids = ["policy", "research", "conceptual", "theoretical", "book", "market", "not_sure"];
    return ids
      .map((id) => `<option value="${id}" ${id === selectedId ? "selected" : ""}>${escapeHtml(textTypeLabelFor(copy, id))}</option>`)
      .join("");
  }

  function labelsForTextType(copy, textTypeId) {
    const base = {
      central: copy.centralArgument,
      claims: copy.claimZones,
      attention: copy.weakSpots,
      check: copy.reviewFocus,
      next: copy.suggestedRoute,
      evidence: copy.evidenceAreas,
      uncertainty: copy.uncertaintyZones
    };
    return { ...base, ...(copy.genreLabels?.[textTypeId] || {}) };
  }

  function currentSourceContext(copy = getCopy()) {
    const result = demoState.result;
    const textType = result ? selectedTextTypeId(result) : "";
    return {
      filename: demoState.fileName,
      extractedText: demoState.extractedText,
      pastedText: demoState.pastedText,
      documentType: result?.document_type || "",
      textType,
      textTypeLabel: textType ? textTypeLabelFor(copy, textType) : "",
      unusualIdea: textType ? conceptualTypeIds.has(textType) : false
    };
  }

  function section(title, body) {
    return `<div class="demo-zone-card"><div class="eyebrow">${title}</div>${body}</div>`;
  }

  function summarySection(title, body) {
    return `<div class="demo-zone-card demo-summary-card"><div class="eyebrow">${escapeHtml(title)}</div>${body}</div>`;
  }

  function nextStepBody(copy, result) {
    const routeLabel = copy.routeLabels[result.route_recommendation] || result.route_recommendation;
    return `<p><strong>${escapeHtml(routeLabel)}</strong><br />${escapeHtml(result.route_reason || "")}</p>`;
  }

  function summaryZoneSection(title, items, group, copy) {
    const rows = Array.isArray(items) ? items : [];
    const body = rows
      .slice(0, 3)
      .map((item, index) => {
        const hasTrace = Boolean(item.source_snippet);
        return `
          <p>
            <strong>${escapeHtml(item.heading || "")}</strong>${item.heading ? "<br />" : ""}
            ${escapeHtml(item.summary || "")}
            ${
              hasTrace
                ? `<br /><button class="trace-button" data-demo-trace-group="${group}" data-demo-trace-index="${index}">${escapeHtml(copy.sourceTrace)}</button>`
                : ""
            }
          </p>
        `;
      })
      .join("");
    return summarySection(title, body || "<p>None returned.</p>");
  }

  function weakRows(result) {
    const uncertaintyRows = Array.isArray(result.uncertainty_zones)
      ? result.uncertainty_zones.map((item, index) => ({ item, group: "uncertainty_zones", index }))
      : [];
    const weakEvidenceRows = Array.isArray(result.evidence_areas)
      ? result.evidence_areas
          .map((item, index) => ({ item, group: "evidence_areas", index }))
          .filter(({ item }) => /weak|thin|limited|unclear|insufficient|unsupported|speculative|contest|низк|слаб|тонк|неяс|недостат/i.test(`${item.heading || ""} ${item.summary || ""}`))
      : [];
    return [...uncertaintyRows, ...weakEvidenceRows];
  }

  function summaryRowsSection(title, rows, copy) {
    const body = rows
      .slice(0, 3)
      .map(({ item, group, index }) => {
        const hasTrace = Boolean(item.source_snippet);
        return `
          <p>
            <strong>${escapeHtml(item.heading || "")}</strong>${item.heading ? "<br />" : ""}
            ${escapeHtml(item.summary || "")}
            ${
              hasTrace
                ? `<br /><button class="trace-button" data-demo-trace-group="${group}" data-demo-trace-index="${index}">${escapeHtml(copy.sourceTrace)}</button>`
                : ""
            }
          </p>
        `;
      })
      .join("");
    return summarySection(title, body || "<p>None returned.</p>");
  }

  function summaryListSection(title, items) {
    const rows = Array.isArray(items) ? items : [];
    const body = rows.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    return summarySection(title, body ? `<ul>${body}</ul>` : "<p>None returned.</p>");
  }

  function zoneSection(title, items, group, copy) {
    const rows = Array.isArray(items) ? items : [];
    const body = rows
      .map((item, index) => {
        const hasTrace = Boolean(item.source_snippet);
        return `
          <p>
            <strong>${escapeHtml(item.heading)}</strong><br />
            ${escapeHtml(item.summary)}
            ${
              hasTrace
                ? `<br /><button class="trace-button" data-demo-trace-group="${group}" data-demo-trace-index="${index}">${escapeHtml(copy.sourceTrace)}</button>`
                : ""
            }
          </p>
        `;
      })
      .join("");
    return section(title, body || "<p>None returned.</p>");
  }

  function listSection(title, items) {
    const rows = Array.isArray(items) ? items : [];
    const body = rows.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    return section(title, body ? `<ul>${body}</ul>` : "<p>None returned.</p>");
  }

  function bind(root) {
    const fileInput = root.querySelector("[data-demo-file]");
    const pasteInput = root.querySelector("[data-demo-paste]");
    const runModeInputs = root.querySelectorAll("[data-demo-run-mode]");
    const ownKeyInput = root.querySelector("[data-demo-own-key]");
    const textTypeInput = root.querySelector("[data-demo-text-type]");
    const analyzeButton = root.querySelector("[data-demo-analyze]");
    const clearButton = root.querySelector("[data-demo-clear]");
    const useWorkflowButton = root.querySelector("[data-demo-use-workflow]");
    const openExampleButton = root.querySelector("[data-demo-open-example]");
    const traceButtons = root.querySelectorAll("[data-demo-trace-group]");
    const closeTraceButtons = root.querySelectorAll("[data-demo-close-trace]");

    if (fileInput) {
      fileInput.addEventListener("change", function (event) {
        const file = event.target.files && event.target.files[0];
        if (file) extractSelectedFile(file);
      });
    }

    if (pasteInput) {
      pasteInput.addEventListener("input", function (event) {
        demoState.pastedText = event.target.value || "";
        demoState.error = "";
        demoState.result = null;
        demoState.trace = null;
        demoState.textTypeOverride = "";
        render();
      });
    }

    runModeInputs.forEach((input) => {
      input.addEventListener("change", function (event) {
        demoState.runMode = event.target.value || "example";
        demoState.error = "";
        render();
      });
    });

    if (ownKeyInput) {
      ownKeyInput.addEventListener("input", function (event) {
        demoState.ownApiKey = event.target.value || "";
        demoState.error = "";
        const analyze = root.querySelector("[data-demo-analyze]");
        const required = root.querySelector("[data-demo-own-key-required]");
        if (analyze) analyze.disabled = !canRunAnalysis();
        if (required) required.style.display = demoState.ownApiKey.trim() ? "none" : "";
      });
    }

    if (analyzeButton) {
      analyzeButton.addEventListener("click", runAnalysis);
    }

    if (textTypeInput) {
      textTypeInput.addEventListener("change", function (event) {
        demoState.textTypeOverride = event.target.value || "";
        demoState.trace = null;
        render();
      });
    }

    if (clearButton) {
      clearButton.addEventListener("click", function () {
        demoState.fileName = "";
        demoState.extractedText = "";
        demoState.pastedText = "";
        demoState.phase = "idle";
        demoState.error = "";
        demoState.result = null;
        demoState.trace = null;
        demoState.runMode = "example";
        demoState.ownApiKey = "";
        demoState.textTypeOverride = "";
        window.trustLayerCurrentFirstPass = null;
        window.trustLayerCurrentSource = null;
        render();
      });
    }

    if (openExampleButton) {
      openExampleButton.addEventListener("click", function () {
        openBuiltInExample();
      });
    }

    traceButtons.forEach((button) => {
      button.addEventListener("click", function () {
        openTrace(button.dataset.demoTraceGroup, Number(button.dataset.demoTraceIndex));
      });
    });

    closeTraceButtons.forEach((button) => {
      button.addEventListener("click", function () {
        demoState.trace = null;
        render();
      });
    });

    if (useWorkflowButton) {
      useWorkflowButton.addEventListener("click", function () {
        if (!demoState.result) return;

        const source = currentSourceContext();
        window.trustLayerCurrentFirstPass = demoState.result;
        window.trustLayerCurrentSource = source;
        window.TrustLayerRuntime?.useFirstPassInWorkflow?.(demoState.result, source);
      });
    }
  }

  async function extractSelectedFile(file) {
    demoState.fileName = file.name;
    demoState.extractedText = "";
    demoState.pastedText = "";
    demoState.error = "";
    demoState.result = null;
    demoState.trace = null;
    demoState.textTypeOverride = "";
    demoState.phase = "extracting";
    render();

    try {
      demoState.extractedText = await window.TrustLayerUpload.extractFile(file);
    } catch (error) {
      demoState.error = localizeError(error, getCopy());
    } finally {
      demoState.phase = "idle";
      render();
    }
  }

  async function runAnalysis() {
    if (demoState.runMode === "example") {
      openBuiltInExample();
      return;
    }

    let sourceText = getSourceText();
    if (!sourceText || demoState.phase !== "idle") return;

    if (isInputTooLong(sourceText)) {
      demoState.error = getCopy().tooLong || "";
      render();
      return;
    }

    if (demoState.runMode === "own_key" && !demoState.ownApiKey.trim()) {
      demoState.error = getCopy().ownApiKeyRequired || "";
      render();
      return;
    }

    if (demoState.runMode === "public" && window.PUBLIC_DEMO_CONFIG?.LIVE_AI_ENABLED === false) {
      demoState.error = getCopy().liveUnavailable || "";
      render();
      return;
    }

    demoState.error = "";
    demoState.result = null;
    demoState.trace = null;
    demoState.textTypeOverride = "";
    demoState.phase = "analyzing";
    render();

    try {
      const lang = window.TrustLayerRuntime?.getLang?.() || "en";
      const apiKey = demoState.runMode === "own_key" ? demoState.ownApiKey.trim() : "";
      demoState.result = await window.TrustLayerAPI.analyze(sourceText, lang, apiKey);
      window.trustLayerCurrentFirstPass = demoState.result;
      window.trustLayerCurrentSource = currentSourceContext(getCopy());
    } catch (error) {
      const copy = getCopy();
      const localized = localizeError(error, copy);
      demoState.error =
        demoState.runMode === "own_key" && error?.code !== "invalid_input"
          ? copy.byokFailed || localized
          : localized;
    } finally {
      demoState.phase = "idle";
      render();
    }
  }

  function openBuiltInExample() {
    if (window.openExampleWorkflow) {
      window.openExampleWorkflow("a");
      return;
    }
    window.openText?.("a");
  }

  function getSourceText() {
    return (demoState.pastedText || "").trim() || demoState.extractedText || "";
  }

  function maxInputChars() {
    if (demoState.runMode === "own_key") {
      return Number(window.PUBLIC_DEMO_CONFIG?.BYOK_MAX_INPUT_CHARS || window.BYOK_MAX_INPUT_CHARS || 30000);
    }
    return Number(window.PUBLIC_DEMO_CONFIG?.MAX_INPUT_CHARS || window.MAX_INPUT_CHARS || 8000);
  }

  function isInputTooLong(text) {
    const max = maxInputChars();
    return max > 0 && String(text || "").length > max;
  }

  function canRunAnalysis() {
    const sourceText = getSourceText();
    const busy = demoState.phase !== "idle";
    const needsText = demoState.runMode !== "example";
    const needsOwnKey = demoState.runMode === "own_key";
    return (
      !busy &&
      !isInputTooLong(sourceText) &&
      (!needsText || Boolean(sourceText)) &&
      (!needsOwnKey || Boolean(demoState.ownApiKey.trim()))
    );
  }

  function formatCharacterCount(text) {
    const count = String(text || "").length;
    return `${count.toLocaleString()} / ${maxInputChars().toLocaleString()}`;
  }

  function isLiveUnavailableError(errorText, copy) {
    const fallbackMessages = [
      copy.liveUnavailable,
      copy.apiOffline,
      copy.budgetExhausted,
      copy.rateLimited,
      copy.invalidInput,
      copy.providerError
    ].filter(Boolean);
    return Boolean(
      errorText &&
        (fallbackMessages.includes(errorText) ||
          /Unsupported file type|PDF support|Please paste text|Text is too short|This demo accepts at most|Неподдерживаемый|PDF|Сначала вставьте|Текст слишком короткий|Сократите текст/i.test(
            errorText
          ))
    );
  }

  function openTrace(group, index) {
    const item = demoState.result?.[group]?.[index];
    if (!item) return;

    demoState.trace = {
      title: item.heading || "",
      snippet: item.source_snippet || "",
      location: item.source_location || ""
    };
    render();
  }

  window.TrustLayerDemo = {
    mount: render
  };

  render();
})();
