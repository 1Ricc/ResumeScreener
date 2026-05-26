import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, JSON, Enum, ForeignKey, DateTime
from backend.db import Base

class JobStatus(enum.Enum):
    pending = "pending"
    processing = "processing"
    done = "done"
    failed = "failed"

class Calibration(Base):
    __tablename__ = "calibrations"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    clerk_user_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    weights = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Screening(Base):
    __tablename__ = "screenings"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    clerk_user_id = Column(String, nullable=False, index=True)
    calibration_id = Column(String(36), ForeignKey("calibrations.id"), nullable=True)
    jd_text = Column(Text, nullable=False)
    resume_text = Column(Text, nullable=False)
    score = Column(Integer, nullable=False)
    reasoning = Column(Text, nullable=False)
    gaps = Column(JSON, nullable=False)
    questions = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Job(Base):
    __tablename__ = "jobs"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    clerk_user_id = Column(String, nullable=False, index=True)
    status = Column(Enum(JobStatus), default=JobStatus.pending, nullable=False)
    total = Column(Integer, nullable=False)
    completed = Column(Integer, default=0, nullable=False)
    result = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
