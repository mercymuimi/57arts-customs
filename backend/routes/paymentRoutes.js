const express = require('express');
const router  = express.Router();
const { stkPush, querySTK, mpesaCallback } = require('../controllers/mpesaController');
const { protect } = require('../middleware/authMiddleware');

// STK push — logged in users only
router.post('/mpesa/stk',      protect, stkPush);
router.post('/mpesa/query',    protect, querySTK);

// Callback — called by Safaricom (no auth)
router.post('/mpesa/callback', mpesaCallback);

module.exports = router;