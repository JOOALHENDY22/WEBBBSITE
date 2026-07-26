"use server";

import { readDB, writeDB, generateId } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
    if (index !== -1) {
      db.questions[index] = { ...db.questions[index], ...data };
    }
  } else {
    db.questions.push({
      ...data,
      id: generateId(),
      created_at: new Date().toISOString()
    });
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

// --- USERS ---
export async function getUsers() {
  const db = await readDB();
  return db.users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function registerUser(name: string) {
  const db = await readDB();
  const userId = generateId();
  
  db.users = db.users || [];
  const newUser = {
    id: userId,
    name,
    created_at: new Date().toISOString()
  };
  db.users.push(newUser);
  await writeDB(db);
  
  const cookieStore = await cookies();
  cookieStore.set("student_id", userId, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  cookieStore.set("student_name", name, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
  
  return newUser;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const id = cookieStore.get("student_id")?.value;
  const name = cookieStore.get("student_name")?.value;
  
  if (id && name) {
    return { id, name };
  }
  return null;
}

// --- RESULTS ---
export async function saveResult(examId: string, score: number, totalQuestions: number, percentage: number) {
  const db = await readDB();
  const user = await getCurrentUser();
  
  const newResult = {
    id: generateId(),
    exam_id: examId,
    user_id: user ? user.id : "anonymous",
    user_name: user ? user.name : "Anonymous",
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
  
  // Group by user_id to get only the highest score for each user
  const highestScores = new Map();
  results.forEach(r => {
    if (!highestScores.has(r.user_id) || highestScores.get(r.user_id).percentage < r.percentage) {
      highestScores.set(r.user_id, r);
    }
  });

  return Array.from(highestScores.values())
    .sort((a, b) => b.percentage - a.percentage || new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(0, 20); // Top 20
}

export async function getAllResults(examId: string) {
  const db = await readDB();
  return db.results
    .filter(r => r.exam_id === examId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// --- AUTH ---
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

// --- ULTRA SMART LOCAL IMPORT (NO API KEY NEEDED) ---
export async function parseQuestionsWithAI(examId: string, rawText: string) {
  try {
    const db = await readDB();
    const questions = [];
    
    // Split by any number followed by a dot, colon, parenthesis, or dash
    const blocks = rawText.split(/(?:^|\n)(?:Q(?:uestion)?\s*)?\d+[\.\:\)\-]\s*/i).filter(b => b.trim().length > 10);
    
    if (blocks.length === 0) {
      return { success: false, error: "لم يتم العثور على صيغة أسئلة صحيحة. حاول ترقيم الأسئلة (مثلاً: 1. السؤال...)" };
    }

    for (const block of blocks) {
      const lines = block.trim().split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length < 2) continue;

      const questionText = lines[0];
      const remainingText = lines.slice(1).join('\n');
      
      // Extract Correct Answer
      let correctAnswer = "A";
      const answerMatch = remainingText.match(/(?:Answer|Correct(?: Answer)?|الإجابة|الحل|الاجابه)[\s\:\-]+([A-D])/i);
      if (answerMatch) {
        correctAnswer = answerMatch[1].toUpperCase();
      }

      // Extract Explanation
      let explanation = "";
      const explanationMatch = remainingText.match(/(?:Explanation|Reason|السبب|التبرير|الشرح)[\s\:\-]+([\s\S]+)/i);
      if (explanationMatch) {
        explanation = explanationMatch[1].trim();
      }

      // Detect True/False
      const isTF = remainingText.toLowerCase().includes('true or false') || 
                   (remainingText.toLowerCase().includes('true') && remainingText.toLowerCase().includes('false')) ||
                   remainingText.includes('صح') || remainingText.includes('خطأ');

      if (isTF) {
        if (remainingText.toLowerCase().match(/(?:answer|correct)[\s\:\-]+(?:true|t|صح)/i)) {
          correctAnswer = "A";
        } else if (remainingText.toLowerCase().match(/(?:answer|correct)[\s\:\-]+(?:false|f|خطأ)/i)) {
          correctAnswer = "B";
        }
        
        questions.push({
          exam_id: examId,
          id: generateId(),
          type: "tf",
          question: questionText,
          option_a: "True / صح",
          option_b: "False / خطأ",
          option_c: "",
          option_d: "",
          correct_answer: correctAnswer,
          explanation: explanation,
          created_at: new Date().toISOString()
        });
      } else {
        // Multiple choice extraction
        const options = { A: "", B: "", C: "", D: "" };
        const optRegex = /(?:^|\n)(?:[A-D]|\d)[\.\:\)\-]\s*([^\n]+)/gi;
        let match;
        let count = 0;
        const letters = ["A", "B", "C", "D"];
        
        while ((match = optRegex.exec(remainingText)) !== null && count < 4) {
          options[letters[count] as "A"|"B"|"C"|"D"] = match[1].trim();
          count++;
        }

        // Fallback: If no A/B/C/D prefixes, just take the first few lines as options
        if (!options.A && !options.B) {
          const possibleOptions = lines.slice(1).filter(l => !l.match(/answer|correct|explanation|السبب|الاجابة/i));
          if (possibleOptions.length >= 1) options.A = possibleOptions[0].replace(/^[A-D\d][\.\:\)\-]\s*/i, '');
          if (possibleOptions.length >= 2) options.B = possibleOptions[1].replace(/^[A-D\d][\.\:\)\-]\s*/i, '');
          if (possibleOptions.length >= 3) options.C = possibleOptions[2].replace(/^[A-D\d][\.\:\)\-]\s*/i, '');
          if (possibleOptions.length >= 4) options.D = possibleOptions[3].replace(/^[A-D\d][\.\:\)\-]\s*/i, '');
        }

        questions.push({
          exam_id: examId,
          id: generateId(),
          type: "mcq",
          question: questionText,
          option_a: options.A || "Option A",
          option_b: options.B || "Option B",
          option_c: options.C || "",
          option_d: options.D || "",
          correct_answer: correctAnswer,
          explanation: explanation,
          created_at: new Date().toISOString()
        });
      }
    }

    if (questions.length === 0) {
      return { success: false, error: "فشل استخراج الأسئلة. الرجاء التأكد من وجود ترقيم واضح للأسئلة." };
    }

    db.questions.push(...questions);
    await writeDB(db);

    return { success: true, count: questions.length };
  } catch (error: any) {
    console.error("Local parsing error:", error);
    return { success: false, error: "Error: " + (error.message || "Unknown error occurred") };
  }
}
