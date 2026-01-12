import { motion } from "framer-motion";
import { Search, Check } from "lucide-react";

export const ControlBar = ({
  searchQuery,
  onSearchChange,
  solvedCount,
  totalCount,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
    >
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <input
          type="text"
          placeholder="Search Question.."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input pl-10 w-full"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>

      {/* Progress Badge */}
      <motion.div
        className="badge-progress"
        whileHover={{ scale: 1.02 }}
      >
        <span className="font-mono text-sm whitespace-nowrap">
          {solvedCount}/{totalCount} Done
        </span>
        <Check className="w-4 h-4 text-green-400" />
      </motion.div>
    </motion.div>
  );
};
