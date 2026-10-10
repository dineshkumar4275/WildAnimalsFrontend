import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import translations from "./translations";

const LANGUAGE_KEY = "@animal_market_language";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");
  const [languageLoading, setLanguageLoading] = useState(true);

  /* =========================================================
     LOAD SAVED LANGUAGE
  ========================================================= */

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

        if (
          savedLanguage &&
          Object.prototype.hasOwnProperty.call(
            translations,
            savedLanguage
          )
        ) {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.log("❌ LANGUAGE LOAD ERROR:", error);
      } finally {
        setLanguageLoading(false);
      }
    };

    loadLanguage();
  }, []);

  /* =========================================================
     CHANGE LANGUAGE
  ========================================================= */

  const setLanguage = async (newLanguage) => {
    try {
      if (
        !Object.prototype.hasOwnProperty.call(
          translations,
          newLanguage
        )
      ) {
        console.log("❌ Invalid language:", newLanguage);
        return;
      }

      setLanguageState(newLanguage);

      await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
    } catch (error) {
      console.log("❌ LANGUAGE SAVE ERROR:", error);
    }
  };

  /* =========================================================
     TRANSLATION FUNCTION
  ========================================================= */

  const t = (key) => {
    const currentTranslations =
      translations[language] || translations.en;

    return (
      currentTranslations[key] ||
      translations.en[key] ||
      key
    );
  };

  /* =========================================================
     LANGUAGE INFO
  ========================================================= */

  const languageInfo = useMemo(() => {
    const languages = {
      en: {
        code: "en",
        label: "English",
        english: "English",
      },
      ta: {
        code: "ta",
        label: "தமிழ்",
        english: "Tamil",
      },
      ml: {
        code: "ml",
        label: "മലയാളം",
        english: "Malayalam",
      },
      te: {
        code: "te",
        label: "తెలుగు",
        english: "Telugu",
      },
    };

    return languages[language] || languages.en;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
    languageInfo,
    languageLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}

export default LanguageContext;