import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { getT, Language } from "@/lib/i18n";
import { ArrowLeft, ArrowRight, FlaskConical, Trophy, Users, Microscope } from "lucide-react";

export default async function Home() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Language) || "ar";
  const t = getT(lang);
  const isAr = lang === "ar";

  const features = [
    {
      icon: FlaskConical,
      title: isAr ? "امتحانات تفاعلية" : "Interactive Exams",
      desc:  isAr ? "أسئلة MCQ وصح/غلط تقيّم مستواك فعلاً" : "MCQ & True/False to truly test you",
      color: "emerald",
    },
    {
      icon: Trophy,
      title: isAr ? "لوحة الأوائل"   : "Leaderboard",
      desc:  isAr ? "شوف مكانك بين زمايلك بعد كل امتحان"   : "See your rank after every exam",
      color: "amber",
    },
    {
      icon: Users,
      title: isAr ? "مجتمع الصيادلة" : "Pharma Community",
      desc:  isAr ? "منصة مخصوصة لطلاب كليات الصيدلة"       : "Built exclusively for pharmacy students",
      color: "sky",
    },
    {
      icon: Microscope,
      title: isAr ? "نتايج فورية"    : "Instant Results",
      desc:  isAr ? "اعرف نتيجتك وشرح الإجابات في ثانية"   : "Scores & explanations instantly",
      color: "purple",
    },
  ];

  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-400",
    amber:   "bg-amber-500/10   text-amber-400",
    sky:     "bg-sky-500/10     text-sky-400",
    purple:  "bg-purple-500/10  text-purple-400",
  };

  return (
    <div
      className="min-h-screen bg-[#030712] text-slate-200 overflow-x-hidden flex flex-col justify-between"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* ── Fixed background glow ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[140px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-500/5  blur-[140px]" />
      </div>

      {/* ── Nav ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-4 border-b border-white/5 backdrop-blur-xl bg-[#030712]/75">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-9 h-9 shrink-0">
            <Image src="/logo.jpg" alt="Mini Doctors" fill className="object-contain" />
          </div>
          <span className="font-black text-white text-lg tracking-tight">Mini Doctors</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/exams"
            className="text-slate-400 hover:text-white font-bold text-sm transition-colors hidden sm:block"
          >
            {t("exploreExams")}
          </Link>
          <Link
            href="/admin"
            className="text-slate-600 hover:text-slate-400 font-bold text-xs px-3 py-2 transition-colors"
          >
            {t("adminPortal")}
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-12 sm:pt-20 pb-12 max-w-4xl mx-auto w-full">

        {/* Logo Container */}
        <div className="relative mb-6 animate-float">
          <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-3xl scale-125" />
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full overflow-hidden border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <Image
              src="/logo.jpg"
              alt="Mini Doctors"
              fill
              className="object-cover scale-105"
              priority
            />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-xs sm:text-sm font-bold mb-6 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {isAr ? "منصة طلاب الصيدلة" : "Pharmacy Students Platform"}
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-black mb-4 tracking-tight leading-tight animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="animate-shimmer">Mini</span>{" "}
          <span className="text-white">Doctors</span>
        </h1>

        <p
          className="text-base sm:text-lg text-slate-400 max-w-xl mb-8 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {isAr
            ? "امتحن نفسك في مواد الصيدلة، شوف مكانك بين الأوائل، وطوّر مستواك!"
            : "Test yourself on pharmacy subjects, rank up on the leaderboard, and level up!"}
        </p>

        {/* CTA - Centered perfectly */}
        <div
          className="flex justify-center items-center w-full animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href="/exams"
            className="group inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base sm:text-lg py-4 px-10 rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:scale-105"
          >
            <FlaskConical size={20} className="group-hover:rotate-12 transition-transform" />
            {t("exploreExams")}
            {isAr
              ? <ArrowLeft  size={18} className="group-hover:-translate-x-1 transition-transform" />
              : <ArrowRight size={18} className="group-hover:translate-x-1  transition-transform" />}
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 px-6 sm:px-10 pb-16 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group bg-[#0f172a]/70 border border-white/5 hover:border-emerald-500/15 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.08 * i + 0.4}s` }}
            >
              <div className={`w-11 h-11 rounded-xl ${colorMap[f.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon size={22} />
              </div>
              <h3 className="font-black text-white text-base mb-1.5">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent pointer-events-none" />
    </div>
  );
}
