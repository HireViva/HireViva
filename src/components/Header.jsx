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
  return <motion.header variants={headerVariants} initial="hidden" animate="visible" className="flex flex-col items-center justify-between gap-4 mb-8 lg:mb-12 sm:flex sm:flex-row">
      {/* Premium PDFs Banner */}
      

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        <motion.button whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }} className="btn-primary-gradient text-sm px-5 py-2.5">
          Sign Up
        </motion.button>
        <motion.button whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }} className="btn-outline-purple text-sm px-5 py-2.5">
          Login
        </motion.button>
      </div>
    </motion.header>;
}