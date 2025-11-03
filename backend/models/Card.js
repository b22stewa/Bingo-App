const db = require('../config/database').promisePool;

class Card {
  static async create(cardData) {
    const { game_id, user_id, numbers } = cardData;
    
    const [result] = await db.execute(
      'INSERT INTO bingo_cards (game_id, user_id, numbers) VALUES (?, ?, ?)',
      [game_id, user_id, JSON.stringify(numbers)]
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

  static async updateMarkedNumbers(cardId, markedNumbers) {
    await db.execute(
      'UPDATE bingo_cards SET marked_numbers = ? WHERE id = ?',
      [JSON.stringify(markedNumbers), cardId]
    );
    
    const [rows] = await db.execute(
      'SELECT * FROM bingo_cards WHERE id = ?',
      [cardId]
    );
    return rows[0];
  }
}

module.exports = Card;

