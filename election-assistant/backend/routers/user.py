from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, QuizQuestion, QuizAttempt, Notice
from schemas import UserOut, UserUpdate, QuizSubmit, QuizResult
from auth_utils import get_current_user
from typing import List
import random

router = APIRouter()

@router.get("/profile", response_model=UserOut)
def get_profile(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserOut)
def update_profile(data: UserUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    for key, value in data.dict(exclude_none=True).items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/quiz/questions")
def get_quiz_questions(count: int = 10, db: Session = Depends(get_db)):
    questions = db.query(QuizQuestion).all()
    selected = random.sample(questions, min(count, len(questions)))
    return [{"id": q.id, "question": q.question, "options": {"A": q.option_a, "B": q.option_b, "C": q.option_c, "D": q.option_d}, "difficulty": q.difficulty, "category": q.category} for q in selected]

@router.post("/quiz/submit", response_model=QuizResult)
def submit_quiz(data: QuizSubmit, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    question_ids = [int(k) for k in data.answers.keys()]
    questions = db.query(QuizQuestion).filter(QuizQuestion.id.in_(question_ids)).all()
    
    score = 0
    correct_answers = {}
    explanations = {}
    
    for q in questions:
        correct_answers[str(q.id)] = q.correct_answer
        explanations[str(q.id)] = q.explanation or ""
        if data.answers.get(str(q.id)) == q.correct_answer:
            score += 1
    
    total = len(questions)
    percentage = (score / total * 100) if total > 0 else 0
    civic_points = score * 5
    
    attempt = QuizAttempt(user_id=current_user.id, score=score, total_questions=total)
    db.add(attempt)
    
    current_user.civic_score += civic_points
    current_user.readiness_score = min(100.0, current_user.readiness_score + (percentage * 0.1))
    db.commit()
    
    return QuizResult(
        score=score, total=total, percentage=percentage,
        correct_answers=correct_answers, explanations=explanations,
        civic_points_earned=civic_points
    )

@router.get("/notices")
def get_notices(db: Session = Depends(get_db)):
    notices = db.query(Notice).filter(Notice.is_active == True).order_by(Notice.created_at.desc()).limit(10).all()
    return notices

@router.get("/readiness-score")
def get_readiness(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    score = 0
    breakdown = []
    
    if current_user.is_registered_voter:
        score += 40
        breakdown.append({"item": "Voter Registration", "points": 40, "completed": True})
    else:
        breakdown.append({"item": "Voter Registration", "points": 40, "completed": False})
    
    if current_user.voter_id:
        score += 20
        breakdown.append({"item": "Voter ID Card", "points": 20, "completed": True})
    else:
        breakdown.append({"item": "Voter ID Card", "points": 20, "completed": False})
    
    if current_user.phone:
        score += 10
        breakdown.append({"item": "Contact Info Updated", "points": 10, "completed": True})
    else:
        breakdown.append({"item": "Contact Info Updated", "points": 10, "completed": False})
    
    quiz_count = db.query(QuizAttempt).filter(QuizAttempt.user_id == current_user.id).count()
    if quiz_count > 0:
        score += 20
        breakdown.append({"item": "Election Knowledge Quiz", "points": 20, "completed": True})
    else:
        breakdown.append({"item": "Election Knowledge Quiz", "points": 20, "completed": False})
    
    if current_user.state:
        score += 10
        breakdown.append({"item": "Location Profile Complete", "points": 10, "completed": True})
    else:
        breakdown.append({"item": "Location Profile Complete", "points": 10, "completed": False})
    
    current_user.readiness_score = float(score)
    db.commit()
    
    return {"score": score, "breakdown": breakdown, "civic_score": current_user.civic_score}
