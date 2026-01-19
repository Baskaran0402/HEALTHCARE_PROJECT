from typing import List, Dict, Optional
import json
import logging
from datetime import datetime

# Adjust import based on your actual path structure
from src.core.llm_client import GroqClient

class KiraAgent:
    """
    Kira - The AI Healthcare Assistant.
    Capabilities:
    1. Answer general health questions/doubts.
    2. Assist in booking doctor appointments (Extraction of intent).
    """

    def __init__(self):
        self.llm = GroqClient()
        self.system_prompt = (
            "You are Kira, a friendly, professional, and empathetic AI healthcare assistant. "
            "Your roles are:\n"
            "1. Answer general health questions and doubts with evidence-based information. "
            "   Always add a disclaimer that you are an AI and not a substitute for a doctor.\n"
            "2. Assist users in booking doctor appointments. If a user expresses intent to book, "
            "   ask for their Preferred Date, Time, and Department/Specialty.\n"
            "   If they provide these details, confirm the booking in a structured summary.\n"
            "3. Keep responses concise, warm, and helpful.\n"
            "4. Positioning: You are a 'Second Opinion' and 'Assistant' tool.\n\n"
            "Current Date: " + datetime.now().strftime("%Y-%m-%d")
        )

    def chat(self, user_message: str, history: List[Dict[str, str]] = None) -> str:
        """
        Process a user message and return Kira's response.
        history: List of {"role": "user"|"assistant", "content": "..."}
        """
        if history is None:
            history = []

        # Construct the messages list for the LLM
        messages = [
            {"role": "system", "content": self.system_prompt}
        ]
        
        # Add conversation history context (limit to last 5 turns to save tokens)
        messages.extend(history[-10:])
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})

        try:
            # We need to bypass the strict single-prompt generate() method of the base client 
            # to support chat history. We'll access the client directly if possible, 
            # or we will construct a single big prompt string if we must leverage the robust fallback logic.
            
            # Using the robust .generate() method by formatting history into a single string 
            # is safer for error handling/fallback, though less "chatty" for the model.
            # Let's try to stringify the history for the prompt.
            
            full_prompt = ""
            for msg in history:
                role = "User" if msg['role'] == 'user' else "Kira"
                full_prompt += f"{role}: {msg['content']}\n"
            
            full_prompt += f"User: {user_message}\nKira:"

            # We use the existing generate method which handles fallbacks and errors
            # But we prepend the system instructions to the prompt since the base class 
            # has a hardcoded system prompt which might conflict slightly, but it's generic enough.
            # actually, let's override the base class behavior by subclassing? 
            # No, keep it simple. The base class system prompt is: 
            # "You are a helpful medical AI assistant..." 
            # That is compatible with Kira. We will reinforce Kira's identity in the user prompt.
            
            reinforced_prompt = (
                f"{self.system_prompt}\n\n"
                "Conversation History:\n"
                f"{full_prompt}"
            )
            
            response = self.llm.generate(reinforced_prompt)
            return response

        except Exception as e:
            logging.error(f"Error in KiraAgent: {e}")
            return "I apologize, but I am currently experiencing technical difficulties. Please try again later."

    def extract_appointment_details(self, message: str) -> Optional[Dict]:
        """
        Try to extract appointment details if the message confirms a booking.
        (Advanced feature for future: utilize JSON mode of LLM)
        For now, we rely on the chat flow.
        """
        pass
