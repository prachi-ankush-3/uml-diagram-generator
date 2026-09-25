"""
Pydantic schemas used for request/response validation across the API.
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

VALID_DIAGRAM_TYPES = {
    "class": "Class Diagram",
    "usecase": "Use Case Diagram",
    "sequence": "Sequence Diagram",
    "activity": "Activity Diagram",
    "component": "Component Diagram",
    "state": "State Diagram",
}


class GenerateDiagramRequest(BaseModel):
    project_name: str = Field(..., min_length=1, max_length=200)
    diagram_type: str
    description: str = Field(..., min_length=1, max_length=8000)
    source_code: Optional[str] = Field(default="", max_length=20000)

    @field_validator("diagram_type")
    @classmethod
    def validate_diagram_type(cls, v: str) -> str:
        if v not in VALID_DIAGRAM_TYPES:
            raise ValueError(
                f"Invalid diagram_type '{v}'. Must be one of: {', '.join(VALID_DIAGRAM_TYPES.keys())}"
            )
        return v

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Please enter project requirements first.")
        return v


class GenerateDiagramResponse(BaseModel):
    success: bool
    diagram_type: str
    mermaid_code: str
    message: str


class ValidateDiagramRequest(BaseModel):
    mermaid_code: str = Field(..., min_length=1)


class ValidateDiagramResponse(BaseModel):
    valid: bool
    message: str


class DiagramCreate(BaseModel):
    project_name: str = Field(..., min_length=1, max_length=200)
    diagram_type: str
    description: Optional[str] = ""
    source_code: Optional[str] = ""
    mermaid_code: str = Field(..., min_length=1)

    @field_validator("diagram_type")
    @classmethod
    def validate_diagram_type(cls, v: str) -> str:
        if v not in VALID_DIAGRAM_TYPES:
            raise ValueError(f"Invalid diagram_type '{v}'")
        return v


class DiagramUpdate(BaseModel):
    project_name: Optional[str] = None
    mermaid_code: Optional[str] = None
    description: Optional[str] = None


class DiagramResponse(BaseModel):
    id: str
    project_name: str
    diagram_type: str
    description: Optional[str] = None
    source_code: Optional[str] = None
    mermaid_code: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class DiagramListResponse(BaseModel):
    success: bool
    count: int
    diagrams: List[DiagramResponse]


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    detail: Optional[str] = None
