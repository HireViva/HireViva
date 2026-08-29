import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, AlertCircle, CheckCircle, ArrowRight, ArrowLeft, Bot, Sparkles, Zap, Shield } from 'lucide-react';
import { getApiBaseUrl } from '../../lib/apiConfig';
import AIInterviewLayout from './AIInterviewLayout';
import './LandingPage.css';

import UpgradePrompt from '../../components/UpgradePrompt';
import { useSubscription } from '../../hooks/useSubscription';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
    const { subscription, canAccessAIInterview } = useSubscription();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setError('');
        setUploadSuccess(false);

        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            setError('Only PDF files are allowed.');
            return;
        }

        if (selectedFile.size > 2 * 1024 * 1024) {
            setError('File size must be less than 2MB.');
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!canAccessAIInterview()) {
            setShowUpgradePrompt(true);
            return;
        }

        if (!file) return;

        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const apiUrl = getApiBaseUrl();
            const response = await fetch(`${apiUrl}/resume/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setUploadSuccess(true);
            setTimeout(() => {
                navigate('/ai-interview/setup', { state: { resumeText: data.text } });
            }, 1000);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSkip = () => {
        if (!canAccessAIInterview()) {
            setShowUpgradePrompt(true);
            return;
        }
        navigate('/ai-interview/setup');
    };

    return (
        <AIInterviewLayout>
            <div className="flex flex-col h-full overflow-hidden relative p-2 sm:p-4 md:p-6">
                {showUpgradePrompt && (
                    <UpgradePrompt
                        currentTier={subscription?.tier || 'free'}
                        requiredTier="pro"
                        feature="AI Interviews"
                        onClose={() => setShowUpgradePrompt(false)}
                    />
                )}

                {/* Decorative Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[100px]" />
                </div>

                <div className="w-full max-w-5xl mx-auto flex flex-col h-full relative z-10">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-4 sm:mb-8 shrink-0">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border/50 hover:bg-muted/80 text-sm text-muted-foreground transition-all group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </button>
                        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-xs font-medium text-primary">AI Agent Online</span>
                        </div>
                    </div>

                    {/* Main Content Layout */}
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 lg:gap-16 flex-1 min-h-0">
                        
                        {/* Left Column - Copy */}
                        <div className="flex-1 flex flex-col justify-center">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary w-fit mb-4"
                            >
                                <Sparkles size={14} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Next-Gen Interview</span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-foreground"
                            >
                                Master Your <br/>
                                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                    Technical Interview
                                </span>
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md"
                            >
                                Experience realistic, dynamic AI-driven interviews. Upload your resume to instantly generate personalized technical questions based on your unique skill set.
                            </motion.p>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Zap size={16} className="text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground">Adaptive AI</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">Questions adapt to your experience</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                                        <Shield size={16} className="text-success" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground">Private & Secure</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">Your resume data is never stored</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Upload Card */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto"
                        >
                            <div className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="relative z-10 flex flex-col h-full">
                                    <h3 className="text-lg font-semibold text-foreground mb-1 text-center">Configure Interview</h3>
                                    <p className="text-xs text-muted-foreground text-center mb-5">Upload your resume for a personalized session</p>

                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            id="resume-upload"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <label 
                                            htmlFor="resume-upload" 
                                            className={`flex flex-col items-center justify-center h-[160px] sm:h-[180px] border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${file ? 'border-success/50 bg-success/5' : 'border-border hover:border-primary/50 hover:bg-primary/5 bg-background/50'}`}
                                        >
                                            {file ? (
                                                <div className="text-center px-4">
                                                    <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                                                        <FileText size={24} className="text-success" />
                                                    </div>
                                                    <p className="text-sm font-medium text-foreground truncate max-w-[200px] mx-auto">{file.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            ) : (
                                                <div className="text-center px-4">
                                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                        <Upload size={20} className="text-primary" />
                                                    </div>
                                                    <p className="text-sm font-medium text-foreground">Click to upload PDF</p>
                                                    <p className="text-xs text-muted-foreground mt-1">Max 2MB. Virus scan included.</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>

                                    <div className="h-12 mt-4 flex flex-col justify-center shrink-0">
                                        {error && (
                                            <div className="flex items-center justify-center gap-2 text-danger bg-danger/10 p-2 rounded-lg text-xs">
                                                <AlertCircle size={14} />
                                                <span>{error}</span>
                                            </div>
                                        )}
                                        {uploadSuccess && (
                                            <div className="flex items-center justify-center gap-2 text-success bg-success/10 p-2 rounded-lg text-xs">
                                                <CheckCircle size={14} />
                                                <span>Processing...</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex flex-col gap-3 shrink-0">
                                        <button
                                            onClick={handleUpload}
                                            disabled={!file || isUploading || uploadSuccess}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 disabled:from-muted/50 disabled:to-muted/50 disabled:text-muted-foreground disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
                                        >
                                            {isUploading ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                                                    Analyzing Resume...
                                                </span>
                                            ) : 'Start Tailored Interview'}
                                        </button>

                                        <button 
                                            onClick={handleSkip} 
                                            className="w-full bg-background border border-border/50 hover:bg-muted text-foreground py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                                        >
                                            Continue without Resume
                                            <ArrowRight size={14} />
                                        </button>

                                        {subscription && subscription.aiInterviews && subscription.aiInterviews.remaining !== 'unlimited' && (
                                            <p className="text-center text-xs text-muted-foreground mt-1">
                                                You have <span className="font-semibold text-primary">{subscription.aiInterviews.remaining} free</span> interviews left.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AIInterviewLayout>
    );
};

export default LandingPage;
