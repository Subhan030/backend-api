const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware.verifyToken, submissionController.submitCode);
router.get('/', authMiddleware.verifyToken, submissionController.getSubmissions);

module.exports = router;
