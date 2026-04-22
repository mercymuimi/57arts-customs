const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const IS_DEV = process.env.NODE_ENV !== 'production';

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send verification email
const sendVerificationEmail = async (email, name, otp) => {
  const toEmail = (IS_DEV && process.env.RESEND_TEST_EMAIL)
    ? process.env.RESEND_TEST_EMAIL
    : email;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to:   toEmail,
      subject: '🎨 Verify your 57 Arts & Customs account',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background:#0a0a0a;font-family:Arial,sans-serif;margin:0;padding:40px 20px;">
          <div style="max-width:480px;margin:0 auto;background:#111111;border:1px solid #1c1c1c;border-radius:16px;overflow:hidden;">
            <div style="background:#c9a84c;padding:24px 32px;">
              <span style="color:#000;font-weight:900;font-size:14px;letter-spacing:0.04em;">57 ARTS & CUSTOMS</span>
            </div>
            <div style="padding:32px;">
              <h1 style="color:#f0ece4;font-size:24px;font-weight:900;margin-bottom:8px;">Welcome, ${name}!</h1>
              <p style="color:#606060;font-size:13px;line-height:1.8;margin-bottom:28px;">
                Use the code below to verify your email. Expires in <strong style="color:#f0ece4;">10 minutes</strong>.
              </p>
              <div style="background:#1c1c1c;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
                <p style="color:#c9a84c;font-size:42px;font-weight:900;letter-spacing:0.3em;margin:0;">${otp}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('✅ Verification email sent to:', toEmail);
    return true;
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    if (IS_DEV) {
      console.log(`\n⚡ DEV FALLBACK — OTP for ${email}: ${otp}\n`);
      return false;
    }
    throw err;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, otp) => {
  const toEmail = (IS_DEV && process.env.RESEND_TEST_EMAIL)
    ? process.env.RESEND_TEST_EMAIL
    : email;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to:   toEmail,
      subject: '🔐 Reset your 57 Arts & Customs password',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background:#0a0a0a;font-family:Arial,sans-serif;margin:0;padding:40px 20px;">
          <div style="max-width:480px;margin:0 auto;background:#111111;border:1px solid #1c1c1c;border-radius:16px;overflow:hidden;">
            <div style="background:#c9a84c;padding:24px 32px;">
              <span style="color:#000;font-weight:900;font-size:14px;letter-spacing:0.04em;">57 ARTS & CUSTOMS</span>
            </div>
            <div style="padding:32px;">
              <h1 style="color:#f0ece4;font-size:24px;font-weight:900;margin-bottom:8px;">Reset Your Password</h1>
              <p style="color:#606060;font-size:13px;line-height:1.8;margin-bottom:28px;">
                Hi ${name}, use the code below to reset your password. Expires in <strong style="color:#f0ece4;">10 minutes</strong>.
              </p>
              <div style="background:#1c1c1c;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
                <p style="color:#c9a84c;font-size:42px;font-weight:900;letter-spacing:0.3em;margin:0;">${otp}</p>
              </div>
              <p style="color:#606060;font-size:12px;">If you didn't request this, ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('✅ Password reset email sent to:', toEmail);
    return true;
  } catch (err) {
    console.error('❌ Reset email send error:', err.message);
    if (IS_DEV) {
      console.log(`\n⚡ DEV FALLBACK — Reset OTP for ${email}: ${otp}\n`);
      return false;
    }
    throw err;
  }
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isEmailVerified) {
        const otp = generateOTP();
        existingUser.emailOTP        = otp;
        existingUser.emailOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
        await existingUser.save();
        const delivered = await sendVerificationEmail(email, existingUser.name, otp);
        return res.status(200).json({
          message: 'Account exists but not verified. New OTP sent.',
          requiresVerification: true,
          email,
          ...(IS_DEV && !delivered && { devOtp: otp }),
        });
      }
      return res.status(400).json({ message: 'Email already registered' });
    }

    const allowedRoles = ['buyer', 'vendor', 'affiliate'];
    const assignedRole = allowedRoles.includes(role) ? role : 'buyer';

    const otp = generateOTP();
    const user = new User({
      name, email, password,
      role: assignedRole,
      isEmailVerified: false,
      emailOTP:        otp,
      emailOTPExpires: new Date(Date.now() + 10 * 60 * 1000),
    });
    await user.save();

    const delivered = await sendVerificationEmail(email, name, otp);

    res.status(201).json({
      message: 'Account created! Check your email for the verification code.',
      requiresVerification: true,
      email,
      ...(IS_DEV && !delivered && { devOtp: otp }),
    });

  } catch (error) {
    console.error('❌ REGISTER ERROR:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= VERIFY EMAIL OTP =================
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: 'Email and OTP are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isEmailVerified)
      return res.status(400).json({ message: 'Email already verified' });
    if (user.emailOTP !== otp)
      return res.status(400).json({ message: 'Invalid verification code' });
    if (new Date() > user.emailOTPExpires)
      return res.status(400).json({ message: 'Code expired. Please request a new one.' });

    user.isEmailVerified = true;
    user.emailOTP        = undefined;
    user.emailOTPExpires = undefined;
    await user.save();

    const token = generateToken(user);
    res.json({
      message: 'Email verified successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (error) {
    console.error('❌ VERIFY EMAIL ERROR:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= RESEND OTP =================
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)                return res.status(404).json({ message: 'User not found' });
    if (user.isEmailVerified) return res.status(400).json({ message: 'Email already verified' });

    const otp = generateOTP();
    user.emailOTP        = otp;
    user.emailOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const delivered = await sendVerificationEmail(email, user.name, otp);
    res.json({
      message: 'New verification code sent!',
      ...(IS_DEV && !delivered && { devOtp: otp }),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated' });

    // ✅ FIX: Admin accounts skip email verification check
    const skipVerification = user.role === 'admin';

    if (!skipVerification && !user.isEmailVerified) {
      const otp = generateOTP();
      user.emailOTP        = otp;
      user.emailOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      const delivered = await sendVerificationEmail(email, user.name, otp);
      return res.status(403).json({
        message: 'Please verify your email first. A new code has been sent.',
        requiresVerification: true,
        email,
        ...(IS_DEV && !delivered && { devOtp: otp }),
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id:        user._id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        phone:     user.phone,
        address:   user.address,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    console.error('❌ LOGIN ERROR:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= FORGOT PASSWORD (REQUEST OTP) =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If this email exists, a reset code has been sent.' });
    }

    const otp = generateOTP();
    user.resetOTP        = otp;
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const delivered = await sendPasswordResetEmail(email, user.name, otp);
    res.json({
      message: 'If this email exists, a reset code has been sent.',
      ...(IS_DEV && !delivered && { devOtp: otp }),
    });

  } catch (error) {
    console.error('❌ FORGOT PASSWORD ERROR:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= RESET PASSWORD (VERIFY OTP + NEW PASSWORD) =================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    if (newPassword.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.resetOTP || user.resetOTP !== otp)
      return res.status(400).json({ message: 'Invalid reset code' });
    if (new Date() > user.resetOTPExpires)
      return res.status(400).json({ message: 'Reset code expired. Please request a new one.' });

    user.password        = newPassword; // pre-save hook will hash it
    user.resetOTP        = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully! You can now log in.' });

  } catch (error) {
    console.error('❌ RESET PASSWORD ERROR:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -emailOTP -emailOTPExpires -resetOTP -resetOTPExpires');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, profileImage, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (currentPassword && newPassword) {
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
      user.password = newPassword;
    }

    if (name)         user.name         = name;
    if (phone)        user.phone        = phone;
    if (address)      user.address      = address;
    if (profileImage) user.profileImage = profileImage;

    await user.save();
    res.json({
      success: true,
      message: 'Profile updated',
      user: {
        id: user._id, name: user.name, email: user.email,
        role: user.role, phone: user.phone, address: user.address, createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};