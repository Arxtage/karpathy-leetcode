import { UserProgress, ExerciseProgress, ExerciseStatus } from "@/lib/content/types";

const STORAGE_KEY = "karpathy-leetcode-progress";

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") {
    return { exercises: {}, completedSegments: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { exercises: {}, completedSegments: {} };
    const parsed = JSON.parse(raw);
    return { exercises: {}, completedSegments: {}, ...parsed } as UserProgress;
  } catch {
    return { exercises: {}, completedSegments: {} };
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function saveExerciseProgress(
  exerciseId: string,
  status: ExerciseStatus,
  userCode: string
): UserProgress {
  const progress = loadProgress();
  const existing = progress.exercises[exerciseId];
  const now = new Date().toISOString();

  const updated: ExerciseProgress = {
    exerciseId,
    status,
    userCode,
    lastAttemptedAt: now,
    solvedAt: status === "solved" ? now : existing?.solvedAt,
  };

  progress.exercises[exerciseId] = updated;
  saveProgress(progress);
  return progress;
}

export function getExerciseProgress(
  exerciseId: string
): ExerciseProgress | undefined {
  const progress = loadProgress();
  return progress.exercises[exerciseId];
}

export function toggleSegmentComplete(segmentId: string): UserProgress {
  const progress = loadProgress();
  if (progress.completedSegments[segmentId]) {
    delete progress.completedSegments[segmentId];
  } else {
    progress.completedSegments[segmentId] = true;
  }
  saveProgress(progress);
  return progress;
}

export function resetAllProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
