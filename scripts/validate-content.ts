import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

interface ValidationError {
  file: string;
  message: string;
}

const errors: ValidationError[] = [];
let totalExercises = 0;

function error(file: string, msg: string) {
  errors.push({ file, message: msg });
}

// Validate courses.json
const coursesPath = path.join(CONTENT_DIR, "courses.json");
if (!fs.existsSync(coursesPath)) {
  error("courses.json", "File not found");
  process.exit(1);
}

const course = JSON.parse(fs.readFileSync(coursesPath, "utf-8"));

if (!course.id || !course.title || !Array.isArray(course.lectures)) {
  error("courses.json", "Missing required fields: id, title, lectures");
}

for (const lecture of course.lectures) {
  const required = ["id", "title", "shortTitle", "youtubeId", "order", "description"];
  for (const field of required) {
    if (!(field in lecture)) {
      error("courses.json", `Lecture ${lecture.id}: missing field '${field}'`);
    }
  }

  // Validate video segments if they exist
  const videoPath = path.join(CONTENT_DIR, "videos", `${lecture.id}.json`);
  if (fs.existsSync(videoPath)) {
    const segments = JSON.parse(fs.readFileSync(videoPath, "utf-8"));
    if (!Array.isArray(segments)) {
      error(videoPath, "Expected array of segments");
      continue;
    }

    for (const seg of segments) {
      const segRequired = [
        "id",
        "lectureId",
        "title",
        "order",
        "startTime",
        "endTime",
        "description",
        "exerciseIds",
      ];
      for (const field of segRequired) {
        if (!(field in seg)) {
          error(videoPath, `Segment ${seg.id}: missing field '${field}'`);
        }
      }

      if (seg.lectureId !== lecture.id) {
        error(videoPath, `Segment ${seg.id}: lectureId mismatch`);
      }

      if (typeof seg.startTime === "number" && typeof seg.endTime === "number") {
        if (seg.endTime <= seg.startTime) {
          error(videoPath, `Segment ${seg.id}: endTime must be > startTime`);
        }
      }
    }
  }

  // Validate exercises
  const exerciseDir = path.join(CONTENT_DIR, "exercises", lecture.id);
  if (fs.existsSync(exerciseDir)) {
    const files = fs.readdirSync(exerciseDir).filter((f: string) => f.endsWith(".json"));

    for (const file of files) {
      const filePath = path.join(exerciseDir, file);
      let exercise;
      try {
        exercise = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch (e) {
        error(filePath, `Invalid JSON: ${e}`);
        continue;
      }

      totalExercises++;

      const exRequired = [
        "id",
        "lectureId",
        "segmentId",
        "title",
        "difficulty",
        "order",
        "topics",
        "description",
        "starterCode",
        "solutionCode",
        "testCode",
        "hints",
      ];
      for (const field of exRequired) {
        if (!(field in exercise)) {
          error(filePath, `Exercise ${exercise.id}: missing field '${field}'`);
        }
      }

      if (exercise.lectureId !== lecture.id) {
        error(filePath, `Exercise ${exercise.id}: lectureId mismatch`);
      }

      if (!["easy", "medium", "hard"].includes(exercise.difficulty)) {
        error(filePath, `Exercise ${exercise.id}: invalid difficulty '${exercise.difficulty}'`);
      }

      if (exercise.runtime && !["pyodide", "local"].includes(exercise.runtime)) {
        error(filePath, `Exercise ${exercise.id}: invalid runtime '${exercise.runtime}'`);
      }

      if (!exercise.starterCode?.trim()) {
        error(filePath, `Exercise ${exercise.id}: starterCode is empty`);
      }

      if (!exercise.solutionCode?.trim()) {
        error(filePath, `Exercise ${exercise.id}: solutionCode is empty`);
      }

      if (!exercise.testCode?.trim()) {
        error(filePath, `Exercise ${exercise.id}: testCode is empty`);
      }
    }
  }
}

// Report
console.log(`\nContent Validation Report`);
console.log(`========================`);
console.log(`Lectures: ${course.lectures.length}`);
console.log(`Exercises: ${totalExercises}`);

if (errors.length === 0) {
  console.log(`\n✓ All content is valid!\n`);
  process.exit(0);
} else {
  console.log(`\n✗ Found ${errors.length} error(s):\n`);
  for (const err of errors) {
    console.log(`  [${err.file}] ${err.message}`);
  }
  console.log();
  process.exit(1);
}
