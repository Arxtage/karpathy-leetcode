"use client";

import { useState, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Play, RotateCcw, Eye, EyeOff, Lightbulb } from "lucide-react";
import { Exercise } from "@/lib/content/types";
import { usePyodide } from "@/lib/pyodide/usePyodide";
import { useProgress } from "@/lib/progress/useProgress";
import CodeEditor from "./CodeEditor";
import TestRunner from "./TestRunner";

interface ExercisePanelProps {
  exercise: Exercise;
  onSolved?: () => void;
}

export default function ExercisePanel({ exercise, onSolved }: ExercisePanelProps) {
  const { isLoading, isRunning, result, runCode } = usePyodide();
  const { saveExerciseProgress, getSavedCode, getExerciseStatus } = useProgress();

  const savedCode = getSavedCode(exercise.id);
  const [code, setCode] = useState(savedCode ?? exercise.starterCode);
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);

  const status = getExerciseStatus(exercise.id);

  // Reset state when exercise changes
  useEffect(() => {
    const saved = getSavedCode(exercise.id);
    setCode(saved ?? exercise.starterCode);
    setShowSolution(false);
    setShowHints(false);
    setRevealedHints(0);
  }, [exercise.id, exercise.starterCode, getSavedCode]);

  const handleRun = useCallback(async () => {
    // Save attempt
    saveExerciseProgress(exercise.id, "attempted", code);

    const res = await runCode(code, exercise.testCode);
    if (res.success) {
      saveExerciseProgress(exercise.id, "solved", code);
      onSolved?.();
    }
  }, [code, exercise.id, exercise.testCode, runCode, saveExerciseProgress, onSolved]);

  const handleReset = useCallback(() => {
    setCode(exercise.starterCode);
    setShowSolution(false);
  }, [exercise.starterCode]);

  const difficultyColor = {
    easy: "text-green-400 bg-green-400/10",
    medium: "text-yellow-400 bg-yellow-400/10",
    hard: "text-red-400 bg-red-400/10",
  }[exercise.difficulty];

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-zinc-100">{exercise.title}</h2>
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${difficultyColor}`}>
            {exercise.difficulty}
          </span>
          {status === "solved" && (
            <span className="px-2 py-0.5 rounded text-xs font-medium text-green-400 bg-green-400/10">
              Solved
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-500">
          {exercise.topics.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded bg-zinc-800">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Content area — split into description + editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Description */}
        <div className="px-4 py-3 border-b border-zinc-700 overflow-y-auto max-h-48">
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{exercise.description}</ReactMarkdown>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0">
          {showSolution ? (
            <CodeEditor value={exercise.solutionCode} onChange={() => {}} readOnly />
          ) : (
            <CodeEditor value={code} onChange={setCode} onRun={handleRun} />
          )}
        </div>

        {/* Hints */}
        {showHints && exercise.hints.length > 0 && (
          <div className="px-4 py-2 border-t border-zinc-700 bg-zinc-800/50">
            <div className="space-y-1">
              {exercise.hints.slice(0, revealedHints).map((hint, i) => (
                <p key={i} className="text-sm text-yellow-300">
                  💡 {hint}
                </p>
              ))}
              {revealedHints < exercise.hints.length && (
                <button
                  onClick={() => setRevealedHints((r) => r + 1)}
                  className="text-xs text-zinc-400 hover:text-zinc-300"
                >
                  Show next hint ({revealedHints}/{exercise.hints.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="border-t border-zinc-700 max-h-48 overflow-y-auto">
          <TestRunner result={result} isRunning={isRunning} />
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-zinc-700 bg-zinc-800/50">
          <button
            onClick={handleRun}
            disabled={isRunning || isLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-medium rounded transition-colors"
          >
            <Play className="h-4 w-4" />
            {isLoading ? "Loading Python..." : isRunning ? "Running..." : "Run Tests"}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-zinc-400 hover:text-zinc-200 text-sm rounded transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>

          <button
            onClick={() => {
              setShowHints(!showHints);
              if (!showHints && revealedHints === 0) setRevealedHints(1);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-zinc-400 hover:text-zinc-200 text-sm rounded transition-colors"
          >
            <Lightbulb className="h-4 w-4" />
            Hints
          </button>

          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-1.5 px-3 py-2 text-zinc-400 hover:text-zinc-200 text-sm rounded transition-colors ml-auto"
          >
            {showSolution ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Solution
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Solution
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
