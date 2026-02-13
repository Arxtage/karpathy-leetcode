/* eslint-disable no-restricted-globals */

// Web Worker that loads Pyodide and executes Python code
// Communicates via postMessage with {id, type, userCode, testCode}

let pyodide = null;
let pyodideReady = false;
let loadingPromise = null;

const PYODIDE_CDN = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";

async function loadPyodideAndPackages() {
  importScripts(PYODIDE_CDN + "pyodide.js");
  pyodide = await self.loadPyodide({
    indexURL: PYODIDE_CDN,
  });
  await pyodide.loadPackage(["numpy"]);
  pyodideReady = true;
}

async function ensurePyodide() {
  if (pyodideReady) return;
  if (!loadingPromise) {
    loadingPromise = loadPyodideAndPackages();
  }
  await loadingPromise;
}

async function runCode(userCode, testCode) {
  await ensurePyodide();

  let stdout = "";
  let stderr = "";

  pyodide.setStdout({
    batched: (text) => {
      stdout += text + "\n";
    },
  });
  pyodide.setStderr({
    batched: (text) => {
      stderr += text + "\n";
    },
  });

  const fullCode = userCode + "\n\n" + testCode;

  try {
    await pyodide.runPythonAsync(fullCode);
    return { success: true, stdout: stdout.trimEnd(), stderr: stderr.trimEnd() };
  } catch (err) {
    return {
      success: false,
      stdout: stdout.trimEnd(),
      stderr: stderr.trimEnd(),
      error: err.message,
    };
  }
}

self.onmessage = async (event) => {
  const { id, type, userCode, testCode } = event.data;

  if (type === "init") {
    try {
      await ensurePyodide();
      self.postMessage({ id, type: "init-done" });
    } catch (err) {
      self.postMessage({ id, type: "init-error", error: err.message });
    }
    return;
  }

  if (type === "run") {
    try {
      const result = await runCode(userCode || "", testCode || "");
      self.postMessage({ id, type: "run-result", result });
    } catch (err) {
      self.postMessage({
        id,
        type: "run-result",
        result: {
          success: false,
          stdout: "",
          stderr: "",
          error: err.message,
        },
      });
    }
  }
};
