import Link from "next/link";
import { getExams, getCurrentUser } from "@/app/actions";
import UserRegistration from "@/components/UserRegistration";
import { ArrowRight, ArrowLeft, BookOpen, Clock, FileText } from "lucide-react";
import { cookies } from "next/headers";
import { getT, Language } from "@/lib/i18n";

export const revalidate = 0; // Disable caching

export default async function ExamsPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Language) || "ar";
  const t = getT(lang);

  const user = await getCurrentUser();
  if (!user) {
    return <UserRegistration />;
  }

  const exams = await getExams();

  return (
    <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
      
      <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-fade-in-up">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">{t("availableExams")}</h1>
            <p className="text-slate-300 font-medium text-lg md:text-xl">{t("selectExamDesc")}</p>
          </div>
          <Link href="/" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors bg-[#18181b] px-6 py-3 rounded-full shadow-lg font-bold text-lg hover:bg-[#27272a]">
            {lang === "ar" ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
            <span>{t("backToHome")}</span>
          </Link>
        </header>

        {(!exams || exams.length === 0) ? (
          <div className="text-center bg-[#18181b] p-16 rounded-[2rem] shadow-xl animate-fade-in-up mt-12">
            <div className="w-24 h-24 bg-[#27272a] text-slate-400 rounded-full flex items-center justify-center mx-auto mb-8">
              <FileText size={40} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">{t("noExams")}</h2>
            <p className="text-xl text-slate-400 font-medium">{t("checkBackLater")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exams.map((exam: any, index: number) => {
              const questionCount = exam.questions[0]?.count || 0;
              const delay = `${0.1 + (index * 0.1)}s`;
              
              return (
                <div 
                  key={exam.id} 
                  className="bg-[#18181b] rounded-[2rem] p-8 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between animate-fade-in-up group"
                  style={{ animationDelay: delay }}
                >
                  <div>
                    <div className="w-16 h-16 bg-[#27272a] text-blue-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                      <BookOpen size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 line-clamp-2 leading-tight">{exam.title}</h2>
                    
                    <div className="flex items-center gap-3 mb-8">
                      <span className="bg-[#27272a] text-slate-200 px-4 py-2 rounded-xl text-base font-bold shadow-sm">
                        {exam.subject}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 text-base md:text-lg text-slate-300 mb-10 font-bold">
                      <div className="flex items-center gap-2">
                        <FileText size={20} className="text-blue-400" />
                        <span>{questionCount} {t("questions")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={20} className="text-blue-400" />
                        <span>{t("notTimed")}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/exams/${exam.id}`}
                    className="w-full flex items-center justify-center gap-3 bg-[#27272a] text-white font-black text-xl py-5 px-6 rounded-2xl hover:bg-blue-600 transition-all shadow-md group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  >
                    <span>{t("startExam")}</span>
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
