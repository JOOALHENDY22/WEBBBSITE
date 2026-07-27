"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getExams, createExam, deleteExam, adminLogout, getUsers } from "@/app/actions";
import { Plus, Trash2, Edit, LogOut, Search, BookOpen, Users, X, FlaskConical, Clock } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function AdminDashboard() {
  const { t, lang } = useLanguage();
  const [exams, setExams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"exams" | "users">("exams");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    const [e, u] = await Promise.all([getExams(), getUsers()]);
    setExams(e);
    setUsers(u);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSubject) return;
    await createExam(newTitle, newSubject);
    setNewTitle(""); setNewSubject(""); setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm(t("confirmDeleteExam"))) { await deleteExam(id); fetchData(); }
  };

  const filteredExams = exams.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-[#030712] text-slate-200 font-sans relative overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%]  w-[55%] h-[55%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%]  w-[55%] h-[55%] rounded-full bg-teal-500/5    blur-[120px]" />
      </div>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-30 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo + Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-9 h-9 shrink-0">
              <Image src="/logo.jpg" alt="Mini Doctors" fill className="object-contain" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-white text-base leading-tight truncate">{t("adminDashboard")}</p>
              <p className="text-emerald-400 text-xs font-bold hidden sm:block">Mini Doctors</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#0f172a] border border-white/5 p-1 rounded-full">
            <button
              onClick={() => setActiveTab("exams")}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${activeTab === "exams" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              {t("examsTabAdmin")}
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-1.5 ${activeTab === "users" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
            >
              <Users size={14} />
              {t("usersTabAdmin")}
              {users.length > 0 && (
                <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-black">{users.length}</span>
              )}
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={() => adminLogout()}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 px-3 py-2 rounded-full font-bold text-sm transition-all border border-transparent hover:border-red-500/20 shrink-0"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">{t("logout")}</span>
          </button>
        </div>
      </nav>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">

        {/* ── EXAMS TAB ── */}
        {activeTab === "exams" && (
          <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-500 ${lang === "ar" ? "right-4" : "left-4"}`} size={18} />
                <input
                  type="text"
                  placeholder={t("searchExams")}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className={`w-full py-3 bg-[#0f172a] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white font-medium text-base placeholder:text-slate-600 ${lang === "ar" ? "pr-11 pl-5" : "pl-11 pr-5"}`}
                />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold text-base transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] whitespace-nowrap"
              >
                <Plus size={20} />
                {t("newExam")}
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredExams.map((exam, i) => (
                <div
                  key={exam.id}
                  className="bg-[#0f172a] border border-white/5 hover:border-emerald-500/20 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] transition-all duration-300 group flex flex-col animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FlaskConical size={24} />
                    </div>
                    <button
                      onClick={() => handleDelete(exam.id)}
                      className="p-2 text-slate-600 hover:text-white hover:bg-red-500/80 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 line-clamp-2 leading-snug">{exam.title}</h3>
                  <span className="inline-block bg-[#1e293b] text-slate-300 px-3 py-1 rounded-lg text-xs font-bold mb-5">{exam.subject}</span>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium text-sm">
                      <Clock size={14} className="text-emerald-400" />
                      <span>{exam.questions[0]?.count || 0} {t("questions")}</span>
                    </div>
                    <Link
                      href={`/admin/exams/${exam.id}`}
                      className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl font-bold text-sm transition-all"
                    >
                      <Edit size={14} />
                      {t("manageBtn")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredExams.length === 0 && (
              <div className="text-center py-20 bg-[#0f172a] border border-white/5 rounded-2xl">
                <BookOpen size={48} className="mx-auto text-slate-700 mb-4" />
                <h3 className="text-xl font-black text-white mb-2">{t("noExamsFoundAdmin")}</h3>
                <p className="text-slate-400">{t("createToGetStarted")}</p>
              </div>
            )}
          </>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === "users" && (
          <div className="bg-[#0f172a] border border-white/5 rounded-2xl overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-white/5 flex items-center gap-3">
              <Users size={20} className="text-emerald-400" />
              <h2 className="text-lg font-black text-white">{t("usersTabAdmin")}</h2>
              <span className="bg-emerald-500/15 text-emerald-400 text-xs font-black px-3 py-1 rounded-full">{users.length}</span>
            </div>

            {users.length === 0 ? (
              <div className="text-center p-16">
                <Users size={48} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-400 font-medium">{t("noUsersFound")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="text-slate-500 text-xs uppercase tracking-widest border-b border-white/5">
                    <tr>
                      <th className={`px-6 py-4 font-bold ${lang === "en" ? "text-left" : "text-right"}`}>#</th>
                      <th className={`px-6 py-4 font-bold ${lang === "en" ? "text-left" : "text-right"}`}>{t("nameHeader")}</th>
                      <th className={`px-6 py-4 font-bold ${lang === "en" ? "text-right" : "text-left"}`}>{t("joinedAt")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className={`px-6 py-4 text-slate-600 text-sm font-bold ${lang === "en" ? "text-left" : "text-right"}`}>{i + 1}</td>
                        <td className={`px-6 py-4 font-bold text-white ${lang === "en" ? "text-left" : "text-right"}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-black text-sm shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            {u.name}
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-slate-400 text-sm ${lang === "en" ? "text-right" : "text-left"}`}>
                          {new Date(u.created_at).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Create Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in-up">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">{t("createNewExam")}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{t("examTitleLabel")}</label>
                <input
                  type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#1e293b] text-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-base"
                  placeholder={t("examTitlePlaceholder")} required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{t("subjectLabel")}</label>
                <input
                  type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#1e293b] text-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-base"
                  placeholder={t("subjectPlaceholder")} required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 rounded-xl transition-colors">
                  {t("createBtn")}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-[#1e293b] hover:bg-[#334155] text-white font-bold py-3.5 rounded-xl transition-colors">
                  {t("cancelBtn")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
