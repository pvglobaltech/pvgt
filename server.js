require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Database connection ───────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all static files (HTML, images, videos, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Rate limiter: max 10 contact form submissions per IP per 15 minutes
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// ── Create table if it doesn't exist ─────────────────────────────────────────
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id          SERIAL PRIMARY KEY,
        full_name   VARCHAR(200) NOT NULL,
        email       VARCHAR(200) NOT NULL,
        phone       VARCHAR(50),
        subject     VARCHAR(300),
        message     TEXT NOT NULL,
        submitted_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ Database table ready.');
  } catch (err) {
    console.error('❌ Database init error:', err.message);
  }
}

// ── Email transporter (Gmail SMTP via pro email) ──────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ── Helper: basic input sanitisation ─────────────────────────────────────────
function sanitize(str) {
  if (!str) return '';
  return String(str).trim().replace(/[<>]/g, '');
}

// ── Check if SMTP is configured ───────────────────────────────────────────────
function smtpConfigured() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

// ── Send emails (non-blocking — failure never breaks the form) ────────────────
async function sendEmails(fullName, email, phone, subject, message) {
  if (!smtpConfigured()) {
    console.warn('⚠️  SMTP not configured — skipping email notifications.');
    return;
  }

  const transporter = createTransporter();

  // Notification to ParahVine team
  try {
    await transporter.sendMail({
      from: `"ParahVine Website" <${process.env.SMTP_USER}>`,
      to: 'team@parahvineglobaltech.com',
      subject: `New Contact Message: ${subject || 'No Subject'} — from ${fullName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
          <div style="background:#32023b;padding:20px;text-align:center;">
            <h2 style="color:#fff;margin:0;">New Contact Form Submission</h2>
            <p style="color:#f0c0f0;margin:5px 0;">ParahVine GlobalTech Website</p>
          </div>
          <div style="padding:24px;background:#fdf5ff;">
            <table style="width:100%;border-collapse:collapse;font-size:15px;">
              <tr><td style="padding:8px 0;color:#555;width:120px;"><strong>Name:</strong></td><td style="padding:8px 0;">${fullName}</td></tr>
              <tr><td style="padding:8px 0;color:#555;"><strong>Email:</strong></td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#555;"><strong>Phone:</strong></td><td style="padding:8px 0;">${phone || 'Not provided'}</td></tr>
              <tr><td style="padding:8px 0;color:#555;"><strong>Subject:</strong></td><td style="padding:8px 0;">${subject || 'Not provided'}</td></tr>
              <tr><td style="padding:8px 0;color:#555;vertical-align:top;"><strong>Message:</strong></td><td style="padding:8px 0;white-space:pre-line;">${message}</td></tr>
            </table>
          </div>
          <div style="padding:16px;background:#32023b;text-align:center;">
            <p style="color:#e0b0e0;margin:0;font-size:13px;">© 2026 ParahVine GlobalTech — www.parahvineglobaltech.com</p>
          </div>
        </div>
      `,
    });
    console.log(`✅ Team notification email sent for message from ${fullName}`);
  } catch (err) {
    console.error('❌ Team notification email failed:', err.message);
  }

  // Auto-reply to the sender
  try {
    await transporter.sendMail({
      from: `"ParahVine GlobalTech" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'We received your message — ParahVine GlobalTech',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
          <div style="background:#32023b;padding:20px;text-align:center;">
            <h2 style="color:#fff;margin:0;">Thank You, ${fullName}!</h2>
          </div>
          <div style="padding:24px;background:#fdf5ff;">
            <p style="font-size:15px;color:#333;">We have received your message and our team will get back to you as soon as possible.</p>
            <p style="font-size:15px;color:#333;">Here is a copy of what you sent us:</p>
            <blockquote style="border-left:4px solid #32023b;margin:16px 0;padding:10px 16px;background:#f3eaff;border-radius:4px;color:#555;white-space:pre-line;">${message}</blockquote>
            <p style="font-size:15px;color:#333;">In the meantime, feel free to reach us directly:</p>
            <ul style="font-size:15px;color:#333;line-height:1.8;">
              <li>📧 <a href="mailto:team@parahvineglobaltech.com">team@parahvineglobaltech.com</a></li>
              <li>📞 Nigeria: +2348031508969</li>
              <li>📞 USA: +1-844-288-0933</li>
            </ul>
            <p style="font-size:15px;color:#333;margin-top:20px;">Warm Regards,<br><strong>Olusegun</strong><br>Founder &amp; Team Lead<br>ParahVine GlobalTech</p>
          </div>
          <div style="padding:16px;background:#32023b;text-align:center;">
            <p style="color:#e0b0e0;margin:0;font-size:13px;">© 2026 ParahVine GlobalTech — <a href="https://www.parahvineglobaltech.com" style="color:#e0b0e0;">www.parahvineglobaltech.com</a></p>
          </div>
        </div>
      `,
    });
    console.log(`✅ Auto-reply sent to ${email}`);
  } catch (err) {
    console.error('❌ Auto-reply email failed:', err.message);
  }
}

// ── Contact form route ────────────────────────────────────────────────────────
app.post('/api/contact', contactLimiter, async (req, res) => {
  const fullName = sanitize(req.body.full_name);
  const email    = sanitize(req.body.email);
  const phone    = sanitize(req.body.phone);
  const subject  = sanitize(req.body.subject);
  const message  = sanitize(req.body.message);

  // Basic validation
  if (!fullName || !email || !message) {
    return res.status(400).json({ success: false, message: 'Full name, email, and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  // ── Step 1: Save to database (this MUST succeed) ──────────────────────────
  try {
    await pool.query(
      `INSERT INTO contact_messages (full_name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [fullName, email, phone || null, subject || null, message]
    );
    console.log(`✅ Message from ${fullName} (${email}) saved to database.`);
  } catch (err) {
    console.error('❌ Database save failed:', err.message);
    return res.status(500).json({
      success: false,
      message: 'We could not save your message. Please try again or contact us directly at team@parahvineglobaltech.com',
    });
  }

  // ── Step 2: Respond to user immediately — database save succeeded ─────────
  res.json({ success: true, message: 'Your message has been received! We will get back to you soon.' });

  // ── Step 3: Send emails in the background (non-blocking) ─────────────────
  // Runs after the response is sent — email failure won't affect the user
  sendEmails(fullName, email, phone, subject, message).catch((err) => {
    console.error('Unexpected email error:', err.message);
  });
});

// ── Catch-all: serve index.html for any unmatched route ──────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ── Start server ──────────────────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 ParahVine GlobalTech server running on port ${PORT}`);
  });
});
