"""
UML Diagram Generator - FastAPI application entry point.
"""
import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from app.database import init_db
from app.routes import diagram_routes

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uml_generator")

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")

app = FastAPI(
    title="UML Diagram Generator API",
    description="AI-assisted backend that converts software requirements into Mermaid UML diagrams.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()
    logger.info("Database initialized.")


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled server error")
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Server error. Please try again.", "detail": str(exc)},
    )


@app.get("/")
def root():
    return {"message": "UML Diagram Generator API is running", "docs": "/docs"}


@app.get("/api/health")
def health_check():
    from app.services.gemini_service import is_configured
    return {
        "status": "ok",
        "gemini_configured": is_configured(),
    }


app.include_router(diagram_routes.router)
