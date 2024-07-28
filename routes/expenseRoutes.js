const express = require('express');
const { calculateSplit } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');
const { generateBalanceSheet, downloadBalanceSheet, getIndividualExpenses, getTotalExpense } = require('../controllers/expenseController');

const router = express.Router();

router.use(authMiddleware);

// @route    POST /api/expenses/split
// @desc     Calculate split amount for each participant
// @access   Private
router.post('/split', calculateSplit);

// @route    GET /api/expenses/balancesheet/:id
// @desc     Generate balance sheet for an expense
// @access   Private
router.get('/balancesheet/:id', generateBalanceSheet);

// @route    GET /api/expenses/getbalancesheet/:id
// @desc     Download balance sheet for an expense
// @access   Private
router.get('/getbalancesheet/:id', downloadBalanceSheet);

// @route    GET /api/expenses/individual/:id
// @desc     Retrieve individual expenses of participants with expense id
// @access   Private
router.get('/individual/:id', getIndividualExpenses);

// @route    GET /api/expenses/total/:id
// @desc     Retrieve total expense of an expense with expense id
// @access   Private
router.get('/total/:id', getTotalExpense);

module.exports = router;