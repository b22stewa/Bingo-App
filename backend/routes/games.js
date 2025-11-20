const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticateToken } = require('../middleware/auth');

// All game routes require authentication
router.use(authenticateToken);

router.post('/', gameController.createGame);
router.get('/', gameController.getGames);
router.get('/:id', gameController.getGame);
router.put('/:id', gameController.updateGame);
router.post('/:id/complete', gameController.completeGame);

module.exports = router;

