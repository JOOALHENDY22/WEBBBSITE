"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { saveResult } from "@/app/actions";
import { CheckCircle2, ChevronLeft, AlertCircle } from "lucide-react";

type Question = {
  id: string;
  type?: 'mcq' | 'tf';
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
};

export default function QuizClient({ 
  exam, 
  questions 
}: { 
  exam: any; 
  questions: Question[] 
}) {
  const { t, lang } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (questionId: string, option: string) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      if (!confirm(t("confirmEarlySubmit", { ans: answeredCount, total: questions.length }))) {
        return;
      }
    }

    setIsSubmitting(true);

    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        score += 1;
      }
    });

    const total = questions.length;
    const percentage = total > 0 ? (score / total) * 100 : 0;

    try {
      const result = await saveResult(exam.id, score, total, percentage);
      window.location.href = `/results/${result.id}`;
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert(t("submitError"));
      setIsSubmitting(false);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
        <div className="bg-[#18181b] p-12 rounded-[2rem] shadow-xl text-center max-w-md w-full animate-fade-in-up">
          <AlertCircle size={64} className="text-slate-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white mb-4">{t("noQuestionsFound")}</h2>
          <p className="text-slate-400 font-medium text-lg mb-8">{t("examNotSetUp")}</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white font-black text-xl py-4 px-8 rounded-full hover:bg-blue-500 transition-colors w-full"
          >
            {t("backToHome")}
          </button>
        </div>
      </div>
    );
  }

  const progress = (Object.keys(answers).length / questions.length) * 100;

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 pt-12 font-sans">
      <div className="glass-dark rounded-[2rem] shadow-2xl p-8 mb-12 sticky top-4 z-20">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight">{exam.title}</h1>
        
        <div className="flex justify-between text-base md:text-lg font-bold text-slate-300 mb-4">
          <span>{t("progress")}</span>
          <span>{t("answeredCount", { ans: Object.keys(answers).length, total: questions.length })}</span>
        </div>
        <div className="w-full bg-[#27272a] h-4 rounded-full overflow-hidden shadow-inner">
          <div 
            className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(59,130,246,0.8)]" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-12 mb-20">
        {questions.map((q, index) => {
          const isTF = q.type === 'tf';
          const options = isTF ? ['A', 'B'] : ['A', 'B', 'C', 'D'];
          
          return (
            <div 
              key={q.id} 
              className="bg-[#18181b] rounded-[2rem] shadow-xl p-6 sm:p-8 md:p-12 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col sm:flex-row gap-6 mb-10">
                <div className="w-14 h-14 shrink-0 bg-[#27272a] text-blue-400 font-black rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug pt-2 mb-4">
                    {q.question}
                  </h3>
                  {isTF && <span className="inline-block bg-[#27272a] text-slate-300 text-sm font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm">{t("trueOrFalse")}</span>}
                </div>
              </div>
              
              <div className={`grid grid-cols-1 ${isTF ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-6`}>
                {options.map((opt) => {
                  const optionKey = `option_${opt.toLowerCase()}` as keyof Question;
                  const isSelected = answers[q.id] === opt;
                  
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(q.id, opt)}
                      className={`group relative flex items-center p-6 sm:p-8 rounded-[1.5rem] transition-all duration-300 text-right ${
                        isSelected 
                          ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] transform scale-[1.02]' 
                          : 'bg-[#27272a] text-slate-300 hover:bg-[#3f3f46]'
                      }`}
                    >
                      <div className="shrink-0 ml-6">
                        {isSelected ? (
                          <CheckCircle2 size={32} className="text-white drop-shadow-md" />
                        ) : (
                          <div className="w-8 h-8 rounded-full border-2 border-slate-500 group-hover:border-slate-400 transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 font-bold text-xl md:text-2xl leading-snug">
                        {!isTF && <span className={`font-black ml-3 ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>{opt}.</span>}
                        {q[optionKey] || (isTF && opt === 'A' ? t("true") : t("false"))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pb-24">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="group w-full sm:w-auto flex items-center justify-center gap-4 bg-blue-600 text-white font-black text-2xl py-6 px-16 rounded-full hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105"
        >
          {isSubmitting ? (
            <span className="animate-pulse">{t("processingResults")}</span>
          ) : (
            <>
              <span>{t("submitScore")}</span>
              {lang === 'ar' ? <ChevronLeft size={32} className="group-hover:-translate-x-2 transition-transform" /> : <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
