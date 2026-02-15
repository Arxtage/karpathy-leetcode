"use client";

import { useState, useCallback, useEffect } from "react";
import { UserProgress, ExerciseStatus } from "@/lib/content/types";
import {
  loadProgress,
  saveExerciseProgress as saveExercise,
  toggleSegmentComplete as toggleSegment,
  resetAllProgress as resetAll,
} from "./progressStore";

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>({ exercises: {}, completedSegments: {} });

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

  const toggleSegmentComplete = useCallback(
    (segmentId: string) => {
      const updated = toggleSegment(segmentId);
      setProgress(updated);
    },
    []
  );

  const isSegmentComplete = useCallback(
    (segmentId: string): boolean => {
      return !!progress.completedSegments[segmentId];
    },
    [progress]
  );

  const resetAllProgress = useCallback(() => {
    resetAll();
    setProgress({ exercises: {}, completedSegments: {} });
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
    toggleSegmentComplete,
    isSegmentComplete,
    resetAllProgress,
    getExerciseStatus,
    getSavedCode,
    getLectureProgress,
  };
}
