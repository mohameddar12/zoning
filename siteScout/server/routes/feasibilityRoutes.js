const express = require('express');
const router = express.Router();
const feasibilityController = require('../controllers/feasibilityController');

// POST calculate project costs
router.post('/calculate-costs', feasibilityController.calculateCosts);

// GET construction cost indices by region
router.get('/cost-indices', feasibilityController.getCostIndices);

module.exports = router; 