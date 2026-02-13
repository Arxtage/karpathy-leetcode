import { getCourse, getExercisesForLecture } from "@/lib/content/loader";
import DashboardClient from "./DashboardClient";
import { LectureMeta } from "@/lib/content/types";

export interface LectureDataItem {
  lecture: LectureMeta;
  exerciseIds: string[];
  exerciseCount: number;
}

export default function HomePage() {
  const course = getCourse();

  const lectureData: LectureDataItem[] = course.lectures.map((lecture) => {
    const exercises = getExercisesForLecture(lecture.id);
    return {
      lecture,
      exerciseIds: exercises.map((e) => e.id),
      exerciseCount: exercises.length,
    };
  });

  return <DashboardClient course={course} lectureData={lectureData} />;
}
