import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import Timer from "../components/Timer";
import QuestionCard from "../components/QuestionCard";
import api from "../api";

export default function AptitudeTest() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const hasSubmittedRef = useRef(false);

    useEffect(() => {
        if (!state?.attemptId) {
            navigate("/aptitude-mock-test");
        }
    }, [state, navigate]);

    const { attemptId, endTime } = state || {};

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [bookmarks, setBookmarks] = useState(new Set());

    const autoSubmitTest = async () => {
        if (hasSubmittedRef.current || !attemptId) return;
        hasSubmittedRef.current = true;

        try {
            console.log('Auto-submitting aptitude test...');
            const res = await api.post("/aptitude-quiz/submit", { attemptId });
            const testId = window.location.pathname.split('/')[2];
            navigate(`/aptitude-mock-test/${testId}/result`, { state: res.data, replace: true });
        } catch (err) {
            console.error('Auto-submit error:', err);
            hasSubmittedRef.current = false;
        }
    };

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!hasSubmittedRef.current) {
                autoSubmitTest();
                e.preventDefault();
                e.returnValue = 'Test will be auto-submitted if you leave';
            }
        };

        return () => {
            if (!hasSubmittedRef.current && attemptId) {
                autoSubmitTest();
            }
        };
    }, [attemptId]);

    useEffect(() => {
        const handlePopState = (e) => {
            e.preventDefault();
            if (!hasSubmittedRef.current) {
                if (window.confirm('Leaving this page will auto-submit your test. Continue?')) {
                    autoSubmitTest();
                } else {
                    window.history.pushState(null, '', window.location.pathname);
                }
            }
        };

        window.history.pushState(null, '', window.location.pathname);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [attemptId]);

    useEffect(() => {
        if (!attemptId) return;

        const pathParts = window.location.pathname.split('/');
        const testId = pathParts[2];

        api.get(`/aptitude-quiz/questions?testSet=${testId}`)
            .then(res => {
                setQuestions(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [attemptId]);

    const handleNext = () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQIndex > 0) {
            setCurrentQIndex(prev => prev - 1);
        }
    };

    const jumpToQuestion = (index) => {
        setCurrentQIndex(index);
    };

    const saveAnswer = (questionId, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));

        api.post("/aptitude-quiz/save-answer", {
            attemptId,
            questionId,
            selectedOption
        });
    };

    const toggleBookmark = (questionId) => {
        setBookmarks(prev => {
            const next = new Set(prev);
            if (next.has(questionId)) {
                next.delete(questionId);
            } else {
                next.add(questionId);
            }
            return next;
        });
    };

    const submitTest = async () => {
        if (!window.confirm("Are you sure you want to submit the test?")) return;
        await autoSubmitTest();
    };

    const handleTimeUp = async () => {
        console.log('Time is up! Auto-submitting test...');
        await autoSubmitTest();
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );

    if (questions.length === 0) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Questions Found</h2>
                <p className="text-gray-600 mb-6">The aptitude quiz database appears to be empty.</p>
                <button
                    onClick={() => navigate('/aptitude-mock-test')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition w-full"
                >
                    Go Back
                </button>
            </div>
        </div>
    );

    const currentQ = questions[currentQIndex];
    const isLastQuestion = currentQIndex === questions.length - 1;
    const isBookmarked = bookmarks.has(currentQ._id);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <main className="flex-1 flex flex-col">
                <header className="bg-white shadow-md sticky top-0 z-30 px-6 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent hidden sm:block tracking-tight">
                            Aptitude Quiz Challenge
                        </h1>
                        <Timer endTime={endTime} onTimeUp={handleTimeUp} />

                        <button
                            onClick={submitTest}
                            className="sm:hidden bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-purple-700 transition-colors"
                        >
                            Submit
                        </button>
                    </div>
                </header>

                <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 flex flex-col">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 flex justify-between items-center">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                                Question <span className="text-purple-600 text-2xl md:text-3xl">{currentQIndex + 1}</span>
                                <span className="text-gray-400 text-lg md:text-xl font-normal ml-2">/ {questions.length}</span>
                            </h2>
                            <button
                                onClick={() => toggleBookmark(currentQ._id)}
                                className={clsx(
                                    "flex items-center space-x-3 px-5 py-3 rounded-xl font-bold transition-all transform active:scale-95",
                                    isBookmarked ? "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                {isBookmarked ? <Bookmark className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
                                <span className="hidden md:inline">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
                            </button>
                        </div>

                        <div className="flex-1 relative min-h-[400px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQ._id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25 }}
                                    className="h-full"
                                >
                                    <QuestionCard
                                        questionIndex={currentQIndex}
                                        q={currentQ}
                                        selected={answers[currentQ._id]}
                                        onSelect={(op) => saveAnswer(currentQ._id, op)}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex justify-between items-center mt-8 bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 sticky bottom-4 z-20">
                            <button
                                onClick={handlePrev}
                                disabled={currentQIndex === 0}
                                className="flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition text-lg"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                <span className="hidden md:inline">Previous</span>
                            </button>

                            {isLastQuestion ? (
                                <button
                                    onClick={submitTest}
                                    className="flex items-center space-x-3 px-10 py-4 rounded-2xl font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 text-lg"
                                >
                                    <span>Submit Test</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center space-x-3 px-10 py-4 rounded-2xl font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 text-lg"
                                >
                                    <span className="hidden md:inline">Next</span>
                                    <span>Question</span>
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-6 text-lg border-b pb-4">Question Overview</h3>
                            <div className="grid grid-cols-5 gap-3">
                                {questions.map((q, idx) => {
                                    const isAnswered = answers[q._id] !== undefined;
                                    const isMarked = bookmarks.has(q._id);
                                    const isCurrent = currentQIndex === idx;

                                    let bgClass = "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100";
                                    if (isMarked) bgClass = "bg-yellow-100 text-yellow-700 border-yellow-300 ring-2 ring-yellow-100";
                                    else if (isAnswered) bgClass = "bg-green-100 text-green-700 border-green-300";

                                    return (
                                        <button
                                            key={q._id}
                                            onClick={() => jumpToQuestion(idx)}
                                            className={clsx(
                                                "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border-2 transition-all duration-200",
                                                bgClass,
                                                isCurrent ? "ring-4 ring-purple-200 border-purple-600 z-10 scale-110 shadow-lg" : ""
                                            )}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-8 space-y-3 text-sm font-medium text-gray-600 bg-gray-50 p-4 rounded-xl">
                                <div className="flex items-center"><div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-3" /> Answered</div>
                                <div className="flex items-center"><div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded mr-3" /> Bookmarked</div>
                                <div className="flex items-center"><div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded mr-3" /> Not Visited</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
