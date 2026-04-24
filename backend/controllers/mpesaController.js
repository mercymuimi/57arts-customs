const axios = require('axios');

// ── In-memory stores ──────────────────────────────────────────────────────────
// Use Redis in production for multi-instance deployments
const confirmedPayments = new Map();
const CALLBACK_PATH = '/api/payments/mpesa/callback';

// ── Token cache ───────────────────────────────────────────────────────────────
// Safaricom tokens are valid for 1 hour. Caching avoids hitting the OAuth
// endpoint on every STK push and every query poll — which was a major cause
// of the SpikeArrestViolation errors alongside the fast polling interval.
let cachedToken    = null;
let tokenExpiresAt = 0;

const getAccessToken = async () => {
  const now = Date.now();

  // Return cached token if still valid (with 60s buffer before expiry)
  if (cachedToken && now < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const { data } = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  );

  cachedToken    = data.access_token;
  // Safaricom tokens expire in 3600 seconds (1 hour)
  tokenExpiresAt = now + (data.expires_in || 3600) * 1000;

  console.log('🔑 New M-Pesa access token fetched, expires in', data.expires_in, 'seconds');
  return cachedToken;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const getTimestamp = () =>
  new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);

const generatePassword = (timestamp) =>
  Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64');

const buildCallbackUrl = () => {
  const raw = (process.env.MPESA_CALLBACK_URL || '').trim().replace(/\/+$/, '');
  if (!raw) throw new Error('MPESA_CALLBACK_URL is not configured');
  if (raw.endsWith(CALLBACK_PATH)) return raw;
  if (raw.endsWith('/api/payments/callback'))
    return raw.replace(/\/api\/payments\/callback$/, CALLBACK_PATH);
  return `${raw}${CALLBACK_PATH}`;
};

const formatPhone = (phone) => {
  const cleaned = phone.replace(/\s+/g, '').replace(/^\+/, '');
  if (cleaned.startsWith('0'))   return `254${cleaned.slice(1)}`;
  if (cleaned.startsWith('254')) return cleaned;
  return `254${cleaned}`;
};

// ── POST /api/payments/mpesa/stk ──────────────────────────────────────────────
exports.stkPush = async (req, res) => {
  try {
    const { phone, amount, orderId } = req.body;

    if (!phone || !amount || !orderId) {
      return res.status(400).json({ message: 'Phone, amount and orderId are required' });
    }

    const token          = await getAccessToken();
    const timestamp      = getTimestamp();
    const password       = generatePassword(timestamp);
    const formattedPhone = formatPhone(phone);
    const callbackUrl    = buildCallbackUrl();
    const stkAmount      = Math.ceil(Number(amount));

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password:          password,
      Timestamp:         timestamp,
      TransactionType:   'CustomerPayBillOnline',
      Amount:            stkAmount,
      PartyA:            formattedPhone,
      PartyB:            process.env.MPESA_SHORTCODE,
      PhoneNumber:       formattedPhone,
      CallBackURL:       callbackUrl,
      AccountReference:  'ArtsPayment',
      TransactionDesc:   'Payment',
    };

    console.log('📱 STK Push:', { phone: formattedPhone, amount: stkAmount });

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    console.log('✅ STK Push sent:', data.CheckoutRequestID);

    res.json({
      success:           true,
      checkoutRequestId: data.CheckoutRequestID,
      message:           'STK push sent successfully',
    });

  } catch (err) {
    const errData = err.response?.data;
    console.error('❌ STK Push error:', JSON.stringify(errData, null, 2));

    // If token was stale, clear cache so next request fetches a fresh one
    if (errData?.fault?.faultstring?.includes('Invalid Access Token')) {
      cachedToken    = null;
      tokenExpiresAt = 0;
    }

    res.status(500).json({
      success: false,
      message: errData?.fault?.faultstring || 'Failed to send STK push',
    });
  }
};

