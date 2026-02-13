import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getLecture,
  getVideoSegments,
  getExercisesForLecture,
  getExercisesForSegment,
} from "@/lib/content/loader";
import LecturePageClient from "./LecturePageClient";

interface Props {
  params: Promise<{ lectureId: string }>;
}

export default async function LecturePage({ params }: Props) {
  const { lectureId } = await params;
  const lecture = getLecture(lectureId);
  if (!lecture) notFound();

  const segments = getVideoSegments(lectureId);
  const allExercises = getExercisesForLecture(lectureId);

  const segmentsWithExercises = segments.map((seg) => ({
    segment: seg,
    exercises: getExercisesForSegment(lectureId, seg.id),
  }));

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-2">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">{lecture.shortTitle}</h1>
        <p className="text-zinc-400 text-sm">{lecture.title}</p>
        <p className="text-zinc-500 mt-2">{lecture.description}</p>
      </div>

      <LecturePageClient
        lectureId={lectureId}
        segmentsWithExercises={segmentsWithExercises}
        allExerciseIds={allExercises.map((e) => e.id)}
      />
    </div>
  );
}
