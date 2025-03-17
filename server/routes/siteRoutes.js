const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

// GET site data by address or coordinates
router.get('/search', siteController.searchSite);

// GET detailed site analysis
router.get('/:siteId', siteController.getSiteById);

module.exports = router; 