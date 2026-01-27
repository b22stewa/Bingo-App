const db = require('../config/database'); // MySQL pool (mysql2/promise)

class Game {
  static async create(gameData) {
    const { created_by, room_name, description, max_players, status } = gameData;
    
    const [result] = await db.query(
      'INSERT INTO games (created_by, room_name, description, max_players, status) VALUES (?, ?, ?, ?, ?)',
      [created_by, room_name, description || null, max_players || 1, status || 'active']
    );
    
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM games WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findAll(userId = null, limit = 50) {
    // PostgreSQL supports parameterized LIMIT
    const limitNum = Math.max(1, Math.min(parseInt(limit, 10) || 50, 1000)); // Clamp between 1 and 1000
    
    try {
      let query;
      let params;
      
      if (userId) {
        const userIdNum = parseInt(userId, 10);
        if (isNaN(userIdNum)) {
          throw new Error('Invalid user ID');
        }
        query = 'SELECT * FROM games WHERE created_by = ? ORDER BY created_at DESC LIMIT ?';
        params = [userIdNum, limitNum];
      } else {
        query = 'SELECT * FROM games ORDER BY created_at DESC LIMIT ?';
        params = [limitNum];
      }
      
      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error in findAll:', error);
      console.error('UserId provided:', userId);
      throw error;
    }
  }

  static async findByStatus(status) {
    const [rows] = await db.query(
      'SELECT * FROM games WHERE status = ? ORDER BY created_at DESC',
      [status]
    );
    return rows;
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    await db.query(
      `UPDATE games SET ${fields} WHERE id = ?`,
      values
    );
    
    return this.findById(id);
  }
}

module.exports = Game;

