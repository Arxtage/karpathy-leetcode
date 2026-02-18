# Karpathy LeetCode

Interactive coding exercises that follow along with Andrej Karpathy's Neural Networks: Zero to Hero lecture series. Watch a segment, then solve exercises that reinforce the concepts.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for PyTorch exercises)

## Quick Start

```bash
npm install
npm run dev
```

This single command will:

1. Check that Docker is running
2. Generate a sandbox auth token (first run only)
3. Build the Python sandbox Docker image (first run only)
4. Start the dev server at [http://localhost:3000](http://localhost:3000)

Press `Ctrl+C` to stop everything and clean up running containers.

## Architecture

- **Next.js** app with server-side content loading from JSON files in `content/`
- **Pyodide** (WASM Python) for micrograd exercises — runs in the browser
- **Docker sandbox** for GPT exercises — real PyTorch running locally in an isolated container with no network/filesystem access
- **Progress** stored in localStorage

## Content Validation

```bash
npx tsx scripts/validate-content.ts
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start everything (Docker check + sandbox + dev server) |
| `npm run build` | Production build |
| `npm run sandbox:build` | Rebuild the Docker sandbox image |
| `npm run sandbox:token` | Regenerate the sandbox auth token |
| `npm run sandbox:setup` | Token + image build |
