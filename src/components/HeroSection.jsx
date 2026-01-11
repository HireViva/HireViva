import { useState } from "react";
import { motion } from "framer-motion";
import PricingModal from "./PricingModal";
import heroBrainGears from "@/assets/hero-brain-gears.png";

// GitHub-style staggered fade-up animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeUpVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

const imageVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 60,
    filter: "blur(20px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      delay: 0.4,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

const floatAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const glowPulse = {
  opacity: [0.4, 0.7, 0.4],
  scale: [1, 1.05, 1],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

// Cloud component
const Cloud = ({ className, delay, duration, startX, endX }) => (
  <motion.div
    initial={{ x: startX, opacity: 0 }}
    animate={{ 
      x: endX, 
      opacity: [0, 0.8, 0.8, 0],
    }}
    transition={{
      duration: duration,
      delay: delay,
      ease: "easeInOut",
    }}
    className={`absolute pointer-events-none ${className}`}
  >
    <svg viewBox="0 0 100 60" className="w-full h-full" fill="currentColor">
      <ellipse cx="30" cy="40" rx="25" ry="15" opacity="0.9" />
      <ellipse cx="55" cy="35" rx="30" ry="20" opacity="0.95" />
      <ellipse cx="75" cy="42" rx="20" ry="12" opacity="0.85" />
      <ellipse cx="45" cy="45" rx="22" ry="12" opacity="0.9" />
    </svg>
  </motion.div>
);

// Butterfly component with wing flapping animation
const Butterfly = () => {
  return (
    <motion.div
      initial={{ x: -200, y: -150, opacity: 0, scale: 0.5 }}
      animate={{ 
        x: [null, -100, -50, 0, 10, 5],
        y: [null, -100, -50, -20, 0, -5],
        opacity: [0, 1, 1, 1, 1, 1],
        scale: [0.5, 0.7, 0.8, 0.9, 1, 1],
        rotate: [0, -10, 5, -5, 0, 0],
      }}
      transition={{
        duration: 3,
        delay: 1.5,
        ease: [0.25, 0.1, 0.25, 1],
        times: [0, 0.2, 0.4, 0.7, 0.9, 1],
      }}
      className="absolute -top-8 -left-4 z-20"
    >
      <motion.svg 
        width="40" 
        height="35" 
        viewBox="0 0 50 40"
        animate={{ 
          y: [0, -2, 0, -1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 4.5,
          ease: "easeInOut",
        }}
      >
        {/* Left wing */}
        <motion.path
          d="M25 20 C15 10, 5 15, 8 25 C10 30, 20 28, 25 20"
          fill="url(#wingGradient1)"
          animate={{ 
            d: [
              "M25 20 C15 10, 5 15, 8 25 C10 30, 20 28, 25 20",
              "M25 20 C18 15, 10 18, 12 24 C14 28, 21 26, 25 20",
              "M25 20 C15 10, 5 15, 8 25 C10 30, 20 28, 25 20",
            ]
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Right wing */}
        <motion.path
          d="M25 20 C35 10, 45 15, 42 25 C40 30, 30 28, 25 20"
          fill="url(#wingGradient2)"
          animate={{ 
            d: [
              "M25 20 C35 10, 45 15, 42 25 C40 30, 30 28, 25 20",
              "M25 20 C32 15, 40 18, 38 24 C36 28, 29 26, 25 20",
              "M25 20 C35 10, 45 15, 42 25 C40 30, 30 28, 25 20",
            ]
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Wing patterns */}
        <circle cx="15" cy="18" r="3" fill="rgba(255,255,255,0.4)" />
        <circle cx="35" cy="18" r="3" fill="rgba(255,255,255,0.4)" />
        <circle cx="12" cy="24" r="2" fill="rgba(255,255,255,0.3)" />
        <circle cx="38" cy="24" r="2" fill="rgba(255,255,255,0.3)" />
        {/* Body */}
        <ellipse cx="25" cy="22" rx="2" ry="8" fill="#2d1b4e" />
        {/* Antennae */}
        <path d="M24 14 Q22 10, 20 8" stroke="#2d1b4e" strokeWidth="1" fill="none" />
        <path d="M26 14 Q28 10, 30 8" stroke="#2d1b4e" strokeWidth="1" fill="none" />
        <circle cx="20" cy="8" r="1.5" fill="#a855f7" />
        <circle cx="30" cy="8" r="1.5" fill="#a855f7" />
        {/* Gradients */}
        <defs>
          <linearGradient id="wingGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="wingGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </motion.svg>
    </motion.div>
  );
};

export default function HeroSection() {
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  return (
    <>
      <section className="relative flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 py-8 lg:py-16 overflow-hidden">
        {/* Animated Clouds */}
        <Cloud 
          className="w-32 h-20 text-white/10 top-10 left-0"
          delay={0.5}
          duration={8}
          startX={-150}
          endX={200}
        />
        <Cloud 
          className="w-40 h-24 text-purple-glow/15 top-24 right-0"
          delay={1}
          duration={10}
          startX={400}
          endX={-100}
        />

        {/* Background Glowing Orb */}
        <motion.div 
          animate={glowPulse}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        >
          <div className="glow-orb w-full h-full bg-purple-glow/30" />
        </motion.div>
        <motion.div 
          animate={{ ...glowPulse, transition: { ...glowPulse.transition, delay: 1.5 } }}
          className="absolute top-1/3 right-1/4 w-[300px] h-[300px] pointer-events-none"
        >
          <div className="glow-orb w-full h-full bg-cyan-accent/20" />
        </motion.div>

        {/* Text Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex-1 max-w-2xl text-center lg:text-left"
        >
          <motion.p
            variants={fadeUpVariants}
            className="brand-text text-xl sm:text-2xl font-semibold mb-4"
          >
            LastMinuteEngineering
          </motion.p>

          <motion.h1
            variants={fadeUpVariants}
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            Your Comprehensive
            <br />
            <span className="text-gradient-purple">Tech Interview Hub</span>
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
          >
            LastMinuteEngineering is a dedicated platform that helps engineering students 
            excel in exams with Free resources, Concise Notes, MAKAUT PYQs, and smart 
            topic-focused Suggestions. We make Preparation Easier and more Effective.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <div className="relative">
              {/* Butterfly landing on button */}
              <Butterfly />
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPricingOpen(true)}
                className="btn-primary-gradient w-full sm:w-auto"
              >
                Explore Premium Plans
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline-purple w-full sm:w-auto"
            >
              Try AI Interview Free
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Hero Image - 3D Brain with Gears and Clouds */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          className="relative flex-1 flex items-center justify-center lg:justify-end"
        >
          <motion.div
            animate={floatAnimation}
            className="relative"
          >
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-gradient-radial from-purple-glow/40 via-purple-glow/10 to-transparent blur-3xl scale-110" />
            
            <img 
              src={heroBrainGears} 
              alt="3D Brain with Gears and Clouds - Tech Interview Hub Illustration" 
              className="relative z-10 w-full max-w-md lg:max-w-lg xl:max-w-xl h-auto drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>

        {/* Decorative floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              y: [0, -100],
              x: [0, (i % 2 === 0 ? 20 : -20)],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut",
            }}
            className="absolute w-2 h-2 rounded-full bg-purple-glow/60"
            style={{
              bottom: `${20 + i * 10}%`,
              left: `${50 + i * 8}%`,
            }}
          />
        ))}
      </section>
      
      {/* Pricing Modal */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </>
  );
}
