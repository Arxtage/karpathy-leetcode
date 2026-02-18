#!/bin/bash
set -e

NEXT_PID=""

cleanup() {
  echo ""
  echo "Shutting down..."

  # Stop Next.js dev server
  if [ -n "$NEXT_PID" ]; then
    kill "$NEXT_PID" 2>/dev/null
    wait "$NEXT_PID" 2>/dev/null
  fi

  # Kill any running sandbox containers
  docker ps -q --filter ancestor=karpathy-sandbox 2>/dev/null | xargs -r docker kill 2>/dev/null

  echo "Stopped."
  exit 0
}

trap cleanup SIGINT SIGTERM

# 1. Check Docker is running
if ! docker info >/dev/null 2>&1; then
  echo "Error: Docker is not running. Start Docker Desktop first."
  exit 1
fi

# 2. Generate sandbox token if needed
npx tsx scripts/generate-sandbox-token.ts

# 3. Build sandbox image if needed
if ! docker image inspect karpathy-sandbox >/dev/null 2>&1; then
  echo "Building sandbox Docker image (first time only)..."
  docker build -t karpathy-sandbox ./sandbox
fi

# 4. Start Next.js
echo "Starting dev server..."
npx next dev &
NEXT_PID=$!

wait "$NEXT_PID"
