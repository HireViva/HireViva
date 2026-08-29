import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Lock, Shield, Eye, Database, Globe, Cookie, UserCheck, AlertTriangle } from "lucide-react";

const policySections = [
    {
        id: 1,
        title: "Information We Collect",
        content: "We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or communicate with us. This may include your name, email address, phone number, and any other information you choose to provide.",
        icon: Database
    },
    {
        id: 2,
        title: "How We Use Your Information",
        content: "We use the information we collect to provide, maintain, and improve our services, to process your transactions, to send you technical notices and support messages, and to communicate with you about products, services, offers, and events.",
        icon: Eye
    },
    {
        id: 3,
        title: "Data Protection & Security",
        content: "We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the Internet is 100% secure.",
        icon: Lock
    },
    {
        id: 4,
        title: "Third-Party Services",
        content: "We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf. We ensure these third parties are bound by confidentiality agreements.",
        icon: Globe
    },
    {
        id: 5,
        title: "Cookies & Tracking",
        content: "We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
        icon: Cookie
    },
    {
        id: 6,
        title: "Your Rights",
        content: "You have the right to access, correct, or delete your personal information. You may also object to the processing of your personal data, restrict its processing, or request portability of your data.",
        icon: UserCheck
    },
    {
        id: 7,
        title: "Changes to Privacy Policy",
        content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.",
        icon: AlertTriangle
    },
    {
        id: 8,
        title: "Contact Us",
        content: "If you have any questions about this Privacy Policy, please contact us at hireviva@gmail.com.",
        icon: Shield
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

export default function PrivacyPolicy() {
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
                                Privacy <span className="bg-gradient-to-r from-purple-glow via-cyan-accent to-pink-500 bg-clip-text text-transparent">Policy</span>
                            </motion.h1>
                            <motion.div
                                variants={itemVariants}
                                className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-glow to-cyan-accent rounded-full mb-6"
                            />
                            <motion.p
                                variants={itemVariants}
                                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                            >
                                We value your privacy and are committed to protecting your personal data. This policy outlines how we collect, use, and safeguard your information.
                            </motion.p>
                            <motion.p
                                variants={itemVariants}
                                className="text-sm text-muted-foreground mt-4"
                            >
                                Last Updated: January 30, 2026
                            </motion.p>
                        </div>

                        {/* Policy Sections */}
                        <div className="space-y-6">
                            {policySections.map((section) => (
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
                                                    <span className="font-bold">{section.id}</span>
                                                </div>
                                            </div>

                                            {/* Text */}
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-bold text-foreground group-hover:text-purple-glow transition-colors duration-300">
                                                    {section.title}
                                                </h3>
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
