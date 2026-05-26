import time
import logging
import requests

logger = logging.getLogger(__name__)

class OllamaClient:
    def __init__(self, model: str = "llama3.2", base_url: str = "http://localhost:11434"):
        self.model = model
        self.base_url = base_url

    def generate(self, prompt: str) -> str:
        logger.info("Ollama ▶ sending request (model=%s, prompt=%d chars)", self.model, len(prompt))
        t0 = time.monotonic()
        response = requests.post(
            f"{self.base_url}/api/generate",
            json={"model": self.model, "prompt": prompt, "stream": False},
            timeout=9999999,
        )
        response.raise_for_status()
        elapsed = time.monotonic() - t0
        logger.info("Ollama ✓ response received in %.1fs", elapsed)
        return response.json()["response"]
