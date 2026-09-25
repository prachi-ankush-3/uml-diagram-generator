# UML Diagram Generator

### AI-Assisted Full-Stack Application

**React • Vite • Tailwind CSS • FastAPI • SQLite • Google Gemini • Mermaid.js**

> An AI-powered web application that converts software requirements, project descriptions, or source code into UML diagrams automatically.

---

## 📌 Project Overview

The **UML Diagram Generator** is a full-stack, AI-assisted web application designed to simplify the process of creating UML diagrams.

Instead of manually creating UML diagrams, users can describe their software system in **plain English** or provide existing source code. The application sends the input to **Google Gemini**, which generates valid **Mermaid.js UML syntax**.

The frontend then renders the generated Mermaid code as an interactive diagram.

Users can:

* Generate UML diagrams using AI
* Edit Mermaid code manually
* Preview diagrams in real time
* Zoom and view diagrams in fullscreen
* Save diagrams to history
* Edit and delete saved diagrams
* Download diagrams as PNG, SVG, or PDF

The application also works **without AI** because users can directly enter Mermaid code and render diagrams manually.

---

# ✨ Features

## 🤖 AI-Powered UML Generation

* Convert natural-language requirements into UML diagrams
* Google Gemini generates Mermaid.js syntax
* Optional source-code input
* Automatic Mermaid syntax validation
* AI generation error handling
* API key status checking

## 📊 Supported UML Diagrams

The application supports six diagram types:

| Diagram               | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| **Class Diagram**     | Classes, attributes, methods, and relationships |
| **Use Case Diagram**  | Actors and their interactions with the system   |
| **Sequence Diagram**  | Message flow between objects over time          |
| **Activity Diagram**  | Workflows, decisions, and processes             |
| **Component Diagram** | Components and their dependencies               |
| **State Diagram**     | States and transitions of an object             |

---

# 🎨 Diagram Editor

The application provides a built-in Mermaid editor.

Users can:

* View generated Mermaid code
* Edit Mermaid code manually
* Render modified code
* Fix invalid Mermaid syntax
* Preview changes instantly

The manual Mermaid editor works even when the Gemini API is unavailable.

---

# 📥 Export Options

Generated diagrams can be downloaded as:

* **PNG**
* **SVG**
* **PDF**

### Export Flow

```text
Mermaid Diagram
      │
      ├── PNG
      │
      ├── SVG
      │
      └── PDF
```

---

# 💾 Diagram History

Saved diagrams are stored in a SQLite database.

The History section allows users to:

* View saved diagrams
* Open diagram details
* Edit diagrams
* Download diagrams
* Delete diagrams

Stored information includes:

```text
Project Name
Diagram Type
Description
Source Code
Mermaid Code
Created Date
Updated Date
```

---

# 🧪 Sample Projects

The application includes sample projects for quick testing:

* E-Commerce System
* Library Management System
* Hospital Management System

These examples allow users to understand the application without creating requirements from scratch.

---

# 🏗️ System Architecture

The project follows a three-tier architecture.

```text
                         USER
                           │
                           ▼
                ┌─────────────────────┐
                │   React + Vite      │
                │     Frontend        │
                └──────────┬──────────┘
                           │
                         Axios
                           │
                           ▼
                ┌─────────────────────┐
                │   FastAPI Backend   │
                └──────────┬──────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
     ┌──────────────────┐      ┌──────────────────┐
     │   Google Gemini  │      │      SQLite      │
     │      AI API      │      │     Database     │
     └────────┬─────────┘      └──────────────────┘
              │
              ▼
     ┌──────────────────┐
     │   Mermaid.js     │
     │  Diagram Render  │
     └────────┬─────────┘
              │
              ▼
     ┌──────────────────┐
     │  Export System   │
     │ PNG / SVG / PDF  │
     └──────────────────┘
```

### 🔐 AI Security

The React frontend **never directly communicates with Gemini**.

All Gemini API requests are handled by:

```text
backend/app/services/gemini_service.py
```

The API key is stored in the backend `.env` file and is never exposed to the browser.

---

# 🔄 Application Workflow

```text
User enters requirements
          │
          ▼
Select diagram type
          │
          ▼
Click "Generate Diagram"
          │
          ▼
FastAPI Backend
          │
          ▼
Google Gemini API
          │
          ▼
Generated Mermaid Code
          │
          ▼
Mermaid Validation
          │
          ▼
Mermaid.js Rendering
          │
          ▼
┌─────────┼─────────┐
│         │         │
▼         ▼         ▼
Edit     Save    Download
Code     History PNG/SVG/PDF
```

### Step-by-Step

