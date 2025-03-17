const express = require('express');
const router = express.Router();
const environmentalController = require('../controllers/environmentalController');

// GET climate data
router.get('/climate', environmentalController.getClimateData);

// GET solar analysis
router.get('/solar', environmentalController.getSolarAnalysis);

// GET flood risk data
router.get('/flood-risk', environmentalController.getFloodRiskData);

module.exports = router; 