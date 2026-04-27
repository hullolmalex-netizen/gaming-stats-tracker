const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');

router.get('/', getAnalytics);  // GET full analytics

module.exports = router;
