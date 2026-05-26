import os
import logging
from dotenv import load_dotenv
load_dotenv()
logging.basicConfig(level=logging.INFO)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.routers import calibrate, screen, batch, stats

app = FastAPI(title="Resume Screener API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calibrate.router)
app.include_router(screen.router)
app.include_router(batch.router)
app.include_router(stats.router)

@app.get("/api/health")
def health():
    return {"status": "ok"}

# Serve Next.js static export — must come after all /api/* routes
_static_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "out")
if os.path.isdir(_static_dir):
    app.mount("/", StaticFiles(directory=_static_dir, html=True), name="static")
