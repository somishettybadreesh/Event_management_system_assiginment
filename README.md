# Event Management System

## Setup and Run

### Backend

1. Create and activate Python environment
2. Install requirements: `pip install -r requirements.txt`
3. Setup PostgreSQL and update `.env`
4. Run backend:  
   `uvicorn app.main:app --reload`

### Frontend

1. Navigate to frontend directory
2. Install dependencies: `npm install`
3. Run frontend server: `npm run dev`

Access frontend at http://localhost:3000
Backend API at http://localhost:8000

## Features

- Signup, login with role-based access (admin and normal users)
- Admin CRUD on events
- Normal user event browsing
- Responsive UI via Tailwind CSS
