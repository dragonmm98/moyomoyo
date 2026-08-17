"use client";

import { useLanguage } from "./i18n/LanguageProvider";
import { localeMeta, locales } from "./i18n/translations";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className={`lang-switch ${className}`.trim()} role="group" aria-label={t.nav.language}>
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={code === locale}
          className={code === locale ? "is-active" : undefined}
          onClick={() => setLocale(code)}
        >
          {localeMeta[code].short}
        </button>
      ))}
    </div>
  );
}
