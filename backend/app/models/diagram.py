"""
SQLAlchemy ORM model for a stored UML diagram.
"""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Text, DateTime
from app.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Diagram(Base):
    __tablename__ = "diagrams"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    project_name = Column(String, nullable=False)
    diagram_type = Column(String, nullable=False)  # class, usecase, sequence, activity, component, state
    description = Column(Text, nullable=True)
    source_code = Column(Text, nullable=True)
    mermaid_code = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "project_name": self.project_name,
            "diagram_type": self.diagram_type,
            "description": self.description,
            "source_code": self.source_code,
            "mermaid_code": self.mermaid_code,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
