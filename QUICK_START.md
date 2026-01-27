# Quick Start Guide - Run Your Bingo App

## Prerequisites
1. **Node.js** must be installed (includes npm)
   - Download from: https://nodejs.org/
   - Choose LTS version
   - Verify installation: Open terminal and run `node --version` and `npm --version`

## Step 1: Install Dependencies

Open a terminal/PowerShell in the project directory and run:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

**OR use the shortcut script:**
```bash
npm run install-all
```

## Step 2: Create Environment Files

### Backend Environment File
Create `backend/.env` file with this content:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=bingo_app
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

### Frontend Environment File
Create `frontend/.env` file with this content:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 3: Set Up Database (Optional for Testing)

If you want full functionality:
1. Install MySQL if not already installed
2. Create database:
   ```sql
   CREATE DATABASE bingo_app;
   ```
3. Run the schema:
   ```bash
   mysql -u root -p bingo_app < database/schema.sql
   ```

**Note:** You can still see the frontend without the database, but registration/login won't work.

## Step 4: Run the App

### Option A: Run Both Servers Together (Recommended)
```bash
npm run dev
```

### Option B: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Step 5: Open in Browser

Once both servers are running:
- **Frontend**: http://localhost:3000 (opens automatically)
- **Backend API**: http://localhost:5000

## Troubleshooting

### "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### Port Already in Use
- If port 5000 or 3000 is busy, stop the process using it
- Or change PORT in backend/.env

### Database Connection Error
- Make sure MySQL is running
- Check your DB credentials in backend/.env
- Or skip database setup to just view the frontend










