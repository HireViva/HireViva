import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { questions } from "./data";
import { ControlBar } from "./ControlBar";
import { QuestionRow } from "./QuestionRow";
import { NoteModal } from "./NoteModal";
import { progressService } from "@/services/progressService";

export const DSATracker = () => {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState({
    solved: [],
    starred: [],
    notes: {}
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  // Load progress on mount
  useEffect(() => {
    if (!authLoading && user) {
      loadProgress();
    } else if (!authLoading && !user) {
      // User not logged in, use local state
      setLoading(false);
    }
  }, [user, authLoading]);

  const loadProgress = async () => {
    try {
      const response = await progressService.getProgress();
      if (response.success) {
        setProgress(response.progress);
      }
    } catch (error) {
      toast.error('Failed to load progress');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return questions;
    return questions.filter((q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Toggle solved - with API call
  const toggleSolved = async (id) => {
    if (!user) {
      toast.info('Please login to save progress');
      // Still update local state for guest users
      setProgress((prev) => ({
        ...prev,
        solved: prev.solved.includes(id)
          ? prev.solved.filter((i) => i !== id)
          : [...prev.solved, id],
      }));
      return;
    }

    // Optimistic update
    const wasSolved = progress.solved.includes(id);
    setProgress((prev) => ({
      ...prev,
      solved: wasSolved
        ? prev.solved.filter((i) => i !== id)
        : [...prev.solved, id],
    }));

    try {
      const response = await progressService.toggleSolved(id);
      if (response.success) {
        // Update with server response
        setProgress((prev) => ({
          ...prev,
          solved: response.solved
        }));
      }
    } catch (error) {
      // Revert on error
      setProgress((prev) => ({
        ...prev,
        solved: wasSolved
          ? [...prev.solved, id]
          : prev.solved.filter((i) => i !== id),
      }));
      toast.error('Failed to update progress');
    }
  };

  // Toggle starred - with API call
  const toggleStar = async (id) => {
    if (!user) {
      toast.info('Please login to save bookmarks');
      setProgress((prev) => ({
        ...prev,
        starred: prev.starred.includes(id)
          ? prev.starred.filter((i) => i !== id)
          : [...prev.starred, id],
      }));
      return;
    }

    // Optimistic update
    const wasStarred = progress.starred.includes(id);
    setProgress((prev) => ({
      ...prev,
      starred: wasStarred
        ? prev.starred.filter((i) => i !== id)
        : [...prev.starred, id],
    }));

    try {
      const response = await progressService.toggleStarred(id);
      if (response.success) {
        setProgress((prev) => ({
          ...prev,
          starred: response.starred
        }));
      }
    } catch (error) {
      setProgress((prev) => ({
        ...prev,
        starred: wasStarred
          ? [...prev.starred, id]
          : prev.starred.filter((i) => i !== id),
      }));
      toast.error('Failed to update bookmark');
    }
  };

  const openNoteModal = (questionId) => {
    if (!user) {
      toast.info('Please login to save notes');
      return;
    }
    setActiveQuestionId(questionId);
    setNoteModalOpen(true);
  };

  const saveNote = async (questionId, content) => {
    if (!user) {
      toast.info('Please login to save notes');
      return;
    }

    // Optimistic update
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

    try {
      const response = await progressService.saveNote(questionId, content);
      if (response.success) {
        toast.success('Note saved');
      }
    } catch (error) {
      toast.error('Failed to save note');
      // Could revert here, but usually keep optimistic update
    }
  };

  const deleteNote = async (questionId) => {
    if (!user) return;

    // Optimistic update
    setProgress((prev) => {
      const { [questionId]: _, ...remainingNotes } = prev.notes;
      return {
        ...prev,
        notes: remainingNotes,
      };
    });

    try {
      const response = await progressService.deleteNote(questionId);
      if (response.success) {
        toast.success('Note deleted');
      }
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const activeQuestion = activeQuestionId !== null
    ? questions.find(q => q.id === activeQuestionId)
    : null;

  // Show loading while checking auth
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Show login prompt if not authenticated */}
        {!user && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-500">
              💡 <Link to="/login" className="underline font-semibold">Login</Link> to save your progress across devices
            </p>
          </div>
        )}

        {/* Header with Stats */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3"
        >
          <div className="flex items-center gap-3">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg glass-card text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              <span className="text-primary">CODING</span>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-foreground">SHEET</span>
            </h1>
          </div>

          {/* Stats Badge */}
          <div className="flex items-center gap-3 glass-card px-3 py-1.5">
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
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="py-2 px-4 text-left w-12"></th>
                  <th className="py-2 px-3 text-left font-mono text-muted-foreground text-sm">id</th>
                  <th className="py-2 px-4 text-center text-muted-foreground font-medium">Questions</th>
                  <th className="py-2 px-4 text-center text-muted-foreground font-medium">Links</th>
                  <th className="py-2 px-4 text-center text-muted-foreground font-medium">Star</th>
                  <th className="py-2 px-4 text-center text-muted-foreground font-medium">Note</th>
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
        </div>
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