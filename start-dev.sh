#!/bin/bash

# Start API server in background
echo "Starting API server..."
npm run start:dev &
API_PID=$!

# Wait a moment for API server to start
sleep 2

# Start Svelte dev server
echo "Starting Svelte dev server..."
npm run dev &
DEV_PID=$!

echo "Both servers started!"
echo "API server running at http://localhost:8000"
echo "Svelte app running at http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup both processes
cleanup() {
    echo "Stopping servers..."
    kill $API_PID $DEV_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT

# Wait for both processes
wait $API_PID $DEV_PID
