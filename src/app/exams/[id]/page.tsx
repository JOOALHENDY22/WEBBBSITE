import { getExamById, getQuestionsByExamId } from "@/app/actions";
import QuizClient from "@/components/QuizClient";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0; // Disable caching

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const exam = await getExamById(resolvedParams.id);

  if (!exam) {
    return notFound();
  }

  const questions = await getQuestionsByExamId(exam.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <QuizClient 
        exam={exam} 
        questions={questions || []} 
      />
    </div>
  );
}
