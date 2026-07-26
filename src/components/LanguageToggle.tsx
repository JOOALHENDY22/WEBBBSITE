"use client";

import { useLanguage } from "./LanguageProvider";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "ar" : "en")}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#27272a]/90 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:bg-[#3f3f46] hover:scale-105 transition-all border border-[#3f3f46]/50 group"
      title="Toggle Language / تغيير اللغة"
    >
      <Globe className="text-blue-400 group-hover:rotate-180 transition-transform duration-500" size={24} />
      <span className="font-black text-lg">
        {lang === "en" ? "عربي" : "English"}
      </span>
    </button>
  );
}
