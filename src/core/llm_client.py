import os
import time

from dotenv import load_dotenv
from groq import Groq


class GeminiClient:
    """
    Multi-LLM Groq Client with automatic fallback.
    Safe for healthcare use (no hallucination on failure).
    Note: Class name kept as 'GeminiClient' for backward compatibility.
    """

    def __init__(self):
        load_dotenv()

        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment")

        self.client = Groq(api_key=api_key)

        # 🔥 Ordered fallback list - Groq models
        self.models = [
            "llama-3.3-70b-versatile",  # Latest, most capable
            "llama-3.1-70b-versatile",  # Fallback
            "mixtral-8x7b-32768",  # Alternative
            "llama-3.1-8b-instant",  # Fastest fallback
        ]

    def generate(self, prompt: str) -> str:
        """
        Try multiple models before falling back to safe response.
        """
        for model_name in self.models:
            try:
                response = self.client.chat.completions.create(
                    model=model_name,
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "You are a helpful medical AI assistant. "
                                "Provide accurate, professional, and empathetic responses."
                            ),
                        },
                        {"role": "user", "content": prompt},
                    ],
                    temperature=0.0,
                    top_p=0.1,
                    max_tokens=2048,
                )

                if response and response.choices and response.choices[0].message.content:
                    return response.choices[0].message.content.strip()

            except Exception as e:
                # Log error and move to next model
                print(f"Error with model {model_name}: {str(e)}")
                time.sleep(1)
                continue

        # 🚨 Absolute safe fallback
        return self._fallback_response()

    def _fallback_response(self) -> str:
        """
        Deterministic, non-hallucinating fallback.
        """
        return (
            "The AI assistant is temporarily unavailable due to system load. "
            "The structured clinical risk assessment remains valid. "
            "Please proceed with physician review."
        )


# Alias for backward compatibility
GroqClient = GeminiClient
