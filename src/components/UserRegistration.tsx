"use client";

import { useState } from "react";
import { registerUser } from "@/app/actions";
import { User, ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export default function UserRegistration() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { t, lang } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    await registerUser(name.trim());
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090b] text-slate-200">
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px]" />
      
      <div className="glass-dark p-10 sm:p-12 rounded-[2.5rem] shadow-premium w-full max-w-lg relative z-10 animate-fade-in-up">
        <div className="w-20 h-20 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <GraduationCap size={40} />
        </div>
        
        <h1 className="text-4xl font-black text-center mb-4 text-white tracking-tight">{t("welcomeHero")}</h1>
        <p className="text-center text-slate-400 mb-10 font-medium text-lg leading-relaxed">
          {t("enterNameDesc")}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${lang === 'ar' ? 'right-5' : 'left-5'}`}>
              <User size={24} />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className={`w-full py-5 rounded-2xl bg-[#18181b] text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-xl placeholder:text-slate-600 shadow-inner ${lang === 'ar' ? 'pr-14 pl-6' : 'pl-14 pr-6'}`}
              required
              minLength={3}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="group w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-black text-2xl py-5 rounded-2xl hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            {loading ? t("registering") : t("letsStart")}
            {!loading && (lang === 'ar' ? <ArrowLeft size={28} className="group-hover:-translate-x-2 transition-transform" /> : <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />)}
          </button>
        </form>
      </div>
    </div>
  );
}
