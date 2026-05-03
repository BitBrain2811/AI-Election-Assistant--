#!/bin/bash
# Quick start script for Election Assistant Backend

echo "🗳️ Starting VoterMitra Backend..."

# Check Python
python3 --version || { echo "Python 3 required"; exit 1; }

cd backend

# Create venv if not exists
if [ ! -d "venv" ]; then
  echo "📦 Creating virtual environment..."
  python3 -m venv venv
fi

# Activate
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate

# Install deps
echo "📥 Installing dependencies..."
pip install -r requirements.txt -q

# Copy env if not exists
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "⚙️  Created .env from template — edit it to add your OpenAI key"
fi

# Start
echo "🚀 Starting FastAPI server on http://localhost:8000"
echo "📖 API docs: http://localhost:8000/api/docs"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
