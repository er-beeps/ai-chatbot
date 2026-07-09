# AI Chatbot

A full-stack AI chatbot platform with JWT authentication, Google OAuth, and a modern React dashboard.

## Tech Stack

**Backend**: Django 5, Django REST Framework, PostgreSQL + PostGIS, SimpleJWT, python-decouple  
**Frontend**: React 19, TypeScript, Vite, React Router 7, Framer Motion, Axios, Lucide React  
**Auth**: JWT (access + refresh tokens), Google OAuth

## Features

- JWT-based authentication with automatic token refresh
- Google OAuth login
- User registration and profile management
- Dark/light theme toggle
- Responsive sidebar layout with animated page transitions
- Dashboard with stats, quick actions, and activity feed
- Role-based user model

## Prerequisites

- Python 3.10+
- Node.js 20+
- PostgreSQL with PostGIS extension
- GDAL (for Windows: `C:\Program Files\GDAL`)

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

Create `backend/.env`:

```env
SECRET_KEY=your-secret-key
DEBUG=True
DJANGO_ENV=local
DATABASE_NAME=ai-chatbot
DATABASE_USER=postgres
DATABASE_PASSWORD=your-password
DATABASE_HOST=localhost
DATABASE_PORT=5432
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
```

```bash
python manage.py migrate
python manage.py seeddata   # creates default users/groups
python manage.py runserver
```

**Default users** (created by `seeddata`):
| Username | Password | Role |
|----------|----------|------|
| superadmin | Super@5678 | Super Admin |
| admin | Admin@1234 | Admin |
| normaluser | Admin@1234 | Normal User |

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

```bash
npm run dev
```

## Environment Switching

Set `DJANGO_ENV` to switch settings:
- `local` (default) — debug on, console email backend
- `production` — debug off, HTTPS security enabled

## Project Structure

```
backend/
├── coreapp/                  # Django project config
│   ├── settings/             # base, local, production
│   ├── urls.py               # API routing
│   └── wsgi.py / asgi.py
├── authentication/           # Auth app (users, JWT, OAuth)
│   ├── models.py             # User, ActivityLogs
│   ├── views_auth_api.py     # REST API endpoints
│   ├── serializers.py
│   └── urls.py
├── manage.py
└── requirements.txt

frontend/
├── src/
│   ├── App.tsx               # Routes
│   ├── main.tsx              # Entry point
│   ├── components/
│   │   ├── layout/           # AdminLayout, SidebarNav, TopBar
│   │   ├── routing/          # ProtectedRoute
│   │   └── ui/               # Icon, PageMotion, AuthShell, etc.
│   ├── features/
│   │   ├── auth/pages/       # LoginPage, RegisterPage
│   │   ├── dashboard/pages/  # DashboardPage
│   │   └── account/pages/    # ProfilePage, ChangePasswordPage
│   ├── contexts/             # AuthContext
│   ├── hooks/                # useAuth
│   ├── services/api/         # Axios client + auth API
│   ├── types/                # TypeScript types
│   ├── styles/global.css     # Design system with dark/light theme
│   └── utils/                # tokenStorage
└── index.html
```

## API Endpoints

All routes are prefixed with `/api/auth/`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API home |
| `/login/` | POST | Login, returns JWT tokens |
| `/register/` | POST | Register new user |
| `/password-change/` | POST | Change password (auth required) |
| `/logout/` | POST | Logout (auth required) |
| `/user/` | GET | Get current user profile (auth required) |
| `/token/` | POST | Obtain JWT token pair |
| `/token/refresh/` | POST | Refresh JWT access token |
| `/google/` | POST | Google OAuth login |

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | Debug mode (True/False) |
| `DJANGO_ENV` | Settings profile: `local` or `production` |
| `DATABASE_NAME` | PostgreSQL database name |
| `DATABASE_USER` | Database user |
| `DATABASE_PASSWORD` | Database password |
| `DATABASE_HOST` | Database host |
| `DATABASE_PORT` | Database port |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | Google OAuth redirect URI |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://127.0.0.1:8000/api` |
| `VITE_LOGIN_ENDPOINT` | Login endpoint | `/auth/login/` |
| `VITE_REGISTER_ENDPOINT` | Register endpoint | `/auth/register/` |
| `VITE_PROFILE_ENDPOINT` | Profile endpoint | `/auth/user/` |
| `VITE_LOGOUT_ENDPOINT` | Logout endpoint | `/auth/logout/` |
| `VITE_PASSWORD_CHANGE_ENDPOINT` | Password change endpoint | `/auth/password-change/` |
| `VITE_REFRESH_ENDPOINT` | Token refresh endpoint | `/auth/token/refresh/` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | — |

## Scripts

| Script | Description |
|--------|-------------|
| `python manage.py seeddata` | Seed default users and groups |
| `python manage.py sync_permissions` | Sync model permissions to groups |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
