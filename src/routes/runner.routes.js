const express = require('express');
const router = express.Router();
const runnerController = require('../controllers/runner.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Run code with custom input (no database save)
router.post('/run', authMiddleware.verifyToken, runnerController.runCode);

module.exports = router;
