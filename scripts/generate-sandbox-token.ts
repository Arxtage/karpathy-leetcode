import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".env.local");
const token = randomBytes(32).toString("hex");

let content = "";
if (fs.existsSync(envPath)) {
  content = fs.readFileSync(envPath, "utf-8");
  if (content.includes("SANDBOX_TOKEN=")) {
    console.log("Sandbox token already exists in .env.local");
    process.exit(0);
  }
}

const lines = [
  `SANDBOX_TOKEN=${token}`,
  `NEXT_PUBLIC_SANDBOX_TOKEN=${token}`,
];

content = content.trimEnd() + (content ? "\n" : "") + lines.join("\n") + "\n";
fs.writeFileSync(envPath, content);
console.log("Generated sandbox token in .env.local");
