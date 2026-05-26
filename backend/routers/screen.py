import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.db import get_db
from backend.models import Calibration, Screening
from backend.schemas import ScreenRequest, ScreenResponse, DEFAULT_WEIGHTS
from backend.auth import get_current_user
from backend.llm.client import LLMClient, get_llm_client
from backend.prompts.builder import build_screen_prompt

router = APIRouter(prefix="/api", tags=["screen"])

def screen_resume_core(jd: str, resume: str, weights: dict, llm: LLMClient) -> dict:
    """Calls LLM and parses response. Raises ValueError on bad output."""
    prompt = build_screen_prompt(jd, resume, weights)
    for attempt in range(2):
        try:
            raw = llm.generate(
                prompt if attempt == 0
                else prompt + "\nCRITICAL: Return ONLY the JSON object. No explanation, no markdown."
            )
            result = json.loads(raw)
            for key in ("score", "reasoning", "gaps", "questions"):
                if key not in result:
                    raise ValueError(f"Missing key: {key}")
            return result
        except (json.JSONDecodeError, ValueError):
            if attempt == 1:
                raise ValueError("LLM returned invalid JSON after two attempts")
    raise ValueError("Unreachable")

@router.post("/screen", response_model=ScreenResponse)
def screen_resume(
    req: ScreenRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
    llm: LLMClient = Depends(get_llm_client),
):
    weights = DEFAULT_WEIGHTS.copy()
    if req.calibration_id:
        cal = db.query(Calibration).filter(
            Calibration.id == req.calibration_id,
            Calibration.clerk_user_id == user_id,
        ).first()
        if not cal:
            raise HTTPException(status_code=404, detail="Calibration not found")
        weights = cal.weights

    try:
        result = screen_resume_core(req.jd, req.resume, weights, llm)
    except ValueError:
        raise HTTPException(status_code=503, detail="LLM returned invalid response")

    screening = Screening(
        clerk_user_id=user_id,
        calibration_id=req.calibration_id,
        jd_text=req.jd,
        resume_text=req.resume,
        score=result["score"],
        reasoning=result["reasoning"],
        gaps=result["gaps"],
        questions=result["questions"],
    )
    db.add(screening)
    db.commit()
    db.refresh(screening)

    return ScreenResponse(
        screening_id=screening.id,
        score=screening.score,
        reasoning=screening.reasoning,
        gaps=screening.gaps,
        questions=screening.questions,
    )
