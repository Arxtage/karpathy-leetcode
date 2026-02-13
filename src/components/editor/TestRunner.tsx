"use client";

import { PyodideResult } from "@/lib/content/types";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";

interface TestRunnerProps {
  result: PyodideResult | null;
  isRunning: boolean;
}

interface ParsedTest {
  name: string;
  passed: boolean;
}

function parseTestOutput(stdout: string): ParsedTest[] {
  const tests: ParsedTest[] = [];
  const lines = stdout.split("\n");
  for (const line of lines) {
    const passMatch = line.match(/^(?:PASS|✓|pass)[:\s]*(.+)/i);
    const failMatch = line.match(/^(?:FAIL|✗|fail)[:\s]*(.+)/i);
    if (passMatch) {
      tests.push({ name: passMatch[1].trim(), passed: true });
    } else if (failMatch) {
      tests.push({ name: failMatch[1].trim(), passed: false });
    }
  }
  return tests;
}

export default function TestRunner({ result, isRunning }: TestRunnerProps) {
  if (isRunning) {
    return (
      <div className="flex items-center gap-2 p-4 text-zinc-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        Running tests...
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-4 text-zinc-500 text-sm">
        Click &quot;Run Tests&quot; or press Cmd+Enter to run your code.
      </div>
    );
  }

  const tests = parseTestOutput(result.stdout);
  const allPassed = result.success && tests.length > 0 && tests.every((t) => t.passed);

  return (
    <div className="p-4 space-y-3">
      {/* Overall status */}
      <div
        className={`flex items-center gap-2 font-medium ${
          allPassed ? "text-green-400" : result.success ? "text-yellow-400" : "text-red-400"
        }`}
      >
        {allPassed ? (
          <>
            <CheckCircle className="h-5 w-5" /> All tests passed!
          </>
        ) : result.success ? (
          <>
            <AlertTriangle className="h-5 w-5" /> Code ran but some tests may have issues
          </>
        ) : (
          <>
            <XCircle className="h-5 w-5" /> Tests failed
          </>
        )}
      </div>

      {/* Individual test results */}
      {tests.length > 0 && (
        <div className="space-y-1">
          {tests.map((test, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm ${
                test.passed ? "text-green-400" : "text-red-400"
              }`}
            >
              {test.passed ? (
                <CheckCircle className="h-3.5 w-3.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              {test.name}
            </div>
          ))}
        </div>
      )}

      {/* stdout */}
      {result.stdout && (
        <details open={!allPassed}>
          <summary className="text-xs text-zinc-500 cursor-pointer">Output</summary>
          <pre className="mt-1 text-xs text-zinc-300 bg-zinc-900 p-2 rounded overflow-x-auto whitespace-pre-wrap">
            {result.stdout}
          </pre>
        </details>
      )}

      {/* stderr / error */}
      {(result.stderr || result.error) && (
        <details open>
          <summary className="text-xs text-red-400 cursor-pointer">Error</summary>
          <pre className="mt-1 text-xs text-red-300 bg-zinc-900 p-2 rounded overflow-x-auto whitespace-pre-wrap">
            {result.error || result.stderr}
          </pre>
        </details>
      )}
    </div>
  );
}
