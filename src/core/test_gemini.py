from src.core.llm_client import GeminiClient

if __name__ == "__main__":
    llm = GeminiClient()

    reply = llm.generate(
        "Ask one gentle medical follow-up question like a real doctor."
    )

    print("\nGemini reply:\n")
    print(reply)
