const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const { authenticateToken } = require('../middleware/auth');

// All card routes require authentication
router.use(authenticateToken);

router.post('/generate', cardController.generateCard);
router.get('/game/:game_id', cardController.getCards);
router.put('/:card_id/goal', cardController.updateGoal); // Update goal text
router.post('/:card_id/mark', cardController.markGoal); // Mark/unmark goal as complete

module.exports = router;

