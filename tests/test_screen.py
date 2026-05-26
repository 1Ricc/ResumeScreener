def test_screen_with_default_weights(client):
    response = client.post("/api/screen", json={
        "jd": "Looking for a Python backend engineer",
        "resume": "Alice has 5 years of Python and FastAPI experience"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 75
    assert "screening_id" in data
    assert "summary" in data
    assert isinstance(data["strengths"], list)
    assert len(data["strengths"]) >= 2
    assert "title" in data["strengths"][0]
    assert "body" in data["strengths"][0]
    assert isinstance(data["gaps"], list)
    assert "title" in data["gaps"][0]
    assert isinstance(data["tips"], list)
    assert isinstance(data["breakdown"], dict)

def test_screen_with_inline_weights(client):
    response = client.post("/api/screen", json={
        "jd": "Senior engineer needed",
        "resume": "Bob has 10 years experience",
        "weights": {
            "skills_match": 10,
            "seniority": 8,
            "culture_fit": 5,
            "stack_match": 7,
            "education": 3,
            "coachability": 5,
        }
    })
    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 75

def test_screen_with_calibration(client):
    cal = client.post("/api/calibrate", json={
        "name": "Test Rubric", "weights": {"seniority": 9}
    }).json()
    response = client.post("/api/screen", json={
        "jd": "Senior engineer needed",
        "resume": "Bob has 10 years experience",
        "calibration_id": cal["calibration_id"]
    })
    assert response.status_code == 200

def test_screen_invalid_calibration_returns_404(client):
    response = client.post("/api/screen", json={
        "jd": "jd text",
        "resume": "resume text",
        "calibration_id": "00000000-0000-0000-0000-000000000000"
    })
    assert response.status_code == 404
