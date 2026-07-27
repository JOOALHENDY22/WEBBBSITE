"use client";

import { useState } from "react";
import Image from "next/image";
import { registerUser, loginUser } from "@/app/actions";
import { User, Lock, ArrowLeft, ArrowRight, Eye, EyeOff, FlaskConical } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export default function UserRegistration() {
  const [mode, setMode] = useState<"register" | "login">("register");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t, lang } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;
    setLoading(true);
    setError("");

    if (mode === "register") {
      const res = await registerUser(name.trim(), password);
      if (!res.success) {
        setError(res.error === "nameExists"
          ? (lang === "ar" ? "الاسم ده موجود قبل كده، حاول تسجيل دخول أو اختار اسم تاني." : "Name already exists. Try logging in.")
          : (lang === "ar" ? "حصل خطأ، حاول تاني." : "An error occurred. Try again.")
        );
        setLoading(false);
        return;
      }
    } else {
      const res = await loginUser(name.trim(), password);
      if (!res.success) {
        setError(res.error === "notFound"
          ? (lang === "ar" ? "الاسم ده مش موجود، سجل حساب جديد." : "Name not found. Create an account.")
          : (lang === "ar" ? "الباسوورد غلط يا وحش!" : "Wrong password!")
        );
        setLoading(false);
        return;
      }
    }
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712] text-slate-200 overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-teal-500/8 blur-[120px]" />
        {/* Animated circles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-emerald-400/30 animate-pulse-soft" style={{animationDelay:'0s'}} />
        <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 rounded-full bg-teal-400/30 animate-pulse-soft" style={{animationDelay:'1s'}} />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-green-400/30 animate-pulse-soft" style={{animationDelay:'2s'}} />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 animate-float">
            <Image src="/logo.jpg" alt="Mini Doctors" fill className="object-contain drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
          </div>
        </div>

        <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-emerald-500/10 rounded-[2rem] shadow-2xl p-8 sm:p-10">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">
              {mode === "register"
                ? (lang === "ar" ? "إنشاء حساب جديد" : "Create Account")
                : (lang === "ar" ? "مرحباً بعودتك!" : "Welcome Back!")}
            </h1>
            <p className="text-slate-400 text-base">
              {mode === "register"
                ? (lang === "ar" ? "اكتب اسمك وباصورد عشان نحفظ نتايجك" : "Enter your name & password to track scores")
                : (lang === "ar" ? "اكتب اسمك والباصورد عشان تدخل" : "Enter your credentials to continue")}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#1e293b] p-1 rounded-full mb-8">
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-3 rounded-full font-black text-sm transition-all ${mode === "register" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              {lang === "ar" ? "حساب جديد" : "Register"}
            </button>
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-3 rounded-full font-black text-sm transition-all ${mode === "login" ? "bg-emerald-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              {lang === "ar" ? "تسجيل دخول" : "Login"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <div className={`absolute top-1/2 -translate-y-1/2 text-emerald-400/70 ${lang === "ar" ? "right-5" : "left-5"}`}>
                <User size={20} />
              </div>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={lang === "ar" ? "اسمك الحقيقي..." : "Your full name..."}
                className={`w-full py-4 rounded-2xl bg-[#1e293b] text-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg placeholder:text-slate-600 transition-all ${lang === "ar" ? "pr-12 pl-5" : "pl-12 pr-5"}`}
                required minLength={3}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className={`absolute top-1/2 -translate-y-1/2 text-emerald-400/70 ${lang === "ar" ? "right-5" : "left-5"}`}>
                <Lock size={20} />
              </div>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={lang === "ar" ? "الباسوورد..." : "Password..."}
                className={`w-full py-4 rounded-2xl bg-[#1e293b] text-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg placeholder:text-slate-600 transition-all ${lang === "ar" ? "pr-12 pl-12" : "pl-12 pr-12"}`}
                required minLength={4}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors ${lang === "ar" ? "left-5" : "right-5"}`}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !name.trim() || !password.trim()}
              className="group w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] animate-glow"
            >
              <FlaskConical size={24} className="group-hover:rotate-12 transition-transform" />
              {loading
                ? (lang === "ar" ? "لحظة..." : "Wait...")
                : mode === "register"
                ? (lang === "ar" ? "سجّل وابدأ" : "Register & Start")
                : (lang === "ar" ? "ادخل" : "Login")}
              {!loading && (lang === "ar"
                ? <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                : <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-sm mt-4">Mini Doctors © 2025</p>
      </div>
    </div>
  );
}
