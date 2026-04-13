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
                    <header className="mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
                        >
                            Mock Tests
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-muted-foreground"
                        >
                            Test your knowledge and prepare for your interviews with our curated mock tests.
                        </motion.p>
                    </header>

                    {loading ? (
                        <div className="text-center text-muted-foreground">Loading tests...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tests.map((test, index) => {
                                const attempt = userAttempts[test.id];
                                const isCompleted = !!attempt;

                                return (
                                    <motion.div
                                        key={test.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ y: -5 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className={`h-full p-6 rounded-2xl bg-card border transition-all duration-300 shadow-lg ${isCompleted
                                            ? 'border-green-500/50 hover:border-green-500/80 hover:shadow-green-500/10'
                                            : 'border-border/50 hover:border-primary/50 hover:shadow-primary/10'
                                            }`}>
                                            <div className="flex items-start justify-between mb-6">
                                                <div className={`p-3 rounded-xl transition-colors ${isCompleted
                                                    ? 'bg-green-500/10 text-green-500'
                                                    : 'bg-primary/10 text-primary'
                                                    }`}>
                                                    {isCompleted ? <CheckCircle size={24} /> : <BookOpen size={24} />}
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isCompleted
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-secondary text-secondary-foreground'
                                                    }`}>
                                                    {isCompleted ? 'Completed' : 'Available'}
                                                </span>
                                            </div>

                                            <h3 className={`text-xl font-semibold mb-2 transition-colors ${isCompleted ? 'text-green-400' : 'group-hover:text-primary'
                                                }`}>
                                                {test.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm mb-4">
                                                {test.description}
                                            </p>

                                            {/* Score Display for Completed Tests */}
                                            {isCompleted && (
                                                <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm text-muted-foreground">Your Score</span>
                                                        <span className="text-lg font-bold text-green-400">
                                                            {attempt.correctAnswers}/{attempt.totalQuestions} ({attempt.percentage}%)
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground">Attempts</span>
                                                        <span className="text-primary font-medium">
                                                            {attempt.attemptNumber} {attempt.attemptNumber === 1 ? 'attempt' : 'attempts'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={16} />
                                                    <span>~30 mins</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            {isCompleted ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleViewResults(attempt.attemptId)}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium text-sm"
                                                    >
                                                        <Eye size={16} />
                                                        View Results
                                                    </button>
                                                    <button
                                                        onClick={() => handleReAttempt(test.id)}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium text-sm"
                                                    >
                                                        <RotateCcw size={16} />
                                                        Re-attempt
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleStartTest(test.id)}
                                                    className="flex items-center text-primary font-medium text-sm hover:translate-x-1 transition-transform bg-transparent border-none cursor-pointer"
                                                >
                                                    Start Test <ArrowRight size={16} className="ml-1" />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Placeholder cards for coming soon tests */}
                            {Array(Math.max(0, 9 - tests.length)).fill(0).map((_, index) => (
                                <motion.div
                                    key={`placeholder-test-${index}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -5 }}
                                    transition={{ delay: (tests.length + index) * 0.1 }}
                                >
                                    <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10 group cursor-pointer">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <BookOpen size={24} />
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                                Coming Soon
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                            Mock Test {tests.length + index + 1}
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-6">
                                            This mock test will be available soon. Stay tuned!
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={16} />
                                                <span>~30 mins</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                                            Start Test <ArrowRight size={16} className="ml-1" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
>>>>>>> origin/main
                            {Array(Math.max(0, 9 - tests.length)).fill(0).map((_, index) => (
                                <motion.div
                                    key={`placeholder-test-${index}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -5 }}
                                    transition={{ delay: (tests.length + index) * 0.1 }}
                                >
                                    <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10 group cursor-pointer">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <BookOpen size={24} />
                                            </div>
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                                Coming Soon
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                            Mock Test {tests.length + index + 1}
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-6">
                                            This mock test will be available soon. Stay tuned!
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={16} />
                                                <span>~30 mins</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                                            Start Test <ArrowRight size={16} className="ml-1" />
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
