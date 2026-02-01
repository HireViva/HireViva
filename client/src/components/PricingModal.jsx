import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Zap, Crown, Rocket } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    icon: Zap,
    features: [
      "Access to basic features",
      "Limited interview practice",
      "Everythhing in Basic",
      "AI-powered coding sheets",
    ],
    color: "from-cyan-accent to-cyan-accent/70",
    popular: false,
  },
  {
    name: "Basic",
    price: "₹99",
    period: "/month",
    icon: Crown,
    features: [
      "Everything in Basic",
      "AI-powered practice tests",
      "Video explanations",
      "Priority support",
      "Offline access",
    ],
    color: "from-purple-glow to-purple-accent",
    popular: true,
  },
  {
    name: "Pro",
    price: "₹199",
    period: "/month",
    icon: Rocket,
    features: [
      "Everything in Pro",
      "1-on-1 mentorship",
      "Interview preparation",
      "Resume review",
      "Extended updates",
    ],
    color: "from-green-accent to-emerald-500",
    popular: false,
  },
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  }),
};

export default function PricingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-card p-6 sm:p-8 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full glass-effect text-foreground/70 hover:text-foreground transition-colors"
            >
              <X size={24} />
            </motion.button>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2"
              >
                Choose Your{" "}
                <span className="text-gradient-purple">Premium Plan</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
                className="text-muted-foreground"
              >
                Unlock your full potential with our premium features
              </motion.p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => {
                const IconComponent = plan.icon;
                return (
                  <motion.div
                    key={plan.name}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                      plan.popular
                        ? "glass-card-glow border-purple-glow/50"
                        : "glass-effect border-white/10 hover:border-white/20"
                    }`}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-glow to-purple-accent text-white">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Icon */}
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}
                    >
                      <IconComponent size={28} className="text-white" />
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-sm text-muted-foreground"
                        >
                          <Check
                            size={16}
                            className={`flex-shrink-0 ${
                              plan.popular
                                ? "text-purple-glow"
                                : "text-green-accent"
                            }`}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${
                        plan.popular
                          ? "btn-primary-gradient"
                          : "glass-effect border border-white/20 text-foreground hover:bg-white/10"
                      }`}
                    >
                      Get Started
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
