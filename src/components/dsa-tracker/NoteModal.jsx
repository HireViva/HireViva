import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Trash2 } from "lucide-react";

export const NoteModal = ({
  isOpen,
  onClose,
  questionId,
  questionTitle,
  existingNote,
  onSave,
  onDelete,
}) => {
  const [content, setContent] = useState(existingNote?.content || "");

  // Sync content when modal opens with different note
  useEffect(() => {
    setContent(existingNote?.content || "");
  }, [existingNote, questionId]);

  const handleSave = () => {
    if (content.trim()) {
      onSave(questionId, content.trim());
    }
    onClose();
  };

  const handleDelete = () => {
    onDelete(questionId);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
    if (e.key === "Enter" && e.ctrlKey) {
      handleSave();
    }
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onKeyDown={handleKeyDown}
          >
            <div className="glass-card w-full max-w-lg p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground">
                    Add Note
                  </h3>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {questionTitle}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Textarea */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your notes here... (Ctrl+Enter to save)"
                autoFocus
                maxLength={1000}
                className="w-full h-40 p-3 rounded-lg bg-secondary/30 border border-border/50
                           text-foreground placeholder:text-muted-foreground/50
                           focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                           resize-none custom-scrollbar"
              />

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {existingNote?.lastUpdated && (
                    <span>
                      Last updated:{" "}
                      {new Date(existingNote.lastUpdated).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {existingNote && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDelete}
                      className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400
                                 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Delete</span>
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="btn-glow-blue flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
