const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const verifyToken = require('../middleware/auth');

router.post('/session', verifyToken, gameController.saveSession);
router.get('/sessions', verifyToken, gameController.getSessions);
router.get('/progress', verifyToken, gameController.getProgress);

module.exports = router;
