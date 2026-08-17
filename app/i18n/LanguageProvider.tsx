"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { localeMeta, messages, type Locale, type Messages } from "./translations";

const STORAGE_KEY = "moyomoyo-lang";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "fil" || value === "ru";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = localeMeta[locale].htmlLang;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      t: messages[locale],
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
