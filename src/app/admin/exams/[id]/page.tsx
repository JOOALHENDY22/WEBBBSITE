"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getExamById, getQuestionsByExamId, saveQuestion, deleteQuestion, parseQuestionsWithAI, getAllResults } from "@/app/actions";
import { ArrowRight, ArrowLeft, Plus, Trash2, Edit2, CheckCircle2, Sparkles, Lightbulb, Users } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function ManageQuestions() {
  const { t, lang } = useLanguage();
  const { id: examId } = useParams() as { id: string };
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"questions" | "results">("questions");
  
  // Single Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [qType, setQType] = useState<"mcq" | "tf">("mcq");
  const [questionText, setQuestionText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [explanation, setExplanation] = useState("");

  // AI Import State
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiText, setAiText] = useState("");
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiError, setAiError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const examData = await getExamById(examId);
      if (examData) setExam(examData);
      const questionsData = await getQuestionsByExamId(examId);
      if (questionsData) setQuestions(questionsData);
      const resultsData = await getAllResults(examId);
      if (resultsData) setResults(resultsData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (examId) fetchData();
  }, [examId]);

  const resetForm = () => {
    setEditingId(null);
    setQType("mcq");
    setQuestionText("");
    setOptA("");
    setOptB("");
    setOptC("");
    setOptD("");
    setCorrectAnswer("A");
    setExplanation("");
    setIsFormOpen(false);
  };

  const handleEdit = (q: any) => {
    setEditingId(q.id);
    setQType(q.type || "mcq");
    setQuestionText(q.question);
    setOptA(q.option_a);
    setOptB(q.option_b);
    setOptC(q.option_c || "");
    setOptD(q.option_d || "");
    setCorrectAnswer(q.correct_answer);
    setExplanation(q.explanation || "");
    setIsFormOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingId,
      exam_id: examId,
      type: qType,
      question: questionText,
      option_a: qType === 'tf' ? 'صح' : optA,
      option_b: qType === 'tf' ? 'غلط' : optB,
      option_c: qType === 'tf' ? '' : optC,
      option_d: qType === 'tf' ? '' : optD,
      correct_answer: correctAnswer,
      explanation: explanation
    };
    try {
      await saveQuestion(payload);
      resetForm();
      fetchData();
    } catch (e) {
      alert("حصلت مشكلة وإحنا بنحفظ السؤال.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDeleteQ"))) return;
    try {
      await deleteQuestion(id);
      fetchData();
    } catch (e) {
      alert("Error deleting question");
    }
  };

  const handleAIImport = async () => {
    if (!aiText.trim()) return;
    setIsAIProcessing(true);
    setAiError("");
    try {
      const res = await parseQuestionsWithAI(examId, aiText);
      if (res.success) {
        setAiText("");
        setIsAIOpen(false);
        fetchData();
        alert(`تم إضافة ${res.count} سؤال بنجاح يا هندسة!`);
      } else {
        setAiError(res.error || "مقدرناش نظبط النص ده.");
      }
    } catch (e) {
      setAiError("حصل إيرور وإحنا بنعالج الكلام.");
    }
    setIsAIProcessing(false);
  };

  if (loading) return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="flex items-center justify-center p-20 min-h-screen bg-[#09090b] font-sans">
      <div className="animate-pulse-soft text-slate-400 text-2xl font-black">{t("loadingData")}</div>
    </div>
  );
  
  if (!exam) return <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#09090b] text-white p-20 text-3xl font-black font-sans">{t("examNotFound")}</div>;

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#09090b] text-slate-200 pb-20 font-sans relative overflow-hidden">
      {/* Background Gradients to match Home */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 relative z-10">
        <div className="mb-12 pt-6">
          <Link href="/admin" className="flex w-max items-center gap-3 text-slate-400 hover:text-white mb-8 bg-[#18181b] px-6 py-3 rounded-full shadow-md font-bold text-lg transition-colors">
            {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            {t("backToDashboard")}
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-l from-white via-blue-200 to-slate-400">
                {exam.title}
              </h1>
              <p className="text-slate-400 font-bold text-xl mt-2">{t("manageQuestionsDesc")}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex bg-[#18181b] p-1 rounded-full shadow-inner mr-4">
                <button 
                  onClick={() => setActiveTab('questions')}
                  className={`px-6 py-3 rounded-full font-black text-lg transition-all ${activeTab === 'questions' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  {t("questionsTab")}
                </button>
                <button 
                  onClick={() => setActiveTab('results')}
                  className={`px-6 py-3 rounded-full font-black text-lg transition-all ${activeTab === 'results' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  {t("resultsTab")}
                </button>
              </div>

              {activeTab === 'questions' && (
                <>
                  <button 
                    onClick={() => { resetForm(); setIsFormOpen(true); }}
                    className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] whitespace-nowrap"
                  >
                    <Plus size={24} />
                    <span>{t("addManually")}</span>
                  </button>
                  <button 
                    onClick={() => setIsAIOpen(true)}
                    className="flex items-center justify-center gap-3 bg-gradient-to-l from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-black text-lg hover:from-purple-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] whitespace-nowrap"
                  >
                    <Sparkles size={24} />
                    <span>{t("smartImport")}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {activeTab === 'results' ? (
          <div className="bg-[#18181b]/90 backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 sm:p-10 animate-fade-in-up border border-[#27272a]/50">
            <h2 className="text-3xl font-black mb-8 text-white flex items-center gap-3">
              <Users className="text-blue-500" size={32} />
              <span className="bg-clip-text text-transparent bg-gradient-to-l from-white via-blue-200 to-slate-400">{t("studentResultsForExam")}</span>
            </h2>
            
            {results.length === 0 ? (
              <div className="text-center p-12">
                <p className="text-xl text-slate-400 font-medium">{t("noOneTookExam")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-slate-200">
                  <thead className="text-slate-400 text-lg border-b border-[#27272a]">
                    <tr>
                      <th className={`pb-4 font-black ${lang === 'en' ? 'text-left' : 'text-right'}`}>{t("nameHeader")}</th>
                      <th className="pb-4 font-black text-center">{t("scoreHeader")}</th>
                      <th className="pb-4 font-black text-center">{t("percentageHeader")}</th>
                      <th className={`pb-4 font-black ${lang === 'en' ? 'text-right' : 'text-left'}`}>{t("dateHeader")}</th>
                    </tr>
                  </thead>
                  <tbody className="text-lg">
                    {results.map((res, i) => (
                      <tr key={res.id} className="border-b border-[#27272a]/50 hover:bg-[#27272a]/30 transition-colors">
                        <td className={`py-5 font-bold ${lang === 'en' ? 'text-left' : 'text-right'}`}>{res.user_name || t("anonymous")}</td>
                        <td className="py-5 text-center font-bold text-white">{res.score} / {res.total_questions}</td>
                        <td className="py-5 text-center font-black">
                          <span className={res.percentage >= 50 ? 'text-emerald-400' : 'text-red-400'}>
                            {Math.round(res.percentage)}%
                          </span>
                        </td>
                        <td className={`py-5 text-slate-400 text-base ${lang === 'en' ? 'text-right' : 'text-left'}`}>{new Date(res.created_at).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Smart Import Modal */}
        {isAIOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
            <div className="bg-[#18181b]/90 backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 sm:p-10 w-full max-w-3xl border border-[#27272a]/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center shadow-inner">
                  <Sparkles size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-l from-white via-blue-200 to-slate-400">{t("smartParserTitle")}</h2>
                  <p className="text-slate-400 text-lg font-medium mt-1">{t("smartParserDesc")}</p>
                </div>
              </div>
              
              {aiError && (
                <div className="bg-red-500/10 text-red-400 p-5 rounded-2xl mb-6 text-lg font-bold border border-red-500/20">
                  {aiError}
                </div>
              )}
              
              <div className="bg-[#09090b] p-6 rounded-2xl mb-6 text-base sm:text-lg text-slate-400 font-medium text-left" dir="ltr">
                <p className="font-black text-slate-200 mb-2 uppercase tracking-wide">{t("formatExample")}</p>
                <p className="text-white">1. What is the largest planet?</p>
                <p>A) Earth B) Mars C) Jupiter D) Venus</p>
                <p className="text-emerald-400 font-bold mt-2">Answer: C</p>
                <p className="text-blue-400 font-bold">Explanation: Jupiter is the 5th planet.</p>
              </div>

              <textarea
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
                placeholder={t("pasteHere")}
                className="w-full h-72 p-6 rounded-[1.5rem] bg-[#09090b] text-white focus:bg-[#27272a] focus:ring-2 focus:ring-purple-500 outline-none resize-none mb-8 font-medium text-lg placeholder:text-slate-600"
              />
              
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button 
                  onClick={() => setIsAIOpen(false)} 
                  className="px-8 py-4 rounded-full font-black text-lg text-slate-300 hover:text-white bg-[#27272a] hover:bg-[#3f3f46] transition-colors"
                >
                  {t("cancelBtn")}
                </button>
                <button 
                  onClick={handleAIImport}
                  disabled={isAIProcessing || !aiText.trim()}
                  className="flex items-center justify-center gap-3 bg-gradient-to-l from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-full font-black text-lg shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50"
                >
                  {isAIProcessing ? (
                    <span className="animate-pulse">{t("processing")}</span>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      <span>{t("extractQuestions")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manual Form */}
        {isFormOpen && (
          <form onSubmit={handleSaveQuestion} className="bg-[#18181b]/90 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] shadow-2xl mb-12 animate-fade-in-up border border-[#27272a]/50">
            <h2 className="text-3xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-l from-white via-blue-200 to-slate-400">{editingId ? t("editQuestion") : t("addNewQuestion")}</h2>
            
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => setQType('mcq')}
                className={`flex-1 py-4 px-6 rounded-2xl font-black text-lg transition-all ${
                  qType === 'mcq' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-[#09090b] text-slate-400 hover:bg-[#27272a]'
                }`}
              >
                {t("multipleChoice")}
              </button>
              <button
                type="button"
                onClick={() => setQType('tf')}
                className={`flex-1 py-4 px-6 rounded-2xl font-black text-lg transition-all ${
                  qType === 'tf' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[#09090b] text-slate-400 hover:bg-[#27272a]'
                }`}
              >
                {t("tfChoice")}
              </button>
            </div>

            <div className="mb-8">
              <label className="block text-base font-black text-slate-400 mb-3 uppercase tracking-widest">{t("questionText")}</label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full px-6 py-5 rounded-[1.5rem] bg-[#09090b] text-white focus:bg-[#27272a] focus:ring-2 focus:ring-blue-500 outline-none min-h-[140px] font-bold text-xl"
                required
              />
            </div>

            {qType === 'mcq' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-black text-slate-400 mb-2 uppercase tracking-wider">{t("choiceA")}</label>
                  <input type="text" value={optA} onChange={(e) => setOptA(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-[#09090b] text-white focus:bg-[#27272a] focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-400 mb-2 uppercase tracking-wider">{t("choiceB")}</label>
                  <input type="text" value={optB} onChange={(e) => setOptB(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-[#09090b] text-white focus:bg-[#27272a] focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-400 mb-2 uppercase tracking-wider">{t("choiceC")}</label>
                  <input type="text" value={optC} onChange={(e) => setOptC(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-[#09090b] text-white focus:bg-[#27272a] focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-400 mb-2 uppercase tracking-wider">{t("choiceD")}</label>
                  <input type="text" value={optD} onChange={(e) => setOptD(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-[#09090b] text-white focus:bg-[#27272a] focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg" required />
                </div>
              </div>
            ) : (
              <div className="mb-8 bg-[#09090b] p-6 rounded-2xl text-slate-400 font-bold text-lg text-center">
                {t("tfAutoNote")}
              </div>
            )}

            <div className="mb-8">
              <label className="block text-base font-black text-slate-400 mb-3 uppercase tracking-widest">{t("correctAnswerLabel")}</label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full px-6 py-5 rounded-2xl bg-[#09090b] text-white focus:bg-[#27272a] focus:ring-2 focus:ring-emerald-500 outline-none font-black text-xl"
              >
                <option value="A">{qType === 'mcq' ? t("choiceA") : t("optTrue")}</option>
                <option value="B">{qType === 'mcq' ? t("choiceB") : t("optFalse")}</option>
                {qType === 'mcq' && <option value="C">{t("choiceC")}</option>}
                {qType === 'mcq' && <option value="D">{t("choiceD")}</option>}
              </select>
            </div>

            <div className="mb-10">
              <label className="flex items-center gap-2 text-base font-black text-blue-400 mb-3 uppercase tracking-widest">
                <Lightbulb size={20} />
                {t("explanationLabel")}
              </label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder={t("explanationPlaceholder")}
                className="w-full px-6 py-5 rounded-[1.5rem] bg-[#09090b] text-white focus:bg-[#27272a] focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] font-bold text-lg placeholder:text-slate-600"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button type="submit" className="flex-1 bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-colors">
                {editingId ? t("updateQuestion") : t("saveQuestion")}
              </button>
              <button type="button" onClick={resetForm} className="flex-1 bg-[#27272a] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#3f3f46] transition-colors">
                {t("cancelBtn")}
              </button>
            </div>
          </form>
        )}

        {questions.length === 0 ? (
          <div className="bg-[#18181b]/90 backdrop-blur-xl p-16 sm:p-24 text-center rounded-[2.5rem] shadow-2xl border border-[#27272a]/50">
            <div className="w-24 h-24 bg-[#09090b] text-slate-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-l from-white via-blue-200 to-slate-400 mb-4">{t("noQuestionsYet")}</h3>
            <p className="text-xl text-slate-400 font-medium">{t("addQuestionsDesc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
              {questions.map((q, i) => (
                <div key={q.id} className="bg-[#18181b]/90 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all border border-[#27272a]/50 group relative">
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(q)} className="p-3 text-slate-400 hover:text-white bg-[#27272a] hover:bg-blue-600 rounded-xl transition-colors">
                      <Edit2 size={24} />
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="p-3 text-slate-400 hover:text-white bg-[#27272a] hover:bg-red-600 rounded-xl transition-colors">
                      <Trash2 size={24} />
                    </button>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug pr-24 mb-8">
                    <span className="text-blue-500 ml-3">{i + 1}.</span> {q.question}
                  </h3>
                <div className="flex gap-3 mb-6">
                  <span className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest ${q.type === 'tf' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {q.type === 'tf' ? t("tfChoice") : t("multipleChoice")}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg mb-6">
                  <div className={`p-5 rounded-2xl ${q.correct_answer === 'A' ? 'bg-emerald-600 text-white font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[#09090b] text-slate-400 font-bold'}`}>
                    <span className={`text-slate-500 ${lang === 'en' ? 'mr-3' : 'ml-3'}`}>A.</span> {q.option_a || t("optTrue")}
                  </div>
                  <div className={`p-5 rounded-2xl ${q.correct_answer === 'B' ? 'bg-emerald-600 text-white font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[#09090b] text-slate-400 font-bold'}`}>
                    <span className={`text-slate-500 ${lang === 'en' ? 'mr-3' : 'ml-3'}`}>B.</span> {q.option_b || t("optFalse")}
                  </div>
                  {(q.type !== 'tf' && (q.option_c || q.option_d)) && (
                    <>
                      <div className={`p-5 rounded-2xl ${q.correct_answer === 'C' ? 'bg-emerald-600 text-white font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[#09090b] text-slate-400 font-bold'}`}>
                        <span className={`text-slate-500 ${lang === 'en' ? 'mr-3' : 'ml-3'}`}>C.</span> {q.option_c}
                      </div>
                      <div className={`p-5 rounded-2xl ${q.correct_answer === 'D' ? 'bg-emerald-600 text-white font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[#09090b] text-slate-400 font-bold'}`}>
                        <span className={`text-slate-500 ${lang === 'en' ? 'mr-3' : 'ml-3'}`}>D.</span> {q.option_d}
                      </div>
                    </>
                  )}
                </div>
                
                {q.explanation && (
                  <div className="bg-blue-900/20 p-6 rounded-[1.5rem] text-slate-200 text-lg font-medium mt-6 flex gap-4">
                    <Lightbulb size={28} className="text-blue-400 shrink-0" />
                    <div><span className="font-black text-blue-400 block mb-1">{t("explanation")}: </span>{q.explanation}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
