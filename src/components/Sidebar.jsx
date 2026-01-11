import { motion } from "framer-motion";
import { 
  Home, 
  Search, 
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

const menuSections = [
  {
    title: "MAIN",
    items: [
      { icon: Home, label: "Home", active: true },
      { icon: Search, label: "Search" },
    ],
  },
  {
    title: "LEARNING & PRACTICE",
    items: [
      { icon: Bot, label: "AI Interview" },
      { icon: FileText, label: "Coding Sheet" },
      { icon: BookOpen, label: "Core Subject" },
      { icon: Star, label: "Aptitude" },
      { icon: MessageSquare, label: "Communication" },
    ],
  },
  {
    title: "PERFORMANCE & CONNECT",
    items: [
      { icon: TrendingUp, label: "Progress" },
      { icon: Users, label: "ExpertTalk" },
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

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-sidebar/80 backdrop-blur-xl border border-border/50 text-foreground"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className={`
          fixed lg:relative top-0 left-0 h-screen w-64 bg-sidebar/60 backdrop-blur-xl 
          border-r border-border/30 p-4 overflow-y-auto z-40
          transform transition-transform lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
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
        {menuSections.map((section, sectionIndex) => (
          <motion.div key={section.title} variants={itemVariants} className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground mb-3 tracking-wider">
              {section.title}
            </h3>
            <nav className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <motion.a
                  key={item.label}
                  href="#"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`sidebar-item ${item.active ? "active" : ""}`}
                  onClick={(e) => e.preventDefault()}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </motion.a>
              ))}
            </nav>
          </motion.div>
        ))}
      </motion.aside>
    </>
  );
}
