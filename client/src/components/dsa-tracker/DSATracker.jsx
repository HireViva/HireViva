import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { questions, initialProgress } from "./data";
import { ControlBar } from "./ControlBar";
import { QuestionRow } from "./QuestionRow";
import { NoteModal } from "./NoteModal";

export const DSATracker = () => {
  const [progress, setProgress] = useState(initialProgress);
  const [searchQuery, setSearchQuery] = useState("");

  // Note modal state
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  // Filtered questions based on search
  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return questions;
    return questions.filter((q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Toggle functions
  const toggleSolved = (id) => {
    setProgress((prev) => ({
      ...prev,
      solved: prev.solved.includes(id)
        ? prev.solved.filter((i) => i !== id)
        : [...prev.solved, id],
    }));
  };

  const toggleStar = (id) => {
    setProgress((prev) => ({
      ...prev,
      starred: prev.starred.includes(id)
        ? prev.starred.filter((i) => i !== id)
        : [...prev.starred, id],
    }));
  };

  // Note functions
  const openNoteModal = (questionId) => {
    setActiveQuestionId(questionId);
    setNoteModalOpen(true);
  };

  const saveNote = (questionId, content) => {
    setProgress((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [questionId]: {
          content,
          lastUpdated: new Date().toISOString(),
        },
      },
    }));
  };

  const deleteNote = (questionId) => {
    setProgress((prev) => {
      const { [questionId]: _, ...remainingNotes } = prev.notes;
      return {
        ...prev,
        notes: remainingNotes,
      };
    });
  };

  const activeQuestion = activeQuestionId !== null
    ? questions.find(q => q.id === activeQuestionId)
    : null;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Stats */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6"
        >
          <div className="flex items-center gap-4">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg glass-card text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="text-primary">CODING</span>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-foreground">SHEET</span>
            </h1>
          </div>

          {/* Stats Badge - Top Right */}
          <div className="flex items-center gap-4 glass-card px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Progress</span>
              <span className="text-primary font-mono font-semibold">
                {Math.round((progress.solved.length / questions.length) * 100)}%
              </span>
            </div>
            <div className="w-px h-4 bg-border/50" />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Starred</span>
              <span className="text-yellow-400 font-mono font-semibold">
                {progress.starred.length}
              </span>
            </div>
            <div className="w-px h-4 bg-border/50" />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Notes</span>
              <span className="text-blue-400 font-mono font-semibold">
                {Object.keys(progress.notes).length}
              </span>
            </div>
          </div>
        </motion.header>

        {/* Control Bar */}
        <ControlBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          solvedCount={progress.solved.length}
          totalCount={questions.length}
        />

        {/* Questions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="py-4 px-4 text-left w-12">
                  </th>
                  <th className="py-4 px-3 text-left font-mono text-muted-foreground text-sm">
                    id
                  </th>
                  <th className="py-4 px-4 text-center text-muted-foreground font-medium">
                    Questions
                  </th>
                  <th className="py-4 px-4 text-center text-muted-foreground font-medium">
                    Links
                  </th>
                  <th className="py-4 px-4 text-center text-muted-foreground font-medium">
                    Star
                  </th>
                  <th className="py-4 px-4 text-center text-muted-foreground font-medium">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((question, index) => (
                  <QuestionRow
                    key={question.id}
                    question={question}
                    isSolved={progress.solved.includes(question.id)}
                    isStarred={progress.starred.includes(question.id)}
                    note={progress.notes[question.id]}
                    onToggleSolved={() => toggleSolved(question.id)}
                    onToggleStar={() => toggleStar(question.id)}
                    onOpenNote={() => openNoteModal(question.id)}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {filteredQuestions.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No questions found matching "{searchQuery}"
            </div>
          )}
        </motion.div>
      </div>

      {/* Note Modal */}
      <NoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        questionId={activeQuestionId ?? 0}
        questionTitle={activeQuestion?.title ?? ""}
        existingNote={activeQuestionId !== null ? progress.notes[activeQuestionId] : undefined}
        onSave={saveNote}
        onDelete={deleteNote}
      />
    </div>
  );
};