1. Open the application dashboard.
2. Click **Create New Diagram**.
3. Select the required UML diagram type.
4. Enter the project name.
5. Enter software requirements.
6. Optionally paste source code.
7. Click **Generate Diagram**.
8. Backend sends the request to Gemini.
9. Gemini returns Mermaid code.
10. Backend validates the generated code.
11. Mermaid.js renders the diagram.
12. User can manually edit the Mermaid code.
13. Click **Render Diagram** to preview changes.
14. Save the diagram to History.
15. Download the diagram as PNG, SVG, or PDF.

---

# 📁 Project Structure

```text
uml-diagram-generator/
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── DiagramCard.jsx
│   │   │   ├── DiagramViewer.jsx
│   │   │   ├── MermaidEditor.jsx
│   │   │   └── Loading.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateDiagram.jsx
│   │   │   ├── History.jsx
│   │   │   ├── DiagramDetails.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   │
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   │
│   │   ├── models/
│   │   │   └── diagram.py
│   │   │
│   │   ├── routes/
│   │   │   └── diagram_routes.py
│   │   │
│   │   ├── services/
│   │   │   ├── gemini_service.py
│   │   │   └── mermaid_service.py
│   │   │
│   │   └── schemas/
│   │       └── diagram_schema.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

# 🛠️ Technology Stack

| Layer                 | Technologies                     |
| --------------------- | -------------------------------- |
| **Frontend**          | React 18, Vite 5, Tailwind CSS 3 |
| **Routing**           | React Router 6                   |
| **API Communication** | Axios                            |
| **Diagram Rendering** | Mermaid.js                       |
| **PDF Export**        | jsPDF                            |
| **Icons**             | Lucide React                     |
| **Backend**           | Python 3.10+, FastAPI            |
| **Validation**        | Pydantic v2                      |
| **ORM**               | SQLAlchemy 2.0                   |
| **Server**            | Uvicorn                          |
| **AI**                | Google Gemini API                |
| **Database**          | SQLite                           |

---

# 🧠 AI Generation Logic

All Gemini-related operations are isolated inside:

```text
backend/app/services/gemini_service.py
```

The application sends a structured prompt to Gemini.

The system instruction is designed to generate only valid Mermaid code:

```text
You are an expert software architect and UML designer.

Convert the user's software requirements into valid Mermaid syntax.

Generate ONLY the Mermaid code.

Do not include markdown code fences.

Do not include explanations.

Ensure the generated syntax is compatible with Mermaid.js.

Follow the selected UML diagram type.
```

The backend provides Gemini with:

```text
Project Name
Diagram Type
Requirements
Optional Source Code
```

Gemini returns Mermaid code.

The backend then:

```text
Gemini Response
      ↓
Remove unwanted code fences
      ↓
Clean Mermaid Code
      ↓
Validate Mermaid Syntax
      ↓
Return to Frontend
```

---

# 🔌 Backend API Reference

| Method   | Endpoint                   | Description                        |
| -------- | -------------------------- | ---------------------------------- |
| `POST`   | `/api/diagrams/generate`   | Generate Mermaid code using Gemini |
| `POST`   | `/api/diagrams/validate`   | Validate Mermaid syntax            |
| `POST`   | `/api/diagrams`            | Save a diagram                     |
| `GET`    | `/api/diagrams`            | List saved diagrams                |
| `GET`    | `/api/diagrams/{id}`       | Get a single diagram               |
| `PUT`    | `/api/diagrams/{id}`       | Update a diagram                   |
| `DELETE` | `/api/diagrams/{id}`       | Delete a diagram                   |
| `GET`    | `/api/diagrams/meta/types` | Get valid diagram types            |
| `GET`    | `/api/health`              | Check backend and Gemini status    |

FastAPI automatically provides interactive API documentation:

```text
http://localhost:8000/docs
```

---

# 📡 Example API Request

### POST `/api/diagrams/generate`

```json
{
  "project_name": "Food Delivery System",
  "diagram_type": "class",
  "description": "Users can register, login, browse restaurants, add food to cart, place orders and make payments.",
  "source_code": ""
}
```

---

# 📤 Example API Response

```json
{
  "success": true,
  "diagram_type": "class",
  "mermaid_code": "classDiagram\nclass User {\n+int id\n+String name\n+login()\n}\n...",
  "message": "Diagram generated successfully"
}
```

---

# 🗄️ Data Model

The main `Diagram` database model contains:

| Field          | Type          | Description            |
| -------------- | ------------- | ---------------------- |
| `id`           | String / UUID | Primary key            |
| `project_name` | String        | Project name           |
| `diagram_type` | String        | UML diagram type       |
| `description`  | Text          | Original requirements  |
| `source_code`  | Text          | Optional source code   |
| `mermaid_code` | Text          | Current Mermaid source |
| `created_at`   | DateTime      | Creation timestamp     |
| `updated_at`   | DateTime      | Last update timestamp  |

Valid diagram types:

```text
class
usecase
sequence
activity
component
state
```

---

# ⚠️ Error Handling

The application provides user-friendly messages for common errors.

| Scenario               | User Message                                         |
| ---------------------- | ---------------------------------------------------- |
| Empty requirements     | Please enter project requirements first.             |
| Missing Gemini API key | Gemini API key is missing on the server.             |
| Gemini API failure     | Unable to generate the diagram. Please try again.    |
| Invalid Mermaid        | Generated Mermaid code contains an error.            |
| Invalid diagram type   | Invalid diagram type.                                |
| Oversized input        | Input is too large. Please shorten your description. |
| Backend unreachable    | Unable to reach the server. Is the backend running?  |
| Server error           | Server error. Please try again.                      |

---

# 🎨 UI / UX Design

The application uses a modern developer-tool interface.

### Design Features

* Dark background
* Green developer-theme accents
* Glassmorphism cards
* Rounded components
* Inter font
* Responsive layout
* Smooth transitions
* Hover effects
* Interactive diagram viewer

### Color Theme

```text
Background:
#0B0F0D

