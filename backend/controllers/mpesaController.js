const axios = require('axios');

// In-memory store for confirmed payments (use Redis in production)
const confirmedPayments = new Map();

const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');
  const { data } = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  );
  return data.access_token;
};

const getTimestamp = () =>
  new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);

const generatePassword = (timestamp) =>
  Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

const formatPhone = (phone) => {
  const cleaned = phone.replace(/\s+/g, '').replace(/^\+/, '');
  if (cleaned.startsWith('0')) return `254${cleaned.slice(1)}`;
  if (cleaned.startsWith('254')) return cleaned;
  return `254${cleaned}`;
};

// POST /api/payments/mpesa/stk
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
    const callbackUrl    = `${process.env.MPESA_CALLBACK_URL}/api/payments/mpesa/callback`;

    // ✅ Use real amount — sandbox accepts any integer amount
    const stkAmount = Math.ceil(Number(amount));

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
    res.status(500).json({
      success: false,
      message: errData?.fault?.faultstring || 'Failed to send STK push',
    });
  }
};

// POST /api/payments/mpesa/query
exports.querySTK = async (req, res) => {
  try {
    const { checkoutRequestId } = req.body;

    if (!checkoutRequestId) {
      return res.status(400).json({ message: 'checkoutRequestId is required' });
    }

    if (confirmedPayments.has(checkoutRequestId)) {
      const paymentData = confirmedPayments.get(checkoutRequestId);
      return res.json({
        success: true,
        paid:    true,
        message: 'Payment confirmed',
        data:    paymentData,
      });
    }

    res.json({ success: true, paid: false, message: 'Payment not yet confirmed' });

  } catch (err) {
    console.error('❌ Query error:', err.message);
    res.status(500).json({ success: false, message: 'Could not check payment status' });
  }
};

// POST /api/payments/mpesa/callback — Safaricom calls this
exports.mpesaCallback = async (req, res) => {
  try {
    const callback = req.body?.Body?.stkCallback;
    if (!callback) return res.status(400).json({ message: 'Invalid callback' });

    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = callback;
    console.log('📲 M-Pesa callback:', { ResultCode, ResultDesc, CheckoutRequestID });

    if (ResultCode === 0) {
      const meta = {};
      CallbackMetadata?.Item?.forEach(item => { meta[item.Name] = item.Value; });
      console.log('✅ Payment confirmed:', meta);

      confirmedPayments.set(CheckoutRequestID, {
        transactionId: meta.MpesaReceiptNumber,
        amount:        meta.Amount,
        phone:         meta.PhoneNumber,
        confirmedAt:   new Date(),
      });

      // Clean up after 10 minutes
      setTimeout(() => confirmedPayments.delete(CheckoutRequestID), 10 * 60 * 1000);
    } else {
      console.log('❌ Payment failed:', ResultDesc);
    }

    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });

  } catch (err) {
    console.error('Callback error:', err.message);
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
};