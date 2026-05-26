from fastapi import FastAPI
from backend.routers import calibrate, screen

app = FastAPI(title="Resume Screener API")
app.include_router(calibrate.router)
app.include_router(screen.router)

@app.get("/api/health")
def health():
    return {"status": "ok"}
