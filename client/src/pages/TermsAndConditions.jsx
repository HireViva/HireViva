import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
    ShieldCheck,
    User,
    Lock,
    FileWarning,
    CreditCard,
    Copyright,
    Globe,
    Smartphone,
    AlertOctagon,
    AlertTriangle,
    Shield,
    FileText,
    Scale,
    Mail,
    BookOpen
} from "lucide-react";

const termsSections = [
    {
        id: 1,
        title: "Eligibility & User Responsibility",
        content: "This section defines who can use the Platform and what responsibilities they have. You confirm that you are 13 years of age or older. Users must be at least 13 to access the Platform. If you are under 18, your usage must be supervised by a parent or legal guardian.",
        icon: User
    },
    {
        id: 2,
        title: "Data Privacy & Protection",
        content: "This section explains how HireViva collects, stores, and protects personal data in compliance with Indian law. Applicable Laws: Digital Personal Data Protection Act, 2023. We collect this data to operate, maintain, and improve the Service.",
        icon: Lock
    },
    {
        id: 3,
        title: "User Conduct (Strict Rules)",
        content: "Defines acceptable and prohibited actions on the Platform to protect users, content, and intellectual property. Do not misuse, disrupt, or interfere with the Platform. Do not share, sell, or transfer your account access.",
        icon: FileWarning
    },
    {
        id: 4,
        title: "Payments, Refunds & Subscriptions",
        content: "Explains financial terms, billing, and user responsibilities. All payments are final, unless specified in the Refund Policy. Subscription features vary by plan and may evolve over time.",
        icon: CreditCard
    },
    {
        id: 5,
        title: "Intellectual Property Rights",
        content: "Covers ownership, usage, and restrictions for all platform content. All Platform content is owned by HireViva or licensed. You may NOT copy, reproduce, distribute, republish, resell, or create derivative works.",
        icon: Copyright
    },
    {
        id: 6,
        title: "Third-Party Services",
        content: "Explains interactions with external services integrated into the Platform. The Platform may use or link to third-party tools. We are not responsible for their accuracy, reliability, or policies.",
        icon: Globe
    },
    {
        id: 7,
        title: "Fair Usage Policy (Device, IP & Payment Compliance)",
        content: "Ensures subscription credibility and security. Single-Device Access: Your account may be used on one device at a time. No Simultaneous Logins. Use of Personal Device is recommended.",
        icon: Smartphone
    },
    {
        id: 8,
        title: "Disclaimer of Warranties",
        content: "This section clarifies the nature of the Platform's services. The Platform is provided on an 'as-is' and 'as-available' basis. We do not guarantee continuous availability or that all features will function perfectly at all times.",
        icon: AlertOctagon
    },
    {
        id: 9,
        title: "Limitation of Liability",
        content: "This section defines the extent of HireViva's legal responsibility. To the maximum extent permitted by Indian law, HireViva is not liable for loss of data, profits, revenue, or business opportunities.",
        icon: AlertTriangle
    },
    {
        id: 10,
        title: "Indemnification",
        content: "Users agree to protect HireViva from legal claims arising from misuse of the Platform. You agree to indemnify and hold harmless HireViva, its founders, employees, and partners.",
        icon: Shield
    },
    {
        id: 11,
        title: "Modifications to Terms",
        content: "This section explains our right to update or amend the Terms. We may revise these Terms periodically. Continued use of the Platform after changes constitutes acceptance of the updated Terms.",
        icon: FileText
    },
    {
        id: 12,
        title: "Governing Law & Jurisdiction",
        content: "This section defines the legal framework. These Terms are governed by the laws of India. All disputes arising under or related to these Terms shall fall under the exclusive jurisdiction of the courts in West Bengal.",
        icon: Scale
    },
    {
        id: 13,
        title: "Contact Information",
        content: "Provides official communication channels for users. For concerns or queries related to these Terms, contact us at: hireviva@gmail.com.",
        icon: Mail
    },
    {
        id: 14,
        title: "Educational Purpose Disclaimer",
        content: "This section clarifies the intended purpose of the Platform. All Platform content is intended solely for learning, upskilling, and career preparation. The Platform does not guarantee employment, salary, or placement.",
        icon: BookOpen
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 }
    }
};

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-background flex w-full">
            <Sidebar />

            <main className="relative flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 overflow-x-hidden bg-background flex flex-col">
                {/* Global background glow */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-1/4 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
                        <div className="glow-orb w-full h-full bg-purple-glow/10" />
                    </div>
                    <div className="absolute right-0 bottom-0 w-[600px] h-[600px]">
                        <div className="glow-orb w-full h-full bg-cyan-accent/10" style={{ animationDelay: "2s" }} />
                    </div>
                </div>

                <div className="relative max-w-5xl mx-auto w-full pt-12 lg:pt-0 flex-1 flex flex-col">
                    <Header />

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex-1 flex flex-col py-12"
                    >
                        {/* Header Section */}
                        <div className="text-center mb-16">
                            <motion.h1
                                variants={itemVariants}
                                className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4"
                            >
                                Terms <span className="text-muted-foreground mr-2">&</span> <span className="bg-gradient-to-r from-purple-glow via-cyan-accent to-pink-500 bg-clip-text text-transparent">Conditions</span>
                            </motion.h1>
                            <motion.div
                                variants={itemVariants}
                                className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-glow to-cyan-accent rounded-full mb-6"
                            />
                            <motion.p
                                variants={itemVariants}
                                className="text-lg text-muted-foreground max-w-3xl mx-auto"
                            >
                                These Terms & Conditions govern your access to and use of the HireViva website, mobile interfaces, products, learning content, and services.
                            </motion.p>
                            <motion.p
                                variants={itemVariants}
                                className="text-sm text-muted-foreground mt-4"
                            >
                                Last Updated: January 30, 2026
                            </motion.p>
                        </div>

                        {/* Terms Sections */}
                        <div className="space-y-6">
                            {termsSections.map((section) => (
                                <motion.div
                                    key={section.id}
                                    variants={itemVariants}
                                    className="group relative"
                                >
                                    {/* Hover Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-glow/10 to-cyan-accent/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                                    {/* Card Content */}
                                    <div className="relative bg-muted/20 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8 transition-all duration-300 hover:border-purple-glow/30 hover:bg-muted/30">
                                        <div className="flex items-start gap-4">
                                            {/* Number/Icon */}
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-glow/20 to-cyan-accent/20 flex items-center justify-center border border-white/10 text-white">
                                                    <section.icon size={20} className="text-white" />
                                                </div>
                                            </div>

                                            {/* Text */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-purple-glow text-lg">{section.id}.</span>
                                                    <h3 className="text-xl font-bold text-foreground group-hover:text-purple-glow transition-colors duration-300">
                                                        {section.title}
                                                    </h3>
                                                </div>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {section.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </main>
        </div>
    );
}
