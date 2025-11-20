# Goal Tracking Bingo App - Features

Your bingo app has been successfully converted from a number-based bingo game to a **goal-tracking bingo app**!

## What Changed

### Core Functionality
- **Before**: Random numbers (1-75) on bingo cards, players mark numbers when called
- **After**: Custom goals/tasks on bingo cards, users mark goals as they complete them

### Key Features

1. **Create Goal Cards**
   - Each user can create multiple goal cards (e.g., "Weekly Goals", "Fitness Challenge", "Reading List")
   - Cards are personal to each user

2. **Add & Edit Goals**
   - Click any cell (except the free space) to add or edit a goal
   - Goals can be any text (e.g., "Exercise 30 min", "Read a book", "Call mom")
   - Use Ctrl+Enter to save, Esc to cancel

3. **Mark Goals Complete**
   - Click a cell with a goal to mark it as complete
   - Click again to unmark it
   - Completed goals show a checkmark and green background

4. **Win Conditions**
   - Complete a full row, column, or diagonal to win
   - Center cell is always "FREE" (automatically marked)
   - When you win, a celebration banner appears!

5. **Track Progress**
   - See all your goal cards on the dashboard
   - View status (active, completed, archived)
   - Open any card to continue working on your goals

## How to Use

1. **Create a Goal Card**
   - Go to Dashboard
   - Enter a name for your goal card (e.g., "January Goals")
   - Click "Create Goal Card"

2. **Add Your Goals**
   - Click on any empty cell
   - Type your goal (e.g., "Go for a run", "Finish project")
   - Press Ctrl+Enter or click Save

3. **Mark Goals Complete**
   - Click on a cell that has a goal
   - It will be marked as complete (green with checkmark)
   - Click again to unmark if needed

4. **Win!**
   - Complete a row, column, or diagonal
   - You'll see a celebration banner when you win!

## Database Migration

If you have an existing database, see `database/MIGRATION_TO_GOALS.md` for migration instructions.

For a fresh start, use the new schema:
```bash
mysql -u root -p bingo_app < database/schema_goals.sql
```

## API Changes

### New Endpoints
- `PUT /api/cards/:card_id/goal` - Update goal text at a specific position
- `POST /api/cards/:card_id/mark` - Mark/unmark a goal (now uses row/col instead of number)

### Updated Endpoints
- `POST /api/cards/generate` - Creates empty goal card instead of random numbers
- `GET /api/cards/game/:game_id` - Returns goals array instead of numbers array

## Example Goals

Here are some ideas for goals you can track:

**Fitness Goals:**
- "Run 5K"
- "Do 50 push-ups"
- "Yoga session"
- "10,000 steps"

**Personal Development:**
- "Read 1 chapter"
- "Learn new skill"
- "Meditate 10 min"
- "Write in journal"

**Social Goals:**
- "Call a friend"
- "Plan date night"
- "Family dinner"
- "Send thank you note"

**Work Goals:**
- "Finish project"
- "Update resume"
- "Network event"
- "Learn new tool"

Have fun tracking your goals! 🎯


