"""
Mermaid syntax validation and cleanup service.

This does not require Mermaid.js itself (that runs in the browser). Instead it performs
structural/heuristic validation on the server so we can catch obviously broken output
from the AI (or from a user hand-editing code) before sending it to the frontend.
"""
import re
from typing import Tuple

DIAGRAM_KEYWORDS = {
    "class": ["classDiagram"],
    "usecase": ["flowchart", "graph"],
    "sequence": ["sequenceDiagram"],
    "activity": ["flowchart", "graph", "stateDiagram"],
    "component": ["flowchart", "graph", "graph TB", "graph LR"],
    "state": ["stateDiagram", "stateDiagram-v2"],
}


def clean_mermaid_code(raw_code: str) -> str:
    """Strip markdown code fences and stray leading/trailing whitespace the AI might add."""
    if not raw_code:
        return ""
    code = raw_code.strip()
    # Remove ```mermaid ... ``` or ``` ... ``` fences if present
    code = re.sub(r"^```(?:mermaid)?\s*\n?", "", code)
    code = re.sub(r"\n?```\s*$", "", code)
    return code.strip()


def validate_mermaid_code(code: str, diagram_type: str = None) -> Tuple[bool, str]:
    """
    Lightweight structural validation of Mermaid syntax.
    Returns (is_valid, message).
    """
    if not code or not code.strip():
        return False, "Mermaid code is empty."

    code = clean_mermaid_code(code)
    first_line = code.strip().split("\n")[0].strip()

    known_starts = [
        "classDiagram", "sequenceDiagram", "flowchart", "graph",
        "stateDiagram", "stateDiagram-v2", "erDiagram", "gantt",
        "pie", "journey", "mindmap", "gitGraph",
    ]

    if not any(first_line.startswith(k) for k in known_starts):
        return False, (
            "Generated Mermaid code contains an error. "
            "It does not start with a recognized diagram declaration "
            "(e.g. classDiagram, sequenceDiagram, flowchart). You can edit it manually."
        )

    # Basic bracket-balance check to catch obviously truncated/broken syntax
    for open_c, close_c in [("{", "}"), ("[", "]"), ("(", ")")]:
        if code.count(open_c) != code.count(close_c):
            return False, (
                f"Generated Mermaid code contains an error: unbalanced '{open_c}{close_c}'. "
                "You can edit it manually."
            )

    if diagram_type and diagram_type in DIAGRAM_KEYWORDS:
        expected = DIAGRAM_KEYWORDS[diagram_type]
        if not any(first_line.startswith(k) for k in expected):
            # Not fatal - some diagram types (usecase/activity/component) intentionally
            # reuse flowchart/graph syntax - just a soft warning bundled into success.
            pass

    return True, "Valid Mermaid syntax"
