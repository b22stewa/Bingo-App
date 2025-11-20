# MySQL Database Setup Guide

## Step 1: Install MySQL (if not already installed)

1. Download MySQL from: https://dev.mysql.com/downloads/installer/
2. Run the installer and follow the setup wizard
3. **Important**: Remember the root password you set during installation
4. Make sure MySQL service is running (check Windows Services)

## Step 2: Create the Database

### Option A: Using MySQL Command Line

1. Open Command Prompt or PowerShell
2. Navigate to MySQL bin directory (usually `C:\Program Files\MySQL\MySQL Server 8.0\bin`)
3. Or if MySQL is in your PATH, just run:
   ```bash
   mysql -u root -p
   ```
4. Enter your MySQL root password when prompted
5. Run these commands:
   ```sql
   CREATE DATABASE bingo_app;
   USE bingo_app;
   ```
6. Exit MySQL: `exit;`

### Option B: Using MySQL Workbench (GUI - Recommended)

1. Download MySQL Workbench: https://dev.mysql.com/downloads/workbench/
2. Open MySQL Workbench
3. Connect to your MySQL server (localhost, user: root, enter your password)
4. Click on "File" → "Open SQL Script"
5. Navigate to `database/schema.sql` in your project
6. Execute the script (click the lightning bolt icon or press Ctrl+Shift+Enter)
7. Or manually create the database:
   - Right-click in the left panel → "Create Schema"
   - Name it `bingo_app`
   - Click "Apply"

## Step 3: Run the Schema

### Option A: Command Line

From your project root directory:
```bash
mysql -u root -p bingo_app < database/schema.sql
```

Enter your MySQL password when prompted.

### Option B: MySQL Workbench

1. Open MySQL Workbench
2. Connect to your server
3. Select the `bingo_app` database (double-click it)
4. File → Open SQL Script → Select `database/schema.sql`
5. Execute the script (lightning bolt icon)

### Option C: Copy and Paste

1. Open `database/schema.sql` in a text editor
2. Copy all the contents
3. Open MySQL Workbench
4. Connect and select `bingo_app` database
5. Paste the SQL into a new query tab
6. Execute (lightning bolt icon)

## Step 4: Configure Backend Environment

Make sure your `backend/.env` file has the correct database credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_root_password_here
DB_NAME=bingo_app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important**: Replace `your_mysql_root_password_here` with your actual MySQL root password.

## Step 5: Test the Connection

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. If you see no database connection errors, you're all set!

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Make sure you're using the correct password
- Try resetting MySQL root password if needed

### "Can't connect to MySQL server"
- Make sure MySQL service is running:
  - Open Windows Services (services.msc)
  - Find "MySQL80" or similar
  - Make sure it's "Running"
- Check if MySQL is listening on port 3306 (default)

### "Unknown database 'bingo_app'"
- Make sure you created the database first (Step 2)
- Verify the database name in your `.env` file matches

### "Table already exists"
- The schema has `CREATE TABLE IF NOT EXISTS`, so this shouldn't happen
- If it does, you can drop and recreate:
  ```sql
  DROP DATABASE bingo_app;
  CREATE DATABASE bingo_app;
  ```
  Then run the schema again.

## Database Structure

After setup, you'll have these tables:
- **users** - User accounts
- **games** - Game rooms
- **bingo_cards** - Player bingo cards
- **game_players** - Tracks who joined which games
- **called_numbers** - Tracks called numbers during games

## Next Steps

Once your database is set up:
1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm start`
3. Open http://localhost:3000 in your browser
4. Register a new account to test!


