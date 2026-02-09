# LyFind - Lost & Found Platform

A full-stack application with Node.js/Express backend and Vite React frontend.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

This will start the frontend at http://localhost:3000

### Run Backend Server (in separate terminal)

```bash
npm run server
```

This will start the backend at http://localhost:3001

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- TailwindCSS
- Radix UI Components

### Backend
- Node.js
- Express
- TypeScript
- CORS

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create new item
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/profile` - Get user profile
- `GET /api/messages` - Get messages
