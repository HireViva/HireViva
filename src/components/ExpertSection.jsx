import { motion } from "framer-motion";
import { Users, MessageCircle, Video, Calendar } from "lucide-react";

const experts = [
  {
    name: "Dr. Rajesh Kumar",
    role: "Senior Software Engineer",
    company: "Google",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    specialty: "System Design"
  },
  {
    name: "Priya Sharma",
    role: "Tech Lead",
    company: "Microsoft",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    specialty: "Data Structures"
  },
  {
    name: "Amit Patel",
    role: "Principal Engineer",
    company: "Amazon",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    specialty: "Algorithms"
  },
  {
    name: "Sneha Reddy",
    role: "Engineering Manager",
    company: "Meta",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    specialty: "Frontend"
  }
];

const features = [
  { icon: MessageCircle, label: "1-on-1 Chat", desc: "Direct messaging with experts" },
  { icon: Video, label: "Video Calls", desc: "Schedule live sessions" },
  { icon: Calendar, label: "Mock Interviews", desc: "Practice with real pros" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function ExpertSection() {
  return (
    <section className="relative py-16 lg:py-24 bg-background">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none">
        <div className="glow-orb w-full h-full bg-purple-glow/20" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="text-purple-glow" size={28} />
            <span className="text-purple-glow font-semibold text-lg">ExpertTalk</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Learn From Industry{" "}
            <span className="text-gradient-purple">Experts</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with experienced professionals from top tech companies for personalized guidance and mock interviews.
          </p>
        </motion.div>

        {/* Expert Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {experts.map((expert, index) => (
            <motion.div
              key={expert.name}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card p-6 text-center group cursor-pointer"
            >
              <div className="relative mb-4 inline-block">
                <div className="absolute inset-0 bg-purple-glow/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="relative w-20 h-20 rounded-full object-cover border-2 border-purple-glow/50 mx-auto"
                />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-1">{expert.name}</h3>
              <p className="text-muted-foreground text-sm mb-1">{expert.role}</p>
              <p className="text-purple-glow text-sm font-medium mb-3">{expert.company}</p>
              <span className="inline-block px-3 py-1 bg-purple-glow/20 text-purple-glow text-xs rounded-full">
                {expert.specialty}
              </span>
            </motion.div>
          ))}
        </motion.div>


        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-outline-purple"
          >
            Browse All Experts
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
