import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Bot, 
  FileText, 
  BookOpen, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Users,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menuSections = [
  {
    title: "MAIN",
    items: [
      { icon: Home, label: "Home", path: "/" },
    ],
  },
  {
    title: "LEARNING & PRACTICE",
    items: [
      { icon: Bot, label: "AI Interview", path: "#" },
      { icon: FileText, label: "Coding Sheet", path: "/coding-sheet" },
      { icon: BookOpen, label: "Core Subject", path: "#" },
      { icon: Star, label: "Aptitude", path: "#" },
      { icon: MessageSquare, label: "Communication", path: "/communication" },
    ],
  },
  {
    title: "PERFORMANCE & CONNECT",
    items: [
      { icon: TrendingUp, label: "Progress", path: "#" },
      { icon: Users, label: "ExpertTalk", path: "#" },
    ],
  },
];

const sidebarVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
  exit: {
    x: -280,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button - Always visible on mobile */}
      <motion.button
        onClick={toggleSidebar}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-sidebar/90 backdrop-blur-xl border border-border/50 text-foreground shadow-lg"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Always visible on lg+ */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="hidden lg:block fixed lg:relative top-0 left-0 h-screen w-64 bg-sidebar/60 backdrop-blur-xl border-r border-border/30 p-4 overflow-y-auto z-40"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar - Controlled by isOpen */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden fixed top-0 left-0 h-screen w-64 bg-sidebar/95 backdrop-blur-xl border-r border-border/30 p-4 overflow-y-auto z-40"
          >
            <SidebarContent onItemClick={() => setIsOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({ onItemClick }) {
  const location = useLocation();
  
  return (
    <>
      {/* Logo */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3 mb-8 mt-2"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-glow to-cyan-accent flex items-center justify-center">
          <span className="text-foreground font-bold text-lg">L</span>
        </div>
      </motion.div>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <motion.div key={section.title} variants={itemVariants} className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 tracking-wider">
            {section.title}
          </h3>
          <nav className="space-y-1">
            {section.items.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={onItemClick}
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </nav>
        </motion.div>
      ))}
    </>
  );
}
