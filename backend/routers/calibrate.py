from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db import get_db
from backend.models import Calibration
from backend.schemas import CalibrateRequest, CalibrateResponse
from backend.auth import get_current_user

router = APIRouter(prefix="/api", tags=["calibrate"])

@router.post("/calibrate", response_model=CalibrateResponse)
def create_calibration(
    req: CalibrateRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    cal = Calibration(clerk_user_id=user_id, name=req.name, weights=req.weights)
    db.add(cal)
    db.commit()
    db.refresh(cal)
    return CalibrateResponse(
        calibration_id=cal.id,
        name=cal.name,
        weights=cal.weights,
        created_at=cal.created_at,
    )

@router.get("/calibrations", response_model=list[CalibrateResponse])
def list_calibrations(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    cals = db.query(Calibration).filter(Calibration.clerk_user_id == user_id).all()
    return [
        CalibrateResponse(calibration_id=c.id, name=c.name, weights=c.weights, created_at=c.created_at)
        for c in cals
    ]
