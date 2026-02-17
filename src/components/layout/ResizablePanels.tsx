"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const STORAGE_KEY = "karpathy-leetcode-panel-width";
const DEFAULT_RIGHT_FRACTION = 0.5;
const MIN_FRACTION = 0.25;
const MAX_FRACTION = 0.75;

interface Props {
  left: ReactNode;
  right: ReactNode;
}

export default function ResizablePanels({ left, right }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const fractionRef = useRef(DEFAULT_RIGHT_FRACTION);

  const [rightFraction, setRightFraction] = useState(DEFAULT_RIGHT_FRACTION);

  // Load saved width on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const val = parseFloat(saved);
        if (val >= MIN_FRACTION && val <= MAX_FRACTION) {
          setRightFraction(val);
          fractionRef.current = val;
        }
      }
    } catch {}
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const leftFraction = Math.min(
        MAX_FRACTION,
        Math.max(MIN_FRACTION, x / rect.width)
      );
      const newRight = 1 - leftFraction;
      fractionRef.current = newRight;
      setRightFraction(newRight);
    };

    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      try {
        localStorage.setItem(STORAGE_KEY, String(fractionRef.current));
      } catch {}
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const leftPct = (1 - rightFraction) * 100;
  const rightPct = rightFraction * 100;

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col lg:flex-row overflow-hidden"
      style={
        { "--panel-left": `${leftPct}%`, "--panel-right": `${rightPct}%` } as React.CSSProperties
      }
    >
      <style>{`
        @media (min-width: 1024px) {
          .resizable-left { width: var(--panel-left) !important; }
          .resizable-right { width: var(--panel-right) !important; }
        }
      `}</style>

      {/* Left panel */}
      <div className="resizable-left flex flex-col overflow-hidden lg:border-r border-zinc-800">
        {left}
      </div>

      {/* Drag handle */}
      <div
        onMouseDown={onMouseDown}
        className="hidden lg:flex items-center justify-center w-1 cursor-col-resize hover:bg-blue-500/40 active:bg-blue-500/60 transition-colors flex-shrink-0"
      />

      {/* Right panel */}
      <div className="resizable-right flex flex-col overflow-hidden">
        {right}
      </div>
    </div>
  );
}
