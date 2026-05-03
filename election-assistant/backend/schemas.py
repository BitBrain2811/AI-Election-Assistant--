from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    citizen = "citizen"
    admin = "admin"

class ComplaintStatus(str, Enum):
    pending = "pending"
    in_review = "in_review"
    resolved = "resolved"
    rejected = "rejected"

# Auth
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    state: Optional[str] = None
    language: str = "en"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    role: str
    language: str
    state: Optional[str]
    district: Optional[str]
    voter_id: Optional[str]
    is_registered_voter: bool
    civic_score: int
    readiness_score: float
    created_at: datetime
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str]
    phone: Optional[str]
    state: Optional[str]
    district: Optional[str]
    voter_id: Optional[str]
    language: Optional[str]

# Election Events
class ElectionEventOut(BaseModel):
    id: int
    title: str
    title_hi: Optional[str]
    description: Optional[str]
    description_hi: Optional[str]
    event_date: datetime
    event_type: str
    state: Optional[str]
    is_national: bool
    class Config:
        from_attributes = True

class ElectionEventCreate(BaseModel):
    title: str
    title_hi: Optional[str]
    description: Optional[str]
    description_hi: Optional[str]
    event_date: datetime
    event_type: str
    state: Optional[str]
    is_national: bool = True

# FAQ
class FAQOut(BaseModel):
    id: int
    question: str
    question_hi: Optional[str]
    answer: str
    answer_hi: Optional[str]
    category: str
    tags: Optional[str]
    views: int
    helpful_count: int
    class Config:
        from_attributes = True

class FAQCreate(BaseModel):
    question: str
    question_hi: Optional[str]
    answer: str
    answer_hi: Optional[str]
    category: str
    tags: Optional[str]

# Complaints
class ComplaintCreate(BaseModel):
    subject: str
    description: str
    category: str
    state: Optional[str]
    district: Optional[str]

class ComplaintOut(BaseModel):
    id: int
    subject: str
    description: str
    category: str
    state: Optional[str]
    district: Optional[str]
    status: str
    admin_response: Optional[str]
    reference_number: str
    created_at: datetime
    class Config:
        from_attributes = True

class ComplaintUpdate(BaseModel):
    status: ComplaintStatus
    admin_response: Optional[str]

# Chat
class ChatMessage(BaseModel):
    message: str
    session_id: str
    language: str = "en"

class ChatResponse(BaseModel):
    response: str
    session_id: str
    suggestions: List[str] = []

# Polling Booth
class PollingBoothOut(BaseModel):
    id: int
    name: str
    address: str
    state: str
    district: str
    constituency: str
    booth_number: str
    latitude: Optional[float]
    longitude: Optional[float]
    capacity: Optional[int]
    is_accessible: bool
    class Config:
        from_attributes = True

# Candidate
class CandidateOut(BaseModel):
    id: int
    name: str
    party: str
    constituency: str
    state: str
    education: Optional[str]
    age: Optional[int]
    criminal_cases: int
    assets: Optional[str]
    manifesto_summary: Optional[str]
    image_url: Optional[str]
    class Config:
        from_attributes = True

# Notice
class NoticeOut(BaseModel):
    id: int
    title: str
    title_hi: Optional[str]
    content: str
    content_hi: Optional[str]
    notice_type: str
    priority: str
    expires_at: Optional[datetime]
    created_at: datetime
    class Config:
        from_attributes = True

class NoticeCreate(BaseModel):
    title: str
    title_hi: Optional[str]
    content: str
    content_hi: Optional[str]
    notice_type: str = "general"
    priority: str = "normal"
    expires_at: Optional[datetime]

# Quiz
class QuizQuestionOut(BaseModel):
    id: int
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    difficulty: str
    category: str
    class Config:
        from_attributes = True

class QuizSubmit(BaseModel):
    answers: dict
    session_id: str

class QuizResult(BaseModel):
    score: int
    total: int
    percentage: float
    correct_answers: dict
    explanations: dict
    civic_points_earned: int

# Eligibility
class EligibilityCheck(BaseModel):
    age: int
    is_citizen: bool
    has_id: bool
    state: str
    is_mentally_competent: bool = True
    has_criminal_conviction: bool = False

class EligibilityResult(BaseModel):
    is_eligible: bool
    reasons: List[str]
    next_steps: List[str]
    documents_needed: List[str]
