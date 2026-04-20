const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

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
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: '🎨 Verify your 57 Arts & Customs account',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background:#0a0a0a;font-family:Arial,sans-serif;margin:0;padding:40px 20px;">
          <div style="max-width:480px;margin:0 auto;background:#111111;border:1px solid #1c1c1c;border-radius:16px;overflow:hidden;">
            <div style="background:#c9a84c;padding:24px 32px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <div style="background:#000;width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px;color:#c9a84c;text-align:center;line-height:32px;">57</div>
                <span style="color:#000;font-weight:900;font-size:14px;letter-spacing:0.04em;">57 ARTS & CUSTOMS</span>
              </div>
            </div>
            <div style="padding:32px;">
              <p style="color:#c9a84c;font-size:10px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:12px;">Email Verification</p>
              <h1 style="color:#f0ece4;font-size:24px;font-weight:900;margin-bottom:8px;">Welcome, ${name}!</h1>
              <p style="color:#606060;font-size:13px;line-height:1.8;margin-bottom:28px;">
                Use the code below to verify your email address. This code expires in <strong style="color:#f0ece4;">10 minutes</strong>.
              </p>
              <div style="background:#1c1c1c;border:1px solid #2e2e2e;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
                <p style="color:#606060;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:12px;">Verification Code</p>
                <p style="color:#c9a84c;font-size:42px;font-weight:900;letter-spacing:0.3em;margin:0;">${otp}</p>
              </div>
              <p style="color:#606060;font-size:12px;line-height:1.7;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
            <div style="padding:20px 32px;border-top:1px solid #1c1c1c;">
              <p style="color:#333333;font-size:11px;text-align:center;margin:0;">© 2024 57 Arts & Customs. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log('✅ Verification email sent to:', email);
  } catch (err) {
    console.error('❌ Email send error:', err.message);
    throw err;
  }
};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists but not verified, resend OTP
      if (!existingUser.isEmailVerified) {
        const otp = generateOTP();
        existingUser.emailOTP         = otp;
        existingUser.emailOTPExpires  = new Date(Date.now() + 10 * 60 * 1000);
        await existingUser.save();
        await sendVerificationEmail(email, existingUser.name, otp);
        return res.status(200).json({
          message: 'Account exists but not verified. New OTP sent.',
          requiresVerification: true,
          email,
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
      emailOTP: otp,
      emailOTPExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    });
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, name, otp);

    res.status(201).json({
      message: 'Account created! Check your email for the verification code.',
      requiresVerification: true,
      email,
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

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    if (user.emailOTP !== otp) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (new Date() > user.emailOTPExpires) {
      return res.status(400).json({ message: 'Code expired. Please register again to get a new code.' });
    }

    // Mark as verified and clear OTP
    user.isEmailVerified  = true;
    user.emailOTP         = undefined;
    user.emailOTPExpires  = undefined;
    await user.save();

    const token = generateToken(user);

    res.json({
      message: 'Email verified successfully!',
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
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
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isEmailVerified) return res.status(400).json({ message: 'Email already verified' });

    const otp = generateOTP();
    user.emailOTP        = otp;
    user.emailOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(email, user.name, otp);
    res.json({ message: 'New verification code sent!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    if (!user.isActive) return res.status(403).json({ message: 'Account is deactivated' });

    // Check email verification
    if (!user.isEmailVerified) {
      // Resend OTP automatically
      const otp = generateOTP();
      user.emailOTP        = otp;
      user.emailOTPExpires = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendVerificationEmail(email, user.name, otp);

      return res.status(403).json({
        message: 'Please verify your email first. A new code has been sent.',
        requiresVerification: true,
        email,
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

// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -emailOTP -emailOTPExpires');
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