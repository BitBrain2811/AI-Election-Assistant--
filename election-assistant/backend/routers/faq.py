from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from database import get_db
from models import FAQ
from schemas import FAQOut

router = APIRouter()

@router.get("/", response_model=List[FAQOut])
def get_faqs(
    category: Optional[str] = None,
    search: Optional[str] = None,
    language: str = "en",
    limit: int = Query(default=20, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(FAQ).filter(FAQ.is_active == True)
    if category:
        query = query.filter(FAQ.category == category)
    if search:
        search_term = f"%{search}%"
        if language == "hi":
            query = query.filter(FAQ.question_hi.ilike(search_term) | FAQ.answer_hi.ilike(search_term))
        else:
            query = query.filter(FAQ.question.ilike(search_term) | FAQ.answer.ilike(search_term) | FAQ.tags.ilike(search_term))
    return query.order_by(FAQ.helpful_count.desc()).limit(limit).all()

@router.get("/categories")
def get_categories():
    return {
        "categories": [
            {"id": "registration", "label": "Voter Registration", "label_hi": "मतदाता पंजीकरण", "icon": "📋"},
            {"id": "eligibility", "label": "Eligibility", "label_hi": "पात्रता", "icon": "✅"},
            {"id": "documents", "label": "Documents", "label_hi": "दस्तावेज़", "icon": "📄"},
            {"id": "voting", "label": "Voting Process", "label_hi": "मतदान प्रक्रिया", "icon": "🗳️"},
            {"id": "evm", "label": "EVM & VVPAT", "label_hi": "EVM और VVPAT", "icon": "🖥️"},
            {"id": "results", "label": "Results & Counting", "label_hi": "परिणाम और मतगणना", "icon": "📊"},
            {"id": "conduct", "label": "Model Code of Conduct", "label_hi": "आदर्श आचार संहिता", "icon": "📜"},
            {"id": "complaint", "label": "Complaints & Grievances", "label_hi": "शिकायत और शिकायत", "icon": "📞"}
        ]
    }

@router.post("/{faq_id}/helpful")
def mark_helpful(faq_id: int, db: Session = Depends(get_db)):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if faq:
        faq.helpful_count += 1
        db.commit()
    return {"success": True}

@router.post("/{faq_id}/view")
def increment_view(faq_id: int, db: Session = Depends(get_db)):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if faq:
        faq.views += 1
        db.commit()
    return {"success": True}
