import { useState } from "react";
import { motion } from "framer-motion";
import PricingModal from "./PricingModal";

const textVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.4 + i * 0.1,
    },
  }),
};

export default function HeroSection() {
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  return (
    <>
      <section className="relative flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 py-8 lg:py-16">
        {/* Background Glowing Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
          <div className="glow-orb w-full h-full bg-purple-glow/30" />
        </div>
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] pointer-events-none">
          <div className="glow-orb w-full h-full bg-cyan-accent/20" style={{ animationDelay: "2s" }} />
        </div>

        {/* Text Content */}
        <div className="relative z-10 flex-1 max-w-2xl text-center lg:text-left">
          <motion.p
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="brand-text text-xl sm:text-2xl font-semibold mb-4"
          >
            LastMinuteEngineering
          </motion.p>

          <motion.h1
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            Your Comprehensive
            <br />
            <span className="text-gradient-purple">Tech Interview Hub</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
          >
            LastMinuteEngineering is a dedicated platform that helps engineering students 
            excel in exams with Free resources, Concise Notes, MAKAUT PYQs, and smart 
            topic-focused Suggestions. We make Preparation Easier and more Effective.
          </motion.p>

          <motion.div
            custom={3}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPricingOpen(true)}
              className="btn-primary-gradient w-full sm:w-auto"
            >
              Explore Premium Plans
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-outline-purple w-full sm:w-auto"
          >
            Try AI Interview Free
          </motion.button>
        </motion.div>
      </div>


      {/* Decorative star */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-10 right-10 text-foreground/30 hidden lg:block"
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 15,10 24,10 17,15 20,24 12,18 4,24 7,15 0,10 9,10" />
        </svg>
      </motion.div>
      </section>
      
      {/* Pricing Modal */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </>
  );
}
