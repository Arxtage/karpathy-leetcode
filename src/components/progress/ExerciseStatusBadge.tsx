import { ExerciseStatus, Difficulty } from "@/lib/content/types";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface ExerciseStatusBadgeProps {
  status: ExerciseStatus;
  difficulty: Difficulty;
}

const difficultyColors: Record<Difficulty, string> = {
  easy: "text-green-400",
  medium: "text-yellow-400",
  hard: "text-red-400",
};

export default function ExerciseStatusBadge({
  status,
  difficulty,
}: ExerciseStatusBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      {status === "solved" ? (
        <CheckCircle className="h-4 w-4 text-green-400" />
      ) : status === "attempted" ? (
        <Clock className="h-4 w-4 text-yellow-400" />
      ) : (
        <Circle className="h-4 w-4 text-zinc-600" />
      )}
      <span className={`text-xs font-medium ${difficultyColors[difficulty]}`}>
        {difficulty}
      </span>
    </div>
  );
}
