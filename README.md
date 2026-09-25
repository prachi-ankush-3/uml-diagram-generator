# UML Diagram Generator

An AI-assisted web application that converts software requirements, project descriptions, or source code into UML diagrams — Class, Use Case, Sequence, Activity, Component, and State — rendered live in the browser and downloadable as PNG, SVG, or PDF.

## Description

Users describe a system in plain English (or paste existing source code), pick a diagram type, and the backend sends the request to Google Gemini, which returns Mermaid.js syntax. The frontend renders that syntax as an interactive diagram that can be zoomed, edited by hand, saved to history, and exported. The app is fully usable without AI too — any diagram can be authored or fixed directly in the Mermaid code editor.

## Features

- 6 UML diagram types: Class, Use Case, Sequence, Activity, Component, State
- Natural-language requirements → Mermaid UML code via Gemini
- Optional source-code input to help the AI infer classes/relationships
- Live Mermaid.js rendering with zoom, reset, and fullscreen
- Manual Mermaid code editor with "Render Diagram" (works fully offline of AI)
- Download diagrams as PNG, SVG, or PDF
- Diagram history stored in SQLite (project, type, Mermaid source, created date)
- View / edit / delete / download from history
- Sample demo projects (e-commerce, library, hospital) to try instantly
- Friendly error handling for empty input, invalid types, API failures, bad Mermaid syntax, missing API key, and oversized input
- Dark, glassmorphic developer-tool UI (Tailwind CSS)

## Technology Stack

**Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Mermaid.js, jsPDF, Lucide React
**Backend:** Python, FastAPI, Pydantic, SQLAlchemy, Uvicorn
**AI:** Google Gemini API (`google-generativeai` SDK)
**Database:** SQLite (via SQLAlchemy, swappable through `DATABASE_URL`)

## System Architecture

```
React (Vite) ── Axios ──▶ FastAPI ── google-generativeai ──▶ Gemini API
     │                        │
     │                        ▼
     │                   SQLite (diagrams table)
     ▼
Mermaid.js (client-side render) ── jsPDF / Canvas ──▶ PNG / SVG / PDF download
```

All Gemini calls live only in `backend/app/services/gemini_service.py` — the API key never reaches the frontend.

## Application Workflow

1. Open the Dashboard → click **Create New Diagram** (or pick a diagram-type card)
2. Choose a diagram type, name the project, describe the requirements (and optionally paste source code)
3. Click **Generate Diagram** → backend sends the input to Gemini → Gemini returns Mermaid code → backend validates it
4. Frontend renders the diagram with Mermaid.js
5. Switch to the **Mermaid Code** tab to hand-edit, then click **Render Diagram** to re-render
6. **Save** to persist the diagram to History
7. **Download** as PNG, SVG, or PDF
8. Revisit, edit or delete any diagram from **History**

## Screenshots

*(Run the app locally and add screenshots here — Dashboard, Create Diagram, and History views.)*

## Installation

### Prerequisites

- Node.js 18+
- Python 3.10+
- A Google Gemini API key: https://aistudio.google.com/app/apikey

### Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# edit .env and set GEMINI_API_KEY
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000` (interactive docs at `/docs`).

### Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # optional, defaults to http://localhost:8000
npm run dev
```

Frontend runs at `http://localhost:5173`.

### Gemini API setup

1. Visit https://aistudio.google.com/app/apikey and create an API key.
2. Paste it into `backend/.env` as `GEMINI_API_KEY=...`.
3. Restart the backend. Check **Settings** in the app — it shows whether the key is detected.
4. Without a key, AI generation is disabled, but the Mermaid code editor still works for manual diagram creation.

## Environment Variables

**backend/.env**
```
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./uml_generator.db
FRONTEND_ORIGIN=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:8000
```

## API Documentation

| Method | Endpoint                     | Description                          |
|--------|-------------------------------|---------------------------------------|
| POST   | `/api/diagrams/generate`      | Generate Mermaid code from requirements via Gemini |
| POST   | `/api/diagrams/validate`      | Validate Mermaid syntax               |
| POST   | `/api/diagrams`               | Save a diagram                        |
| GET    | `/api/diagrams`               | List all saved diagrams               |
| GET    | `/api/diagrams/{id}`          | Get one diagram                       |
| PUT    | `/api/diagrams/{id}`          | Update a diagram's code/name          |
| DELETE | `/api/diagrams/{id}`          | Delete a diagram                      |
| GET    | `/api/health`                 | Backend/Gemini configuration status   |

Full interactive OpenAPI docs at `http://localhost:8000/docs` once the backend is running.

### Example request — `POST /api/diagrams/generate`

```json
{
  "project_name": "Food Delivery System",
  "diagram_type": "class",
  "description": "Users can register, login, browse restaurants, add food to cart, place orders and make payments.",
  "source_code": ""
}
```

### Example response

```json
{
  "success": true,
  "diagram_type": "class",
  "mermaid_code": "classDiagram\nclass User {\n+int id\n+String name\n+login()\n}\n...",
  "message": "Diagram generated successfully"
}
```

## Future Scope

- Real-time collaborative editing of diagrams
- Export entire project (multiple diagrams) as a single PDF report
- Reverse-engineer diagrams directly from a GitHub repository
- User accounts and per-user diagram libraries
- Additional diagram types (deployment, ER diagrams)
- Version history / diffing for edited diagrams
