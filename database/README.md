# Database Setup

This directory contains the database schema and migration files for the Bingo App.

## Setup Instructions

### 1. Create MySQL Database

First, create the database in MySQL:

```sql
CREATE DATABASE bingo_app;
```

### 2. Run Schema

Execute the schema file to create all tables:

```bash
mysql -u your_username -p bingo_app < schema.sql
```

Or if you're using MySQL Workbench or another GUI tool, open `schema.sql` and execute it.

### 3. Update Backend Configuration

Make sure your `.env` file in the `backend` directory has the correct database credentials:

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=bingo_app
```

## Database Structure

### Tables

1. **users** - Stores user accounts (username, email, password)
2. **games** - Stores game rooms and their status
3. **bingo_cards** - Stores individual bingo cards for players
4. **game_players** - Tracks which users joined which games
5. **called_numbers** - Tracks numbers that have been called during games

### Relationships

- Each game is created by a user (created_by -> users.id)
- Each bingo card belongs to a game and a user
- Game players track who joined which games
- Called numbers track which numbers were called in each game

## Notes

- The schema uses JSON columns for storing bingo card numbers (MySQL 5.7+ required)
- Foreign keys ensure referential integrity
- Indexes are added for performance on frequently queried columns
- All timestamps use MySQL's TIMESTAMP type with automatic updates

