import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { LectureMeta } from "@/lib/content/types";
import ProgressBar from "./ProgressBar";

interface LectureCardProps {
  lecture: LectureMeta;
  exerciseCount: number;
  solvedCount: number;
}

export default function LectureCard({
  lecture,
  exerciseCount,
  solvedCount,
}: LectureCardProps) {
  return (
    <Link
      href={`/lecture/${lecture.id}`}
      className="group block p-5 rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">
            {String(lecture.order).padStart(2, "0")}
          </span>
          <BookOpen className="h-4 w-4 text-zinc-500" />
        </div>
        <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
      </div>

      <h3 className="font-semibold text-zinc-100 mb-1">{lecture.shortTitle}</h3>
      <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
        {lecture.description}
      </p>

      {exerciseCount > 0 && (
        <ProgressBar solved={solvedCount} total={exerciseCount} />
      )}
      {exerciseCount === 0 && (
        <p className="text-xs text-zinc-600 italic">Coming soon</p>
      )}
    </Link>
  );
}
