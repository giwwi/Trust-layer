(function () {
  const ACCEPT = ".txt,.md,.docx";

  async function extractFile(file) {
    if (!file) {
      throw new Error("No file selected.");
    }

    const response = await window.TrustLayerAPI.extract(file);
    return response.text || "";
  }

  window.TrustLayerUpload = {
    ACCEPT,
    extractFile
  };
})();
