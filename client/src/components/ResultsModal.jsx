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

                    {/* Modal — fills most of the screen */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-6 bg-card border border-border/50 rounded-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/80 backdrop-blur shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-primary/10">
                                    <Trophy className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold leading-tight">Quiz Results</h2>
                                    {attemptData && (
                                        <p className="text-xs text-muted-foreground">
                                            Mock Test {attemptData.testSet}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-sm text-muted-foreground">Loading results...</div>
                            </div>
                        ) : attemptData && questions ? (
                            <>
                                {/* Summary Stats — compact row */}
                                <div className="px-4 py-3 border-b border-border/50 bg-muted/20 shrink-0">
                                    <div className="grid grid-cols-4 gap-3">
                                        <div className="text-center p-2.5 rounded-xl bg-card border border-border/50">
                                            <div className="text-xl font-bold text-primary">{attemptData.percentage}%</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">Score</div>
                                        </div>
                                        <div className="text-center p-2.5 rounded-xl bg-card border border-border/50">
                                            <div className="text-xl font-bold text-green-500">{attemptData.correctAnswers}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">Correct</div>
                                        </div>
                                        <div className="text-center p-2.5 rounded-xl bg-card border border-border/50">
                                            <div className="text-xl font-bold text-red-500">{attemptData.incorrectAnswers}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">Wrong</div>
                                        </div>
                                        <div className="text-center p-2.5 rounded-xl bg-card border border-border/50">
                                            <div className="text-sm font-bold text-blue-500 flex items-center justify-center gap-1 mt-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {formatTime(attemptData.timeTaken)}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">Time</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Questions List — scrollable */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {questions.map((q, index) => (
                                        <div
                                            key={q.questionId}
                                            className={`p-3 rounded-xl border ${q.isCorrect
                                                ? 'bg-green-500/5 border-green-500/25'
                                                : 'bg-red-500/5 border-red-500/25'
                                                }`}
                                        >
                                            {/* Question header */}
                                            <div className="flex items-start gap-2 mb-2.5">
                                                <div className={`p-0.5 rounded-full shrink-0 mt-0.5 ${q.isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                                    {q.isCorrect ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-xs font-medium text-muted-foreground">Q{index + 1}. </span>
                                                    <span className="text-sm text-foreground leading-snug">{q.questionText}</span>
                                                </div>
                                            </div>

                                            {/* Options */}
                                            <div className="ml-6 space-y-1.5">
                                                {q.options.map((option, optIndex) => {
                                                    const isUserAnswer = q.userAnswer === optIndex;
                                                    const isCorrectAnswer = q.correctAnswer === optIndex;

                                                    let bgClass = 'bg-muted/30';
                                                    let borderClass = 'border-transparent';

                                                    if (isCorrectAnswer) {
                                                        bgClass = 'bg-green-500/15';
                                                        borderClass = 'border-green-500/60';
                                                    } else if (isUserAnswer && !q.isCorrect) {
                                                        bgClass = 'bg-red-500/15';
                                                        borderClass = 'border-red-500/60';
                                                    }

                                                    return (
                                                        <div
                                                            key={optIndex}
                                                            className={`px-3 py-1.5 rounded-lg border ${bgClass} ${borderClass} flex items-center gap-2`}
                                                        >
                                                            <span className="text-xs text-muted-foreground w-4 shrink-0">
                                                                {String.fromCharCode(65 + optIndex)}.
                                                            </span>
                                                            <span className="flex-1 text-xs leading-snug">{option}</span>
                                                            {isCorrectAnswer && (
                                                                <span className="text-xs px-1.5 py-0.5 rounded bg-green-500 text-white shrink-0">
                                                                    ✓
                                                                </span>
                                                            )}
                                                            {isUserAnswer && !isCorrectAnswer && (
                                                                <span className="text-xs px-1.5 py-0.5 rounded bg-red-500 text-white shrink-0">
                                                                    ✗
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
                                <div className="text-sm text-muted-foreground">No results available</div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
