from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db import get_db
from backend.models import Screening
from backend.schemas import StatsResponse
from backend.auth import get_current_user

router = APIRouter(prefix="/api", tags=["stats"])

@router.get("/stats", response_model=StatsResponse)
def get_stats(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    screenings = db.query(Screening).filter(Screening.clerk_user_id == user_id).all()
    total = len(screenings)

    if total == 0:
        return StatsResponse(
            avg_score=0.0,
            score_distribution={"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0},
            top_gaps=[],
            total_screenings=0,
        )

    avg_score = round(sum(s.score for s in screenings) / total, 1)

    dist = {"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}
    for s in screenings:
        if s.score <= 20:
            dist["0-20"] += 1
        elif s.score <= 40:
            dist["21-40"] += 1
        elif s.score <= 60:
            dist["41-60"] += 1
        elif s.score <= 80:
            dist["61-80"] += 1
        else:
            dist["81-100"] += 1

    gap_counts: dict[str, int] = {}
    for s in screenings:
        for gap in (s.gaps or []):
            gap_title = gap["title"]
            gap_counts[gap_title] = gap_counts.get(gap_title, 0) + 1
    top_gaps = sorted(
        [{"skill": k, "count": v} for k, v in gap_counts.items()],
        key=lambda x: x["count"],
        reverse=True,
    )[:10]

    return StatsResponse(
        avg_score=avg_score,
        score_distribution=dist,
        top_gaps=top_gaps,
        total_screenings=total,
    )
