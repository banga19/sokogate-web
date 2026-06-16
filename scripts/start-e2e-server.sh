#!/bin/bash
# Kill stale dev server on port 4500 and start a fresh one for e2e tests
# Prevents stale-compilation timeouts after repeated test runs
# Windows/Git Bash compatible

PORT=4500
LOG="/tmp/frontend-e2e.log"

# ── Kill existing process on port ──
echo "Checking for stale server on port $PORT..."
pid=$(netstat -ano 2>&1 | findstr ":$PORT " | findstr LISTENING | awk '{print $5}')
if [ -n "$pid" ]; then
  kill "$pid" 2>/dev/null
  echo "Killed stale dev server (PID: $pid)"
  sleep 2
fi

# ── Start fresh dev server ──
echo "Starting fresh dev server on port $PORT..."
nohup npx vue-cli-service serve --port $PORT > "$LOG" 2>&1 &
SERVER_PID=$!

# ── Wait for server to be ready ──
echo "Waiting for server to compile..."
for ((i=0; i<60; i++)); do
  sleep 2
  status=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:$PORT/ 2>/dev/null)
  if [ "$status" = "200" ]; then
    echo "Dev server ready! (PID: $SERVER_PID)"
    exit 0
  fi
done

echo "ERROR: Dev server did not start within 120 seconds. Check $LOG"
exit 1
