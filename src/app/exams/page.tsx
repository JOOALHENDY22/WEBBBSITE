import Link from "next/link";
import Image from "next/image";
import { getExams, getCurrentUser, logoutUser } from "@/app/actions";
import UserRegistration from "@/components/UserRegistration";
import { ArrowRight, ArrowLeft, BookOpen, FileText, Clock, LogOut, FlaskConical, User } from "lucide-react";
import { cookies } from "next/headers";
import { getT, Language } from "@/lib/i18n";

export const revalidate = 0;

export default async function ExamsPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Language) || "ar";
  const t = getT(lang);

  const user = await getCurrentUser();
  if (!user) return <UserRegistration />;

  const exams = await getExams();

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Background */}
      <div className="absolute top-[-10%] right-[-5%]  w-[50%] h-[50%] rounded-full bg-emerald-500/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-teal-500/6   blur-[120px] pointer-events-none" />

      <div className="p-4 sm:p-8 md:p-10 max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <Link href="/" className="relative w-12 h-12 shrink-0">
              <Image src="/logo.jpg" alt="Mini Doctors" fill className="object-contain" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{t("availableExams")}</h1>
              <p className="text-slate-400 font-medium text-base">{t("selectExamDesc")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* User info */}
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-full font-bold text-sm">
              <User size={16} />
              <span>{user.name}</span>
            </div>
            {/* Logout */}
            <form action={logoutUser}>
              <button type="submit" className="flex items-center gap-2 bg-[#0f172a] hover:bg-red-900/30 border border-white/5 hover:border-red-500/30 text-slate-400 hover:text-red-400 px-4 py-2.5 rounded-full font-bold text-sm transition-all">
                <LogOut size={16} />
                <span className="hidden sm:inline">{t("logout")}</span>
              </button>
            </form>
          </div>
        </header>

        {/* Exams grid */}
        {(!exams || exams.length === 0) ? (
          <div className="text-center bg-[#0f172a] border border-white/5 p-16 rounded-[2rem] shadow-xl animate-fade-in-up mt-12">
            <div className="w-24 h-24 bg-[#1e293b] text-slate-400 rounded-full flex items-center justify-center mx-auto mb-8">
              <FileText size={40} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">{t("noExams")}</h2>
            <p className="text-xl text-slate-400 font-medium">{t("checkBackLater")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam: any, index: number) => {
              const questionCount = exam.questions[0]?.count || 0;
              return (
                <div
                  key={exam.id}
                  className="group bg-[#0f172a] border border-white/5 hover:border-emerald-500/20 rounded-[2rem] p-8 shadow-lg hover:shadow-[0_0_40px_rgba(16,185,129,0.1)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between animate-fade-in-up"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <div>
                    <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      <FlaskConical size={28} />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-3 line-clamp-2 leading-tight">{exam.title}</h2>
                    <div className="inline-block bg-[#1e293b] text-slate-300 px-3 py-1.5 rounded-xl text-sm font-bold mb-6">
                      {exam.subject}
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 text-sm font-bold mb-8">
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={16} className="text-emerald-400" />
                        <span>{questionCount} {t("questions")}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-emerald-400" />
                        <span>{t("notTimed")}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/exams/${exam.id}`}
                    className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg py-4 px-6 rounded-2xl transition-all shadow-md group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                  >
                    <span>{t("startExam")}</span>
                    {lang === "ar" ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
