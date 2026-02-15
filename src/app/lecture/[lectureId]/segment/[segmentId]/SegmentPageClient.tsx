"use client";

import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { Exercise } from "@/lib/content/types";
import { useProgress } from "@/lib/progress/useProgress";
import ExercisePanel from "@/components/editor/ExercisePanel";

interface Props {
  exercises: Exercise[];
  segmentId: string;
}

export default function SegmentPageClient({ exercises, segmentId }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { toggleSegmentComplete, isSegmentComplete } = useProgress();

  const completed = isSegmentComplete(segmentId);

  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-500">
        <p>No exercises for this segment.</p>
        <button
          onClick={() => toggleSegmentComplete(segmentId)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            completed
              ? "bg-green-900/30 text-green-400 border border-green-800/50 hover:bg-green-900/50"
              : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
          }`}
        >
          {completed ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Watched
            </>
          ) : (
            <>
              <Circle className="h-4 w-4" />
              Mark as Watched
            </>
          )}
        </button>
      </div>
    );
  }

  const exercise = exercises[activeIndex];

  return (
    <div className="flex flex-col h-full">
      {/* Exercise tabs */}
      {exercises.length > 1 && (
        <div className="flex gap-1 px-4 pt-3 pb-1 border-b border-zinc-800 overflow-x-auto">
          {exercises.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => setActiveIndex(i)}
              className={`px-3 py-1.5 text-xs rounded-t font-medium transition-colors whitespace-nowrap ${
                i === activeIndex
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Ex {ex.order}
            </button>
          ))}
        </div>
      )}

      {/* Active exercise */}
      <div className="flex-1 overflow-hidden">
        <ExercisePanel
          key={exercise.id}
          exercise={exercise}
          onSolved={() => {
            // Auto-advance to next unsolved exercise
            if (activeIndex < exercises.length - 1) {
              setTimeout(() => setActiveIndex(activeIndex + 1), 1500);
            }
          }}
        />
      </div>
    </div>
  );
}
