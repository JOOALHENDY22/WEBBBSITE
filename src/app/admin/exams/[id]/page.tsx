"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getExamById, getQuestionsByExamId, saveQuestion, deleteQuestion, parseQuestionsWithAI, getAllResults } from "@/app/actions";
import { ArrowRight, ArrowLeft, Plus, Trash2, Edit2, CheckCircle2, Sparkles, Lightbulb, Users, Clock, X, HelpCircle } from "lucide-react";
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
      option_a: qType === 'tf' ? 'True / صح' : optA,
      option_b: qType === 'tf' ? 'False / خطأ' : optB,
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
      alert("Error saving question");
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
        alert(`تم إضافة ${res.count} سؤال بنجاح يا دكتور!`);
      } else {
        setAiError(res.error || "مقدرناش نظبط النص ده.");
      }
    } catch (e) {
      setAiError("حصل إيرور وإحنا بنعالج الكلام.");
    }
    setIsAIProcessing(false);
  };

  if (loading) return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="flex items-center justify-center p-20 min-h-screen bg-[#030712] font-sans">
      <div className="animate-pulse-soft text-slate-400 text-2xl font-black">{t("loadingData")}</div>
    </div>
  );
  
  if (!exam) return <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#030712] text-white p-20 text-3xl font-black font-sans">{t("examNotFound")}</div>;

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#030712] text-slate-200 pb-20 font-sans relative overflow-hidden">
      {/* Background Gradients to match Home */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-500/5 blur-[150px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 relative z-10">
        <div className="mb-12 pt-4">
          <Link href="/admin" className="flex w-max items-center gap-2 text-slate-400 hover:text-white mb-8 bg-[#0f172a] px-5 py-2.5 rounded-xl border border-white/5 font-bold text-base transition-all hover:scale-105">
            {lang === 'ar' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            {t("backToDashboard")}
          </Link>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
                {exam.title}
              </h1>
              <p className="text-slate-400 font-bold text-base mt-2">{t("manageQuestionsDesc")}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="flex bg-[#0f172a] border border-white/5 p-1 rounded-full shadow-inner mr-4">
                <button 
                  onClick={() => setActiveTab('questions')}
                  className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'questions' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  {t("questionsTab")}
                </button>
                <button 
                  onClick={() => setActiveTab('results')}
                  className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${activeTab === 'results' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  {t("resultsTab")}
                </button>
              </div>

              {activeTab === 'questions' && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => { resetForm(); setIsFormOpen(true); }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] whitespace-nowrap"
                  >
                    <Plus size={18} />
                    <span>{t("addManually")}</span>
                  </button>
                  <button 
                    onClick={() => setIsAIOpen(true)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-l from-teal-600 to-emerald-600 text-white px-5 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] whitespace-nowrap"
                  >
                    <Sparkles size={18} />
                    <span>{t("smartImport")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- RESULTS TAB --- */}
        {activeTab === 'results' ? (
          <div className="bg-[#0f172a] border border-white/5 rounded-2xl shadow-xl p-6 sm:p-10 animate-fade-in-up">
            <h2 className="text-2xl font-black mb-8 text-white flex items-center gap-3">
              <Users className="text-emerald-400" size={26} />
              <span>{t("studentResultsForExam")}</span>
            </h2>
            
            {results.length === 0 ? (
              <div className="text-center p-12">
                <p className="text-lg text-slate-400 font-medium">{t("noOneTookExam")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-slate-200">
                  <thead className="text-slate-500 text-xs uppercase tracking-widest border-b border-white/5">
                    <tr>
                      <th className={`px-4 py-3 font-bold ${lang === 'en' ? 'text-left' : 'text-right'}`}>{t("nameHeader")}</th>
                      <th className="px-4 py-3 font-bold text-center">{t("scoreHeader")}</th>
                      <th className="px-4 py-3 font-bold text-center">{t("percentageHeader")}</th>
                      <th className={`px-4 py-3 font-bold ${lang === 'en' ? 'text-right' : 'text-left'}`}>{t("dateHeader")}</th>
                    </tr>
                  </thead>
                  <tbody className="text-base font-medium">
                    {results.map((res) => (
                      <tr key={res.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className={`px-4 py-4 font-bold ${lang === 'en' ? 'text-left' : 'text-right'}`}>{res.user_name || t("anonymous")}</td>
                        <td className="px-4 py-4 text-center font-bold text-white">{res.score} / {res.total_questions}</td>
                        <td className="px-4 py-4 text-center font-black">
                          <span className={res.percentage >= 50 ? 'text-emerald-400' : 'text-red-400'}>
                            {Math.round(res.percentage)}%
                          </span>
                        </td>
                        <td className={`px-4 py-4 text-slate-400 text-sm ${lang === 'en' ? 'text-right' : 'text-left'}`}>{new Date(res.created_at).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* --- SMART IMPORT MODAL --- */}
            {isAIOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in-up">
                <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-white">{t("smartParserTitle")}</h2>
                        <p className="text-slate-400 text-xs font-bold mt-0.5">{t("smartParserDesc")}</p>
                      </div>
                    </div>
                    <button onClick={() => setIsAIOpen(false)} className="text-slate-500 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-all">
                      <X size={20} />
                    </button>
                  </div>
                  
                  {aiError && (
                    <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-4 text-sm font-bold border border-red-500/20">
                      {aiError}
                    </div>
                  )}
                  
                  <div className="bg-[#1e293b] p-5 rounded-xl mb-4 text-sm text-slate-400 font-bold text-left" dir="ltr">
                    <p className="font-black text-slate-200 mb-1 uppercase tracking-wide">{t("formatExample")}</p>
                    <p className="text-white">1. What is the largest planet?</p>
                    <p>A) Earth B) Mars C) Jupiter D) Venus</p>
                    <p className="text-emerald-400 font-bold mt-1">Answer: C</p>
                    <p className="text-teal-400 font-bold">Explanation: Jupiter is the 5th planet.</p>
                  </div>

                  <textarea
                    value={aiText}
                    onChange={(e) => setAiText(e.target.value)}
                    placeholder={t("pasteHere")}
                    className="w-full h-64 p-4 rounded-xl bg-[#1e293b] text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none mb-6 font-medium text-base placeholder:text-slate-650"
                  />
                  
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setIsAIOpen(false)} 
                      className="px-6 py-3 rounded-xl font-bold text-sm text-slate-300 hover:text-white bg-[#1e293b] hover:bg-[#334155] transition-colors"
                    >
                      {t("cancelBtn")}
                    </button>
                    <button 
                      onClick={handleAIImport}
                      disabled={isAIProcessing || !aiText.trim()}
                      className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
                    >
                      {isAIProcessing ? (
                        <span className="animate-pulse">{t("processing")}</span>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          <span>{t("extractQuestions")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- MANUAL FORM --- */}
            {isFormOpen && (
              <form onSubmit={handleSaveQuestion} className="bg-[#0f172a] border border-white/5 p-6 sm:p-8 rounded-2xl shadow-2xl mb-8 animate-fade-in-up">
                <h2 className="text-2xl font-black mb-6 text-white">{editingId ? t("editQuestion") : t("addNewQuestion")}</h2>
                
                <div className="mb-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setQType('mcq')}
                    className={`flex-1 py-3 px-5 rounded-xl font-bold text-base transition-all ${
                      qType === 'mcq' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[#1e293b] text-slate-400 hover:bg-[#334155]'
                    }`}
                  >
                    {t("multipleChoice")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setQType('tf')}
                    className={`flex-1 py-3 px-5 rounded-xl font-bold text-base transition-all ${
                      qType === 'tf' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[#1e293b] text-slate-400 hover:bg-[#334155]'
                    }`}
                  >
                    {t("tfChoice")}
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">{t("questionText")}</label>
                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#1e293b] text-white focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px] font-bold text-lg"
                    required
                  />
                </div>

                {qType === 'mcq' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-black text-slate-400 mb-1 uppercase tracking-wider">{t("choiceA")}</label>
                      <input type="text" value={optA} onChange={(e) => setOptA(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#1e293b] text-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-base" required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 mb-1 uppercase tracking-wider">{t("choiceB")}</label>
                      <input type="text" value={optB} onChange={(e) => setOptB(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#1e293b] text-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-base" required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 mb-1 uppercase tracking-wider">{t("choiceC")}</label>
                      <input type="text" value={optC} onChange={(e) => setOptC(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#1e293b] text-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-base" required />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 mb-1 uppercase tracking-wider">{t("choiceD")}</label>
                      <input type="text" value={optD} onChange={(e) => setOptD(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#1e293b] text-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-base" required />
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 bg-[#1e293b] p-4 rounded-xl text-slate-400 font-bold text-sm text-center">
                    {t("tfAutoNote")}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">{t("correctAnswerLabel")}</label>
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#1e293b] text-white focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-base"
                  >
                    <option value="A">{qType === 'mcq' ? t("choiceA") : t("optTrue")}</option>
                    <option value="B">{qType === 'mcq' ? t("choiceB") : t("optFalse")}</option>
                    {qType === 'mcq' && <option value="C">{t("choiceC")}</option>}
                    {qType === 'mcq' && <option value="D">{t("choiceD")}</option>}
                  </select>
                </div>

                <div className="mb-8">
                  <label className="flex items-center gap-1.5 text-xs font-black text-emerald-400 mb-2 uppercase tracking-widest">
                    <Lightbulb size={16} />
                    {t("explanationLabel")}
                  </label>
                  <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder={t("explanationPlaceholder")}
                    className="w-full px-4 py-3 rounded-xl bg-[#1e293b] text-white focus:ring-2 focus:ring-emerald-500 outline-none min-h-[90px] font-bold text-base placeholder:text-slate-600"
                  />
                </div>

                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-colors">
                    {editingId ? t("updateQuestion") : t("saveQuestion")}
                  </button>
                  <button type="button" onClick={resetForm} className="flex-1 bg-[#1e293b] text-white py-3.5 rounded-xl font-bold text-base hover:bg-[#334155] transition-colors">
                    {t("cancelBtn")}
                  </button>
                </div>
              </form>
            )}

            {/* --- QUESTIONS LIST --- */}
            {questions.length === 0 ? (
              <div className="bg-[#0f172a] border border-white/5 p-16 text-center rounded-2xl">
                <HelpCircle size={48} className="mx-auto text-slate-700 mb-4" />
                <h3 className="text-xl font-black text-white mb-2">{t("noQuestionsYet")}</h3>
                <p className="text-slate-400">{t("addQuestionsDesc")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {questions.map((q, i) => (
                  <div key={q.id} className="bg-[#0f172a] border border-white/5 p-6 sm:p-8 rounded-2xl relative group">
                    {/* Action buttons */}
                    <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(q)} className="p-2 text-slate-400 hover:text-white bg-[#1e293b] hover:bg-emerald-600 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(q.id)} className="p-2 text-slate-400 hover:text-white bg-[#1e293b] hover:bg-red-650 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-bold text-white leading-snug pr-20 mb-4">
                      <span className="text-emerald-400 ml-2 font-black">{i + 1}.</span> {q.question}
                    </h3>

                    <div className="inline-block bg-[#1e293b] text-slate-300 px-3 py-1 rounded-lg text-xs font-bold mb-5 uppercase tracking-wider">
                      {q.type === 'tf' ? t("tfChoice") : t("multipleChoice")}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base mb-4">
                      <div className={`p-4 rounded-xl ${q.correct_answer === 'A' ? 'bg-emerald-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]' : 'bg-[#1e293b] text-slate-400'}`}>
                        <span className={`text-slate-500 ${lang === 'en' ? 'mr-2' : 'ml-2'}`}>A.</span> {q.option_a || t("optTrue")}
                      </div>
                      <div className={`p-4 rounded-xl ${q.correct_answer === 'B' ? 'bg-emerald-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]' : 'bg-[#1e293b] text-slate-400'}`}>
                        <span className={`text-slate-500 ${lang === 'en' ? 'mr-2' : 'ml-2'}`}>B.</span> {q.option_b || t("optFalse")}
                      </div>
                      {(q.type !== 'tf' && (q.option_c || q.option_d)) && (
                        <>
                          <div className={`p-4 rounded-xl ${q.correct_answer === 'C' ? 'bg-emerald-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]' : 'bg-[#1e293b] text-slate-400'}`}>
                            <span className={`text-slate-500 ${lang === 'en' ? 'mr-2' : 'ml-2'}`}>C.</span> {q.option_c}
                          </div>
                          <div className={`p-4 rounded-xl ${q.correct_answer === 'D' ? 'bg-emerald-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]' : 'bg-[#1e293b] text-slate-400'}`}>
                            <span className={`text-slate-500 ${lang === 'en' ? 'mr-2' : 'ml-2'}`}>D.</span> {q.option_d}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {q.explanation && (
                      <div className="bg-emerald-950/20 border border-emerald-500/10 p-4 rounded-xl text-slate-300 text-sm mt-4 flex gap-3">
                        <Lightbulb size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                        <div><span className="font-bold text-emerald-400 block mb-0.5">{t("explanation")}: </span>{q.explanation}</div>
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
