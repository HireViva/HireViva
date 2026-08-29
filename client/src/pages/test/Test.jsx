import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react"; // Replaced Icons
import { clsx } from "clsx";
import Timer from "../../components/Timer";
import QuestionCard from "../../components/QuestionCard";
import api from "../../api"; // Using our axios instance

export default function Test() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const hasSubmittedRef = useRef(false); // Track if test has been submitted

    useEffect(() => {
        if (!state?.attemptId) {
            // If no attempt ID, redirect to dashboard
            navigate("/mock-test");
        }
    }, [state, navigate]);

    const { attemptId, endTime } = state || {};

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for Navigation & Logic
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [bookmarks, setBookmarks] = useState(new Set());

    // Auto-submit function (without confirmation)
    const autoSubmitTest = async () => {
        if (hasSubmittedRef.current || !attemptId) return; // Prevent double submission
        hasSubmittedRef.current = true;

        try {
            console.log('Auto-submitting test...');
            const res = await api.post("/quiz/submit", { attemptId });
            const testId = window.location.pathname.split('/')[2];
            navigate(`/mock-test/${testId}/result`, { state: res.data, replace: true });
        } catch (err) {
            console.error('Auto-submit error:', err);
            hasSubmittedRef.current = false; // Reset on error
        }
    };

    // Detect navigation away and auto-submit
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!hasSubmittedRef.current) {
                // Auto-submit when user tries to close/reload
                autoSubmitTest();
                e.preventDefault();
                e.returnValue = 'Test will be auto-submitted if you leave';
            }
        };

        // Auto-submit on component unmount (navigation away)
        return () => {
            if (!hasSubmittedRef.current && attemptId) {
                // User is navigating away, auto-submit
                autoSubmitTest();
            }
        };
    }, [attemptId]);

    // Prevent browser back/forward navigation
    useEffect(() => {
        const handlePopState = (e) => {
            e.preventDefault();
            if (!hasSubmittedRef.current) {
                if (window.confirm('Leaving this page will auto-submit your test. Continue?')) {
                    autoSubmitTest();
                } else {
                    // Push state back to prevent navigation
                    window.history.pushState(null, '', window.location.pathname);
                }
            }
        };

        // Push initial state
        window.history.pushState(null, '', window.location.pathname);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [attemptId]);

    // Fetch questions
    useEffect(() => {
        if (!attemptId) return;
        // The source used GET /questions. My backend uses /questions with query param or just returns all.
        // My quizController.js getQuestions supports filtering by testSet via query, 
        // but here we are fetching ALL or based on what startTest initialized.
        // Actually the source `Test.jsx` just fetched ALL questions `http://localhost:5000/api/test/questions`.
        // I will match that behavior but using my endpoint.
        // Note: My backend gets questions for the SPECIFIC test set associated with the attempt would be better,
        // but let's stick to what the source did or what my new controller allows.
        // My new controller `getQuestions` returns based on query. 
        // But better yet, I should probably pass the testSet to the question fetch logic or fetch specific questions for the attempt. 
        // For simplicity and matching source: Fetching questions for the testAttempt if possible, or just all for that set.
        // Let's assume we fetch questions for the testId (which we don't have easily accessible here unless passed in state/url).
        // Wait, the URL is `/mock-test/:testId/attempt`. We can get testId from params.

        // However, the source just did `axios.get(".../questions")`.
        // Let's assume we fetch all for now or filter by testId if I can extract it.
        const pathParts = window.location.pathname.split('/');
        const testId = pathParts[2]; // /mock-test/1/attempt -> 1

        api.get(`/quiz/questions?testSet=${testId}`)
            .then(res => {
                setQuestions(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [attemptId]);

    // Navigation Handlers
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

    // Logic Handlers
    const saveAnswer = (questionId, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));

        api.post("/quiz/save-answer", {
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (questions.length === 0) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Questions Found</h2>
                <p className="text-gray-600 mb-6">The quiz database appears to be empty.</p>
                <button
                    onClick={() => navigate('/mock-test')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition w-full"
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
        <div className="h-screen max-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 shrink-0 px-6 py-2.5 z-30">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                        Quiz Challenge
                    </h1>
                    <div className="flex items-center gap-4">
                        <Timer endTime={endTime} onTimeUp={handleTimeUp} />
                        <button
                            onClick={submitTest}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer"
                        >
                            End Test
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 min-h-0 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden">
                {/* Main Content: Question Area */}
                <div className="lg:col-span-3 flex flex-col min-h-0 h-full">
                    {/* Top bar with question counter & bookmark */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-2.5 mb-2.5 shrink-0 flex justify-between items-center">
                        <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
                            Question <span className="text-indigo-600 ml-1.5">{currentQIndex + 1}</span>
                            <span className="text-gray-400 text-sm sm:text-base font-normal ml-1.5">/ {questions.length}</span>
                        </h2>
                        <button
                            onClick={() => toggleBookmark(currentQ._id)}
                            className={clsx(
                                "flex items-center gap-2 px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold transition-all transform active:scale-95",
                                isBookmarked ? "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                            )}
                        >
                            {isBookmarked ? <Bookmark className="w-3.5 h-3.5 fill-current" /> : <Bookmark className="w-3.5 h-3.5" />}
                            <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
                        </button>
                    </div>

                    {/* Question Card View */}
                    <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                        <QuestionCard
                            key={currentQ._id}
                            questionIndex={currentQIndex}
                            q={currentQ}
                            selected={answers[currentQ._id]}
                            onSelect={(op) => saveAnswer(currentQ._id, op)}
                        />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-2.5 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-200 shrink-0">
                        <button
                            onClick={handlePrev}
                            disabled={currentQIndex === 0}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs sm:text-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                        </button>

                        {isLastQuestion ? (
                            <button
                                onClick={submitTest}
                                className="flex items-center gap-1.5 px-5 py-2 rounded-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition transform hover:-translate-y-0.5 text-xs sm:text-sm"
                            >
                                <span>Submit Test</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-1.5 px-5 py-2 rounded-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition transform hover:-translate-y-0.5 text-xs sm:text-sm"
                            >
                                <span>Next Question</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Question Palette / Overview */}
                <div className="lg:col-span-1 flex flex-col min-h-0 h-full bg-white rounded-xl shadow-sm border border-gray-200 p-3.5">
                    <h3 className="font-semibold text-gray-800 text-xs uppercase tracking-wider mb-2 shrink-0">Overview</h3>
                    
                    <div className="flex-1 min-h-0 overflow-y-auto pr-1 grid grid-cols-5 gap-1.5 content-start">
                        {questions.map((q, idx) => {
                            const isAnswered = answers[q._id] !== undefined;
                            const isMarked = bookmarks.has(q._id);
                            const isCurrent = currentQIndex === idx;

                            let bgClass = "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100";
                            if (isMarked) bgClass = "bg-yellow-50 text-yellow-700 border-yellow-300";
                            else if (isAnswered) bgClass = "bg-green-50 text-green-700 border-green-300";

                            return (
                                <button
                                    key={q._id}
                                    onClick={() => jumpToQuestion(idx)}
                                    className={clsx(
                                        "w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold border transition-all duration-200",
                                        bgClass,
                                        isCurrent ? "ring-2 ring-indigo-200 border-indigo-600 z-10 scale-105 shadow-sm" : ""
                                    )}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 space-y-1.5 text-xs font-medium text-gray-600 bg-gray-50/80 p-2.5 rounded-lg shrink-0">
                        <div className="flex items-center"><div className="w-2.5 h-2.5 bg-green-50 border border-green-300 rounded-sm mr-2" /> Answered</div>
                        <div className="flex items-center"><div className="w-2.5 h-2.5 bg-yellow-50 border border-yellow-300 rounded-sm mr-2" /> Bookmarked</div>
                        <div className="flex items-center"><div className="w-2.5 h-2.5 bg-gray-50 border border-gray-300 rounded-sm mr-2" /> Not Visited</div>
                    </div>
                </div>
            </main>
        </div>
    );
}
