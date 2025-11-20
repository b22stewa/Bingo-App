const Game = require('../models/Game');
const Card = require('../models/Card');

exports.createGame = async (req, res, next) => {
  try {
    const { room_name, description, max_players } = req.body;
    const created_by = req.user.userId;

    const gameId = await Game.create({
      created_by,
      room_name: room_name || `Goal Card ${Date.now()}`,
      description: description || '',
      max_players: max_players || 1,
      status: 'active'
    });

    const game = await Game.findById(gameId);
    res.status(201).json({ message: 'Goal card created successfully', game });
  } catch (error) {
    next(error);
  }
};

exports.getGames = async (req, res, next) => {
  try {
    const { status } = req.query;
    const games = status 
      ? await Game.findByStatus(status)
      : await Game.findAll();
    
    res.json({ games });
  } catch (error) {
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

