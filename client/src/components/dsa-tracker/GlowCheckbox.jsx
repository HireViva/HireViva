import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const GlowCheckbox = ({ checked, onChange }) => {
  return (
    <motion.button
      onClick={onChange}
      whileTap={{ scale: 0.9 }}
      className={`
        w-6 h-6 rounded-md border-2 flex items-center justify-center
        transition-all duration-300 cursor-pointer
        ${checked
          ? 'bg-primary border-primary checkbox-glow'
          : 'bg-transparent border-muted-foreground/40 hover:border-primary/60'
        }
      `}
    >
      <motion.div
        initial={false}
        animate={{
          scale: checked ? 1 : 0,
          opacity: checked ? 1 : 0
        }}
        transition={{ duration: 0.2, type: "spring", stiffness: 500 }}
      >
        <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
      </motion.div>
    </motion.button>
  );
};
