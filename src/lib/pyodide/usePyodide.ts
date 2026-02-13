"use client";

import { useState, useCallback, useEffect } from "react";
import { PyodideResult } from "@/lib/content/types";
import { pyodideManager } from "./pyodideManager";

export function usePyodide() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<PyodideResult | null>(null);

  useEffect(() => {
    pyodideManager
      .init()
      .then(() => setIsLoading(false))
      .catch((err) => {
        setIsLoading(false);
        setResult({
          success: false,
          stdout: "",
          stderr: "",
          error: `Failed to load Pyodide: ${err.message}`,
        });
      });
  }, []);

  const runCode = useCallback(
    async (userCode: string, testCode: string): Promise<PyodideResult> => {
      setIsRunning(true);
      setResult(null);
      try {
        const res = await pyodideManager.runCode(userCode, testCode);
        setResult(res);
        return res;
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

  return { isLoading, isRunning, result, runCode };
}
