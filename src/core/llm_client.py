import os
from dotenv import load_dotenv
from google import genai
from google.genai import types


class GeminiClient:
    def __init__(self):
        load_dotenv()

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")

        # Client automatically reads GEMINI_API_KEY
        self.client = genai.Client()

        # Recommended for conversational + summarization
        self.model_name = "gemini-2.5-flash"

    def generate(self, prompt: str) -> str:
        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3,          # medical safety
                thinking_config=types.ThinkingConfig(
                    thinking_budget=0     # disable deep thinking for speed
                ),
            ),
        )

        return response.text.strip()
