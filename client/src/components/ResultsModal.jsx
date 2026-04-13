import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, Trophy, Clock } from "lucide-react";

/**
 * ResultsModal Component
 * Shows detailed quiz results with correct/wrong answers
 */
export default function ResultsModal({ isOpen, onClose, attemptData, questions, loading }) {
    if (!isOpen) return null;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-10 lg:inset-20 bg-card border border-border/50 rounded-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-card/80 backdrop-blur">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/10">
                                    <Trophy className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Quiz Results</h2>
                                    {attemptData && (
                                        <p className="text-sm text-muted-foreground">
                                            Mock Test {attemptData.testSet}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg hover:bg-muted transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-muted-foreground">Loading results...</div>
                            </div>
                        ) : attemptData && questions ? (
                            <>
                                {/* Summary Stats */}
                                <div className="p-6 border-b border-border/50 bg-muted/20">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
                                            <div className="text-3xl font-bold text-primary">{attemptData.percentage}%</div>
                                            <div className="text-sm text-muted-foreground">Score</div>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
                                            <div className="text-3xl font-bold text-green-500">{attemptData.correctAnswers}</div>
                                            <div className="text-sm text-muted-foreground">Correct</div>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
                                            <div className="text-3xl font-bold text-red-500">{attemptData.incorrectAnswers}</div>
                                            <div className="text-sm text-muted-foreground">Wrong</div>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
                                            <div className="text-3xl font-bold text-blue-500 flex items-center justify-center gap-1">
                                                <Clock className="w-5 h-5" />
                                                {formatTime(attemptData.timeTaken)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Time Taken</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Questions List */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {questions.map((q, index) => (
                                        <div
                                            key={q.questionId}
                                            className={`p-4 rounded-xl border ${q.isCorrect
                                                    ? 'bg-green-500/5 border-green-500/30'
                                                    : 'bg-red-500/5 border-red-500/30'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className={`p-1 rounded-full ${q.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                                    {q.isCorrect ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-muted-foreground mb-1">
                                                        Question {index + 1}
                                                    </p>
                                                    <p className="text-foreground">{q.questionText}</p>
                                                </div>
                                            </div>

                                            <div className="ml-8 space-y-2">
                                                {q.options.map((option, optIndex) => {
                                                    const isUserAnswer = q.userAnswer === optIndex;
                                                    const isCorrectAnswer = q.correctAnswer === optIndex;

                                                    let bgClass = 'bg-muted/30';
                                                    let borderClass = 'border-transparent';

                                                    if (isCorrectAnswer) {
                                                        bgClass = 'bg-green-500/20';
                                                        borderClass = 'border-green-500';
                                                    } else if (isUserAnswer && !q.isCorrect) {
                                                        bgClass = 'bg-red-500/20';
                                                        borderClass = 'border-red-500';
                                                    }

                                                    return (
                                                        <div
                                                            key={optIndex}
                                                            className={`p-3 rounded-lg border ${bgClass} ${borderClass} flex items-center gap-2`}
                                                        >
                                                            <span className="text-sm text-muted-foreground w-6">
                                                                {String.fromCharCode(65 + optIndex)}.
                                                            </span>
                                                            <span className="flex-1">{option}</span>
                                                            {isCorrectAnswer && (
                                                                <span className="text-xs px-2 py-0.5 rounded bg-green-500 text-white">
                                                                    Correct
                                                                </span>
                                                            )}
                                                            {isUserAnswer && !isCorrectAnswer && (
                                                                <span className="text-xs px-2 py-0.5 rounded bg-red-500 text-white">
                                                                    Your Answer
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-muted-foreground">No results available</div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
