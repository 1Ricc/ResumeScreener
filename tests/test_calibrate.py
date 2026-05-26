def test_create_calibration(client):
    response = client.post("/api/calibrate", json={
        "name": "Senior Eng Rubric",
        "weights": {"seniority": 8, "stack_match": 4, "skills_match": 7}
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Senior Eng Rubric"
    assert data["weights"]["seniority"] == 8
    assert "calibration_id" in data

def test_list_calibrations_empty(client):
    response = client.get("/api/calibrations")
    assert response.status_code == 200
    assert response.json() == []

def test_list_calibrations_returns_created(client):
    client.post("/api/calibrate", json={"name": "Rubric A", "weights": {"skills_match": 5}})
    client.post("/api/calibrate", json={"name": "Rubric B", "weights": {"seniority": 9}})
    response = client.get("/api/calibrations")
    assert response.status_code == 200
    assert len(response.json()) == 2
