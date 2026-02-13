"use client";

import { Exercise } from "@/lib/content/types";
import ExercisePanel from "@/components/editor/ExercisePanel";

interface Props {
  exercise: Exercise;
}

export default function ExercisePageClient({ exercise }: Props) {
  return <ExercisePanel exercise={exercise} />;
}
