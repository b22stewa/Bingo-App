# Migration Guide: Converting from Number Bingo to Goal Tracking

This guide explains how to update your existing database to support goal tracking instead of number-based bingo.

## Option 1: Fresh Start (Recommended for Development)

If you're just starting or don't have important data:

1. Drop the existing database:
   ```sql
   DROP DATABASE bingo_app;
   CREATE DATABASE bingo_app;
   ```

2. Run the new schema:
   ```bash
   mysql -u root -p bingo_app < database/schema_goals.sql
   ```

## Option 2: Migrate Existing Database

If you have existing data you want to keep:

### Step 1: Backup Your Database
```bash
mysqldump -u root -p bingo_app > backup.sql
```

### Step 2: Update the Schema

Run these SQL commands:

```sql
USE bingo_app;

-- Rename the numbers column to goals
ALTER TABLE bingo_cards 
  CHANGE COLUMN numbers goals JSON NOT NULL COMMENT '2D array of goal text [5x5]';

-- Rename marked_numbers to marked_goals
ALTER TABLE bingo_cards 
  CHANGE COLUMN marked_numbers marked_goals JSON DEFAULT '[]' COMMENT 'Array of completed goal positions as [row, col] pairs';

-- Update games table status enum
ALTER TABLE games 
  MODIFY COLUMN status ENUM('active', 'completed', 'archived') DEFAULT 'active';

-- Remove current_number column (not needed for goals)
ALTER TABLE games 
  DROP COLUMN current_number;

-- Add description column to games
ALTER TABLE games 
  ADD COLUMN description TEXT NULL COMMENT 'Description of the goal card set' AFTER room_name;

-- Drop called_numbers table (not needed for goal tracking)
DROP TABLE IF EXISTS called_numbers;

-- Update existing data: Convert number arrays to empty goal arrays
-- This will create empty goal cards that users can fill in
UPDATE bingo_cards 
SET goals = JSON_ARRAY(
  JSON_ARRAY('', '', '', '', ''),
  JSON_ARRAY('', '', '', '', ''),
  JSON_ARRAY('', '', 'FREE', '', ''),
  JSON_ARRAY('', '', '', '', ''),
  JSON_ARRAY('', '', '', '', '')
);

-- Clear marked numbers (convert to empty array)
UPDATE bingo_cards 
SET marked_goals = JSON_ARRAY();

-- Update game statuses
UPDATE games 
SET status = 'active' 
WHERE status = 'waiting';

UPDATE games 
SET status = 'completed' 
WHERE status = 'finished';
```

### Step 3: Verify Migration

```sql
-- Check the structure
DESCRIBE bingo_cards;
DESCRIBE games;

-- Verify data
SELECT id, JSON_PRETTY(goals), JSON_PRETTY(marked_goals) FROM bingo_cards LIMIT 1;
```

## What Changed

1. **bingo_cards.numbers** → **bingo_cards.goals**: Now stores goal text instead of numbers
2. **bingo_cards.marked_numbers** → **bingo_cards.marked_goals**: Now stores [row, col] positions instead of numbers
3. **games.status**: Changed from `('waiting', 'active', 'finished')` to `('active', 'completed', 'archived')`
4. **games.current_number**: Removed (not needed)
5. **games.description**: Added (optional description field)
6. **called_numbers table**: Removed (not needed for goal tracking)

## Notes

- All existing cards will be converted to empty goal cards
- Users will need to re-enter their goals
- Game statuses will be automatically converted
- The free space (center cell) is automatically set to 'FREE'


