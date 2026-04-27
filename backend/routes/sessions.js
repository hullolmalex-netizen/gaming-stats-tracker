// routes/sessions.js
const express = require('express');
const router = express.Router();
const { createSession, getSessions } = require('../controllers/sessionController');

router.route('/')
  .get(getSessions)    // GET  /api/sessions
  .post(createSession); // POST /api/sessions

module.exports = router;