Dark Surface:
#111713

Secondary Surface:
#182019

Accent Green:
#4ADE80

Accent Emerald:
#10B981
```

### Layout

```text
┌──────────────┬─────────────────────────────────────┐
│              │                                     │
│  Dashboard   │          Top Navigation             │
│              │                                     │
│  Create      ├─────────────────────────────────────┤
│  Diagram     │                                     │
│              │                                     │
│  History     │          Main Content               │
│              │                                     │
│  Settings    │                                     │
│              │                                     │
└──────────────┴─────────────────────────────────────┘
```

---

# 🖥️ Application Output

## Dashboard

Add your dashboard screenshot here:

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                  DASHBOARD SCREENSHOT                    │
│                                                          │
│                  Add Image Here                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Output:** Dashboard showing UML diagram types, recent diagrams, and Create New Diagram option.

---

## Create Diagram

Add your Create Diagram screenshot here:

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                CREATE DIAGRAM SCREENSHOT                 │
│                                                          │
│                  Add Image Here                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Output:** User enters project requirements, selects diagram type, and generates the UML diagram.

---

## AI Generated UML Diagram

Add your generated diagram screenshot here:

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│              GENERATED UML DIAGRAM                       │
│                                                          │
│                  Add Image Here                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Output:** Mermaid.js renders the UML diagram generated by Gemini.

---

## Mermaid Code Editor

Add your Mermaid editor screenshot here:

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│               MERMAID CODE EDITOR                        │
│                                                          │
│                  Add Image Here                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Output:** Users can manually edit Mermaid code and render the updated diagram.

---

## Diagram History

Add your History screenshot here:

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                 DIAGRAM HISTORY                          │
│                                                          │
│                  Add Image Here                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Output:** Previously saved diagrams with view, edit, download, and delete actions.

---

## Exported Output

Add your final exported diagram screenshot here:

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                  FINAL UML OUTPUT                        │
│                                                          │
│                  Add Image Here                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Supported Output Formats

```text
Generated Diagram
       │
       ├── 📄 PDF
       │
       ├── 🖼️ PNG
       │
       └── 🧩 SVG
