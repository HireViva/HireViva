import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {user ? (
        // When logged in: Avatar on left, Logout on right
        <>
          {/* User Avatar - Left Side */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="fixed top-0 left-0 z-50 p-4 md:p-6"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-glow to-cyan-accent flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </motion.div>

          {/* Logout Button - Right Side */}
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="fixed top-0 right-0 z-50 p-4 md:p-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="btn-outline-purple text-sm px-5 py-2.5 flex items-center gap-2"
              title="Logout"
            >
              <LogOut size={16} />
              Logout
            </motion.button>
          </motion.div>
        </>
      ) : (
        // When not logged in: Auth buttons on right
        <motion.header
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="fixed top-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="btn-primary-gradient text-sm px-5 py-2.5"
            >
              Sign Up
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="btn-outline-purple text-sm px-5 py-2.5"
            >
              Login
            </motion.button>
          </div>
        </motion.header>
      )}
    </>
  );
}