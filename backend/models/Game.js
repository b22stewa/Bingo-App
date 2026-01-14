const db = require('../config/database');

class Game {
  static async create(gameData) {
    const { created_by, room_name, description, max_players, status } = gameData;
    
    const result = await db.query(
      'INSERT INTO games (created_by, room_name, description, max_players, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [created_by, room_name, description || null, max_players || 1, status || 'active']
    );
    
    return result.rows[0].id;
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM games WHERE id = $1',
      [id]
    );
    return result.rows[0];
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
        query = 'SELECT * FROM games WHERE created_by = $1 ORDER BY created_at DESC LIMIT $2';
        params = [userIdNum, limitNum];
      } else {
        query = 'SELECT * FROM games ORDER BY created_at DESC LIMIT $1';
        params = [limitNum];
      }
      
      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error in findAll:', error);
      console.error('UserId provided:', userId);
      throw error;
    }
  }

  static async findByStatus(status) {
    const result = await db.query(
      'SELECT * FROM games WHERE status = $1 ORDER BY created_at DESC',
      [status]
    );
    return result.rows;
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = Object.values(updates);
    values.push(id);

    await db.query(
      `UPDATE games SET ${fields} WHERE id = $${values.length}`,
      values
    );
    
    return this.findById(id);
  }
}

module.exports = Game;

