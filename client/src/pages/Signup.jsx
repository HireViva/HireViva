import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/register', formData);

            if (response.data.success) {
                toast.success(response.data.message);
                await checkAuth(); // Refresh auth state
                navigate('/email-verify');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/google', {
                credential: credentialResponse.credential,
            });

            if (response.data.success) {
                toast.success(response.data.message);
                await checkAuth();
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Google signup error:', error);
            toast.error('Google signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex relative bg-[#030712] overflow-hidden items-center justify-center">
            
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 sm:top-8 sm:left-8 text-[#a1a1aa] hover:text-white flex items-center gap-2 transition-colors font-['Inter',sans-serif] text-sm z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
            </button>

            {/* Form Space */}
            <div className="w-full max-w-[400px] flex flex-col p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    {/* Header */}
                    <div className="text-center flex flex-col items-center mb-8">
                        <div className="w-10 h-10 mb-4 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm font-['Inter',sans-serif]">
                            HV
                        </div>
                        <h2 className="text-2xl font-semibold text-white font-['Inter',sans-serif]">Create an Account</h2>
                        <p className="text-[#a1a1aa] text-sm mt-1.5 font-['Inter',sans-serif]">Sign up to get started</p>
                    </div>

                    {/* Social Login Container */}
                    <div className="flex justify-center mb-6">
                        <div className="w-full overflow-hidden rounded-md border border-[#27272a] hover:bg-[#18181b] transition-colors flex justify-center py-0.5">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => toast.error('Google signup failed')}
                                theme="filled_black"
                                size="large"
                                text="signup_with"
                                type="standard"
                                shape="rectangular"
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#27272a]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-[#030712] text-[#71717a] font-['Inter',sans-serif]">or sign up with email</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="text-xs font-medium text-[#e4e4e7] font-['Inter',sans-serif]">
                                Full Name*
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-md text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#52525b] focus:ring-1 focus:ring-[#52525b] transition-all font-['Inter',sans-serif]"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-xs font-medium text-[#e4e4e7] font-['Inter',sans-serif]">
                                Email*
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-md text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#52525b] focus:ring-1 focus:ring-[#52525b] transition-all font-['Inter',sans-serif]"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="text-xs font-medium text-[#e4e4e7] font-['Inter',sans-serif]">
                                    Password*
                                </label>
                            </div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-md text-sm text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#52525b] focus:ring-1 focus:ring-[#52525b] transition-all font-['Inter',sans-serif]"
                                placeholder="Create a password"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 bg-white hover:bg-[#e4e4e7] text-black text-sm font-medium rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center font-['Inter',sans-serif] mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center pt-6">
                        <p className="text-xs text-[#a1a1aa] font-['Inter',sans-serif]">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="font-semibold text-white hover:text-[#e4e4e7] transition-colors"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
        </div>
    );
}
