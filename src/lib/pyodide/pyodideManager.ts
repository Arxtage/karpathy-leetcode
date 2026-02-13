import { PyodideResult } from "@/lib/content/types";

type MessageHandler = (result: PyodideResult) => void;
type InitHandler = (error?: string) => void;

interface PendingMessage {
  type: "run" | "init";
  resolve: MessageHandler | InitHandler;
  reject: (error: Error) => void;
}

class PyodideManager {
  private worker: Worker | null = null;
  private messageId = 0;
  private pending = new Map<number, PendingMessage>();
  private _isReady = false;
  private initPromise: Promise<void> | null = null;

  get isReady() {
    return this._isReady;
  }

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker("/pyodide-worker.js");
      this.worker.onmessage = this.handleMessage.bind(this);
    }
    return this.worker;
  }

  private handleMessage(event: MessageEvent) {
    const { id, type, result, error } = event.data;
    const pending = this.pending.get(id);
    if (!pending) return;
    this.pending.delete(id);

    if (type === "init-done") {
      this._isReady = true;
      (pending.resolve as InitHandler)();
    } else if (type === "init-error") {
      (pending.resolve as InitHandler)(error);
    } else if (type === "run-result") {
      (pending.resolve as MessageHandler)(result);
    }
  }

  async init(): Promise<void> {
    if (this._isReady) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise<void>((resolve, reject) => {
      const id = this.messageId++;
      this.pending.set(id, {
        type: "init",
        resolve: (error?: string) => {
          if (error) reject(new Error(error));
          else resolve();
        },
        reject,
      });
      this.getWorker().postMessage({ id, type: "init" });
    });

    return this.initPromise;
  }

  async runCode(userCode: string, testCode: string): Promise<PyodideResult> {
    await this.init();
    return new Promise((resolve, reject) => {
      const id = this.messageId++;
      this.pending.set(id, {
        type: "run",
        resolve: resolve as MessageHandler,
        reject,
      });
      this.getWorker().postMessage({ id, type: "run", userCode, testCode });
    });
  }

  terminate() {
    this.worker?.terminate();
    this.worker = null;
    this._isReady = false;
    this.initPromise = null;
    this.pending.clear();
  }
}

// Singleton
export const pyodideManager = new PyodideManager();
