const Card = require('../models/Card');
const Game = require('../models/Game');
const db = require('../config/database').promisePool;

// Generate a random bingo card (5x5 grid with numbers 1-75)
const generateBingoCard = () => {
  const card = [];
  const usedNumbers = new Set();
  
  // B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75
  const ranges = [
    { min: 1, max: 15 },   // B
    { min: 16, max: 30 },  // I
    { min: 31, max: 45 },  // N
    { min: 46, max: 60 },  // G
    { min: 61, max: 75 }   // O
  ];

  for (let col = 0; col < 5; col++) {
    const row = [];
    const range = ranges[col];
    
    for (let i = 0; i < 5; i++) {
      let num;
      do {
        num = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      } while (usedNumbers.has(num));
      
      usedNumbers.add(num);
      row.push(num);
    }
    
    card.push(row);
  }

  // Free space in center (N column, middle row)
  card[2][2] = 0; // 0 represents free space

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

    if (game.status === 'finished') {
      return res.status(400).json({ message: 'Cannot join finished game' });
    }

    // Check if user already has a card for this game
    const existingCards = await Card.findByGameAndUser(game_id, user_id);
    if (existingCards.length > 0) {
      return res.status(400).json({ message: 'User already has a card for this game' });
    }

    // Generate bingo card
    const numbers = generateBingoCard();
    
    const cardId = await Card.create({
      game_id,
      user_id,
      numbers
    });

    const [card] = await Card.findByGameAndUser(game_id, user_id);
    res.status(201).json({ 
      message: 'Bingo card generated successfully', 
      card: {
        ...card,
        numbers: JSON.parse(card.numbers)
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
      numbers: JSON.parse(card.numbers),
      marked_numbers: card.marked_numbers ? JSON.parse(card.marked_numbers) : []
    }));

    res.json({ cards: formattedCards });
  } catch (error) {
    next(error);
  }
};

exports.markNumber = async (req, res, next) => {
  try {
    const { card_id } = req.params;
    const { number } = req.body;

    // Get card
    const [cards] = await db.execute(
      'SELECT * FROM bingo_cards WHERE id = ?',
      [card_id]
    );
    
    if (!cards || cards.length === 0) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const card = cards[0];
    if (card.user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to mark this card' });
    }

    // Update marked numbers
    let markedNumbers = card.marked_numbers ? JSON.parse(card.marked_numbers) : [];
    if (!markedNumbers.includes(number)) {
      markedNumbers.push(number);
    }

    const updatedCard = await Card.updateMarkedNumbers(card_id, markedNumbers);

    res.json({
      message: 'Number marked successfully',
      card: {
        ...updatedCard,
        numbers: JSON.parse(updatedCard.numbers),
        marked_numbers: JSON.parse(updatedCard.marked_numbers)
      }
    });
  } catch (error) {
    next(error);
  }
};

