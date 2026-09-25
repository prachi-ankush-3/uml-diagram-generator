"""
Gemini AI service - the ONLY place in the backend that talks to Google's Gemini API.

Converts natural-language software requirements (optionally with source code) into
valid Mermaid UML syntax, for a given diagram type.
"""
import os
import logging
from typing import Optional

import google.generativeai as genai
from dotenv import load_dotenv

from app.services.mermaid_service import clean_mermaid_code

load_dotenv()

logger = logging.getLogger("uml_generator.gemini")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

DIAGRAM_TYPE_LABELS = {
    "class": "Class Diagram (Mermaid `classDiagram` syntax)",
    "usecase": "Use Case Diagram (represent actors as `((Actor))` nodes and use cases as "
               "rectangles in Mermaid `flowchart LR` syntax)",
    "sequence": "Sequence Diagram (Mermaid `sequenceDiagram` syntax)",
    "activity": "Activity Diagram (Mermaid `flowchart TD` syntax with decision diamonds)",
    "component": "Component Diagram (Mermaid `flowchart TB` syntax with subgraphs "
                 "representing components and arrows representing dependencies)",
    "state": "State Diagram (Mermaid `stateDiagram-v2` syntax)",
}

SYSTEM_INSTRUCTION = """You are an expert software architect and UML designer.

Convert the user's software requirements into valid Mermaid syntax.

Generate ONLY the Mermaid code.
Do not include markdown code fences.
Do not include explanations.
Ensure the generated syntax is compatible with Mermaid.js.
Follow the selected UML diagram type."""


class GeminiServiceError(Exception):
    """Raised when the Gemini API call fails or returns unusable output."""


def _build_prompt(diagram_type: str, project_name: str, description: str, source_code: Optional[str]) -> str:
    type_label = DIAGRAM_TYPE_LABELS.get(diagram_type, diagram_type)
    prompt_parts = [
        f"Diagram type to generate: {type_label}",
        f"Project name: {project_name}",
        f"Project description / requirements:\n{description}",
    ]
    if source_code and source_code.strip():
        prompt_parts.append(f"Reference source code (use it to infer classes/relationships):\n{source_code}")
    prompt_parts.append(
        "Respond with ONLY the raw Mermaid diagram code. No markdown fences, no commentary."
    )
    return "\n\n".join(prompt_parts)


def is_configured() -> bool:
    return bool(GEMINI_API_KEY)


def generate_mermaid_code(diagram_type: str, project_name: str, description: str,
                           source_code: Optional[str] = "") -> str:
    """
    Calls the Gemini API and returns cleaned Mermaid code.
    Raises GeminiServiceError on any failure (missing key, API error, empty response).
    """
    if not GEMINI_API_KEY:
        raise GeminiServiceError(
            "Gemini API key is missing. Set GEMINI_API_KEY in your backend .env file."
        )

    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(
            model_name=GEMINI_MODEL,
            system_instruction=SYSTEM_INSTRUCTION,
        )
        prompt = _build_prompt(diagram_type, project_name, description, source_code)

        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
                max_output_tokens=2048,
            ),
        )

        raw_text = (response.text or "").strip() if hasattr(response, "text") else ""

        if not raw_text:
            raise GeminiServiceError("Gemini returned an empty response. Please try again.")

        return clean_mermaid_code(raw_text)

    except GeminiServiceError:
        raise
    except Exception as exc:  # noqa: BLE001 - surface any SDK/network error uniformly
        logger.exception("Gemini API call failed")
        raise GeminiServiceError(f"Unable to generate the diagram. Please try again. ({exc})") from exc
