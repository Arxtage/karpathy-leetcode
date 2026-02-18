import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

interface RunRequest {
  userCode: string;
  testCode: string;
}

function forbidden(msg: string) {
  return NextResponse.json(
    { success: false, stdout: "", stderr: "", error: msg },
    { status: 403 }
  );
}

function isLocalhost(request: NextRequest): boolean {
  // Check X-Forwarded-For (in case of proxy)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0].trim();
    if (ip !== "127.0.0.1" && ip !== "::1" && ip !== "::ffff:127.0.0.1") {
      return false;
    }
  }

  // Check Host header
  const host = request.headers.get("host") || "";
  if (
    !host.startsWith("localhost") &&
    !host.startsWith("127.0.0.1") &&
    !host.startsWith("[::1]")
  ) {
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  // 1. Localhost check
  if (!isLocalhost(request)) {
    return forbidden("Only localhost requests are allowed");
  }

  // 2. Token check
  const expectedToken = process.env.SANDBOX_TOKEN;
  if (expectedToken) {
    const providedToken = request.headers.get("x-sandbox-token");
    if (providedToken !== expectedToken) {
      return forbidden("Invalid or missing sandbox token");
    }
  }

  // 3. Parse request
  const { userCode, testCode }: RunRequest = await request.json();
  if (!userCode && !testCode) {
    return NextResponse.json(
      { success: false, stdout: "", stderr: "", error: "No code provided" },
      { status: 400 }
    );
  }

  const fullCode = userCode + "\n\n" + testCode;

  // 4. Execute in Docker sandbox
  return new Promise<NextResponse>((resolve) => {
    let resolved = false;
    const done = (response: NextResponse) => {
      if (!resolved) {
        resolved = true;
        resolve(response);
      }
    };

    const child = spawn("docker", [
      "run", "--rm", "-i",
      "--network=none",
      "--memory=512m",
      "--cpus=1",
      "--read-only",
      "--tmpfs", "/tmp:size=50m",
      "karpathy-sandbox",
      "python3", "-u", "-",
    ]);

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data: Buffer) => {
      stdout += data.toString();
      if (stdout.length > 1024 * 1024) {
        try { child.kill("SIGKILL"); } catch {}
      }
    });

    child.stderr.on("data", (data: Buffer) => {
      stderr += data.toString();
      if (stderr.length > 1024 * 1024) {
        try { child.kill("SIGKILL"); } catch {}
      }
    });

    child.stdin.write(fullCode);
    child.stdin.end();

    child.on("close", (code) => {
      done(
        NextResponse.json({
          success: code === 0,
          stdout: stdout.slice(0, 1024 * 1024),
          stderr: stderr.slice(0, 1024 * 1024),
          error:
            code !== 0 && !stdout && !stderr
              ? `Process exited with code ${code}`
              : undefined,
        })
      );
    });

    child.on("error", (err) => {
      done(
        NextResponse.json({
          success: false,
          stdout: "",
          stderr: "",
          error: err.message.includes("ENOENT")
            ? "Docker not found. Install Docker Desktop and run: npm run sandbox:build"
            : err.message,
        })
      );
    });

    // Hard timeout
    setTimeout(() => {
      try { child.kill("SIGKILL"); } catch {}
      done(
        NextResponse.json({
          success: false,
          stdout: stdout.slice(0, 1024 * 1024),
          stderr: stderr.slice(0, 1024 * 1024),
          error: "Execution timed out (30s limit)",
        })
      );
    }, 30_000);
  });
}
