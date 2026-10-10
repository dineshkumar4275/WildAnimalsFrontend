import api from "./index"; // Unga existing api instance

/* ==========================================
   TRANSLATE TEXT
   text: "Brown"
   targetLang: "ta" | "ml" | "te"
========================================== */

export const translateText = async (text, targetLang) => {
  if (!text) return "";
  if (!targetLang || targetLang === "en") return text;

  try {
    const response = await api.post("/translate", {
      text,
      targetLang,
    });

    return response?.translated || text;
  } catch (error) {
    console.log("Translate API error:", error?.message);
    return text; // Fallback to original
  }
};

/* ==========================================
   BATCH TRANSLATE
   Multiple texts in one call
========================================== */

export const translateBatch = async (texts, targetLang) => {
  if (!Array.isArray(texts) || texts.length === 0) return [];

  const results = await Promise.all(
    texts.map((text) => translateText(text, targetLang))
  );

  return results;
};