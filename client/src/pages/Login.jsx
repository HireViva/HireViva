import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();
    const [formData, setFormData] = useState({
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
        console.log('Login form submitted', formData);

        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            console.log('Sending login request to:', '/auth/login');
            const response = await api.post('/auth/login', formData);
            console.log('Login response:', response.data);

            if (response.data.success) {
                toast.success(response.data.message);
                await checkAuth(); // Refresh auth state
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
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
                    <div className="glow-orb w-full h-full bg-green-accent/20" style={{ animationDelay: "2s" }} />
                </div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="glass-card p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2 font-['Poppins']">
                            <span className="text-gradient-purple">Welcome Back</span>
                        </h1>
                        <p className="text-muted-foreground">Sign in to your account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="auth-input w-full px-4 py-3 bg-input border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground/80 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="auth-input w-full px-4 py-3 bg-input border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 cursor-pointer"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary-gradient w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center space-y-3">
                        <p className="text-muted-foreground">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/signup')}
                                className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200 cursor-pointer"
                            >
                                Sign up
                            </button>
                        </p>
                        <p className="text-muted-foreground">
                            <button
                                onClick={() => navigate('/forgot-password')}
                                className="text-cyan-accent hover:text-cyan-accent/80 font-medium transition-colors duration-200 cursor-pointer"
                            >
                                Forgot Password?
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
