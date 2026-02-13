interface ProgressBarProps {
  solved: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ solved, total, className = "" }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-zinc-400 tabular-nums">
        {solved}/{total}
      </span>
    </div>
  );
}