// ── POST /api/payments/mpesa/query ────────────────────────────────────────────
// NOTE: This route has NO auth middleware — see paymentRoutes.js.
// It is polled repeatedly by the frontend during checkout verification.
exports.querySTK = async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;

    if (!checkoutRequestId) {
      return res.status(400).json({ message: 'checkoutRequestId is required' });
    }

    // Check in-memory confirmed payments first — avoids a Safaricom API call
    // entirely if the callback already confirmed the payment
    if (confirmedPayments.has(checkoutRequestId)) {
      const paymentData = confirmedPayments.get(checkoutRequestId);
      return res.json({
        success: true,
        paid:    true,
        message: 'Payment confirmed',
        data:    paymentData,
      });
    }

    // Use cached token — no extra OAuth call on every poll
    const token     = await getAccessToken();
    const timestamp = getTimestamp();
    const password  = generatePassword(timestamp);

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password:          password,
        Timestamp:         timestamp,
        CheckoutRequestID: checkoutRequestId,
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    console.log('🔍 Query result:', { ResultCode: data?.ResultCode, ResultDesc: data?.ResultDesc });

    if (data?.ResultCode === '0' || data?.ResultCode === 0) {
      const paymentData = {
        transactionId: data.MpesaReceiptNumber || '',
        amount:        data.Amount             || null,
        phone:         data.PhoneNumber        || '',
        confirmedAt:   new Date(),
        source:        'stk-query',
      };

      confirmedPayments.set(checkoutRequestId, paymentData);
      // Auto-clean after 10 minutes
      setTimeout(() => confirmedPayments.delete(checkoutRequestId), 10 * 60 * 1000);

      return res.json({
        success: true,
        paid:    true,
        message: data.ResultDesc || 'Payment confirmed',
        data:    paymentData,
      });
    }

    // ResultCode 1032 = cancelled by user, 1037 = timeout, 2001 = wrong PIN
    const cancelled = [1032, '1032'].includes(data?.ResultCode);
    const timedOut  = [1037, '1037'].includes(data?.ResultCode);

    res.json({
      success:   true,
      paid:      false,
      cancelled: cancelled || timedOut,
      message:   data?.ResultDesc || 'Payment not yet confirmed',
    });

  } catch (err) {
    const errData = err.response?.data;
    console.error('❌ Query error:', errData || err.message);

    // Clear token cache on auth errors so next poll gets a fresh token
    if (
      errData?.fault?.faultstring?.includes('Invalid Access Token') ||
      errData?.fault?.faultstring?.includes('Spike arrest')
    ) {
      cachedToken    = null;
      tokenExpiresAt = 0;
    }

    res.status(500).json({ success: false, message: 'Could not check payment status' });
  }
};

// ── POST /api/payments/mpesa/callback — Safaricom calls this ─────────────────
exports.mpesaCallback = async (req, res) => {
  try {
    const callback = req.body?.Body?.stkCallback;
    if (!callback) return res.status(400).json({ message: 'Invalid callback' });

    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = callback;
    console.log('📲 M-Pesa callback:', { ResultCode, ResultDesc, CheckoutRequestID });

    if (ResultCode === 0) {
      const meta = {};
      CallbackMetadata?.Item?.forEach(item => { meta[item.Name] = item.Value; });
      console.log('✅ Payment confirmed via callback:', meta);

      confirmedPayments.set(CheckoutRequestID, {
        transactionId: meta.MpesaReceiptNumber,
        amount:        meta.Amount,
        phone:         meta.PhoneNumber,
        confirmedAt:   new Date(),
        source:        'callback',
      });

      // Auto-clean after 10 minutes
      setTimeout(() => confirmedPayments.delete(CheckoutRequestID), 10 * 60 * 1000);
    } else {
      console.log('❌ Payment failed via callback:', ResultDesc);
    }

    // Always respond 200 to Safaricom — otherwise they retry repeatedly
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });

  } catch (err) {
    console.error('Callback error:', err.message);
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
};