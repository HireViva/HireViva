import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Clock, CheckCircle, RotateCcw, Eye } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import ResultsModal from "../../components/ResultsModal";
import UpgradePrompt from "../../components/UpgradePrompt";
import { useSubscription } from "../../hooks/useSubscription";
import api from "../../api";

export default function MockTestDashboard() {
    const [tests, setTests] = useState([]);
    const [userAttempts, setUserAttempts] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAttempt, setSelectedAttempt] = useState(null);
    const [attemptDetails, setAttemptDetails] = useState({ attempt: null, questions: [] });
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
    const { subscription, canAccessMockTest } = useSubscription();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTests();
        fetchUserAttempts();
    }, []);

    const fetchTests = async () => {
        try {
            const response = await api.get("/quiz/tests");
            if (response.data.success) {
                setTests(response.data.tests);
            }
        } catch (error) {
            console.error("Error fetching tests:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserAttempts = async () => {
        try {
            const response = await api.get("/quiz/user-attempts");
            if (response.data.success) {
                setUserAttempts(response.data.attempts);
            }
        } catch (error) {
            console.error("Error fetching user attempts:", error);
        }
    };

    const handleViewResults = async (attemptId) => {
        setSelectedAttempt(attemptId);
        setModalOpen(true);
        setDetailsLoading(true);

        try {
            const response = await api.get(`/quiz/attempt/${attemptId}/details`);
            if (response.data.success) {
                setAttemptDetails({
                    attempt: response.data.attempt,
                    questions: response.data.questions
                });
            }
        } catch (error) {
            console.error("Error fetching attempt details:", error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedAttempt(null);
        setAttemptDetails({ attempt: null, questions: [] });
    };

    const handleReAttempt = (testId) => {
        if (!canAccessMockTest()) {
            setShowUpgradePrompt(true);
            return;
        }
        navigate(`/mock-test/${testId}/start`);
    };

    const handleStartTest = (testId) => {
        if (!canAccessMockTest()) {
            setShowUpgradePrompt(true);
            return;
        }
        navigate(`/mock-test/${testId}/start`);
    };

    return (
        <div className="min-h-screen bg-background flex w-full">
            <Sidebar />
            {showUpgradePrompt && (
                <UpgradePrompt
                    currentTier={subscription?.tier || 'free'}
                    requiredTier={subscription?.tier === 'free' ? 'basic' : 'pro'}
                    feature="Mock Tests"
                    onClose={() => setShowUpgradePrompt(false)}
                />
            )}
            <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 lg:ml-64 relative">
                {/* Background Gradients */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto">
                    <header className="mb-6">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
                        >
                            Mock Tests
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-sm text-muted-foreground"
                        >
                            Test your knowledge and prepare for your interviews with our curated mock tests.
                        </motion.p>
                    </header>

                    {loading ? (
                        <div className="text-center text-muted-foreground">Loading tests...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tests.map((test, index) => {
                                const attempt = userAttempts[test.id];
                                const isCompleted = !!attempt;

                                return (
                                    <motion.div
                                        key={test.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ y: -3 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="h-[220px]"
                                    >
                                        <div className={`h-full flex flex-col p-4 rounded-2xl bg-card border transition-all duration-300 ${isCompleted
                                            ? 'border-green-500/40 hover:border-green-500/70'
                                            : 'border-border/50 hover:border-primary/60'
                                            }`}>

                                            {/* Top Row: Icon + Badge */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-500/15 text-green-400' : 'bg-primary/15 text-primary'}`}>
                                                    {isCompleted ? <CheckCircle size={18} /> : <BookOpen size={18} />}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock size={12} /> 30 min
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'}`}>
                                                        {isCompleted ? 'Done' : 'Free'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Middle: Title + Description */}
                                            <div className="flex-1 min-h-0">
                                                <h3 className={`text-sm font-bold mb-1 leading-snug ${isCompleted ? 'text-green-400' : 'text-foreground'}`}>
                                                    {test.title}
                                                </h3>
                                                {isCompleted ? (
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-xs text-muted-foreground">Score:</span>
                                                        <span className="text-sm font-bold text-green-400">
                                                            {attempt.correctAnswers}/{attempt.totalQuestions}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">({attempt.percentage}%)</span>
                                                        <span className="ml-auto text-xs text-muted-foreground">{attempt.attemptNumber} attempt{attempt.attemptNumber !== 1 ? 's' : ''}</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                                        {test.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Bottom: Action Buttons */}
                                            <div className="mt-3">
                                                {isCompleted ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleViewResults(attempt.attemptId)}
                                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-xs border border-primary/20"
                                                        >
                                                            <Eye size={13} /> View Results
                                                        </button>
                                                        <button
                                                            onClick={() => handleReAttempt(test.id)}
                                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-muted/60 text-foreground hover:bg-muted transition-colors font-medium text-xs border border-border/40"
                                                        >
                                                            <RotateCcw size={13} /> Retry
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleStartTest(test.id)}
                                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold text-xs"
                                                    >
                                                        Start Test <ArrowRight size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Placeholder cards */}
                            {Array(Math.max(0, 9 - tests.length)).fill(0).map((_, index) => (
                                <motion.div
                                    key={`placeholder-${index}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: (tests.length + index) * 0.05 }}
                                    className="h-[220px]"
                                >
                                    <div className="h-full flex flex-col p-4 rounded-2xl bg-card border border-border/30 opacity-50">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="p-2 rounded-lg bg-muted/40 text-muted-foreground">
                                                <BookOpen size={18} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock size={12} /> 30 min
                                                </span>
                                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-muted/60 text-muted-foreground">
                                                    Soon
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-h-0">
                                            <h3 className="text-sm font-bold mb-1 text-muted-foreground">
                                                Mock Test {tests.length + index + 1}
                                            </h3>
                                            <p className="text-xs text-muted-foreground/70 leading-relaxed">
                                                Coming soon. Stay tuned!
                                            </p>
                                        </div>
                                        <div className="mt-3">
                                            <div className="w-full py-2.5 rounded-lg bg-muted/30 text-center text-xs text-muted-foreground font-medium">
                                                Coming Soon
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Results Modal */}
            <ResultsModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                attemptData={attemptDetails.attempt}
                questions={attemptDetails.questions}
                loading={detailsLoading}
            />
        </div>
    );
}
