from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Complaint
from schemas import ComplaintCreate, ComplaintOut
from auth_utils import get_current_user
import random, string
from datetime import datetime

router = APIRouter()

def generate_reference():
    return "COMP" + datetime.now().strftime("%Y%m%d") + ''.join(random.choices(string.digits, k=4))

@router.post("/", response_model=ComplaintOut)
def submit_complaint(
    data: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    complaint = Complaint(
        user_id=current_user.id,
        subject=data.subject,
        description=data.description,
        category=data.category,
        state=data.state or current_user.state,
        district=data.district or current_user.district,
        reference_number=generate_reference()
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return complaint

@router.get("/my", response_model=List[ComplaintOut])
def get_my_complaints(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Complaint).filter(Complaint.user_id == current_user.id).order_by(Complaint.created_at.desc()).all()

@router.get("/track/{reference_number}", response_model=ComplaintOut)
def track_complaint(reference_number: str, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.reference_number == reference_number).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@router.get("/categories")
def get_complaint_categories():
    return {
        "categories": [
            {"id": "voter_registration", "label": "Voter Registration Issue"},
            {"id": "polling_booth", "label": "Polling Booth Problem"},
            {"id": "intimidation", "label": "Voter Intimidation"},
            {"id": "mcc_violation", "label": "Model Code of Conduct Violation"},
            {"id": "booth_capturing", "label": "Booth Capturing"},
            {"id": "misinformation", "label": "Misinformation/Fake News"},
            {"id": "bribery", "label": "Bribery/Gift Distribution"},
            {"id": "other", "label": "Other"}
        ]
    }
