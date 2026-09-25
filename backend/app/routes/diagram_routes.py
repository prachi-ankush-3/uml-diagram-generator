"""
API routes for the UML Diagram Generator.
"""
import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.diagram import Diagram
from app.schemas.diagram_schema import (
    GenerateDiagramRequest, GenerateDiagramResponse,
    ValidateDiagramRequest, ValidateDiagramResponse,
    DiagramCreate, DiagramUpdate, DiagramResponse, DiagramListResponse,
    VALID_DIAGRAM_TYPES,
)
from app.services import gemini_service
from app.services.mermaid_service import validate_mermaid_code, clean_mermaid_code

logger = logging.getLogger("uml_generator.routes")
router = APIRouter(prefix="/api/diagrams", tags=["diagrams"])


@router.post("/generate", response_model=GenerateDiagramResponse)
def generate_diagram(payload: GenerateDiagramRequest):
    if len(payload.description) > 8000:
        raise HTTPException(status_code=400, detail="Input is too large. Please shorten your description.")

    if not gemini_service.is_configured():
        raise HTTPException(
            status_code=503,
            detail="Gemini API key is missing on the server. Add GEMINI_API_KEY to backend/.env, "
                   "or enter Mermaid code manually using the editor.",
        )

    try:
        mermaid_code = gemini_service.generate_mermaid_code(
            diagram_type=payload.diagram_type,
            project_name=payload.project_name,
            description=payload.description,
            source_code=payload.source_code,
        )
    except gemini_service.GeminiServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    is_valid, message = validate_mermaid_code(mermaid_code, payload.diagram_type)

    return GenerateDiagramResponse(
        success=True,
        diagram_type=payload.diagram_type,
        mermaid_code=mermaid_code,
        message="Diagram generated successfully" if is_valid else message,
    )


@router.post("/validate", response_model=ValidateDiagramResponse)
def validate_diagram(payload: ValidateDiagramRequest):
    is_valid, message = validate_mermaid_code(payload.mermaid_code)
    return ValidateDiagramResponse(valid=is_valid, message=message)


@router.post("", response_model=DiagramResponse)
@router.post("/", response_model=DiagramResponse, include_in_schema=False)
def save_diagram(payload: DiagramCreate, db: Session = Depends(get_db)):
    is_valid, message = validate_mermaid_code(payload.mermaid_code, payload.diagram_type)
    if not is_valid:
        raise HTTPException(status_code=400, detail=message)

    diagram = Diagram(
        project_name=payload.project_name,
        diagram_type=payload.diagram_type,
        description=payload.description or "",
        source_code=payload.source_code or "",
        mermaid_code=clean_mermaid_code(payload.mermaid_code),
    )
    db.add(diagram)
    db.commit()
    db.refresh(diagram)
    return diagram.to_dict()


@router.get("", response_model=DiagramListResponse)
@router.get("/", response_model=DiagramListResponse, include_in_schema=False)
def get_all_diagrams(db: Session = Depends(get_db)):
    diagrams = db.query(Diagram).order_by(Diagram.created_at.desc()).all()
    return DiagramListResponse(
        success=True,
        count=len(diagrams),
        diagrams=[d.to_dict() for d in diagrams],
    )


@router.get("/{diagram_id}", response_model=DiagramResponse)
def get_diagram(diagram_id: str, db: Session = Depends(get_db)):
    diagram = db.query(Diagram).filter(Diagram.id == diagram_id).first()
    if not diagram:
        raise HTTPException(status_code=404, detail="Diagram not found")
    return diagram.to_dict()


@router.put("/{diagram_id}", response_model=DiagramResponse)
def update_diagram(diagram_id: str, payload: DiagramUpdate, db: Session = Depends(get_db)):
    diagram = db.query(Diagram).filter(Diagram.id == diagram_id).first()
    if not diagram:
        raise HTTPException(status_code=404, detail="Diagram not found")

    if payload.mermaid_code is not None:
        is_valid, message = validate_mermaid_code(payload.mermaid_code, diagram.diagram_type)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)
        diagram.mermaid_code = clean_mermaid_code(payload.mermaid_code)

    if payload.project_name is not None:
        diagram.project_name = payload.project_name

    if payload.description is not None:
        diagram.description = payload.description

    db.commit()
    db.refresh(diagram)
    return diagram.to_dict()


@router.delete("/{diagram_id}")
def delete_diagram(diagram_id: str, db: Session = Depends(get_db)):
    diagram = db.query(Diagram).filter(Diagram.id == diagram_id).first()
    if not diagram:
        raise HTTPException(status_code=404, detail="Diagram not found")
    db.delete(diagram)
    db.commit()
    return {"success": True, "message": "Diagram deleted successfully"}


@router.get("/meta/types")
def get_diagram_types():
    """Helper endpoint the frontend can use to populate the diagram-type dropdown."""
    return {"types": VALID_DIAGRAM_TYPES}
