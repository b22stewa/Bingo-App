# Bingo App

A full-stack, in-progress multiplayer Bingo application designed for company events,
built to explore full-stack architecture, relational data modeling, and API-driven
game logic.

## Overview
This project demonstrates end-to-end development of a web application, including
frontend UI, backend API design, authentication, and database integration. The focus
is on scalable game logic, secure user management, and clean data flow between
systems.

## Tech Stack
- Frontend: React, React Router, Axios
- Backend: Node.js, Express
- Database: MySQL (MySQL2)
- Authentication: JWT
- Tooling: Git, GitHub

## Features (Current / Planned)
- User authentication and authorization
- Bingo card generation and validation
- Database-backed game state management
- RESTful API design
- Planned real-time gameplay features

## Project Status
This project is actively under development. The repository reflects ongoing work,
iterative design decisions, and feature experimentation rather than a finalized
production application.

## Project Structure
```
Bingo App/
├── backend/          # Node.js + Express API server
├── frontend/         # React application
├── database/         # Database schema and migrations
└── README.md         # This file
```
## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Backend Setup
Navigate to the backend directory:
```
cd backend
```
Install dependencies:
```
npm install
```
Create a `.env` file in the backend directory:
```
PORT=5000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=bingo_app
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```
Run database migrations (see database/README.md)

Start the server:
```
npm run dev
```
### Frontend Setup
Navigate to the frontend directory:
```
cd frontend
```
Install dependencies:
```
npm install
```
Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```
Start the development server:
```
npm start
```
