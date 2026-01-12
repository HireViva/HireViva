import { motion } from "framer-motion";

export const LeetCodeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.483 2.173a1 1 0 011.414 0l2.93 2.93a1 1 0 01-1.414 1.414l-2.93-2.93a1 1 0 010-1.414z" />
    <path d="M10.06 5.596a4 4 0 015.657 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a2 2 0 00-2.829 0l-6.364 6.364a2 2 0 000 2.829l3.536 3.536a2 2 0 002.829 0l6.364-6.364a1 1 0 011.414 1.414l-6.364 6.364a4 4 0 01-5.657 0l-3.536-3.536a4 4 0 010-5.657l6.364-6.364z" />
    <path d="M20 12a1 1 0 100-2h-6a1 1 0 100 2h6z" />
  </svg>
);

export const LinkButton = ({ href }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      className="p-1.5 rounded-lg transition-colors text-yellow-400 hover:text-yellow-300 hover:bg-secondary/50"
    >
      <LeetCodeIcon />
    </motion.a>
  );
};
