import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";

interface RunRequest {
  userCode: string;
  testCode: string;
}

export async function POST(request: NextRequest) {
  const { userCode, testCode }: RunRequest = await request.json();

  if (!userCode && !testCode) {
    return NextResponse.json(
      { success: false, stdout: "", stderr: "", error: "No code provided" },
      { status: 400 }
    );
  }

  const fullCode = userCode + "\n\n" + testCode;

  return new Promise<NextResponse>((resolve) => {
    const child = execFile(
      "python3",
      ["-c", fullCode],
      { timeout: 30_000, maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error && error.killed) {
          resolve(
            NextResponse.json({
              success: false,
              stdout: stdout || "",
              stderr: stderr || "",
              error: "Execution timed out (30s limit)",
            })
          );
          return;
        }

        resolve(
          NextResponse.json({
            success: !error,
            stdout: stdout || "",
            stderr: stderr || "",
            error: error && !error.killed ? error.message : undefined,
          })
        );
      }
    );

    // Safety: kill if somehow still running
    setTimeout(() => {
      try {
        child.kill("SIGKILL");
      } catch {
        // already dead
      }
    }, 35_000);
  });
}
