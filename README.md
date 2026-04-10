# TaskFlow

A full-stack task management web application with Kanban and list views, user-defined phases, subtasks, a calendar, and an admin panel.

---

## Project Description

TaskFlow lets authenticated users organize their work through a customizable phase-based workflow. Tasks can be viewed as a Kanban board (drag-and-drop between phases) or a filterable/sortable list. Each task supports subtasks, priority levels, and due dates. A built-in calendar shows tasks by due date. Administrators can view and remove any user or task across the system. Unauthenticated visitors can browse the app in a read-only guest mode.

---

## System Architecture Overview

TaskFlow follows a **layered architecture** on both sides of the stack.

### Backend (Django REST Framework)

```
Presentation   views.py        HTTP handling, permission enforcement, calling services
Business Logic services.py     Domain operations (phase creation, password management)
Serialization  serializers.py  Data shape & field-level validation, request-agnostic
Persistence    models.py       ORM models (Phase, Task, Subtask)
Cross-cutting  permissions.py  Reusable object-level permission (IsOwner)
```

The frontend communicates with the backend exclusively through a REST API at `/api/`. Authentication uses short-lived JWT access tokens (30 min) with rotating refresh tokens (1 day), backed by a token blacklist on logout.

### Frontend (React + Vite)

```
Presentation   views/, components/   Page-level views and reusable UI components
Business Logic hooks/                Custom hooks (useTasks, usePhases, useSubtasks, …)
Data Access    services/api.js       All HTTP calls via Axios with Bearer token injection
State          context/AuthContext   JWT-backed auth state shared across the app
Utilities      utils/                Pure helper functions (task filtering/sorting)
```

### Data Model

```
User  ──< Phase ──< Task ──< Subtask
```

- A user owns many phases and many tasks.
- Each task belongs to one phase (nullable).
- Each task has many subtasks.

---

## User Roles & Permissions

| Role | Access |
|---|---|
| **Guest** (unauthenticated) | Read-only view of the app at `/guest` and `/how-to-use` |
| **Regular User** | Full CRUD on their own tasks, subtasks, and phases; profile & password management |
| **Admin** (`is_staff = True`) | All regular-user access plus the admin panel: view/delete any user or task system-wide |

Object-level ownership is enforced server-side via the `IsOwner` permission class — users cannot read or modify each other's data.

---

## Technology Stack

### Backend
| | |
|---|---|
| Language | Python 3.14 |
| Framework | Django 4.2 + Django REST Framework 3.14 |
| Auth | `djangorestframework-simplejwt` 5.3 (JWT + token blacklist) |
| CORS | `django-cors-headers` 4.3 |
| Config | `python-decouple` (`.env` file) |
| Database | SQLite (development) |

### Frontend
| | |
|---|---|
| Language | JavaScript (ES Modules) |
| Framework | React 18 |
| Bundler | Vite 5 |
| Routing | React Router v6 |
| HTTP | Axios |
| Drag & Drop | `@dnd-kit` |
| Styling | Tailwind CSS 3 |
| Notifications | React Toastify |

---

## Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend

```bash
cd taskflow_backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create the environment file
cp .env.example .env            # or create .env manually (see below)

# Apply migrations
python manage.py migrate

# (Optional) create a superuser for the admin panel
python manage.py createsuperuser
```

**.env** (minimum required keys):

```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend

```bash
cd taskflow_frontend

# Install dependencies
npm install
```

---

## How to Run the System

### 1. Start the backend

```bash
cd taskflow_backend
source venv/bin/activate        # Windows: venv\Scripts\activate
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`.

### 2. Start the frontend

```bash
cd taskflow_frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

### API base URL

The frontend reads `VITE_API_BASE_URL` from environment variables and falls back to `http://localhost:8000`. To override, create `taskflow_frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:8000
```

---

## Screenshots

### Login
![Login](assets/Screenshot%202569-04-10%20at%2022.15.28.png)

### Guest View (Demo Kanban)
![Guest View](assets/Screenshot%202569-04-10%20at%2022.15.45.png)

### How to Use
![How to Use](assets/Screenshot%202569-04-10%20at%2022.15.56.png)

### Dashboard — Kanban View
![Kanban View](assets/Screenshot%202569-04-10%20at%2022.17.17.png)

### Dashboard — List View
![List View](assets/Screenshot%202569-04-10%20at%2022.17.30.png)

### Manage Phases
![Manage Phases](assets/Screenshot%202569-04-10%20at%2022.17.43.png)

