
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import userModel from '../models/userModel.js';
import { sendEmail } from '../config/nodemailer.js';

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        {
            expiresIn: '7d',
            issuer: 'hireviva',
        }
    );
};

// Secure Cookie Options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite:
        process.env.NODE_ENV === 'production'
            ? 'none'
            : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Password Validation
const validatePassword = (password) => {

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (
        password.length < minLength ||
        !hasUpperCase ||
        !hasLowerCase ||
        !hasNumber
    ) {
        return false;
    }

    return true;
};

// Generate OTP
const generateOTP = () => {
    return String(
        Math.floor(100000 + Math.random() * 900000)
    );
};

// ================= REGISTER =================

export const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Password Validation
        if (!validatePassword(password)) {
            return res.json({
                success: false,
                message:
                    'Password must contain uppercase, lowercase, number and minimum 8 characters'
            });
        }

        // Check Existing User
        const existingUser = await userModel.findOne({
            email
        });

        if (existingUser) {
            return res.json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(
            password,
            12
        );

        // Create User
        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            authProvider: 'local',
        });

        await user.save();

        // Generate Token
        const token = generateToken(user._id);

        // Set Cookie
        res.cookie(
            'token',
            token,
            cookieOptions
        );

        // Send Welcome Email
        try {
            await sendEmail({
                to: email,
                subject: '🎉 Welcome to HireViva — Your AI Interview Journey Starts Now!',
                html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:10px;">
        <div style="width:44px;height:44px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;display:inline-block;"></div>
        <span style="font-size:26px;font-weight:800;color:#fff;">HireViva</span>
      </div>
    </div>
    <div style="background:linear-gradient(135deg,#1e1b4b,#1e1e2e);border:1px solid #312e81;border-radius:20px;padding:40px;">
      <h1 style="color:#fff;font-size:28px;font-weight:700;margin:0 0 8px;">Welcome aboard, ${name}! 🚀</h1>
      <p style="color:#a5b4fc;font-size:16px;margin:0 0 28px;">Your account is ready. Let's ace those interviews.</p>
      <div style="background:#0f0f1a;border-radius:12px;padding:24px;margin-bottom:24px;">
        <p style="color:#e2e8f0;margin:0 0 12px;font-size:15px;">With HireViva you can:</p>
        <div style="color:#a5b4fc;font-size:14px;line-height:2;">✅ &nbsp;Practice with AI Interviews<br>✅ &nbsp;Take Aptitude &amp; Mock Tests<br>✅ &nbsp;Track your Progress<br>✅ &nbsp;Improve with detailed Feedback</div>
      </div>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display:block;text-align:center;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:16px;">Start Practising Now →</a>
    </div>
    <p style="text-align:center;color:#4b5563;font-size:13px;margin-top:24px;">© ${new Date().getFullYear()} HireViva. All rights reserved.</p>
  </div>
</body>
</html>`
            });
        } catch (emailError) {
            console.error('Welcome email failed:', emailError.message);
        }

        return res.json({
            success: true,
            message: 'User registered successfully'
        });

    } catch (error) {

        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });

    }
};

// ================= LOGIN =================

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find User
        const user = await userModel.findOne({
            email
        });

        if (!user) {
            return res.json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate Token
        const token = generateToken(user._id);

        // Set Cookie
        res.cookie(
            'token',
            token,
            cookieOptions
        );

        // Send login notification email (non-blocking)
        try {
            const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
            sendEmail({
                to: user.email,
                subject: '🔐 New Login to Your HireViva Account',
                html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="display:inline-flex;align-items:center;gap:10px;">
        <div style="width:44px;height:44px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;display:inline-block;"></div>
        <span style="font-size:26px;font-weight:800;color:#fff;">HireViva</span>
      </div>
    </div>
    <div style="background:linear-gradient(135deg,#1e1b4b,#1e1e2e);border:1px solid #312e81;border-radius:20px;padding:40px;">
      <h2 style="color:#fff;font-size:22px;margin:0 0 8px;">New login detected 🔐</h2>
      <p style="color:#a5b4fc;margin:0 0 28px;">Hi ${user.name}, someone just signed into your HireViva account.</p>
      <div style="background:#0f0f1a;border-radius:12px;padding:20px;margin-bottom:24px;">
        <table style="width:100%;color:#e2e8f0;font-size:14px;">
          <tr><td style="padding:8px 0;color:#6b7280;">Time</td><td style="text-align:right;">${loginTime} IST</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Account</td><td style="text-align:right;">${user.email}</td></tr>
        </table>
      </div>
      <p style="color:#f87171;font-size:14px;margin:0;">If this wasn't you, please reset your password immediately.</p>
    </div>
    <p style="text-align:center;color:#4b5563;font-size:13px;margin-top:24px;">© ${new Date().getFullYear()} HireViva. All rights reserved.</p>
  </div>
</body>
</html>`
            }).catch(e => console.error('Login email failed:', e.message));
        } catch (emailError) {
            console.error('Login email failed:', emailError.message);
        }

        return res.json({
            success: true,
            message: 'Login successful'
        });

    } catch (error) {

        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });

    }
};

