"use client";

import { useState, useCallback, useEffect } from "react";
import { UserProgress, ExerciseStatus } from "@/lib/content/types";
import {
  loadProgress,
  saveExerciseProgress as saveExercise,
  resetAllProgress as resetAll,
} from "./progressStore";

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>({ exercises: {} });

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const saveExerciseProgress = useCallback(
    (exerciseId: string, status: ExerciseStatus, userCode: string) => {
      const updated = saveExercise(exerciseId, status, userCode);
      setProgress(updated);
    },
    []
  );

  const resetAllProgress = useCallback(() => {
    resetAll();
    setProgress({ exercises: {} });
  }, []);

  const getExerciseStatus = useCallback(
    (exerciseId: string): ExerciseStatus => {
      return progress.exercises[exerciseId]?.status ?? "not_started";
    },
    [progress]
  );

  const getSavedCode = useCallback(
    (exerciseId: string): string | undefined => {
      return progress.exercises[exerciseId]?.userCode;
    },
    [progress]
  );

  const getLectureProgress = useCallback(
    (exerciseIds: string[]): { solved: number; total: number } => {
      const solved = exerciseIds.filter(
        (id) => progress.exercises[id]?.status === "solved"
      ).length;
      return { solved, total: exerciseIds.length };
    },
    [progress]
  );

  return {
    progress,
    saveExerciseProgress,
    resetAllProgress,
    getExerciseStatus,
    getSavedCode,
    getLectureProgress,
  };
}
