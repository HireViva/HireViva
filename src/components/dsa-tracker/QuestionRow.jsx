import { motion } from "framer-motion";
import { Star, NotebookPen } from "lucide-react";
import { GlowCheckbox } from "./GlowCheckbox";
import { LinkButton } from "./LinkIcons";
import confetti from "canvas-confetti";

export const QuestionRow = ({
  question,
  isSolved,
  isStarred,
  note,
  onToggleSolved,
  onToggleStar,
  onOpenNote,
  index,
}) => {
  const rowId = `question-${question.id}`;
  const hasNote = !!note?.content;

  const handleSolvedToggle = () => {
    if (!isSolved) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#22c55e', '#f97316', '#eab308'],
        scalar: 0.8,
      });
    }
    onToggleSolved();
  };

  return (
    <motion.tr
      id={rowId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="table-row-hover border-b border-border/30 group transition-all duration-300"
    >
      {/* Checkbox */}
      <td className="py-4 px-4">
        <GlowCheckbox checked={isSolved} onChange={handleSolvedToggle} />
      </td>

      {/* ID */}
      <td className="py-4 px-3 font-mono text-muted-foreground text-sm">
        {question.id}
      </td>

      {/* Question Title */}
      <td className="py-4 px-4">
        <span
          className={`text-foreground transition-all duration-300 ${isSolved ? 'line-through-animated text-muted-foreground' : ''
            }`}
        >
          {question.title}
        </span>
      </td>

      {/* Links */}
      <td className="py-4 px-4">
        <div className="flex items-center justify-center gap-2">
          {question.links.leetcode && (
            <LinkButton href={question.links.leetcode} />
          )}
        </div>
      </td>

      {/* Star */}
      <td className="py-4 px-4">
        <div className="flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleStar}
            className="p-1"
          >
            <Star
              className={`w-5 h-5 transition-all duration-300 ${isStarred
                ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                : 'text-muted-foreground hover:text-yellow-400/70'
                }`}
            />
          </motion.button>
        </div>
      </td>

      {/* Note */}
      <td className="py-4 px-4">
        <div className="flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={onOpenNote}
            className="p-1"
          >
            <NotebookPen
              className={`w-5 h-5 transition-all duration-300 ${hasNote
                ? 'fill-blue-400/20 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                : 'text-muted-foreground hover:text-blue-400/70'
                }`}
            />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};
