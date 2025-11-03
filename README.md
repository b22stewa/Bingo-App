# Bingo App

A full-stack bingo application built with React frontend, Node.js + Express backend, and MySQL database.

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

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=bingo_app
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Run database migrations (instructions in database/README.md)

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Technologies

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, MySQL2, JWT
- **Database**: MySQL

## License

MIT

