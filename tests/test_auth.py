from fastapi import FastAPI
from fastapi.testclient import TestClient
from backend.auth import get_current_user

app = FastAPI()

@app.get("/me")
def me(user_id: str = __import__('fastapi').Depends(get_current_user)):
    return {"user_id": user_id}

client = TestClient(app, raise_server_exceptions=False)

def test_missing_token_returns_403():
    response = client.get("/me")
    assert response.status_code in (401, 403)

def test_invalid_token_returns_401():
    response = client.get("/me", headers={"Authorization": "Bearer invalid.token.here"})
    assert response.status_code == 401
