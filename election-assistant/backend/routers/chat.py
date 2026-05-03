from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import ChatHistory
from schemas import ChatMessage, ChatResponse
from auth_utils import get_optional_user
import os, httpx
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

ELECTION_CONTEXT = """You are VoterMitra, an expert AI assistant for Indian elections and democratic processes. 
You help citizens understand:
- Voter registration process (Form 6, 6A, 6B)
- Election Commission of India rules
- Voting eligibility (must be 18+, Indian citizen)
- Required documents (Aadhaar, PAN, Passport, etc.)
- Polling booth information
- Model Code of Conduct
- EVM and VVPAT systems
- Election timeline and important dates
- How to check voter list (electoral roll)
- NOTA (None of the Above) option
- Postal ballot and proxy voting
- Grievance redressal (1950 helpline, NVSP portal)
- State assembly and Lok Sabha elections
- Panchayat and local body elections

Always be helpful, accurate, and encourage civic participation.
For Hindi queries, respond in Hindi.
Keep responses concise but informative.
Suggest next steps when relevant."""

FALLBACK_RESPONSES = {
    "registration": {
        "en": "To register as a voter, you need to fill Form 6 on the NVSP portal (nvsp.in) or visit your local Electoral Registration Officer. You'll need proof of age, address, and identity. The process takes 30-45 days.",
        "hi": "मतदाता के रूप में पंजीकरण के लिए, आपको NVSP पोर्टल (nvsp.in) पर फॉर्म 6 भरना होगा। आपको आयु, पता और पहचान का प्रमाण चाहिए।"
    },
    "eligibility": {
        "en": "To vote in India, you must be: (1) 18 years or older, (2) Indian citizen, (3) Resident of the constituency, (4) Not disqualified under any law. Mental illness or criminal conviction may affect eligibility.",
        "hi": "भारत में मतदान के लिए: (1) 18 वर्ष या उससे अधिक, (2) भारतीय नागरिक, (3) निर्वाचन क्षेत्र के निवासी होना आवश्यक है।"
    },
    "documents": {
        "en": "Required documents: Aadhaar Card, Voter ID (EPIC), PAN Card, Passport, Driving License, Service Identity Card with photo, Bank/Post Office Passbook with photo. Any one photo ID is sufficient at the polling booth.",
        "hi": "आवश्यक दस्तावेज़: आधार कार्ड, मतदाता पहचान पत्र (EPIC), पैन कार्ड, पासपोर्ट, ड्राइविंग लाइसेंस। मतदान केंद्र पर कोई भी एक फोटो ID पर्याप्त है।"
    },
    "default": {
        "en": "I'm VoterMitra, your election guide! I can help you with voter registration, eligibility checks, polling booth information, election timelines, and more. What would you like to know about the election process?",
        "hi": "मैं वोटर मित्र हूं, आपका चुनाव गाइड! मैं मतदाता पंजीकरण, पात्रता जांच, मतदान केंद्र जानकारी और चुनाव प्रक्रिया में आपकी मदद कर सकता हूं।"
    }
}

def get_fallback_response(message: str, language: str) -> tuple[str, list]:
    msg_lower = message.lower()
    suggestions_en = ["How to register to vote?", "Check my eligibility", "Find polling booth", "Election timeline", "Required documents"]
    suggestions_hi = ["मतदाता पंजीकरण कैसे करें?", "पात्रता जांचें", "मतदान केंद्र खोजें", "चुनाव समयरेखा"]
    
    suggestions = suggestions_hi if language == "hi" else suggestions_en
    
    for key in ["registration", "eligibility", "documents"]:
        if key in msg_lower or (language == "hi" and any(w in msg_lower for w in ["पंजीकरण", "पात्र", "दस्तावेज"])):
            return FALLBACK_RESPONSES[key][language], suggestions
    
    return FALLBACK_RESPONSES["default"][language], suggestions

@router.post("/message", response_model=ChatResponse)
async def chat(msg: ChatMessage, db: Session = Depends(get_db), current_user=Depends(get_optional_user)):
    # Save user message
    user_msg = ChatHistory(
        session_id=msg.session_id,
        user_id=current_user.id if current_user else None,
        role="user",
        content=msg.message,
        language=msg.language
    )
    db.add(user_msg)
    db.commit()
    
    # Get chat history for context
    history = db.query(ChatHistory).filter(
        ChatHistory.session_id == msg.session_id
    ).order_by(ChatHistory.id.desc()).limit(10).all()
    history.reverse()
    
    ai_response = ""
    suggestions = []
    
    if OPENAI_API_KEY:
        try:
            messages = [{"role": "system", "content": ELECTION_CONTEXT}]
            for h in history[:-1]:
                messages.append({"role": h.role, "content": h.content})
            messages.append({"role": "user", "content": msg.message})
            
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    f"{OPENAI_BASE_URL}/chat/completions",
                    headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
                    json={
                        "model": os.getenv("AI_MODEL", "gpt-3.5-turbo"),
                        "messages": messages,
                        "max_tokens": 500,
                        "temperature": 0.7
                    }
                )
                data = response.json()
                ai_response = data["choices"][0]["message"]["content"]
                suggestions = ["Tell me more", "Next steps?", "Related FAQs", "How to apply?"]
        except Exception as e:
            ai_response, suggestions = get_fallback_response(msg.message, msg.language)
    else:
        ai_response, suggestions = get_fallback_response(msg.message, msg.language)
    
    # Save AI response
    ai_msg = ChatHistory(
        session_id=msg.session_id,
        user_id=current_user.id if current_user else None,
        role="assistant",
        content=ai_response,
        language=msg.language
    )
    db.add(ai_msg)
    db.commit()
    
    # Award civic score
    if current_user:
        current_user.civic_score += 1
        db.commit()
    
    return ChatResponse(response=ai_response, session_id=msg.session_id, suggestions=suggestions)

@router.get("/history/{session_id}")
def get_history(session_id: str, db: Session = Depends(get_db)):
    messages = db.query(ChatHistory).filter(
        ChatHistory.session_id == session_id
    ).order_by(ChatHistory.id.asc()).all()
    return [{"role": m.role, "content": m.content, "created_at": m.created_at} for m in messages]
