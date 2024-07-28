const express = require('express');
const { calculateSplit } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');
const { generateBalanceSheet } = require('../controllers/expenseController');

const router = express.Router();

router.use(authMiddleware);
router.post('/split', calculateSplit);
router.get('/balancesheet/:id', generateBalanceSheet);

module.exports = router;