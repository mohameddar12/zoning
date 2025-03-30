const express = require('express');
const router = express.Router();
const zoningController = require('../controllers/zoningController');

// GET zoning information by location
router.get('/info', zoningController.getZoningInfo);

// GET zoning regulations
router.get('/regulations/:zoneId', zoningController.getZoningRegulations);

module.exports = router; 