#!/bin/bash

# Read setup_guide.md before using this script



BASE_DIR="$(pwd)"

killall node 2>/dev/null

cd "$BASE_DIR/backend" && node server.js &
cd "$BASE_DIR/frontend-web" && npm run dev &
cd "$BASE_DIR/frontend-admin" && npm run dev &

wait
