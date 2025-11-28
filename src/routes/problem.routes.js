const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problem.controller');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/', problemController.getProblems);
router.get('/:slug', problemController.getProblemBySlug);
router.post('/', verifyToken, authorizeRoles('Admin'), problemController.createProblem);

module.exports = router;
