# Digital Health Atlas

A full-stack web application for managing master data in a healthcare system.

## Tech Stack

### Backend
- **Framework**: Django 6.0
- **API**: Django REST Framework
- **Database**: PostgreSQL
- **Admin Theme**: Django Unfold
- **Other**: django-cors-headers, django-filter, django-select2

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Language**: TypeScript

## Project Structure

```
digital_health/
├── digital_health/          # Django project settings
│   ├── settings/            # Environment-specific settings
│   ├── urls.py              # Root URL configuration
│   ├── asgi.py
│   └── wsgi.py
├── authentication/          # User authentication app
├── master/                  # Master data management app
│   ├── models.py            # Data models (Countries, Provinces, Districts, etc.)
│   ├── admin.py             # Django admin configuration
│   ├── urls.py              # App URL routes
│   ├── crud/                # Create/Update API logic
│   ├── seed/                # Database seeding scripts
│   ├── templates/           # Django templates
│   └── templatetags/        # Custom template tags
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/        # Feature-based modules
│   │   │   ├── master/      # Master data pages & components
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── account/     # Account management
│   │   │   └── dashboard/   # Dashboard
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── styles/          # CSS styles
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   └── package.json
├── manage.py                # Django management script
├── requirements.txt         # Python dependencies
└── venv/                   # Virtual environment (not tracked)
```

## Features

- **Master Data Management**: CRUD operations for Countries, Provinces, Districts, Local Levels, Nepali Months, Genders, Fiscal Years, Years
- **User Authentication**: Login, Registration, Profile Management, Password Change
- **Dashboard**: Overview and navigation
- **Data Tables**: Searchable, paginated tables with edit/delete actions
- **Responsive Design**: Modern UI with dark/light theme support

## Installation & Setup

### Backend

1. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # OR
   venv\Scripts\activate    # Windows
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables (edit `.env` file):
   ```env
   DEBUG=True
   SECRECT_KEY=your-secret-key
   DATABASE_NAME=your_db_name
   DATABASE_USER=your_db_user
   DATABASE_PASSWORD=your_db_password
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

6. Seed initial data (optional):
   ```bash
   python manage.py seed
   ```

7. Start development server:
   ```bash
   python manage.py runserver
   ```

### Frontend

1. Navigate to frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Configure API base URL in `src/services/api/axios.ts` if needed

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile
- `POST /api/auth/change-password/` - Change password

### Master Data
- `GET /api/master/<resource>/` - List all records
- `POST /api/master/<resource>/` - Create new record
- `GET /api/master/<resource>/<id>/` - Get single record
- `PUT /api/master/<resource>/<id>/` - Update record
- `DELETE /api/master/<resource>/<id>/` - Delete record

Available resources: countries, provinces, districts, local-levels, nepali-months, genders, fiscal-years, years

## Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| DEBUG | Set to True for development |
| SECRET_KEY | Django secret key |
| DATABASE_NAME | PostgreSQL database name |
| DATABASE_USER | Database username |
| DATABASE_PASSWORD | Database password |
| DATABASE_HOST | Database host (default: localhost) |
| DATABASE_PORT | Database port (default: 5432) |
| ALLOWED_HOSTS | Comma-separated allowed hosts |
| CORS_ALLOWED_ORIGINS | Frontend URL for CORS |

## Development

### Running Tests
```bash
# Backend
python manage.py test

# Frontend
cd frontend
npm test
```

### Code Style
- Backend: Follows Django conventions
- Frontend: ESLint/Prettier (if configured)

## License

This project is for internal use.