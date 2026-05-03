from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn

from database import engine, Base
from routers import auth, chat, election, faq, complaint, admin, user
from middleware.rate_limit import RateLimitMiddleware
import seed_data

app = FastAPI(
    title="Election Process Assistant API",
    description="AI-powered election guidance platform for citizens",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Seed initial data
@app.on_event("startup")
async def startup_event():
    seed_data.seed_all()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI Chatbot"])
app.include_router(election.router, prefix="/api/election", tags=["Election Info"])
app.include_router(faq.router, prefix="/api/faq", tags=["FAQ"])
app.include_router(complaint.router, prefix="/api/complaint", tags=["Complaints"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(user.router, prefix="/api/user", tags=["User"])

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "Election Assistant API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
