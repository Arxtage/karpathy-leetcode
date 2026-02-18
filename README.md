# Karpathy LeetCode

LeetCode-style coding exercises for Andrej Karpathy's [Neural Networks: Zero to Hero](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ). Watch a lecture segment, solve the exercise, repeat.

44 exercises across 2 lectures. Micrograd runs in the browser via Pyodide. GPT exercises run real PyTorch in a sandboxed Docker container on your machine.

## Quick Start

```bash
npm install
npm run dev
```

Requires [Node.js](https://nodejs.org/) 20+ and [Docker Desktop](https://www.docker.com/products/docker-desktop/). One command handles everything — sandbox setup, token generation, dev server. `Ctrl+C` to stop.

## How It Works

- Lectures are split into timed segments synced to the YouTube video
- Each segment has exercises that test the concepts just covered
- You write real Python in a code editor, hit Run, tests pass or fail
- Progress is saved locally in your browser

## Sandbox

PyTorch exercises execute in a Docker container with `--network=none`, `--read-only`, `--memory=512m`. No filesystem access, no network, no escape. Auth token required for all requests, localhost only.
