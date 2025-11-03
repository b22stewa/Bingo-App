const db = require('../config/database').promisePool;

class Game {
  static async create(gameData) {
    const { created_by, room_name, max_players, status } = gameData;
    
    const [result] = await db.execute(
      'INSERT INTO games (created_by, room_name, max_players, status) VALUES (?, ?, ?, ?)',
      [created_by, room_name, max_players || 10, status || 'waiting']
    );
    
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM games WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findAll(limit = 50) {
    const [rows] = await db.execute(
      'SELECT * FROM games ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    return rows;
  }

  static async findByStatus(status) {
    const [rows] = await db.execute(
      'SELECT * FROM games WHERE status = ? ORDER BY created_at DESC',
      [status]
    );
    return rows;
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    await db.execute(
      `UPDATE games SET ${fields} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }
}

module.exports = Game;

