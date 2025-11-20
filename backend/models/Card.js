const db = require('../config/database').promisePool;

class Card {
  static async create(cardData) {
    const { game_id, user_id, goals } = cardData;
    
    const [result] = await db.execute(
      'INSERT INTO bingo_cards (game_id, user_id, goals) VALUES (?, ?, ?)',
      [game_id, user_id, JSON.stringify(goals)]
    );
    
    return result.insertId;
  }

  static async findByGameAndUser(gameId, userId) {
    const [rows] = await db.execute(
      'SELECT * FROM bingo_cards WHERE game_id = ? AND user_id = ?',
      [gameId, userId]
    );
    return rows;
  }

  static async findByGame(gameId) {
    const [rows] = await db.execute(
      'SELECT * FROM bingo_cards WHERE game_id = ?',
      [gameId]
    );
    return rows;
  }

  static async updateGoals(cardId, goals) {
    await db.execute(
      'UPDATE bingo_cards SET goals = ? WHERE id = ?',
      [JSON.stringify(goals), cardId]
    );
    
    const [rows] = await db.execute(
      'SELECT * FROM bingo_cards WHERE id = ?',
      [cardId]
    );
    return rows[0];
  }

  static async updateMarkedGoals(cardId, markedGoals) {
    // Check if card is completed (full row, column, or card)
    const isCompleted = this.checkCompletion(markedGoals);
    
    const updateData = {
      marked_goals: JSON.stringify(markedGoals)
    };
    
    if (isCompleted) {
      updateData.is_winner = true;
      updateData.completed_at = new Date();
    }
    
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(cardId);
    
    await db.execute(
      `UPDATE bingo_cards SET ${fields} WHERE id = ?`,
      values
    );
    
    const [rows] = await db.execute(
      'SELECT * FROM bingo_cards WHERE id = ?',
      [cardId]
    );
    return rows[0];
  }

  // Check if marked goals form a complete row, column, diagonal, or full card
  static checkCompletion(markedGoals) {
    if (!markedGoals || markedGoals.length === 0) return false;
    
    // Convert marked goals to a set for quick lookup
    const markedSet = new Set(markedGoals.map(g => `${g[0]},${g[1]}`));
    
    // Check rows
    for (let row = 0; row < 5; row++) {
      let rowComplete = true;
      for (let col = 0; col < 5; col++) {
        // Center cell (2,2) is free space, always considered marked
        if (row === 2 && col === 2) continue;
        if (!markedSet.has(`${row},${col}`)) {
          rowComplete = false;
          break;
        }
      }
      if (rowComplete) return true;
    }
    
    // Check columns
    for (let col = 0; col < 5; col++) {
      let colComplete = true;
      for (let row = 0; row < 5; row++) {
        if (row === 2 && col === 2) continue; // Free space
        if (!markedSet.has(`${row},${col}`)) {
          colComplete = false;
          break;
        }
      }
      if (colComplete) return true;
    }
    
    // Check main diagonal (top-left to bottom-right)
    let diag1Complete = true;
    for (let i = 0; i < 5; i++) {
      if (i === 2) continue; // Free space
      if (!markedSet.has(`${i},${i}`)) {
        diag1Complete = false;
        break;
      }
    }
    if (diag1Complete) return true;
    
    // Check other diagonal (top-right to bottom-left)
    let diag2Complete = true;
    for (let i = 0; i < 5; i++) {
      if (i === 2) continue; // Free space
      if (!markedSet.has(`${i},${4-i}`)) {
        diag2Complete = false;
        break;
      }
    }
    if (diag2Complete) return true;
    
    return false;
  }
}

module.exports = Card;

