import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, CheckCircle, Play, ArrowLeft, ShieldAlert } from "lucide-react";
import api from "../../api";
import Sidebar from "../../components/Sidebar";

export default function StartTest() {
    const navigate = useNavigate();
    const { testId } = useParams();

    const testDetails = {
        title: `Mock Test ${testId}`,
        description: "Master your skills with this comprehensive assessment. Ensure you have a stable internet connection before starting.",
        duration: "30 Min",
        questions: "Varies",
    };

    const startTest = async () => {
        try {
            console.log("Starting test:", testId);
            const res = await api.post("/quiz/start", {
                testId: testId
            });

            navigate(`/mock-test/${testId}/attempt`, {
                state: {
                    attemptId: res.data.attemptId,
                    endTime: res.data.endTime
                }
            });
        } catch (err) {
            console.error("Error starting test:", err);
            const msg = err.response?.data?.message || err.message || "Failed to start test";
            alert(`Error: ${msg}`);
        }
    };

    return (
        <div className="min-h-screen bg-background flex w-full relative overflow-hidden font-sans">
            <Sidebar />
            
            <main className="flex-1 flex flex-col overflow-auto relative z-10 lg:ml-64">
                {/* Immersive Background Glows */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[150px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[150px]" />
                </div>

                {/* Header */}
                <header className="relative z-20 px-6 py-6 sm:px-12 flex justify-between items-center shrink-0">
                    <button
                        onClick={() => navigate('/mock-test')}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/50 border border-border/50 hover:bg-muted/80 text-sm text-muted-foreground transition-all group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Mock Tests
                    </button>
                </header>

                <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-12 relative z-10 min-h-0">
                    <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-stretch">
                        
                        {/* Left Column: Text & Info */}
                        <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary w-fit mx-auto lg:mx-0 mb-4"
                            >
                                <ShieldAlert size={14} />
                                <span className="text-xs font-bold uppercase tracking-wider">Proctored Environment</span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-4 tracking-tight leading-tight"
                            >
                                Ready to <br className="hidden lg:block"/>
                                <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">Challenge Yourself?</span>
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0"
                            >
                                {testDetails.description}
                            </motion.p>
                        </div>

                        {/* Right Column: The Start Card */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex-1 w-full max-w-md mx-auto lg:max-w-none flex flex-col"
                        >
                            <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full relative group">
                                
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                
                                {/* Card Header */}
                                <div className="p-8 border-b border-border/30 relative overflow-hidden bg-background/50">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] transform translate-x-10 -translate-y-10"></div>
                                    <h2 className="text-2xl font-bold text-foreground relative z-10">{testDetails.title}</h2>
                                    <p className="text-sm text-muted-foreground mt-1 relative z-10">Standard Assessment Protocol</p>
                                </div>

                                {/* Card Body */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-background/80 p-5 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center shadow-inner group-hover:border-primary/30 transition-colors">
                                            <Clock className="w-6 h-6 mb-2 text-primary" />
                                            <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Time Limit</span>
                                            <span className="text-xl font-bold text-foreground">{testDetails.duration}</span>
                                        </div>
                                        <div className="bg-background/80 p-5 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center shadow-inner group-hover:border-secondary/30 transition-colors">
                                            <CheckCircle className="w-6 h-6 mb-2 text-secondary" />
                                            <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1">Questions</span>
                                            <span className="text-xl font-bold text-foreground">{testDetails.questions}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <button
                                            onClick={startTest}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center gap-3 group/btn"
                                        >
                                            <span className="text-base tracking-wide">Enter Test Environment</span>
                                            <Play size={18} className="group-hover/btn:translate-x-1 transition-transform fill-current" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
