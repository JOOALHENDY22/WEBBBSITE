"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, getT } from "@/lib/i18n";

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: ReturnType<typeof getT>;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ 
  children, 
  initialLang 
}: { 
  children: React.ReactNode;
  initialLang: Language;
}) {
  const [lang, setLangState] = useState<Language>(initialLang);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    document.cookie = `lang=${newLang}; path=/; max-age=31536000`; // 1 year
    window.location.reload(); // Refresh to let server components catch the cookie
  };

  const t = getT(lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="font-sans">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
