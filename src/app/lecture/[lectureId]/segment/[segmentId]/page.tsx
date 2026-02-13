import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getLecture,
  getVideoSegment,
  getVideoSegments,
  getExercisesForSegment,
} from "@/lib/content/loader";
import YouTubePlayer from "@/components/video/YouTubePlayer";
import SegmentPageClient from "./SegmentPageClient";

interface Props {
  params: Promise<{ lectureId: string; segmentId: string }>;
}

export default async function SegmentPage({ params }: Props) {
  const { lectureId, segmentId } = await params;
  const lecture = getLecture(lectureId);
  if (!lecture) notFound();

  const segment = getVideoSegment(lectureId, segmentId);
  if (!segment) notFound();

  const exercises = getExercisesForSegment(lectureId, segmentId);
  const allSegments = getVideoSegments(lectureId);
  const segmentIndex = allSegments.findIndex((s) => s.id === segmentId);
  const prevSegment = segmentIndex > 0 ? allSegments[segmentIndex - 1] : null;
  const nextSegment =
    segmentIndex < allSegments.length - 1 ? allSegments[segmentIndex + 1] : null;

  return (
    <div className="h-full flex flex-col">
      {/* Breadcrumb */}
      <div className="px-6 py-3 border-b border-zinc-800 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-300">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/lecture/${lectureId}`}
          className="hover:text-zinc-300"
        >
          {lecture.shortTitle}
        </Link>
        <span>/</span>
        <span className="text-zinc-300">{segment.title}</span>
      </div>

      {/* Main content: video + exercises */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video + navigation */}
        <div className="lg:w-1/2 flex flex-col border-r border-zinc-800">
          <div className="p-4">
            <YouTubePlayer
              videoId={lecture.youtubeId}
              startTime={segment.startTime}
              endTime={segment.endTime}
              title={segment.title}
            />
          </div>
          <div className="px-4 pb-2">
            <h2 className="text-lg font-semibold">{segment.title}</h2>
            <p className="text-sm text-zinc-400 mt-1">{segment.description}</p>
          </div>

          {/* Segment navigation */}
          <div className="mt-auto px-4 py-3 border-t border-zinc-800 flex justify-between text-sm">
            {prevSegment ? (
              <Link
                href={`/lecture/${lectureId}/segment/${prevSegment.id}`}
                className="text-zinc-400 hover:text-zinc-200"
              >
                &larr; {prevSegment.title}
              </Link>
            ) : (
              <span />
            )}
            {nextSegment ? (
              <Link
                href={`/lecture/${lectureId}/segment/${nextSegment.id}`}
                className="text-zinc-400 hover:text-zinc-200"
              >
                {nextSegment.title} &rarr;
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>

        {/* Right: Exercise panel */}
        <div className="lg:w-1/2 flex flex-col overflow-hidden">
          <SegmentPageClient exercises={exercises} />
        </div>
      </div>
    </div>
  );
}
