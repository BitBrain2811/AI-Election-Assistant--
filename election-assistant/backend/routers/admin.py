from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import User, Complaint, FAQ, Notice, ElectionEvent
from schemas import ComplaintUpdate, FAQCreate, NoticeCreate, NoticeOut, ElectionEventCreate
from auth_utils import require_admin

router = APIRouter()

@router.get("/stats")
def admin_stats(db: Session = Depends(get_db), admin=Depends(require_admin)):
    return {
        "total_users": db.query(User).count(),
        "total_complaints": db.query(Complaint).count(),
        "pending_complaints": db.query(Complaint).filter(Complaint.status == "pending").count(),
        "total_faqs": db.query(FAQ).count(),
        "active_notices": db.query(Notice).filter(Notice.is_active == True).count(),
        "upcoming_events": db.query(ElectionEvent).filter(ElectionEvent.is_active == True).count()
    }

@router.get("/complaints")
def get_all_complaints(status: Optional[str] = None, db: Session = Depends(get_db), admin=Depends(require_admin)):
    query = db.query(Complaint)
    if status:
        query = query.filter(Complaint.status == status)
    return query.order_by(Complaint.created_at.desc()).all()

@router.put("/complaints/{complaint_id}")
def update_complaint(complaint_id: int, data: ComplaintUpdate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    complaint.status = data.status
    if data.admin_response:
        complaint.admin_response = data.admin_response
    db.commit()
    return {"success": True}

@router.post("/faq")
def create_faq(data: FAQCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    faq = FAQ(**data.dict())
    db.add(faq)
    db.commit()
    db.refresh(faq)
    return faq

@router.delete("/faq/{faq_id}")
def delete_faq(faq_id: int, db: Session = Depends(get_db), admin=Depends(require_admin)):
    faq = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if faq:
        faq.is_active = False
        db.commit()
    return {"success": True}

@router.post("/notices", response_model=NoticeOut)
def create_notice(data: NoticeCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    notice = Notice(**data.dict())
    db.add(notice)
    db.commit()
    db.refresh(notice)
    return notice

@router.get("/notices", response_model=List[NoticeOut])
def get_all_notices(db: Session = Depends(get_db), admin=Depends(require_admin)):
    return db.query(Notice).order_by(Notice.created_at.desc()).all()

@router.post("/events")
def create_event(data: ElectionEventCreate, db: Session = Depends(get_db), admin=Depends(require_admin)):
    event = ElectionEvent(**data.dict())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.get("/users")
def get_users(db: Session = Depends(get_db), admin=Depends(require_admin)):
    users = db.query(User).order_by(User.created_at.desc()).limit(100).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role, "state": u.state, "created_at": u.created_at, "civic_score": u.civic_score} for u in users]
