from src.core.llm_client import GeminiClient  # Kept name for compatibility

if __name__ == "__main__":
    print("Testing Groq AI Client...\n")

    llm = GeminiClient()  # Actually using Groq now

    # Test 1: Medical question
    print("=" * 60)
    print("Test 1: Medical Follow-up Question")
    print("=" * 60)

    reply = llm.generate("Ask one gentle medical follow-up question like a real doctor.")

    print("\nGroq AI reply:\n")
    print(reply)
    print("\n")

    # Test 2: Clinical summary
    print("=" * 60)
    print("Test 2: Clinical Summary")
    print("=" * 60)

    summary = llm.generate("Summarize in 2 sentences: Patient reports chest pain and fatigue for 3 days.")

    print("\nGroq AI reply:\n")
    print(summary)
    print("\n")

    # Test 3: Next question based on conversation
    print("=" * 60)
    print("Test 3: Contextual Follow-up")
    print("=" * 60)

    context = llm.generate("Patient said: 'I've been having headaches.' What's a good follow-up question?")

    print("\nGroq AI reply:\n")
    print(context)
    print("\n")
