#!/bin/bash
# Quick start script for Election Assistant Frontend

echo "🎨 Starting VoterMitra Frontend..."

# Check Node
node --version || { echo "Node.js 18+ required"; exit 1; }

cd frontend

# Install if needed
if [ ! -d "node_modules" ]; then
  echo "📥 Installing npm packages..."
  npm install
fi

echo "🚀 Starting Vite dev server on http://localhost:5173"
npm run dev
