import { notFound } from "next/navigation";
import Link from "next/link";
import { getExercise, getLecture } from "@/lib/content/loader";
import ExercisePageClient from "./ExercisePageClient";

interface Props {
  params: Promise<{ exerciseId: string }>;
}

export default async function ExercisePage({ params }: Props) {
  const { exerciseId } = await params;
  const exercise = getExercise(exerciseId);
  if (!exercise) notFound();

  const lecture = getLecture(exercise.lectureId);

  return (
    <div className="h-full flex flex-col">
      {/* Breadcrumb */}
      <div className="px-6 py-3 border-b border-zinc-800 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-300">
          Home
        </Link>
        {lecture && (
          <>
            <span>/</span>
            <Link
              href={`/lecture/${lecture.id}`}
              className="hover:text-zinc-300"
            >
              {lecture.shortTitle}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-zinc-300">{exercise.title}</span>
      </div>

      <div className="flex-1 overflow-hidden">
        <ExercisePageClient exercise={exercise} />
      </div>
    </div>
  );
}
