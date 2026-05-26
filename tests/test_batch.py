def test_create_batch_returns_job_id(client):
    response = client.post("/api/batch", json={
        "jd": "Python engineer needed",
        "resumes": ["Alice: 5y Python", "Bob: 3y Python"]
    })
    assert response.status_code == 200
    assert "job_id" in response.json()

def test_get_job_after_batch(client):
    batch_resp = client.post("/api/batch", json={
        "jd": "Python engineer needed",
        "resumes": ["Alice: 5y Python", "Bob: 3y Python"]
    })
    job_id = batch_resp.json()["job_id"]
    response = client.get(f"/api/jobs/{job_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "done"
    assert data["total"] == 2
    assert data["completed"] == 2
    assert len(data["result"]) == 2

def test_batch_max_resumes_validation(client):
    response = client.post("/api/batch", json={
        "jd": "jd",
        "resumes": ["resume"] * 21
    })
    assert response.status_code == 422

def test_get_job_wrong_user_returns_404(client):
    batch_resp = client.post("/api/batch", json={
        "jd": "jd", "resumes": ["resume"]
    })
    job_id = batch_resp.json()["job_id"]
    from backend.auth import get_current_user
    from backend.main import app
    app.dependency_overrides[get_current_user] = lambda: "different_user"
    response = client.get(f"/api/jobs/{job_id}")
    assert response.status_code == 404
