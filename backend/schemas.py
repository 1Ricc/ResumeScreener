from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime

DEFAULT_WEIGHTS: dict[str, int] = {
    "skills_match": 5,
    "seniority": 5,
    "culture_fit": 5,
    "stack_match": 5,
}

class CalibrateRequest(BaseModel):
    name: str
    weights: dict[str, int]

class CalibrateResponse(BaseModel):
    calibration_id: str
    name: str
    weights: dict[str, int]
    created_at: datetime

class ScreenRequest(BaseModel):
    jd: str
    resume: str
    calibration_id: Optional[str] = None

class ScreenResponse(BaseModel):
    screening_id: str
    score: int
    reasoning: str
    gaps: list[str]
    questions: list[str]

class BatchRequest(BaseModel):
    jd: str
    resumes: list[str]
    calibration_id: Optional[str] = None

    @field_validator("resumes")
    @classmethod
    def max_twenty(cls, v: list) -> list:
        if len(v) > 20:
            raise ValueError("Maximum 20 resumes per batch")
        return v

class BatchResponse(BaseModel):
    job_id: str

class JobResponse(BaseModel):
    job_id: str
    status: str
    total: int
    completed: int
    result: Optional[list] = None

class StatsResponse(BaseModel):
    avg_score: float
    score_distribution: dict[str, int]
    top_gaps: list[dict]
    total_screenings: int
