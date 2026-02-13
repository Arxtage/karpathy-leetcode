interface YouTubePlayerProps {
  videoId: string;
  startTime?: number;
  endTime?: number;
  title?: string;
}

export default function YouTubePlayer({
  videoId,
  startTime,
  endTime,
  title,
}: YouTubePlayerProps) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  });
  if (startTime !== undefined) params.set("start", String(Math.floor(startTime)));
  if (endTime !== undefined) params.set("end", String(Math.floor(endTime)));

  const src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;

  return (
    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
      <iframe
        className="absolute inset-0 w-full h-full rounded-lg"
        src={src}
        title={title ?? "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
