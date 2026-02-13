import fs from "fs";
import path from "path";
import { Course, LectureMeta, VideoSegment, Exercise } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getCourse(): Course {
  const raw = fs.readFileSync(
    path.join(CONTENT_DIR, "courses.json"),
    "utf-8"
  );
  return JSON.parse(raw) as Course;
}

export function getLecture(lectureId: string): LectureMeta | undefined {
  const course = getCourse();
  return course.lectures.find((l) => l.id === lectureId);
}

export function getVideoSegments(lectureId: string): VideoSegment[] {
  const filePath = path.join(CONTENT_DIR, "videos", `${lectureId}.json`);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  const segments = JSON.parse(raw) as VideoSegment[];
  return segments.sort((a, b) => a.order - b.order);
}

export function getVideoSegment(
  lectureId: string,
  segmentId: string
): VideoSegment | undefined {
  const segments = getVideoSegments(lectureId);
  return segments.find((s) => s.id === segmentId);
}

export function getExercise(exerciseId: string): Exercise | undefined {
  // exerciseId format: "01-micrograd-ex003" -> lectureId = "01-micrograd"
  const parts = exerciseId.split("-ex");
  if (parts.length < 2) return undefined;
  const lectureId = parts[0];
  const exercises = getExercisesForLecture(lectureId);
  return exercises.find((e) => e.id === exerciseId);
}

export function getExercisesForLecture(lectureId: string): Exercise[] {
  const dir = path.join(CONTENT_DIR, "exercises", lectureId);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const exercises: Exercise[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    exercises.push(JSON.parse(raw) as Exercise);
  }

  return exercises.sort((a, b) => a.order - b.order);
}

export function getExercisesForSegment(
  lectureId: string,
  segmentId: string
): Exercise[] {
  const exercises = getExercisesForLecture(lectureId);
  return exercises.filter((e) => e.segmentId === segmentId);
}

export function getAllExerciseIds(): string[] {
  const course = getCourse();
  const ids: string[] = [];
  for (const lecture of course.lectures) {
    const exercises = getExercisesForLecture(lecture.id);
    ids.push(...exercises.map((e) => e.id));
  }
  return ids;
}
