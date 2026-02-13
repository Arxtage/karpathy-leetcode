"use client";

import { Course } from "@/lib/content/types";
import { useProgress } from "@/lib/progress/useProgress";
import LectureCard from "@/components/progress/LectureCard";
import { LectureDataItem } from "./page";

interface DashboardClientProps {
  course: Course;
  lectureData: LectureDataItem[];
}

export default function DashboardClient({
  course,
  lectureData,
}: DashboardClientProps) {
  const { getLectureProgress } = useProgress();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-zinc-400">{course.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lectureData.map(({ lecture, exerciseIds, exerciseCount }) => {
          const { solved } = getLectureProgress(exerciseIds);
          return (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              exerciseCount={exerciseCount}
              solvedCount={solved}
            />
          );
        })}
      </div>
    </div>
  );
}
