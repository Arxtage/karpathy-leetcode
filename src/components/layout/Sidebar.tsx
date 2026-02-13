"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Home,
} from "lucide-react";

const lectures = [
  { id: "01-micrograd", shortTitle: "micrograd", order: 1 },
  { id: "02-makemore-1", shortTitle: "makemore (bigrams)", order: 2 },
  { id: "03-makemore-2", shortTitle: "makemore (MLP)", order: 3 },
  { id: "04-makemore-3", shortTitle: "makemore (BatchNorm)", order: 4 },
  { id: "05-makemore-4", shortTitle: "makemore (Backprop)", order: 5 },
  { id: "06-makemore-5", shortTitle: "makemore (WaveNet)", order: 6 },
  { id: "07-gpt", shortTitle: "GPT", order: 7 },
  { id: "08-tokenizer", shortTitle: "Tokenizer", order: 8 },
  { id: "09-gpt2", shortTitle: "GPT-2", order: 9 },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`${
        collapsed ? "w-14" : "w-64"
      } flex flex-col border-r border-zinc-800 bg-zinc-900 transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-zinc-800">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-green-400" />
            <span className="font-bold text-sm">Karpathy LeetCode</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-zinc-800 text-zinc-400"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <Link
          href="/"
          className={`flex items-center gap-2 px-3 py-2 mx-2 rounded text-sm transition-colors ${
            pathname === "/"
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          }`}
        >
          <Home className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        {!collapsed && (
          <div className="mt-4 px-3">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Lectures
            </p>
          </div>
        )}

        {lectures.map((lecture) => {
          const isActive = pathname.startsWith(`/lecture/${lecture.id}`);
          return (
            <Link
              key={lecture.id}
              href={`/lecture/${lecture.id}`}
              className={`flex items-center gap-2 px-3 py-1.5 mx-2 rounded text-sm transition-colors ${
                isActive
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              <span className="text-xs font-mono text-zinc-600 shrink-0 w-4 text-right">
                {lecture.order}
              </span>
              {!collapsed && <span className="truncate">{lecture.shortTitle}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
