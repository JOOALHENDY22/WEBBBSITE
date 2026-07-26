import { getResultById, getQuestionsByExamId, getLeaderboard } from "@/app/actions";
import ResultClient from "@/components/ResultClient";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0; // Disable caching

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const result = await getResultById(resolvedParams.id);

  if (!result) {
    return notFound();
  }

  const questions = await getQuestionsByExamId(result.exam_id);
  const leaderboard = await getLeaderboard(result.exam_id);

  return (
    <div className="min-h-screen bg-[#09090b]">
      <ResultClient 
        result={result} 
        questions={questions || []}
        leaderboard={leaderboard || []} 
      />
    </div>
  );
}