```

---

# ⚙️ Installation & Setup

## Prerequisites

Install the following:

* Node.js 18+
* Python 3.10+
* npm
* Git
* Google Gemini API key

---

# 🔧 Backend Setup

Open the project terminal:

```bash
cd backend
```

### Create Virtual Environment

#### Windows

```bash
python -m venv venv
```

Activate it:

```bash
venv\Scripts\activate
```

#### macOS / Linux

```bash
python3 -m venv venv
```

Activate it:

```bash
source venv/bin/activate
```

### Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

# 🔑 Gemini API Configuration

Create:

```text
backend/.env
```

Add:

```env
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./uml_generator.db
FRONTEND_ORIGIN=http://localhost:5173
```

> Never upload your real Gemini API key to GitHub.

---

# ▶️ Start Backend

Run:

```bash
python -m uvicorn app.main:app --reload
```

Backend:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

## Backend `.env`

```env
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./uml_generator.db
FRONTEND_ORIGIN=http://localhost:5173
```

| Variable          | Purpose                        |
| ----------------- | ------------------------------ |
| `GEMINI_API_KEY`  | Google Gemini API key          |
| `DATABASE_URL`    | SQLAlchemy database connection |
| `FRONTEND_ORIGIN` | Allowed frontend CORS origin   |

## Frontend `.env`

```env
VITE_API_URL=http://localhost:8000
```

| Variable       | Purpose              |
| -------------- | -------------------- |
| `VITE_API_URL` | Backend API base URL |

---

# 🧪 Testing Checklist

The following functionality should be tested:

### Backend

* [ ] Backend starts successfully
* [ ] `/api/health` works
* [ ] `/docs` opens successfully
* [ ] Gemini API connection works
* [ ] Mermaid validation works

### Frontend

* [ ] Dashboard loads
* [ ] Create Diagram page works
* [ ] Diagram generation works
* [ ] Mermaid rendering works
* [ ] Manual editing works
* [ ] Render Diagram button works
* [ ] Save functionality works
* [ ] History loads correctly
* [ ] Edit functionality works
* [ ] Delete functionality works
* [ ] PNG download works
* [ ] SVG download works
* [ ] PDF download works

### Error Testing

* [ ] Empty input
* [ ] Missing Gemini API key
* [ ] Invalid Mermaid syntax
* [ ] Invalid diagram type
* [ ] Oversized input
* [ ] Backend unavailable
* [ ] Gemini API failure

---

# 📌 Known Limitations

* Gemini API usage is subject to API quotas and limits.
* SQLite is used as the default database for simplicity.
* Production deployment should use a production database such as PostgreSQL.
* Mermaid does not provide a dedicated UML Use Case diagram syntax, so Use Case diagrams are represented using Mermaid flowchart-style syntax.
* PDF export converts the rendered diagram before embedding it into the PDF.
* Very large diagrams may require additional optimization for PDF export.
* AI-generated diagrams may require manual editing for complex systems.

---

# 🚀 Future Scope

Future versions can include:

* Real-time collaborative editing
* Multiple diagrams inside one project
* Combined project PDF reports
* GitHub repository integration
* Automatic diagram generation from GitHub source code
* User authentication
* User-specific diagram libraries
* Version history
* Diagram comparison and diffing
* Deployment diagrams
* ER diagrams
* Cloud database support
* Improved AI-based UML validation
* Project-wide architecture visualization

---

# 🎓 Learning Outcomes

This project demonstrates practical knowledge of:

* Full-stack web development
* React development
* Vite
* Tailwind CSS
* REST API development
* FastAPI
* Python
* SQLAlchemy
* SQLite
* Generative AI
* Google Gemini API
* Prompt Engineering
* Mermaid.js
* UML modeling
* API integration
* Database management
* Error handling
* Environment variables
* Software architecture

---

# 🎯 Use Cases

The UML Diagram Generator can be used by:

* Software Engineering students
* Developers
* Project teams
* Software architects
* Students creating UML assignments
* Teams preparing project documentation
* Developers planning system architecture

---

# 🔒 Security

Basic security practices are followed:

* Gemini API key is stored in `.env`
* API key is handled only by the backend
* API key is not exposed to the frontend
* `.env` files should not be committed
* User input is validated
* Backend and frontend communicate through API endpoints

---

# 📚 Project Demonstration

### Example System

**Food Delivery System**

Input:

```text
Customers can register and login.

Customers can browse restaurants and menus.

Customers can add food to their cart.

Customers can place orders and make payments.

Restaurants can manage menus and orders.

Delivery partners can accept and deliver orders.

Administrators can manage users and restaurants.
```

The application can generate different UML diagrams from the same requirements:

```text
Food Delivery System
        │
        ├── Class Diagram
        │
        ├── Use Case Diagram
        │
        ├── Sequence Diagram
        │
        ├── Activity Diagram
        │
        ├── Component Diagram
        │
        └── State Diagram
```

---

# 📸 Output Gallery

> Replace the placeholders below with your actual screenshots.

| Dashboard        | Create Diagram   |
| ---------------- | ---------------- |
| `Add Screenshot` | `Add Screenshot` |

| Generated UML    | Mermaid Editor   |
| ---------------- | ---------------- |
| `Add Screenshot` | `Add Screenshot` |

| History          | Settings         |
| ---------------- | ---------------- |
| `Add Screenshot` | `Add Screenshot` |

---

# 👩‍💻 Author

**Prachi Ankush**

B.Tech Computer Engineering — Software Engineering

### Technologies Used

```text
React
FastAPI
Python
SQLite
Google Gemini
Mermaid.js
Tailwind CSS
Vite
```

---

# ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**UML Diagram Generator — turning requirements into diagrams with AI.**
