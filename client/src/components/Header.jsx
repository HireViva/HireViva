import { motion } from "framer-motion";
import { Bell, ArrowRight } from "lucide-react";
const headerVariants = {
  hidden: {
    y: -50,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.3
    }
  }
};
export default function Header() {
  return (
    <motion.header 
      variants={headerVariants} 
      initial="hidden" 
      animate="visible" 
      className="fixed top-0 right-0 z-50 p-4 md:p-6"
    >
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