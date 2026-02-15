"use client";

import Link from "next/link";
import { Play, Clock, CheckCircle } from "lucide-react";
import { VideoSegment, Exercise } from "@/lib/content/types";
import { useProgress } from "@/lib/progress/useProgress";
import ProgressBar from "@/components/progress/ProgressBar";
import ExerciseStatusBadge from "@/components/progress/ExerciseStatusBadge";

interface SegmentWithExercises {
  segment: VideoSegment;
  exercises: Exercise[];
}

interface Props {
  lectureId: string;
  segmentsWithExercises: SegmentWithExercises[];
  allExerciseIds: string[];
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function LecturePageClient({
  lectureId,
  segmentsWithExercises,
  allExerciseIds,
}: Props) {
  const { getLectureProgress, getExerciseStatus, isSegmentComplete } = useProgress();
  const { solved, total } = getLectureProgress(allExerciseIds);

  return (
    <>
      <ProgressBar solved={solved} total={total} className="mb-8" />

      <div className="space-y-3">
        {segmentsWithExercises.map(({ segment, exercises }) => {
          const segmentSolved =
            exercises.length > 0
              ? exercises.every((ex) => getExerciseStatus(ex.id) === "solved")
              : isSegmentComplete(segment.id);

          return (
          <Link
            key={segment.id}
            href={`/lecture/${lectureId}/segment/${segment.id}`}
            className={`block p-4 rounded-lg border transition-colors ${
              segmentSolved
                ? "border-green-800/50 bg-green-950/30 hover:border-green-700/50 hover:bg-green-900/20"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800/50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5 ${
                  segmentSolved ? "bg-green-900/50 text-green-400" : "bg-zinc-800 text-zinc-400"
                }`}>
                  {segmentSolved ? <CheckCircle className="h-4 w-4" /> : <Play className="h-3.5 w-3.5" />}
                </div>
                <div>
                  <h3 className="font-medium text-zinc-100">{segment.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(segment.startTime)} – {formatTime(segment.endTime)}
                    </span>
                    {exercises.length > 0 && (
                      <span>
                        {exercises.length} exercise{exercises.length !== 1 && "s"}
                      </span>
                    )}
                  </div>

                  {/* Exercise list */}
                  {exercises.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {exercises.map((ex) => (
                        <div key={ex.id} className="flex items-center gap-2 text-sm text-zinc-400">
                          <ExerciseStatusBadge
                            status={getExerciseStatus(ex.id)}
                            difficulty={ex.difficulty}
                          />
                          <span className="truncate">{ex.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
          );
        })}
      </div>
    </>
  );
}
