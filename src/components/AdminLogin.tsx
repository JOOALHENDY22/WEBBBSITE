"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen flex items-center justify-center p-4 bg-[#030712] text-slate-200 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-500/5 blur-[150px]" />
      
      <Link href="/" className="fixed top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-base font-bold">
        {lang === 'ar' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        <span>{t("backToHome")}</span>
      </Link>

      <div className="bg-[#0f172a]/95 border border-white/5 p-8 sm:p-10 rounded-[2rem] shadow-2xl w-full max-w-md relative overflow-hidden animate-fade-in-up">
        {/* Glow Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500" />
        
        {/* Logo Shield */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <Image src="/logo.jpg" alt="Mini Doctors" fill className="object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
        </div>
        
        <h1 className="text-3xl font-black text-center mb-2 text-white tracking-tight">{t("adminAccess")}</h1>
        <p className="text-center text-slate-400 mb-8 font-medium text-base">
          {t("enterSecureCreds")}
        </p>
        
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-bold text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <div className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${lang === 'ar' ? 'right-5' : 'left-5'}`}>
              <Lock size={20} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              className={`w-full py-4 rounded-2xl bg-[#1e293b] text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-lg placeholder:text-slate-600 ${lang === 'ar' ? 'pr-12 pl-5' : 'pl-12 pr-5'}`}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group w-full flex items-center justify-center gap-3 bg-emerald-600 text-white font-black text-xl py-4 rounded-2xl hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            {loading ? t("loading") : t("loginDashboard")}
            {!loading && (lang === 'ar' ? <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" /> : <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />)}
          </button>
        </form>
      </div>
    </div>
  );
}
