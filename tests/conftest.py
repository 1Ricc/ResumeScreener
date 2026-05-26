import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.db import Base, get_db
from backend.llm.client import get_llm_client
from backend.auth import get_current_user

TEST_DB_URL = "sqlite:///./test.db"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class MockLLMClient:
    def generate(self, prompt: str) -> str:
        return '{"score": 75, "reasoning": "Good match overall", "gaps": ["Kubernetes", "System design"], "questions": ["Describe a production incident you handled"]}'

def override_db():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()

def override_llm():
    return MockLLMClient()

def override_user():
    return "test_user_abc123"

@pytest.fixture(autouse=True)
def reset_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    from backend.main import app
    app.dependency_overrides[get_db] = override_db
    app.dependency_overrides[get_llm_client] = override_llm
    app.dependency_overrides[get_current_user] = override_user
    yield TestClient(app)
    app.dependency_overrides.clear()
