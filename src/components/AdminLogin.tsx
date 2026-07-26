"use client";

import { useState } from "react";
import Link from "next/link";
import { adminLogin } from "@/app/actions";
import { Lock, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export default function AdminLogin() {
  const { t, lang } = useLanguage();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await adminLogin(password);
      if (res.success) {
        window.location.reload();
      } else {
        setError(t("invalidPassword"));
        setLoading(false);
      }
    } catch (e) {
      setError("An error occurred");
      setLoading(false);
    }
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center p-4 bg-[#09090b] text-slate-200 font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px]" />
      
      <Link href="/" className="fixed top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-lg font-bold">
        {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        <span>{t("backToHome")}</span>
      </Link>

      <div className="glass-dark p-10 rounded-3xl shadow-premium w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
        
        <div className="w-20 h-20 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <ShieldCheck size={40} />
        </div>
        
        <h1 className="text-4xl font-black text-center mb-4 text-white tracking-tight">{t("adminAccess")}</h1>
        <p className="text-center text-slate-400 mb-10 font-medium text-lg">
          {t("enterSecureCreds")}
        </p>
        
        {error && <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-base font-bold text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <div className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${lang === 'ar' ? 'right-5' : 'left-5'}`}>
              <Lock size={24} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              className={`w-full py-5 rounded-2xl bg-[#18181b] text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-xl placeholder:text-slate-600 shadow-inner ${lang === 'ar' ? 'pr-14 pl-6' : 'pl-14 pr-6'}`}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-black text-2xl py-5 rounded-2xl hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            {loading ? t("loading") : t("loginDashboard")}
            {!loading && (lang === 'ar' ? <ArrowLeft size={28} className="group-hover:-translate-x-2 transition-transform" /> : <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />)}
          </button>
        </form>
      </div>
    </div>
  );
}
