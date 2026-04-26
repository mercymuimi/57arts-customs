const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Notify your team
    await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: process.env.RESEND_TEST_EMAIL,
      subject: `[57 Arts Contact] ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Auto-reply to sender
    await resend.emails.send({
      from: 'Mercy from 57 Arts <onboarding@resend.dev>',
      to: email,
      subject: `We received your message — 57 Arts & Customs`,
      html: `
        <p>Hi ${name},</p>
        <p>Thanks for reaching out! We received your message about <strong>${subject}</strong> and will get back to you within 24 hours.</p>
        <p>— The 57 Arts & Customs Team</p>
      `,
    });

    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Resend error:', err);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});

module.exports = router;