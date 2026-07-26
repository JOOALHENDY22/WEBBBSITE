import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { cookies } from "next/headers";
import { getT, Language } from "@/lib/i18n";

export default async function Home() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Language) || "ar";
  const t = getT(lang);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#09090b] text-slate-200 flex flex-col justify-center items-center px-4 sm:px-6">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px]" />
      
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl">
        <div className="glass-dark p-2 rounded-2xl mb-8 md:mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-[#18181b]/90 px-6 py-3 rounded-xl text-blue-400 font-bold text-base md:text-lg flex items-center justify-center gap-3 shadow-lg">
            <GraduationCap size={24} />
            <span>{t("platformTitle")}</span>
          </div>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-8 tracking-tight animate-fade-in-up leading-tight" style={{ animationDelay: '0.2s' }}>
          <span className="bg-clip-text text-transparent bg-gradient-to-l from-white via-blue-200 to-slate-400">
            {t("mainTitle")}
          </span>
        </h1>
        
        <p className="text-lg sm:text-2xl md:text-3xl text-slate-300 max-w-3xl mb-12 animate-fade-in-up leading-relaxed font-medium" style={{ animationDelay: '0.3s' }}>
          {t("subtitle")}
        </p>

        <div className="animate-fade-in-up w-full sm:w-auto" style={{ animationDelay: '0.4s' }}>
          <Link 
            href="/exams" 
            className="group relative flex w-full sm:inline-flex items-center justify-center gap-4 bg-blue-600 text-white font-black text-xl md:text-2xl py-5 px-12 rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] hover:bg-blue-500"
          >
            <BookOpen size={28} className="group-hover:-rotate-12 transition-transform" />
            <span>{t("exploreExams")}</span>
            {lang === "ar" ? <ArrowLeft size={28} className="group-hover:-translate-x-2 transition-transform" /> : <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />}
          </Link>
        </div>
        
        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Link href="/admin" className="text-slate-500 hover:text-white transition-colors text-base md:text-lg font-bold">
            {t("adminPortal")}
          </Link>
        </div>
      </div>
    </div>
  );
}
