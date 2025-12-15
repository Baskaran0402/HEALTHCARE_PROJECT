from src.core.llm_client import GeminiClient
from src.agents.doctor_agent import DoctorAgent

llm = GeminiClient()
doctor = DoctorAgent(llm)

conversation = [
    {"role": "patient", "content": "I feel tired and dizzy sometimes"},
    {"role": "doctor", "content": "How long have you felt this way?"}
]

question = doctor.ask_next_question(conversation, confidence=0.4)
print("Next Question:", question)
