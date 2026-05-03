from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from database import get_db
from models import ElectionEvent, PollingBooth, Candidate
from schemas import ElectionEventOut, PollingBoothOut, CandidateOut, EligibilityCheck, EligibilityResult

router = APIRouter()

@router.get("/events", response_model=List[ElectionEventOut])
def get_events(
    state: Optional[str] = None,
    event_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ElectionEvent).filter(ElectionEvent.is_active == True)
    if state:
        query = query.filter((ElectionEvent.state == state) | (ElectionEvent.is_national == True))
    if event_type:
        query = query.filter(ElectionEvent.event_type == event_type)
    return query.order_by(ElectionEvent.event_date.asc()).all()

@router.get("/polling-booths", response_model=List[PollingBoothOut])
def get_booths(
    state: Optional[str] = None,
    district: Optional[str] = None,
    constituency: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(PollingBooth)
    if state:
        query = query.filter(PollingBooth.state == state)
    if district:
        query = query.filter(PollingBooth.district == district)
    if constituency:
        query = query.filter(PollingBooth.constituency == constituency)
    return query.limit(50).all()

@router.get("/candidates", response_model=List[CandidateOut])
def get_candidates(
    state: Optional[str] = None,
    constituency: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Candidate).filter(Candidate.is_active == True)
    if state:
        query = query.filter(Candidate.state == state)
    if constituency:
        query = query.filter(Candidate.constituency == constituency)
    return query.all()

@router.post("/check-eligibility", response_model=EligibilityResult)
def check_eligibility(data: EligibilityCheck):
    reasons = []
    next_steps = []
    docs_needed = []
    is_eligible = True

    if data.age < 18:
        is_eligible = False
        reasons.append("Must be 18 years or older to vote")
    else:
        reasons.append("✓ Age requirement met (18+)")

    if not data.is_citizen:
        is_eligible = False
        reasons.append("Must be an Indian citizen")
    else:
        reasons.append("✓ Indian citizenship confirmed")

    if not data.has_id:
        reasons.append("⚠ Valid photo ID required")
        docs_needed.extend(["Aadhaar Card", "Voter ID (EPIC)", "PAN Card", "Passport", "Driving License"])

    if data.has_criminal_conviction:
        is_eligible = False
        reasons.append("Criminal conviction may disqualify from voting - check with ECI")

    if is_eligible:
        if not data.has_id:
            next_steps = [
                "Apply for Aadhaar card at nearest Aadhaar center",
                "Register on NVSP portal (nvsp.in) for Voter ID",
                "Fill Form 6 for voter registration",
                "Visit Electoral Registration Officer with documents"
            ]
            docs_needed = ["Aadhaar Card OR PAN Card OR Passport", "Proof of address", "Passport-size photograph"]
        else:
            next_steps = [
                "Visit nvsp.in to check if you are already registered",
                "Fill Form 6 if not registered",
                "Track your Voter ID application status online",
                "Find your polling booth on ECI website"
            ]
            docs_needed = ["Recent passport-size photograph", "Proof of residence in constituency"]
    else:
        next_steps = ["Contact Electoral Registration Officer for clarification", "Call helpline 1950 for assistance"]

    return EligibilityResult(
        is_eligible=is_eligible,
        reasons=reasons,
        next_steps=next_steps,
        documents_needed=docs_needed
    )

@router.get("/registration-steps")
def get_registration_steps(language: str = "en"):
    steps_en = [
        {"step": 1, "title": "Check Eligibility", "description": "Verify you are 18+ years old and an Indian citizen", "icon": "check-circle", "duration": "5 mins"},
        {"step": 2, "title": "Gather Documents", "description": "Collect Age proof, Address proof, and Identity proof", "icon": "document", "duration": "1-2 days"},
        {"step": 3, "title": "Fill Form 6", "description": "Complete Form 6 online at nvsp.in or offline at ERO office", "icon": "form", "duration": "30 mins"},
        {"step": 4, "title": "Submit Application", "description": "Submit Form 6 with supporting documents to local ERO", "icon": "upload", "duration": "Same day"},
        {"step": 5, "title": "Verification", "description": "ERO verifies your documents and address (BLO may visit)", "icon": "search", "duration": "15-30 days"},
        {"step": 6, "title": "Receive Voter ID", "description": "Get EPIC (Voter ID card) by post or collect from ERO office", "icon": "id-card", "duration": "7-10 days"}
    ]
    steps_hi = [
        {"step": 1, "title": "पात्रता जांचें", "description": "सुनिश्चित करें कि आप 18+ वर्ष के हैं और भारतीय नागरिक हैं", "icon": "check-circle", "duration": "5 मिनट"},
        {"step": 2, "title": "दस्तावेज़ इकट्ठा करें", "description": "आयु प्रमाण, पता प्रमाण और पहचान प्रमाण एकत्र करें", "icon": "document", "duration": "1-2 दिन"},
        {"step": 3, "title": "फॉर्म 6 भरें", "description": "nvsp.in पर ऑनलाइन या ERO कार्यालय में ऑफलाइन फॉर्म 6 पूरा करें", "icon": "form", "duration": "30 मिनट"},
        {"step": 4, "title": "आवेदन जमा करें", "description": "दस्तावेजों के साथ स्थानीय ERO को फॉर्म 6 जमा करें", "icon": "upload", "duration": "उसी दिन"},
        {"step": 5, "title": "सत्यापन", "description": "ERO आपके दस्तावेज़ सत्यापित करता है (BLO घर आ सकते हैं)", "icon": "search", "duration": "15-30 दिन"},
        {"step": 6, "title": "मतदाता पहचान पत्र प्राप्त करें", "description": "डाक द्वारा EPIC (मतदाता पहचान पत्र) प्राप्त करें", "icon": "id-card", "duration": "7-10 दिन"}
    ]
    return {"steps": steps_hi if language == "hi" else steps_en}

@router.get("/stats")
def get_election_stats():
    return {
        "total_voters": 970000000,
        "registered_2024": 968000000,
        "polling_booths": 1050000,
        "constituencies": 543,
        "states": 28,
        "union_territories": 8,
        "voter_turnout_2019": 67.4,
        "women_voters_percent": 48.5,
        "first_time_voters": 15000000,
        "overseas_voters": 107329
    }
