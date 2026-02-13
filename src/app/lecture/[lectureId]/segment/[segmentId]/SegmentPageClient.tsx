"use client";

import { useState } from "react";
import { Exercise } from "@/lib/content/types";
import ExercisePanel from "@/components/editor/ExercisePanel";

interface Props {
  exercises: Exercise[];
}

export default function SegmentPageClient({ exercises }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (exercises.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        <p>No exercises for this segment. Watch the video and continue!</p>
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
