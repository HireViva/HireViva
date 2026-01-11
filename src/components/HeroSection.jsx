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

export default function HeroSection() {
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  return (
    <>
      <section className="relative flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 py-8 lg:py-16 overflow-hidden">
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
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPricingOpen(true)}
              className="btn-primary-gradient w-full sm:w-auto"
            >
              Explore Premium Plans
            </motion.button>
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
