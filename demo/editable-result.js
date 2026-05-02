(function () {
  function blankZone() {
    return {
      heading: "",
      summary: ""
    };
  }

  function normalizeZoneArray(value) {
    if (!Array.isArray(value) || value.length === 0) {
      return [blankZone()];
    }

    return value.map(function (entry) {
      return {
        heading: typeof entry?.heading === "string" ? entry.heading : "",
        summary: typeof entry?.summary === "string" ? entry.summary : ""
      };
    });
  }

  function normalizeFocusArray(value) {
    if (!Array.isArray(value) || value.length === 0) {
      return [""];
    }

    return value.map(function (entry) {
      return typeof entry === "string" ? entry : "";
    });
  }

  function toEditable(result) {
    return {
      document_type: typeof result?.document_type === "string" ? result.document_type : "",
      probable_central_argument:
        typeof result?.probable_central_argument === "string" ? result.probable_central_argument : "",
      claim_zones: normalizeZoneArray(result?.claim_zones),
      evidence_areas: normalizeZoneArray(result?.evidence_areas),
      uncertainty_zones: normalizeZoneArray(result?.uncertainty_zones),
      review_focus: normalizeFocusArray(result?.review_focus),
      route_recommendation:
        typeof result?.route_recommendation === "string" ? result.route_recommendation : "bounded_review",
      route_reason: typeof result?.route_reason === "string" ? result.route_reason : "",
      confidence_note: typeof result?.confidence_note === "string" ? result.confidence_note : ""
    };
  }

  function setSimple(result, field, value) {
    result[field] = value;
  }

  function ensureZone(result, group, index) {
    if (!Array.isArray(result[group])) {
      result[group] = [];
    }

    while (result[group].length <= index) {
      result[group].push(blankZone());
    }
  }

  function setZone(result, group, index, key, value) {
    ensureZone(result, group, index);
    result[group][index][key] = value;
  }

  function setFocus(result, index, value) {
    if (!Array.isArray(result.review_focus)) {
      result.review_focus = [];
    }

    while (result.review_focus.length <= index) {
      result.review_focus.push("");
    }

    result.review_focus[index] = value;
  }

  window.TrustLayerEditable = {
    blankZone,
    toEditable,
    setSimple,
    setZone,
    setFocus
  };
})();
