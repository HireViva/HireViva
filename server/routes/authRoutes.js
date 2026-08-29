import express from "express";
import { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword, googleAuth } from "../controllers/authControllers.js";
import userAuth from "../middleware/userAuth.js";
import { sendEmail } from "../config/nodemailer.js";

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.post('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);
authRouter.post('/google', googleAuth);

// ── PUBLIC: test email — open in browser ─────────────────────────────────────
// GET http://localhost:5000/api/auth/test-email?to=your@email.com
authRouter.get('/test-email', async (req, res) => {
    const to = req.query.to || process.env.EMAIL_USER;
    try {
        await sendEmail({
            to,
            subject: '✅ HireViva SMTP Test',
            html: `<h2>SMTP is working!</h2><p>This test email was sent at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST.</p><p>Sent from: ${process.env.EMAIL_USER}</p>`
        });
        res.json({ status: '✅ Email sent successfully', to, from: process.env.EMAIL_USER });
    } catch (err) {
        res.status(500).json({ status: '❌ Email failed', error: err.message, from: process.env.EMAIL_USER });
    }
});

export default authRouter;
