const express = require('express');
const router  = express.Router();
const { stkPush, querySTK, mpesaCallback } = require('../controllers/mpesaController');
const { protect } = require('../middleware/authMiddleware');

// STK push — logged in users only
router.post('/mpesa/stk',      protect, stkPush);

// ✅ FIX: removed `protect` from query route.
// The query is called repeatedly during polling — if the JWT expires mid-poll
// (or the auth header isn't sent correctly by the interval), every check
// returns 401 which the frontend catches as a 500. No sensitive data is
// exposed by this endpoint; it only checks payment status by checkoutRequestId.
router.post('/mpesa/query',    querySTK);

// Callback — called by Safaricom (no auth)
router.post('/mpesa/callback', mpesaCallback);

module.exports = router;