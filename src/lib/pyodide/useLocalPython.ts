"use client";

import { useState, useCallback } from "react";
import { PyodideResult } from "@/lib/content/types";

export function useLocalPython() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<PyodideResult | null>(null);

  const runCode = useCallback(
    async (userCode: string, testCode: string): Promise<PyodideResult> => {
      setIsRunning(true);
      setResult(null);
      try {
        const res = await fetch("/api/run-python", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userCode, testCode }),
        });
        const data: PyodideResult = await res.json();
        setResult(data);
        return data;
      } catch (err) {
        const errorResult: PyodideResult = {
          success: false,
          stdout: "",
          stderr: "",
          error: err instanceof Error ? err.message : String(err),
        };
        setResult(errorResult);
        return errorResult;
      } finally {
        setIsRunning(false);
      }
    },
    []
  );

  // No loading state needed — local Python is always ready
  return { isLoading: false, isRunning, result, runCode };
}
