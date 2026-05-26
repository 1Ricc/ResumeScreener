from fastapi import FastAPI

app = FastAPI(title="Resume Screener API")

@app.get("/api/health")
def health():
    return {"status": "ok"}
