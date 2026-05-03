from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class UserRole(str, enum.Enum):
    citizen = "citizen"
    admin = "admin"

class ComplaintStatus(str, enum.Enum):
    pending = "pending"
    in_review = "in_review"
    resolved = "resolved"
    rejected = "rejected"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    hashed_password = Column(String(200), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.citizen)
    language = Column(String(10), default="en")
    state = Column(String(50), nullable=True)
    district = Column(String(50), nullable=True)
    voter_id = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    is_registered_voter = Column(Boolean, default=False)
    civic_score = Column(Integer, default=0)
    readiness_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    complaints = relationship("Complaint", back_populates="user")
    quiz_attempts = relationship("QuizAttempt", back_populates="user")

class ElectionEvent(Base):
    __tablename__ = "election_events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    title_hi = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    description_hi = Column(Text, nullable=True)
    event_date = Column(DateTime, nullable=False)
    event_type = Column(String(50), nullable=False)
    state = Column(String(50), nullable=True)
    is_national = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FAQ(Base):
    __tablename__ = "faqs"
    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    question_hi = Column(Text, nullable=True)
    answer = Column(Text, nullable=False)
    answer_hi = Column(Text, nullable=True)
    category = Column(String(50), nullable=False)
    tags = Column(String(200), nullable=True)
    is_active = Column(Boolean, default=True)
    views = Column(Integer, default=0)
    helpful_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PollingBooth(Base):
    __tablename__ = "polling_booths"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    address = Column(Text, nullable=False)
    state = Column(String(50), nullable=False)
    district = Column(String(50), nullable=False)
    constituency = Column(String(100), nullable=False)
    booth_number = Column(String(20), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    capacity = Column(Integer, nullable=True)
    is_accessible = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    party = Column(String(100), nullable=False)
    constituency = Column(String(100), nullable=False)
    state = Column(String(50), nullable=False)
    education = Column(String(200), nullable=True)
    age = Column(Integer, nullable=True)
    criminal_cases = Column(Integer, default=0)
    assets = Column(String(100), nullable=True)
    manifesto_summary = Column(Text, nullable=True)
    image_url = Column(String(300), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    state = Column(String(50), nullable=True)
    district = Column(String(50), nullable=True)
    status = Column(Enum(ComplaintStatus), default=ComplaintStatus.pending)
    admin_response = Column(Text, nullable=True)
    reference_number = Column(String(20), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    user = relationship("User", back_populates="complaints")

class Notice(Base):
    __tablename__ = "notices"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    title_hi = Column(String(200), nullable=True)
    content = Column(Text, nullable=False)
    content_hi = Column(Text, nullable=True)
    notice_type = Column(String(50), default="general")
    priority = Column(String(20), default="normal")
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    option_a = Column(String(200), nullable=False)
    option_b = Column(String(200), nullable=False)
    option_c = Column(String(200), nullable=False)
    option_d = Column(String(200), nullable=False)
    correct_answer = Column(String(1), nullable=False)
    explanation = Column(Text, nullable=True)
    difficulty = Column(String(20), default="medium")
    category = Column(String(50), default="general")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="quiz_attempts")

class ChatHistory(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), nullable=False, index=True)
    user_id = Column(Integer, nullable=True)
    role = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
