export interface Course {
  id: string;
  title: string;
  description: string;
  lectures: LectureMeta[];
}

export interface LectureMeta {
  id: string;
  title: string;
  shortTitle: string;
  youtubeId: string;
  order: number;
  description: string;
}

export interface VideoSegment {
  id: string;
  lectureId: string;
  title: string;
  order: number;
  startTime: number; // seconds
  endTime: number; // seconds
  description: string;
  exerciseIds: string[];
}

export type Difficulty = "easy" | "medium" | "hard";

export interface Exercise {
  id: string;
  lectureId: string;
  segmentId: string;
  title: string;
  difficulty: Difficulty;
  order: number;
  topics: string[];
  description: string; // Markdown
  starterCode: string;
  solutionCode: string;
  testCode: string;
  hints: string[];
}

export type ExerciseStatus = "not_started" | "attempted" | "solved";

export interface ExerciseProgress {
  exerciseId: string;
  status: ExerciseStatus;
  userCode: string;
  lastAttemptedAt: string; // ISO timestamp
  solvedAt?: string;
}

export interface UserProgress {
  exercises: Record<string, ExerciseProgress>;
}

export interface PyodideResult {
  success: boolean;
  stdout: string;
  stderr: string;
  error?: string;
}
