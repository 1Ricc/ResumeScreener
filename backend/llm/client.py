import os
from typing import Protocol, runtime_checkable

@runtime_checkable
class LLMClient(Protocol):
    def generate(self, prompt: str) -> str: ...

def get_llm_client() -> LLMClient:
    provider = os.getenv("LLM_PROVIDER", "ollama")
    if provider == "gemini":
        from backend.llm.gemini import GeminiClient
        return GeminiClient(api_key=os.getenv("GEMINI_API_KEY", ""))
    from backend.llm.ollama import OllamaClient
    return OllamaClient(
        model=os.getenv("OLLAMA_MODEL", "llama3.2"),
        base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
    )
