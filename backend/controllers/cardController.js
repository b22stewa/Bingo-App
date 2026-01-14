const Card = require('../models/Card');
const Game = require('../models/Game');
const db = require('../config/database'); // pg Pool instance

// Helper function to safely parse JSON (handles both string and object)
// PostgreSQL JSON columns can return data as strings or already-parsed objects
const parseJSON = (data) => {
  if (!data) return null;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('JSON parse error:', e, 'Data:', data);
      return null;
    }
  }
  return data; // Already an object
};

// Generate an empty goal card (5x5 grid with empty strings for goals)
const generateGoalCard = () => {
  const card = [];
  
  for (let row = 0; row < 5; row++) {
    const cardRow = [];
    for (let col = 0; col < 5; col++) {
      // Center cell is free space
      if (row === 2 && col === 2) {
        cardRow.push('FREE');
      } else {
        cardRow.push(''); // Empty string - user will fill in their goals
      }
    }
    card.push(cardRow);
  }

  return card;
};

exports.generateCard = async (req, res, next) => {
  try {
    const { game_id } = req.body;
    const user_id = req.user.userId;

    // Check if game exists and is valid
    const game = await Game.findById(game_id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.status === 'completed') {
      return res.status(400).json({ message: 'Cannot create card for completed game' });
    }

    // Check if user already has a card for this game
    const existingCards = await Card.findByGameAndUser(game_id, user_id);
    if (existingCards.length > 0) {
      return res.status(400).json({ message: 'User already has a card for this game' });
    }

    // Generate empty goal card
    const goals = generateGoalCard();
    
    const cardId = await Card.create({
      game_id,
      user_id,
      goals
    });

    const [card] = await Card.findByGameAndUser(game_id, user_id);
    
    res.status(201).json({ 
      message: 'Goal card created successfully', 
      card: {
        ...card,
        goals: parseJSON(card.goals) || [],
        marked_goals: parseJSON(card.marked_goals) || []
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCards = async (req, res, next) => {
  try {
    const { game_id } = req.params;
    const user_id = req.user.userId;

    const cards = await Card.findByGameAndUser(game_id, user_id);
    
    const formattedCards = cards.map(card => ({
      ...card,
      goals: parseJSON(card.goals) || [],
      marked_goals: parseJSON(card.marked_goals) || []
    }));

    res.json({ cards: formattedCards });
  } catch (error) {
    console.error('Error fetching cards:', error);
    next(error);
  }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const { card_id } = req.params;
    const { row, col, goal } = req.body;

    // Get card
    const result = await db.query(
      'SELECT * FROM bingo_cards WHERE id = $1',
      [card_id]
    );
    
    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const card = result.rows[0];
    if (card.user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this card' });
    }

    // Validate row and col
    if (row < 0 || row >= 5 || col < 0 || col >= 5) {
      return res.status(400).json({ message: 'Invalid cell position' });
    }

    // Update goal text
    let goals = parseJSON(card.goals) || [];
    if (!Array.isArray(goals) || goals.length !== 5) {
      // If goals is malformed, create a new empty card structure
      goals = Array(5).fill(null).map(() => Array(5).fill(''));
      goals[2][2] = 'FREE';
    }
    goals[row][col] = goal || '';
    
    const updatedCard = await Card.updateGoals(card_id, goals);

    res.json({
      message: 'Goal updated successfully',
      card: {
        ...updatedCard,
        goals: parseJSON(updatedCard.goals) || [],
        marked_goals: parseJSON(updatedCard.marked_goals) || []
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.markGoal = async (req, res, next) => {
  try {
    const { card_id } = req.params;
    const { row, col } = req.body;

    // Get card
    const result = await db.query(
      'SELECT * FROM bingo_cards WHERE id = $1',
      [card_id]
    );
    
    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const card = result.rows[0];
    if (card.user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to mark this card' });
    }

    // Validate row and col
    if (row < 0 || row >= 5 || col < 0 || col >= 5) {
      return res.status(400).json({ message: 'Invalid cell position' });
    }

    // Can't mark free space
    if (row === 2 && col === 2) {
      return res.status(400).json({ message: 'Cannot mark free space' });
    }

    // Update marked goals
    let markedGoals = parseJSON(card.marked_goals) || [];
    if (!Array.isArray(markedGoals)) {
      markedGoals = [];
    }
    
    const goalKey = `${row},${col}`;
    const goalIndex = markedGoals.findIndex(g => Array.isArray(g) && `${g[0]},${g[1]}` === goalKey);
    
    // Toggle: if already marked, unmark it; otherwise mark it
    if (goalIndex >= 0) {
      markedGoals.splice(goalIndex, 1);
    } else {
      markedGoals.push([row, col]);
    }

    const updatedCard = await Card.updateMarkedGoals(card_id, markedGoals);
    const wasMarked = markedGoals.some(g => Array.isArray(g) && `${g[0]},${g[1]}` === goalKey);

    res.json({
      message: wasMarked ? 'Goal marked as complete' : 'Goal unmarked',
      card: {
        ...updatedCard,
        goals: parseJSON(updatedCard.goals) || [],
        marked_goals: parseJSON(updatedCard.marked_goals) || []
      }
    });
  } catch (error) {
    next(error);
  }
};

