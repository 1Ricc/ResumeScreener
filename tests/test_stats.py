def test_stats_empty(client):
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_screenings"] == 0
    assert data["avg_score"] == 0.0
    assert data["top_gaps"] == []

def test_stats_after_screenings(client):
    client.post("/api/screen", json={"jd": "Python dev", "resume": "Alice knows Python"})
    client.post("/api/screen", json={"jd": "Python dev", "resume": "Bob knows Java"})
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_screenings"] == 2
    assert data["avg_score"] == 75.0
    assert "61-80" in data["score_distribution"]
    assert data["score_distribution"]["61-80"] == 2
    assert any(g["skill"] == "Kubernetes" for g in data["top_gaps"])
