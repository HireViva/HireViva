import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';

export default function EmailVerify() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef([]);

    // Cooldown timer effect
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Auto-focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleSendOtp = async () => {
        if (resendCooldown > 0) return;

        setLoading(true);
        try {
            const response = await api.post('/auth/send-verify-otp');

            if (response.data.success) {
                toast.success(response.data.message);
                setOtpSent(true);
                setResendCooldown(60);
                setTimeout(() => inputRefs.current[0]?.focus(), 100);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            toast.error('Please enter complete 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/verify-account', { otp: otpString });

            if (response.data.success) {
                toast.success(response.data.message);
                setTimeout(() => navigate('/'), 1000);
            } else {
                toast.error(response.data.message);
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        if (/^\d{6}$/.test(pastedData)) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            inputRefs.current[5]?.focus();
        } else {
            toast.error('Please paste a valid 6-digit OTP');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Background glow orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/4 top-1/4 w-[600px] h-[600px]">
                    <div className="glow-orb w-full h-full bg-purple-glow/30" />
                </div>
                <div className="absolute right-1/4 bottom-1/4 w-[500px] h-[500px]">
                    <div className="glow-orb w-full h-full bg-primary/20" style={{ animationDelay: "2s" }} />
                </div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="glass-card p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold mb-2 font-['Poppins']">
                            <span className="text-gradient-purple">Verify Your Email</span>
                        </h1>
                        <p className="text-muted-foreground">
                            {otpSent
                                ? 'Enter the 6-digit code sent to your email'
                                : 'Click below to receive a verification code'}
                        </p>
                    </div>

                    {/* OTP Input Section */}
                    {otpSent && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-foreground/80 mb-3 text-center">
                                Enter OTP
                            </label>
                            <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-2xl font-bold bg-input border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                                        disabled={loading}
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground/70 text-center">
                                Tip: You can paste the 6-digit code directly
                            </p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="space-y-4">
                        {!otpSent ? (
                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="btn-primary-gradient w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending OTP...
                                    </span>
                                ) : (
                                    'Send Verification Code'
                                )}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={loading || otp.join('').length !== 6}
                                    className="btn-primary-gradient w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </span>
                                    ) : (
                                        'Verify Email'
                                    )}
                                </button>

                                <button
                                    onClick={handleSendOtp}
                                    disabled={loading || resendCooldown > 0}
                                    className="btn-outline-purple w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resendCooldown > 0
                                        ? `Resend OTP in ${resendCooldown}s`
                                        : 'Resend OTP'}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground text-sm">
                            Already verified?{' '}
                            <button
                                onClick={() => navigate('/')}
                                className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200 cursor-pointer"
                            >
                                Go to Home
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
