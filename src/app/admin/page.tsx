"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getExams, createExam, deleteExam, adminLogout, getUsers } from "@/app/actions";
import { Plus, Trash2, Edit, LogOut, Search, BookOpen, Clock, Users } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function AdminDashboard() {
  const { t, lang } = useLanguage();
  const [exams, setExams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'exams'|'users'>('exams');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchExams = async () => {
    const data = await getExams();
    setExams(data);
  };

  const fetchUsersData = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    fetchExams();
    fetchUsersData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSubject) return;
    await createExam(newTitle, newSubject);
    setNewTitle("");
    setNewSubject("");
    setIsModalOpen(false);
    fetchExams();
  };

  const handleDelete = async (id: string) => {
    if (confirm(t("confirmDeleteExam"))) {
      await deleteExam(id);
      fetchExams();
    }
  };

  const filteredExams = exams.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#09090b] text-slate-200 font-sans relative overflow-hidden">
      {/* Background Gradients to match Home */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
      
      {/* Top Nav */}
      <nav className="bg-[#18181b]/80 backdrop-blur-xl sticky top-0 z-30 shadow-md border-b border-[#27272a]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              Y
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-l from-white via-blue-200 to-slate-400">
                {t("adminDashboard")}
              </h1>
              <p className="text-sm text-blue-400 font-bold tracking-wide uppercase">{t("mainTitle")}</p>
            </div>
          </div>
          <button 
            onClick={() => adminLogout()} 
            className="flex items-center gap-2 text-white font-bold transition-colors bg-[#27272a] hover:bg-red-600 px-6 py-3 rounded-full shadow-md"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">{t("logout")}</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-l from-white via-blue-200 to-slate-400">
              {t("examsManager")}
            </h2>
            <p className="text-slate-400 mt-2 font-medium text-lg">{t("manageExamsDesc")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="flex bg-[#18181b] p-1 rounded-full shadow-inner mr-4">
              <button 
                onClick={() => setActiveTab('exams')}
                className={`px-6 py-3 rounded-full font-black text-lg transition-all ${activeTab === 'exams' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                {t("examsTabAdmin")}
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 rounded-full font-black text-lg transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                {t("usersTabAdmin")}
              </button>
            </div>
            
            {activeTab === 'exams' && (
              <>
                <div className="relative w-full sm:w-80">
                  <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${lang === 'ar' ? 'right-5' : 'left-5'}`} size={24} />
                  <input 
                    type="text" 
                    placeholder={t("searchExams")} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full py-4 bg-[#18181b] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-bold text-lg placeholder:text-slate-500 shadow-lg ${lang === 'ar' ? 'pr-14 pl-6' : 'pl-14 pr-6'}`}
                  />
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] whitespace-nowrap"
                >
                  <Plus size={24} />
                  <span>{t("newExam")}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
            <div className="bg-[#18181b] rounded-[2rem] shadow-2xl p-10 w-full max-w-lg">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-white">{t("createNewExam")}</h2>
              </div>
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-base font-bold text-slate-400 mb-3 uppercase tracking-wider">{t("examTitleLabel")}</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl bg-[#09090b] text-white focus:bg-[#27272a] focus:ring-2 focus:ring-blue-500 outline-none font-bold text-xl"
                    placeholder={t("examTitlePlaceholder")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-base font-bold text-slate-400 mb-3 uppercase tracking-wider">{t("subjectLabel")}</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-6 py-5 rounded-2xl bg-[#09090b] text-white focus:bg-[#27272a] focus:ring-2 focus:ring-blue-500 outline-none font-bold text-xl"
                    placeholder={t("subjectPlaceholder")}
                    required
                  />
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 bg-blue-600 text-white font-black text-xl py-5 rounded-2xl hover:bg-blue-500 transition-colors shadow-lg">
                    {t("createBtn")}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-[#27272a] text-white font-black text-xl py-5 rounded-2xl hover:bg-[#3f3f46] transition-colors">
                    {t("cancelBtn")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'exams' ? (
          <>
            {/* Exams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredExams.map((exam) => (
                <div key={exam.id} className="bg-[#18181b] rounded-[2rem] p-8 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-2 transition-all duration-300 group relative flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-[#27272a] text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                      <BookOpen size={32} />
                    </div>
                    <button 
                      onClick={() => handleDelete(exam.id)}
                      className="p-3 text-slate-500 hover:text-white hover:bg-red-500 rounded-xl transition-colors shadow-sm"
                      title="امسح الامتحان"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-4 line-clamp-2 leading-snug">{exam.title}</h3>
                  <div className="inline-block bg-[#09090b] text-slate-300 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest mb-8 w-max">
                    {exam.subject}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#27272a]">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-lg">
                      <Clock size={20} />
                      <span>{exam.questions[0]?.count || 0} {t("questions")}</span>
                    </div>
                    <Link 
                      href={`/admin/exams/${exam.id}`}
                      className="flex items-center gap-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl font-black transition-colors"
                    >
                      <Edit size={18} />
                      {t("manageBtn")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredExams.length === 0 && (
              <div className="text-center py-24 bg-[#18181b] rounded-[2rem] shadow-xl">
                <BookOpen size={64} className="mx-auto text-[#27272a] mb-6" />
                <h3 className="text-3xl font-black text-white mb-2">{t("noExamsFoundAdmin")}</h3>
                <p className="text-xl text-slate-400 font-medium">{t("createToGetStarted")}</p>
              </div>
            )}
          </>
        ) : (
          <div className="bg-[#18181b] rounded-[2rem] shadow-xl p-6 sm:p-10 animate-fade-in-up">
            <h2 className="text-3xl font-black mb-8 text-white flex items-center gap-3">
              <Users className="text-blue-500" size={32} />
              {t("usersTabAdmin")}
            </h2>
            
            {users.length === 0 ? (
              <div className="text-center p-12">
                <p className="text-xl text-slate-400 font-medium">{t("noUsersFound")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-slate-200">
                  <thead className="text-slate-400 text-lg border-b border-[#27272a]">
                    <tr>
                      <th className={`pb-4 font-black ${lang === 'en' ? 'text-left' : 'text-right'}`}>{t("nameHeader")}</th>
                      <th className={`pb-4 font-black ${lang === 'en' ? 'text-right' : 'text-left'}`}>{t("joinedAt")}</th>
                    </tr>
                  </thead>
                  <tbody className="text-lg">
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-[#27272a]/50 hover:bg-[#27272a]/30 transition-colors">
                        <td className={`py-5 font-bold ${lang === 'en' ? 'text-left' : 'text-right'}`}>{u.name}</td>
                        <td className={`py-5 text-slate-400 text-base ${lang === 'en' ? 'text-right' : 'text-left'}`}>{new Date(u.created_at).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
