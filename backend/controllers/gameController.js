const Game = require('../models/Game');
const Card = require('../models/Card');

exports.createGame = async (req, res, next) => {
  try {
    const { room_name, description, max_players } = req.body;
    const created_by = req.user.userId;

    const gameId = await Game.create({
      created_by,
      room_name: room_name || `Goal Card ${Date.now()}`,
      description: description || null,
      max_players: max_players || 1,
      status: 'active'
    });

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(500).json({ message: 'Failed to retrieve created game' });
    }
    
    res.status(201).json({ message: 'Goal card created successfully', game });
  } catch (error) {
    console.error('Error creating game:', error);
    next(error);
  }
};

exports.getGames = async (req, res, next) => {
  try {
    const { status } = req.query;
    const userId = req.user.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }
    
    let games;
    if (status) {
      games = await Game.findByStatus(status);
      // Filter by user if status is provided
      // Convert both to numbers for comparison
      games = games.filter(game => parseInt(game.created_by, 10) === parseInt(userId, 10));
    } else {
      games = await Game.findAll(userId);
    }
    
    res.json({ games: games || [] });
  } catch (error) {
    console.error('Error fetching games:', error);
    console.error('User ID:', req.user.userId);
    console.error('Error stack:', error.stack);
    next(error);
  }
};

exports.getGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json({ game });
  } catch (error) {
    next(error);
  }
};

exports.updateGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const game = await Game.update(id, updates);
    res.json({ message: 'Game updated successfully', game });
  } catch (error) {
    next(error);
  }
};

exports.completeGame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.created_by !== req.user.userId) {
      return res.status(403).json({ message: 'Only card creator can mark it as complete' });
    }

    const updatedGame = await Game.update(id, { status: 'completed', finished_at: new Date() });
    res.json({ message: 'Goal card marked as completed', game: updatedGame });
  } catch (error) {
    next(error);
  }
};

