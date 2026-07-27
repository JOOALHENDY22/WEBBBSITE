"use server";

import { readDB, writeDB, generateId } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Simple deterministic hash (no Node.js crypto needed - works on all runtimes)
function hashPassword(password: string): string {
  const str = password + "minidoctors_salt_2025";
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

// --- EXAMS ---
export async function getExams() {
  const db = await readDB();
  return db.exams.map(exam => {
    const questionCount = db.questions.filter(q => q.exam_id === exam.id).length;
    return { ...exam, questions: [{ count: questionCount }] };
  }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getExamById(id: string) {
  const db = await readDB();
  return db.exams.find(e => e.id === id) || null;
}

export async function createExam(title: string, subject: string) {
  const db = await readDB();
  const newExam = {
    id: generateId(),
    title,
    subject,
    created_at: new Date().toISOString()
  };
  db.exams.push(newExam);
  await writeDB(db);
  return newExam;
}

export async function deleteExam(id: string) {
  const db = await readDB();
  db.exams = db.exams.filter(e => e.id !== id);
  db.questions = db.questions.filter(q => q.exam_id !== id);
  db.results = db.results.filter(r => r.exam_id !== id);
  await writeDB(db);
  return { success: true };
}

// --- QUESTIONS ---
export async function getQuestionsByExamId(examId: string) {
  const db = await readDB();
  return db.questions
    .filter(q => q.exam_id === examId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export async function saveQuestion(data: any) {
  const db = await readDB();
  if (data.id) {
    const index = db.questions.findIndex(q => q.id === data.id);
    if (index !== -1) db.questions[index] = { ...db.questions[index], ...data };
  } else {
    db.questions.push({ ...data, id: generateId(), created_at: new Date().toISOString() });
  }
  await writeDB(db);
  return { success: true };
}

export async function deleteQuestion(id: string) {
  const db = await readDB();
  db.questions = db.questions.filter(q => q.id !== id);
  await writeDB(db);
  return { success: true };
}

// --- USERS AUTH ---
export async function getUsers() {
  const db = await readDB();
  return db.users
    .map(u => ({ id: u.id, name: u.name, created_at: u.created_at }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function registerUser(name: string, password: string) {
  const db = await readDB();
  db.users = db.users || [];

  // Check if name already exists
  const existing = db.users.find(u => u.name.toLowerCase().trim() === name.toLowerCase().trim());
  if (existing) {
    return { success: false, error: "nameExists" };
  }

  const userId = generateId();
  const newUser = {
    id: userId,
    name: name.trim(),
    password: hashPassword(password),
    created_at: new Date().toISOString()
  };
  db.users.push(newUser);
  await writeDB(db);

  const cookieStore = await cookies();
  cookieStore.set("student_id",   userId,       { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365 });
  cookieStore.set("student_name", name.trim(),  { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365 });

  return { success: true, user: { id: userId, name: name.trim() } };
}

export async function loginUser(name: string, password: string) {
  const db = await readDB();
  const user = db.users.find(u => u.name.toLowerCase().trim() === name.toLowerCase().trim());

  if (!user) return { success: false, error: "notFound" };
  if (user.password !== hashPassword(password)) return { success: false, error: "wrongPassword" };

  const cookieStore = await cookies();
  cookieStore.set("student_id",   user.id,   { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365 });
  cookieStore.set("student_name", user.name, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365 });

  return { success: true, user: { id: user.id, name: user.name } };
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("student_id");
  cookieStore.delete("student_name");
  redirect("/");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const id   = cookieStore.get("student_id")?.value;
  const name = cookieStore.get("student_name")?.value;
  if (id && name) return { id, name };
  return null;
}

// --- RESULTS ---
export async function saveResult(examId: string, score: number, totalQuestions: number, percentage: number) {
  const db = await readDB();
  const user = await getCurrentUser();

  const newResult = {
    id: generateId(),
    exam_id: examId,
    user_id:   user ? user.id   : "anonymous",
    user_name: user ? user.name : "مجهول",
    score,
    total_questions: totalQuestions,
    percentage,
    created_at: new Date().toISOString()
  };
  db.results.push(newResult);
  await writeDB(db);
  return newResult;
}

export async function getResultById(id: string) {
  const db = await readDB();
  return db.results.find(r => r.id === id) || null;
}

export async function getLeaderboard(examId: string) {
  const db = await readDB();
  const results = db.results.filter(r => r.exam_id === examId);

  const highestScores = new Map<string, any>();
  results.forEach(r => {
    const key = r.user_id || r.user_name;
    if (!highestScores.has(key) || highestScores.get(key).percentage < r.percentage) {
      highestScores.set(key, r);
    }
  });

  return Array.from(highestScores.values())
    .sort((a, b) => b.percentage - a.percentage || new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(0, 20);
}

export async function getAllResults(examId: string) {
  const db = await readDB();
  return db.results
    .filter(r => r.exam_id === examId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// --- ADMIN AUTH ---
export async function adminLogin(password: string) {
  if (password === "ECU482007") {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    return { success: true };
  }
  return { success: false, error: "Invalid password" };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin");
}

export async function checkAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "true";
}

// --- SMART IMPORT ---
export async function parseQuestionsWithAI(examId: string, rawText: string) {
  try {
    const db = await readDB();
    const questions = [];

    const blocks = rawText.split(/(?:^|\n)(?:Q(?:uestion)?\s*)?\d+[\.\:\)\-]\s*/i).filter(b => b.trim().length > 10);

    if (blocks.length === 0) {
      return { success: false, error: "لم يتم العثور على صيغة أسئلة صحيحة." };
    }

    for (const block of blocks) {
      const lines = block.trim().split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length < 2) continue;

      const questionText = lines[0];
      const remainingText = lines.slice(1).join('\n');

      let correctAnswer = "A";
      const answerMatch = remainingText.match(/(?:Answer|Correct(?: Answer)?|الإجابة|الحل|الاجابه)[\s\:\-]+([A-D])/i);
      if (answerMatch) correctAnswer = answerMatch[1].toUpperCase();

      let explanation = "";
      const explanationMatch = remainingText.match(/(?:Explanation|Reason|السبب|التبرير|الشرح)[\s\:\-]+([\s\S]+)/i);
      if (explanationMatch) explanation = explanationMatch[1].trim();

      const isTF = remainingText.toLowerCase().includes('true or false') ||
        (remainingText.toLowerCase().includes('true') && remainingText.toLowerCase().includes('false')) ||
        remainingText.includes('صح') || remainingText.includes('خطأ');

      if (isTF) {
        if (remainingText.toLowerCase().match(/(?:answer|correct)[\s\:\-]+(?:true|t|صح)/i)) correctAnswer = "A";
        else if (remainingText.toLowerCase().match(/(?:answer|correct)[\s\:\-]+(?:false|f|خطأ)/i)) correctAnswer = "B";

        questions.push({
          exam_id: examId, id: generateId(), type: "tf",
          question: questionText, option_a: "True / صح", option_b: "False / خطأ",
          option_c: "", option_d: "", correct_answer: correctAnswer,
          explanation, created_at: new Date().toISOString()
        });
      } else {
        const options: Record<string, string> = { A: "", B: "", C: "", D: "" };
        const optRegex = /(?:^|\n)(?:[A-D]|\d)[\.\:\)\-]\s*([^\n]+)/gi;
        let match; let count = 0;
        const letters = ["A", "B", "C", "D"];
        while ((match = optRegex.exec(remainingText)) !== null && count < 4) {
          options[letters[count]] = match[1].trim();
          count++;
        }
        if (!options.A && !options.B) {
          const possibleOptions = lines.slice(1).filter(l => !l.match(/answer|correct|explanation|السبب|الاجابة/i));
          if (possibleOptions.length >= 1) options.A = possibleOptions[0].replace(/^[A-D\d][\.\:\)\-]\s*/i, '');
          if (possibleOptions.length >= 2) options.B = possibleOptions[1].replace(/^[A-D\d][\.\:\)\-]\s*/i, '');
          if (possibleOptions.length >= 3) options.C = possibleOptions[2].replace(/^[A-D\d][\.\:\)\-]\s*/i, '');
          if (possibleOptions.length >= 4) options.D = possibleOptions[3].replace(/^[A-D\d][\.\:\)\-]\s*/i, '');
        }
        questions.push({
          exam_id: examId, id: generateId(), type: "mcq",
          question: questionText, option_a: options.A || "Option A",
          option_b: options.B || "Option B", option_c: options.C || "",
          option_d: options.D || "", correct_answer: correctAnswer,
          explanation, created_at: new Date().toISOString()
        });
      }
    }

    if (questions.length === 0) return { success: false, error: "فشل استخراج الأسئلة." };

    db.questions.push(...questions);
    await writeDB(db);
    return { success: true, count: questions.length };
  } catch (error: any) {
    return { success: false, error: "Error: " + (error.message || "Unknown error") };
  }
}
