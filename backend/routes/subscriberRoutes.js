const express    = require('express');
const router     = express.Router();
const Subscriber = require('../models/Subscriber');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// POST /api/subscribers — public subscribe
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (existing.status === 'approved')
        return res.status(409).json({ message: 'already_approved' });
      return res.status(409).json({ message: 'already_pending' });
    }
    await Subscriber.create({ email });
    res.status(201).json({ message: 'Subscribed! Pending admin approval.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/subscribers — admin: list all
router.get('/', async (req, res) => {
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/subscribers/check?email=xxx — check approval status
router.get('/check', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email required.' });
  try {
    const sub = await Subscriber.findOne({ email: email.toLowerCase().trim() });
    if (!sub) return res.json({ status: 'not_found' });
    res.json({ status: sub.status });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PATCH /api/subscribers/:id/approve — admin: approve + send welcome email
router.patch('/:id/approve', async (req, res) => {
  try {
    const sub = await Subscriber.findByIdAndUpdate(
      req.params.id, { status: 'approved' }, { new: true }
    );
    if (!sub) return res.status(404).json({ message: 'Subscriber not found.' });

    await resend.emails.send({
      from:    'Mercy from 57 Arts <onboarding@resend.dev>',
      to:      sub.email,
      subject: '✦ You\'re In — Welcome to the 57 Arts Syndicate',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background-color:#111111;border:1px solid #1c1c1c;border-radius:16px;overflow:hidden;max-width:560px;">

                  <!-- Gold top bar -->
                  <tr><td style="height:3px;background-color:#c9a84c;"></td></tr>

                  <!-- Header -->
                  <tr>
                    <td style="padding:36px 40px 24px;border-bottom:1px solid #1c1c1c;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color:#c9a84c;border-radius:8px;width:32px;height:32px;text-align:center;vertical-align:middle;">
                            <span style="color:#000;font-weight:900;font-size:13px;">57</span>
                          </td>
                          <td style="padding-left:10px;">
                            <span style="color:#f0ece4;font-weight:900;font-size:13px;letter-spacing:0.04em;">
                              57 ARTS <span style="color:#c9a84c;">&amp;</span> CUSTOMS
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px 40px 32px;">
                      <p style="color:#c9a84c;font-size:10px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 16px;">
                        ✦ Syndicate Membership
                      </p>
                      <h1 style="color:#f0ece4;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;margin:0 0 16px;line-height:1.1;">
                        You're In.<br />
                        <span style="color:#c9a84c;font-style:italic;">Welcome to the Circle.</span>
                      </h1>
                      <p style="color:#606060;font-size:14px;line-height:1.8;margin:0 0 28px;">
                        Your application has been approved. You now have exclusive access to early drops, private events, and bespoke consults — reserved for the 57.
                      </p>

                      <!-- What you get -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;border:1px solid #1c1c1c;border-radius:12px;margin-bottom:28px;">
                        <tr><td style="padding:20px 24px;">
                          <p style="color:#c9a84c;font-size:10px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 14px;">Your Active Perks</p>
                          ${[
                            ['★', 'Early Access Drops', '48hrs before public release'],
                            ['✦', 'Bespoke Consults',   'Direct line to our artisans'],
                            ['🔑', 'Private Events',     'Invitation-only Nairobi studio nights'],
                            ['💎', 'Priority Custom Slots', 'Skip the commission queue'],
                          ].map(([icon, title, desc]) => `
                            <table cellpadding="0" cellspacing="0" style="margin-bottom:12px;width:100%;">
                              <tr>
                                <td style="width:28px;vertical-align:top;padding-top:2px;font-size:14px;">${icon}</td>
                                <td>
                                  <p style="color:#f0ece4;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 2px;">${title}</p>
                                  <p style="color:#606060;font-size:12px;margin:0;">${desc}</p>
                                </td>
                              </tr>
                            </table>
                          `).join('')}
                        </td></tr>
                      </table>

                      <!-- CTA Button -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding-bottom:28px;">
                            <a href="${FRONTEND_URL}/syndicate/members"
                              style="display:inline-block;background-color:#c9a84c;color:#000;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:0.08em;padding:15px 36px;border-radius:10px;text-decoration:none;">
                              Enter the Members Area →
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="color:#333333;font-size:12px;text-align:center;margin:0;">
                        First exclusive drop lands this Friday. Watch your inbox.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 40px;border-top:1px solid #1c1c1c;">
                      <p style="color:#333333;font-size:11px;margin:0;text-align:center;">
                        © 2024 57 Arts & Customs · Nairobi, Kenya<br />
                        <a href="${FRONTEND_URL}/syndicate/members" style="color:#c9a84c;text-decoration:none;">Members Area</a>
                        &nbsp;·&nbsp;
                        <a href="${FRONTEND_URL}/shop" style="color:#606060;text-decoration:none;">Browse Archive</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    res.json({ message: 'Approved and welcome email sent.', subscriber: sub });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PATCH /api/subscribers/:id/reject — admin: reject
router.patch('/:id/reject', async (req, res) => {
  try {
    const sub = await Subscriber.findByIdAndUpdate(
      req.params.id, { status: 'rejected' }, { new: true }
    );
    if (!sub) return res.status(404).json({ message: 'Subscriber not found.' });
    res.json({ message: 'Rejected.', subscriber: sub });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;