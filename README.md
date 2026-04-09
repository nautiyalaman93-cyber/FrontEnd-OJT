# BharatPath 🚂

A full-stack Indian Railway companion app for live tracking, PNR status, seat exchange, and SOS emergency alerts.

## Project Structure

```
BharatPath/
├── frontend/   ← React + Vite (UI)
└── backend/    ← Node.js + Express + MongoDB (API)
```

---

## Running the Project

### 1. Start the Backend
```bash
cd backend
npm install      # only first time
npm run dev      # runs on http://localhost:5000
```

### 2. Start the Frontend
```bash
cd frontend
npm install      # only first time
npm run dev      # runs on http://localhost:5173
```

---

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, React Router v7
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Google OAuth
- **External API**: RapidAPI (IRCTC data)

## Environment Setup
Copy `backend/.env.example` to `backend/.env` and fill in your values.
