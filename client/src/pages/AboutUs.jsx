import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Users, TrendingUp, Award, Target } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

const impactStats = [
    {
        icon: Users,
        number: "10K+",
        label: "Active Users",
        subtitle: "and growing"
    },
    {
        icon: TrendingUp,
        number: "50K+",
        label: "Practice Sessions",
        subtitle: "per month"
    },
    {
        icon: Award,
        number: "500+",
        label: "Success Stories",
        subtitle: "till date"
    },
    {
        icon: Target,
        number: "95%",
        label: "Success Rate",
        subtitle: "in placements"
    }
];

const teamMembers = [
    {
        id: 1,
        name: "Tanmoy",
        role: "Frontend Developer",
        image: "/Tanmoy1.jpg"
    },
    {
        id: 2,
        name: "Sayan",
        role: "Backend Developer",
        image: "/Sayan1.jpeg"
    },
    {
        id: 3,
        name: "Soumik",
        role: "AI Developer",
        image: "/Soumik1.jpeg"
    }
];

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-background flex w-full">
            <Sidebar />

            <main className="relative flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 overflow-x-hidden bg-background">
                {/* Global background glow */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-1/2 top-[20%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]">
                        <div className="glow-orb w-full h-full bg-purple-glow/30" />
                    </div>
                    <div className="absolute right-[8%] top-[60%] w-[520px] h-[520px]">
                        <div className="glow-orb w-full h-full bg-cyan-accent/20" style={{ animationDelay: "2s" }} />
                    </div>
                </div>

                <div className="relative max-w-6xl mx-auto pt-12 lg:pt-0">
                    <Header />

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="py-12 space-y-16"
                    >
                        {/* Hero Section */}
                        <motion.div variants={itemVariants} className="text-center space-y-6">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                                <span className="bg-gradient-to-r from-purple-glow via-cyan-accent to-pink-500 bg-clip-text text-transparent">
                                    Welcome to HireViva
                                </span>
                            </h1>

                            <div className="max-w-4xl mx-auto space-y-4 text-muted-foreground">
                                <p className="text-base sm:text-lg leading-relaxed">
                                    We started back in 2024 with our{" "}
                                    <a href="#" className="text-purple-glow hover:text-cyan-accent transition-colors underline">
                                        vision to empower students
                                    </a>
                                    . The idea of building a comprehensive platform came into vision when we realized the gap between academic learning and industry requirements.
                                </p>
                                <p className="text-base sm:text-lg leading-relaxed">
                                    We started with a simple goal and evolved into a full-fledged interview preparation platform in 2025.
                                </p>
                            </div>

                            <div className="max-w-4xl mx-auto space-y-4 text-muted-foreground pt-6">
                                <p className="text-base sm:text-lg leading-relaxed">
                                    Our vision is to make interview preparation feel seamless and enjoyable, removing the overwhelming factor which you find in most places. We cover{" "}
                                    <span className="text-foreground font-semibold">DSA, Core Subjects, System Design,</span> and{" "}
                                    <span className="text-foreground font-semibold">Communication Skills</span> as of today, and we plan to add much more in the future.
                                </p>
                            </div>
                        </motion.div>

                        {/* Impact in Numbers */}
                        <motion.div variants={itemVariants} className="space-y-8">
                            <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground">
                                Our Impact in Numbers
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {impactStats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        variants={cardVariants}
                                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                        className="relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-glow/20 to-cyan-accent/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                                        <div className="relative bg-muted/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 space-y-4 hover:border-purple-glow/50 transition-all duration-300">
                                            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-glow/30 to-cyan-accent/30 flex items-center justify-center border border-purple-glow/20">
                                                <stat.icon className="w-8 h-8 text-purple-glow" />
                                            </div>
                                            <div className="text-center space-y-1">
                                                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-glow to-cyan-accent bg-clip-text text-transparent">
                                                    {stat.number}
                                                </div>
                                                <div className="text-foreground font-semibold">
                                                    {stat.label}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {stat.subtitle}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Mission Statement */}
                        <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-glow/20 to-cyan-accent/20 rounded-2xl blur-xl" />
                                <div className="relative bg-muted/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8 sm:p-10">
                                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                                        HireViva consists of all free materials, which can be a good place to start with, but if you're looking for a premium experience with the best study materials and personalized guidance,{" "}
                                        <span className="text-foreground font-semibold">HireViva Pro</span> is our premium offering designed to accelerate your success.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Team Section */}
                        <motion.div variants={itemVariants} className="space-y-8">
                            <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground">
                                Our Amazing Team
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {teamMembers.map((member, index) => (
                                    <motion.div
                                        key={member.id}
                                        variants={cardVariants}
                                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                        className="relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-glow/20 to-cyan-accent/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                                        <div className="relative bg-muted/30 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden hover:border-purple-glow/50 transition-all duration-300">
                                            {/* Image Placeholder */}
                                            <div className="aspect-square bg-gradient-to-br from-purple-glow/20 to-cyan-accent/20 flex items-center justify-center">
                                                {member.image ? (
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-center space-y-2">
                                                        <Users className="w-20 h-20 mx-auto text-purple-glow/50" />
                                                        <p className="text-muted-foreground text-sm">Photo Coming Soon</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Member Info */}
                                            <div className="p-6 text-center space-y-2">
                                                <h3 className="text-xl font-bold text-foreground">
                                                    {member.name}
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    {member.role}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>


                </div>
            </main>
        </div>
    );
}
