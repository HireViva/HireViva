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
  X,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";

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
      { icon: Bot, label: "AI Interview", path: "/ai-interview" },
      { icon: FileText, label: "Coding Sheet", path: "/coding-sheet" },
      {
        icon: BookOpen,
        label: "Core Subject",
        path: "#",
        subItems: [
          { label: "Study Material", path: "/study-material" },
          { label: "Mock Test", path: "/mock-test" }
        ]
      },
      {
        icon: Star,
        label: "Aptitude",
        path: "#",
        subItems: [
          { label: "Study Material", path: "/aptitude-study-material" },
          { label: "Mock Test", path: "/aptitude-mock-test" }
        ]
      },
      { icon: MessageSquare, label: "Communication", path: "/communication" },
    ],
  },
  {
    title: "PERFORMANCE",
    items: [
      { icon: TrendingUp, label: "Progress", path: "/progress" },
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
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditClick = () => {
    if (user) {
      setEditName(user.name);
      setIsEditing(true);
    }
  };

  const handleSaveName = async () => {
    if (!editName.trim() || editName.trim() === user.name) {
      setIsEditing(false);
      return;
    }
    
    setIsUpdating(true);
    try {
      const response = await api.put("/user/name", { name: editName.trim() });
      if (response.data.success) {
        setUser({ ...user, name: editName.trim() });
      }
    } catch (error) {
      console.error("Failed to update name", error);
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSaveName();
    if (e.key === "Escape") setIsEditing(false);
  };

  const Wrapper = animate ? motion.div : 'div';
  const wrapperProps = animate ? { variants: itemVariants } : {};

  // Randomize avatar based on user's email/name
  const avatarSeed = user ? user.email || user.name : 'guest';
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  return (
    <>
      {/* Beautiful Profile Banner */}
      <Wrapper
        {...wrapperProps}
        className="relative flex items-center gap-3 mb-8 mt-2 p-3 rounded-2xl bg-gradient-to-br from-sidebar-accent/50 to-sidebar-accent/10 border border-sidebar-border/50 shadow-sm overflow-hidden group"
      >
        {/* Glow effect behind banner */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Profile Picture */}
        <div className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-background/50 shadow-inner z-10">
          <img 
            src={avatarUrl} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Details */}
        <div className="flex-1 min-w-0 z-10">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveName}
                disabled={isUpdating}
                className="w-full bg-background/50 border border-primary/30 text-foreground text-sm font-semibold rounded px-1.5 py-0.5 outline-none focus:border-primary/60 transition-colors"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className="text-foreground font-semibold text-sm truncate">
                {user ? user.name : 'Guest'}
              </span>
              {user && (
                <button 
                  onClick={handleEditClick}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-foreground/10 rounded transition-all shrink-0 text-muted-foreground hover:text-foreground"
                  title="Edit Name"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
              )}
            </div>
          )}
          <span className="block text-muted-foreground text-xs truncate mt-0.5">
            {user ? user.email : 'Not logged in'}
          </span>
        </div>
      </Wrapper>
      {menuSections.map((section) => (
        <Wrapper key={section.title} {...wrapperProps} className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 tracking-wider">
            {section.title}
          </h3>
          <nav className="space-y-1">
            {section.items.map((item) => (
              <SidebarItem
                key={item.label}
                item={item}
                animate={animate}
                onItemClick={onItemClick}
              />
            ))}
          </nav>
        </Wrapper>
      ))}
    </>
  );
}

function SidebarItem({ item, animate, onItemClick }) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = location.pathname === item.path || (item.subItems && item.subItems.some(sub => location.pathname === sub.path));

  const handleClick = (e) => {
    if (item.subItems) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    } else {
      if (onItemClick) onItemClick();
    }
  };

  return (
    <div className="mb-1">
      <Link
        to={item.path}
        onClick={handleClick}
        className="block"
      >
        {animate ? (
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`sidebar-item flex items-center justify-between ${isActive ? "active" : ""}`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.subItems && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div
            className={`sidebar-item flex items-center justify-between ${isActive ? "active" : ""}`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.subItems && (
              <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown size={16} />
              </div>
            )}
          </div>
        )}
      </Link>

      <AnimatePresence>
        {item.subItems && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden ml-4 pl-4 border-l border-border/30 mt-1 space-y-1"
          >
            {item.subItems.map((subItem) => (
              <Link
                key={subItem.label}
                to={subItem.path}
                onClick={onItemClick}
                className={`block py-2 px-2 text-sm rounded-lg hover:text-primary hover:bg-sidebar-accent/50 transition-colors ${location.pathname === subItem.path ? "text-primary bg-sidebar-accent/50 font-medium" : "text-muted-foreground"
                  }`}
              >
                {subItem.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
