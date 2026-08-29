
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
                subject: 'Welcome to HireViva',
                html: `
                    <h1>Welcome to HireViva</h1>
                    <p>Hello ${name},</p>
                    <p>Your account has been created successfully.</p>
                `
            });

        } catch (emailError) {
            console.error(emailError);
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