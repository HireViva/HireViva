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
import { useAuth } from "../context/AuthContext";

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
      <aside
        className="hidden lg:block fixed top-0 left-0 h-screen w-64 bg-sidebar/60 backdrop-blur-xl border-r border-border/30 p-4 overflow-y-auto z-40"
      >
        <SidebarContent animate={false} />
      </aside>

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
            <SidebarContent animate={true} onItemClick={() => setIsOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({ animate = true, onItemClick }) {
  const location = useLocation();
  const { user } = useAuth();

  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate ? { variants: itemVariants } : {};

  return (
    <>
      {/* User Info */}
      <Wrapper
        {...wrapperProps}
        className="flex flex-col gap-1 mb-8 mt-2 p-3 rounded-xl bg-sidebar-accent/30 border border-sidebar-border/30"
      >
        <span className="text-foreground font-semibold text-sm truncate">
          {user ? user.name : 'Guest'}
        </span>
        <span className="text-muted-foreground text-xs truncate">
          {user ? user.email : 'Not logged in'}
        </span>
      </Wrapper>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <Wrapper key={section.title} {...wrapperProps} className="mb-6">
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
                {animate ? (
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                ) : (
                  <div
                    className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                )}
              </Link>
            ))}
          </nav>
        </Wrapper>
      ))}
    </>
  );
}
