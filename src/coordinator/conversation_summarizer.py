from typing import Dict


def summarize_conversation(memory: Dict) -> str:
    lines = []

    if "complaint" in memory:
        lines.append(f"Chief complaint: {memory['complaint']}")

    if "duration" in memory:
        lines.append(f"Duration: {memory['duration']}")

    if "medications" in memory:
        lines.append(f"Current medications: {memory['medications']}")

    if "chest_pain" in memory:
        lines.append("Chest pain reported")

    if "breathlessness" in memory:
        lines.append("Breathlessness reported")

    if "edema" in memory:
        lines.append("Swelling (edema) reported")

    return "\n".join(lines)
