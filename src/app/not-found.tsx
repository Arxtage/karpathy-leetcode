import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-4xl font-bold text-zinc-400">404</h1>
      <p className="text-zinc-500">Page not found</p>
      <Link
        href="/"
        className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
