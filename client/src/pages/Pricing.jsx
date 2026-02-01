import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Check, Zap, Crown, Rocket } from "lucide-react";

const plans = [
    {
        name: "Free",
        price: "₹0",
        period: "/month",
        icon: Zap,
        features: [
            "Access to basic features",
            "Limited interview practice",
            "Everything in Basic",
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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
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

export default function Pricing() {
    return (
        <div className="min-h-screen bg-background flex w-full">
            <Sidebar />

            <main className="relative flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 overflow-x-hidden bg-background flex flex-col">
                {/* Global background glow */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-1/2 top-[20%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]">
                        <div className="glow-orb w-full h-full bg-purple-glow/20" />
                    </div>
                    <div className="absolute right-[5%] bottom-[10%] w-[600px] h-[600px]">
                        <div className="glow-orb w-full h-full bg-cyan-accent/15" style={{ animationDelay: "2s" }} />
                    </div>
                </div>

                <div className="relative max-w-7xl mx-auto w-full pt-12 lg:pt-0 flex-1 flex flex-col">
                    <Header />

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex-1 flex flex-col py-12"
                    >
                        {/* Header Section */}
                        <div className="text-center mb-12 lg:mb-16">
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4"
                            >
                                Choose Your{" "}
                                <span className="bg-gradient-to-r from-purple-glow via-cyan-accent to-pink-500 bg-clip-text text-transparent">
                                    Premium Plan
                                </span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { delay: 0.3 } }}
                                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                            >
                                Unlock your full potential with our premium features tailored for your interview success.
                            </motion.p>
                        </div>

                        {/* Pricing Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
                            {plans.map((plan, index) => {
                                const IconComponent = plan.icon;
                                return (
                                    <motion.div
                                        key={plan.name}
                                        custom={index}
                                        variants={cardVariants}
                                        whileHover={{ y: -12, scale: 1.02 }}
                                        className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col h-full shadow-xl ${plan.popular
                                            ? "bg-muted/40 backdrop-blur-md border-purple-glow/50 shadow-purple-glow/10"
                                            : "bg-muted/30 backdrop-blur-md border-border/50 hover:border-border"
                                            }`}
                                    >
                                        {/* Popular Badge */}
                                        {plan.popular && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                                <span className="px-6 py-1.5 text-sm font-bold rounded-full bg-gradient-to-r from-purple-glow to-purple-accent text-white shadow-lg shadow-purple-glow/30">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}

                                        {/* Glow Effect for popular card */}
                                        {plan.popular && (
                                            <div className="absolute inset-0 bg-gradient-to-b from-purple-glow/10 to-transparent rounded-3xl -z-10" />
                                        )}

                                        {/* Icon */}
                                        <div
                                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg`}
                                        >
                                            <IconComponent size={32} className="text-white" />
                                        </div>

                                        {/* Plan Name */}
                                        <h3 className="text-2xl font-bold text-foreground mb-2">
                                            {plan.name}
                                        </h3>

                                        {/* Price */}
                                        <div className="flex items-baseline gap-1 mb-6">
                                            <span className="text-5xl font-bold text-foreground">
                                                {plan.price}
                                            </span>
                                            <span className="text-xl text-muted-foreground">
                                                {plan.period}
                                            </span>
                                        </div>

                                        {/* Divider */}
                                        <div className="w-full h-px bg-border/50 mb-6" />

                                        {/* Features */}
                                        <ul className="space-y-4 mb-8 flex-1">
                                            {plan.features.map((feature, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-3 text-base text-muted-foreground group"
                                                >
                                                    <div className="mt-1">
                                                        <Check
                                                            size={18}
                                                            className={`flex-shrink-0 ${plan.popular
                                                                ? "text-purple-glow"
                                                                : "text-cyan-accent"
                                                                }`}
                                                        />
                                                    </div>
                                                    <span className="group-hover:text-foreground transition-colors">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${plan.popular
                                                ? "btn-primary-gradient shadow-purple-glow/25"
                                                : "bg-muted hover:bg-muted/80 border border-border/50 text-foreground"
                                                }`}
                                        >
                                            Get Started
                                        </motion.button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>


                </div>
            </main>
        </div>
    );
}
