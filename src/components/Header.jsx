import { motion } from "framer-motion";
import { Bell, ArrowRight } from "lucide-react";

const headerVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.3,
    },
  },
};

export default function Header() {
  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 lg:mb-12"
    >
      {/* Premium PDFs Banner */}
      <motion.div
        className="glass-card flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 flex-1 max-w-3xl"
        whileHover={{ scale: 1.01 }}
      >
        <Bell className="text-purple-glow hidden sm:block" size={20} />
        <p className="text-sm sm:text-base text-foreground/90 text-center sm:text-left">
          <span className="font-semibold">Premium PDFs 🔥</span>{" "}
          <span className="text-muted-foreground">
            Explore premium-quality notes with PDF previews. Unlock full access after purchase.
          </span>
        </p>
        <motion.a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-2 text-foreground font-medium whitespace-nowrap hover:text-purple-glow transition-colors"
          whileHover={{ x: 3 }}
        >
          View more <ArrowRight size={16} />
        </motion.a>
      </motion.div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary-gradient text-sm px-5 py-2.5"
        >
          Sign Up
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-outline-purple text-sm px-5 py-2.5"
        >
          Login
        </motion.button>
      </div>
    </motion.header>
  );
}
