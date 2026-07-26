"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, XCircle, Lightbulb } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

type Question = {
  id: string;
  type?: 'mcq' | 'tf';
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation?: string;
};

export default function ResultClient({
  result,
  questions,
  leaderboard
}: {
  result: any;
  questions: Question[];
  leaderboard: any[];
}) {
  const { t, lang } = useLanguage();
  const [showAnswers, setShowAnswers] = useState(false);

  const isPass = result.percentage >= 50;

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 pt-12 font-sans">
      <div className="bg-[#18181b] rounded-[3rem] shadow-2xl p-8 sm:p-12 md:p-16 mb-12 text-center relative overflow-hidden animate-fade-in-up">
        {/* Glow effect */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] ${isPass ? 'bg-emerald-600/10' : 'bg-red-600/10'} blur-[100px] pointer-events-none`} />
        
        <div className="relative z-10">
          <div className="inline-block p-6 rounded-full bg-[#09090b] mb-8 shadow-inner">
            {isPass ? (
              <CheckCircle2 size={80} className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            ) : (
              <XCircle size={80} className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white">
            {isPass ? t("congrats") : t("keepPracticing")}
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium mb-12">
            {t("completedExam")}
          </p>
        
          <div className="relative inline-flex items-center justify-center mb-16">
            {/* Circular Progress */}
            <svg className="w-56 h-56 sm:w-64 sm:h-64 transform -rotate-90">
              <circle cx="128" cy="128" r="112" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-[#27272a]" />
              <circle 
                cx="128" cy="128" r="112" 
                stroke="currentColor" 
                strokeWidth="16" 
                fill="transparent" 
                strokeDasharray={`${2 * Math.PI * 112}`}
                strokeDashoffset={`${2 * Math.PI * 112 * (1 - result.percentage / 100)}`}
                className={`${isPass ? 'text-emerald-500' : 'text-red-500'} transition-all duration-1000 ease-out drop-shadow-[0_0_10px_currentColor]`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-6xl sm:text-7xl font-black ${isPass ? 'text-emerald-400' : 'text-red-400'} drop-shadow-[0_0_20px_currentColor]`}>
                {Math.round(result.percentage)}%
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-6 mb-16">
            <div className="bg-[#09090b] rounded-[2rem] p-8 md:p-10 shadow-inner">
              <div className="text-5xl md:text-7xl font-black text-white mb-2">
                {result.score} <span className="text-2xl md:text-4xl text-slate-500">/ {result.total_questions}</span>
              </div>
              <div className="text-lg md:text-xl font-bold text-slate-400 uppercase tracking-widest">{t("correct")}</div>
            </div>
            
            <div className="bg-[#09090b] rounded-[2rem] p-8 md:p-10 shadow-inner">
              <div className="text-5xl md:text-7xl font-black text-white mb-2">
                {result.total_questions - result.score}
              </div>
              <div className="text-lg md:text-xl font-bold text-slate-400 uppercase tracking-widest">{t("wrong")}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12 relative z-10">
            <button 
              onClick={() => window.location.href = '/exams'}
              className="flex items-center justify-center gap-3 bg-blue-600 text-white font-black text-xl py-6 px-10 rounded-full hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105"
            >
              <RotateCcw size={24} />
              <span>{t("takeAnother")}</span>
            </button>
            
            <button 
              onClick={() => setShowAnswers(!showAnswers)}
              className="flex items-center justify-center gap-3 bg-[#27272a] text-white font-black text-xl py-6 px-10 rounded-full hover:bg-[#3f3f46] transition-colors shadow-lg hover:scale-105"
            >
              <span>{showAnswers ? t("hideAnswers") : t("reviewAnswers")}</span>
              {lang === 'ar' ? (
                <ArrowLeft size={24} className={`transform transition-transform ${showAnswers ? '-rotate-90' : ''}`} />
              ) : (
                <ArrowRight size={24} className={`transform transition-transform ${showAnswers ? 'rotate-90' : ''}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* LEADERBOARD SECTION */}
      <div className="bg-[#18181b] rounded-[2.5rem] shadow-xl p-8 md:p-12 mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-3xl md:text-5xl font-black mb-8 text-center text-white tracking-tight flex justify-center items-center gap-4">
          <span>🏆</span> {t("leaderboardTitle")}
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {leaderboard.map((userResult, index) => {
            const isCurrentUser = userResult.id === result.id || userResult.user_id === result.user_id;
            let rankBadge = "";
            if (index === 0) rankBadge = "🥇";
            else if (index === 1) rankBadge = "🥈";
            else if (index === 2) rankBadge = "🥉";
            else rankBadge = `#${index + 1}`;

            return (
              <div 
                key={userResult.id} 
                className={`flex items-center justify-between p-5 md:p-6 rounded-2xl font-bold text-lg md:text-xl transition-all ${
                  isCurrentUser 
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transform scale-[1.02]' 
                    : 'bg-[#09090b] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-12 text-center text-2xl ${isCurrentUser ? 'text-white' : 'text-blue-400'}`}>{rankBadge}</span>
                  <span>{userResult.user_name || t("anonymous")} {isCurrentUser && ` ${t("you")}`}</span>
                </div>
                <div className={`flex items-center gap-2 ${isCurrentUser ? 'text-white' : 'text-emerald-400'}`}>
                  <span>{Math.round(userResult.percentage)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAnswers && (
        <div className="space-y-10 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center text-white tracking-tight">{t("examReview")}</h2>
          
          {questions.map((q, index) => {
            const isTF = q.type === 'tf';
            const options = isTF ? ['A', 'B'] : ['A', 'B', 'C', 'D'];
            
            return (
              <div key={q.id} className="bg-[#18181b] rounded-[2rem] shadow-xl p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-full pointer-events-none" />
                <h3 className="text-2xl md:text-3xl font-bold mb-8 text-white leading-snug relative z-10">
                  <span className="text-blue-400 ml-3">{index + 1}.</span> {q.question}
                </h3>
                
                <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 mb-8`}>
                  {options.map((opt) => {
                    const optionKey = `option_${opt.toLowerCase()}` as keyof Question;
                    const isCorrect = q.correct_answer === opt;
                    
                    return (
                      <div
                        key={opt}
                        className={`p-5 rounded-2xl flex flex-row items-center border-2 text-right ${
                          isCorrect 
                            ? 'bg-emerald-600/10 border-emerald-500/50' 
                            : 'bg-[#09090b] border-[#27272a]'
                        }`}
                      >
                        <div className={`shrink-0 ${lang === 'en' ? 'mr-5' : 'ml-5'}`}>
                          {isCorrect ? (
                            <CheckCircle2 size={28} className="text-emerald-500" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#27272a]" />
                          )}
                        </div>
                        <div className={`font-bold text-lg md:text-xl flex-1 ${isCorrect ? 'text-white' : 'text-slate-400'}`}>
                          {!isTF && <span className={`font-black ${lang === 'en' ? 'mr-3' : 'ml-3'} ${isCorrect ? 'text-emerald-300' : 'text-slate-500'}`}>{opt}.</span>}
                          {q[optionKey] || (isTF && opt === 'A' ? t("optTrue") : t("optFalse"))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {q.explanation && (
                  <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/20 rounded-2xl relative z-10">
                    <h4 className="text-blue-400 font-black text-lg mb-2">{t("explanation")}</h4>
                    <p className="text-slate-300 text-lg leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
