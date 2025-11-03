# Setting Up Remote Access for Your Bingo App

This guide will help you share your project across multiple devices using Git and GitHub/GitLab.

## Step 1: Initialize Git Repository (if not done)

```bash
git init
```

## Step 2: Create Remote Repository

### Option A: GitHub (Recommended)

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `bingo-app` (or any name you prefer)
4. **Don't** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Option B: GitLab

1. Go to [GitLab](https://gitlab.com) and sign in
2. Click "New project" → "Create blank project"
3. Name it and click "Create project"

## Step 3: Add and Commit Your Files

```bash
# Add all files
git add .

# Make your first commit
git commit -m "Initial commit: Bingo app with React frontend and Express backend"

# Optional: Check what will be committed
git status
```

## Step 4: Connect to Remote Repository

After creating the repository, GitHub/GitLab will show you commands. Use these:

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/bingo-app.git

# Or if using SSH:
git remote add origin git@github.com:YOUR_USERNAME/bingo-app.git

# Push your code
git branch -M main
git push -u origin main
```

## Step 5: Access on Other Devices

On your other device:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/bingo-app.git

# Navigate into the project
cd bingo-app

# Install dependencies
npm run install-all

# Set up environment files (see below)
```

## Important: Environment Files Setup

⚠️ **Environment files are NOT tracked by git** (for security). You'll need to recreate them on each device:

### On Backend Device:
Create `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bingo_app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### On Frontend Device:
Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Alternative: Using USB Drive or Cloud Storage

If you prefer not to use Git:

1. **USB Drive**: Copy the entire project folder (excluding `node_modules` folders)
2. **Cloud Storage** (Dropbox, Google Drive, OneDrive): Upload project folder
3. **Note**: You'll still need to run `npm install` on the new device

## Syncing Changes Between Devices

Once set up with Git:

```bash
# On device 1 (after making changes):
git add .
git commit -m "Description of changes"
git push

# On device 2 (to get latest changes):
git pull
```

## Troubleshooting

### If you get authentication errors:
- Use GitHub Desktop app (easier for beginners)
- Or set up SSH keys for authentication
- Or use a Personal Access Token

### If you can't push:
- Make sure you've committed your changes first
- Check that the remote URL is correct: `git remote -v`