// ================= LOGOUT =================

export const logout = async (req, res) => {

    try {

        res.clearCookie('token', cookieOptions);

        return res.json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        });

    }
};

// ================= SEND VERIFY OTP =================

export const sendVerifyOtp = async (req, res) => {

    try {

        const userId = req.userId;

        const user = await userModel.findById(
            userId
        );

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: 'Account already verified'
            });
        }

        // Generate OTP
        const otp = generateOTP();

        user.verifyOtp = otp;

        user.verifyOtpExpireAt =
            Date.now() + 10 * 60 * 1000;

        await user.save();

        // Send Email
        await sendEmail({
            to: user.email,
            subject: 'Verify Your Account',
            html: `
                <h2>HireViva Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>Expires in 10 minutes.</p>
            `
        });

        return res.json({
            success: true,
            message:
                'Verification OTP sent successfully'
        });

    } catch (error) {

        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });

    }
};

// ================= VERIFY EMAIL =================

export const verifyEmail = async (req, res) => {

    try {

        const userId = req.userId;

        const { otp } = req.body;

        if (!otp) {
            return res.json({
                success: false,
                message: 'OTP is required'
            });
        }

        const user = await userModel.findById(
            userId
        );

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        if (
            String(user.verifyOtp) !== String(otp)
        ) {
            return res.json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        if (
            user.verifyOtpExpireAt < Date.now()
        ) {
            return res.json({
                success: false,
                message: 'OTP expired'
            });
        }

        user.isAccountVerified = true;

        user.verifyOtp = '';

        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({
            success: true,
            message:
                'Email verified successfully'
        });

    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        });

    }
};

// ================= IS AUTHENTICATED =================

export const isAuthenticated = async (
    req,
    res
) => {

    try {

        return res.json({
            success: true
        });

    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        });

    }
};

// ================= SEND RESET OTP =================

export const sendResetOtp = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.json({
                success: false,
                message: 'Email is required'
            });
        }

        const user = await userModel.findOne({
            email
        });

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate OTP
        const otp = generateOTP();

        user.resetOtp = otp;

        user.resetOtpExpireAt =
            Date.now() + 10 * 60 * 1000;

        await user.save();

        // Send Email
        await sendEmail({
            to: user.email,
            subject: 'Reset Your Password',
            html: `
                <h2>HireViva Password Reset</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>Expires in 10 minutes.</p>
            `
        });

        return res.json({
            success: true,
            message:
                'Password reset OTP sent'
        });

    } catch (error) {

        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });

    }
};

// ================= RESET PASSWORD =================

export const resetPassword = async (
    req,
    res
) => {

    try {

        const {
            email,
            otp,
            newPassword
        } = req.body;

        if (
            !email ||
            !otp ||
            !newPassword
        ) {
            return res.json({
                success: false,
                message:
                    'Email, OTP and password required'
            });
        }

        // Password Validation
        if (!validatePassword(newPassword)) {
            return res.json({
                success: false,
                message:
                    'Password must contain uppercase, lowercase, number and minimum 8 characters'
            });
        }

        const user = await userModel.findOne({
            email
        });

        if (!user) {
            return res.json({
                success: false,
                message: 'User not found'
            });
        }

        if (
            user.resetOtp !== otp
        ) {
            return res.json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        if (
            user.resetOtpExpireAt < Date.now()
        ) {
            return res.json({
                success: false,
                message: 'OTP expired'
            });
        }

        // Hash Password
        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                12
            );

        user.password = hashedPassword;

        user.resetOtp = '';

        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({
            success: true,
            message:
                'Password reset successful'
        });

    } catch (error) {

        return res.json({
            success: false,
            message: error.message
        });

    }
};

// ================= GOOGLE AUTH =================

export const googleAuth = async (
    req,
    res
) => {

    try {

        const { credential } = req.body;

        if (!credential) {
            return res.json({
                success: false,
                message:
                    'Google credential required'
            });
        }

        // Verify Token
        const ticket =
            await googleClient.verifyIdToken({
                idToken: credential,
                audience:
                    process.env
                        .GOOGLE_CLIENT_ID,
            });

        const payload =
            ticket.getPayload();

        const {
            sub: googleId,
            email,
            name,
            email_verified,
        } = payload;

        // Find User
        let user =
            await userModel.findOne({
                email
            });

        if (!user) {

            // Create User
            user = new userModel({
                name,
                email,
                googleId,
                authProvider: 'google',
                isAccountVerified:
                    email_verified || false,
            });

            await user.save();

        } else {

            // Link Google Account
            user.googleId = googleId;

            user.authProvider = 'google';

            if (email_verified) {
                user.isAccountVerified = true;
            }

            await user.save();
        }

        // Generate Token
        const token =
            generateToken(user._id);

        // Set Cookie
        res.cookie(
            'token',
            token,
            cookieOptions
        );

        return res.json({
            success: true,
            message:
                'Google authentication successful'
        });

    } catch (error) {

        console.error(error);

        return res.json({
            success: false,
            message:
                'Google authentication failed'
        });

    }
};