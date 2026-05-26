import google.generativeai as genai

class GeminiClient:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self._model = genai.GenerativeModel("gemini-1.5-flash")

    def generate(self, prompt: str) -> str:
        response = self._model.generate_content(prompt)
        return response.text
