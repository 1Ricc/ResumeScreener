from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session, sessionmaker
from backend.db import get_db
from backend.models import Job, JobStatus, Screening, Calibration
from backend.schemas import BatchRequest, BatchResponse, JobResponse, DEFAULT_WEIGHTS
from backend.auth import get_current_user
from backend.llm.client import LLMClient, get_llm_client
from backend.routers.screen import screen_resume_core

router = APIRouter(prefix="/api", tags=["batch"])

def _process_batch(job_id: str, jd: str, resumes: list, weights: dict, user_id: str, calibration_id, db_engine=None, llm=None):
    if db_engine is None:
        from backend.db import engine as db_engine
    if llm is None:
        llm = get_llm_client()
    factory = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
    db = factory()
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        job.status = JobStatus.processing
        db.commit()

        results = []
        for resume in resumes:
            try:
                result = screen_resume_core(jd, resume, weights, llm)
                screening = Screening(
                    clerk_user_id=user_id,
                    calibration_id=calibration_id,
                    jd_text=jd,
                    resume_text=resume,
                    score=result["score"],
                    reasoning=result["summary"],
                    gaps=result["gaps"],
                    questions=result["tips"],
                )
                db.add(screening)
                db.commit()
                results.append({
                    "resume_preview": resume[:120],
                    "score": result["score"],
                    "summary": result["summary"],
                    "gaps": result["gaps"],
                    "tips": result["tips"],
                })
            except ValueError:
                results.append({"resume_preview": resume[:120], "error": "Screening failed"})

            job = db.query(Job).filter(Job.id == job_id).first()
            job.completed += 1
            db.commit()

        results.sort(key=lambda x: x.get("score", -1), reverse=True)
        job = db.query(Job).filter(Job.id == job_id).first()
        job.result = results
        job.status = JobStatus.done
        db.commit()
    except Exception:
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.status = JobStatus.failed
            db.commit()
    finally:
        db.close()

@router.post("/batch", response_model=BatchResponse)
def create_batch(
    req: BatchRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
    llm: LLMClient = Depends(get_llm_client),
):
    weights = DEFAULT_WEIGHTS.copy()
    calibration_id = None
    if req.calibration_id:
        cal = db.query(Calibration).filter(
            Calibration.id == req.calibration_id,
            Calibration.clerk_user_id == user_id,
        ).first()
        if not cal:
            raise HTTPException(status_code=404, detail="Calibration not found")
        weights = cal.weights
        calibration_id = req.calibration_id

    job = Job(clerk_user_id=user_id, total=len(req.resumes), completed=0)
    db.add(job)
    db.commit()
    db.refresh(job)

    background_tasks.add_task(_process_batch, job.id, req.jd, req.resumes, weights, user_id, calibration_id, db.bind, llm)
    return BatchResponse(job_id=job.id)

@router.get("/jobs/{job_id}", response_model=JobResponse)
def get_job(
    job_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    job = db.query(Job).filter(Job.id == job_id, Job.clerk_user_id == user_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobResponse(
        job_id=job.id,
        status=job.status.value,
        total=job.total,
        completed=job.completed,
        result=job.result,
    )
