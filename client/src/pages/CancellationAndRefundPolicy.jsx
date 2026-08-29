import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
    Ban,
    AlertTriangle,
    BellOff,
    MonitorX,
    UserX,
    Gavel
} from "lucide-react";

const policySections = [
    {
        id: 1,
        title: "No Refunds on Opt-Out or Cancellation",
        content: (
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-foreground mb-1">Refund Policy</h4>
                    <p>Once a subscription has been purchased and activated, no refunds will be issued under any circumstances.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground mb-1">Final Payments</h4>
                    <p>All payments made towards HireViva+, courses, or any other paid services are final and non-refundable.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground mb-1">Service Shutdown</h4>
                    <p>In the event of an unexpected or abrupt shutdown of services, HireViva shall not be obligated to provide refunds for any fees, subscriptions, or payments made by users. This includes, but is not limited to: • HireViva+ subscription fees • Course payments • Any other paid offerings</p>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground mb-1">Cancellation Policy</h4>
                    <p>Cancellations or mid-term opt-outs are not permitted to ensure fairness and consistency for all users.</p>
                </div>
            </div>
        ),
        icon: Ban
    },
    {
        id: 2,
        title: "Limitation of Liability",
        content: "HireViva shall not be liable for any direct, indirect, incidental, consequential, or punitive damages that may arise from: • Use or inability to use the platform • Service interruptions • Abrupt shutdown or discontinuation of services. This applies to all users, including those with active paid subscriptions.",
        icon: AlertTriangle
    },
    {
        id: 3,
        title: "Subscription Opt-Out Notification",
        content: (
            <div className="space-y-4">
                <p>If a user voluntarily opts out of using the service after purchase, no refund will be issued for the remaining subscription period.</p>
                <p>The responsibility of subscription management rests with the user.</p>
            </div>
        ),
        icon: BellOff
    },
    {
        id: 4,
        title: "Multiple IP / Account Misuse",
        content: (
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold text-foreground mb-1">Account Activity</h4>
                    <p>Accounts exhibiting excessive or suspicious login activity, including access from an unusually high number of different IP addresses, may be: • Flagged • Restricted • Suspended without refund</p>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground mb-1">Protection Measure</h4>
                    <p>This measure protects the platform from shared account misuse and unauthorized access.</p>
                </div>
            </div>
        ),
        icon: MonitorX
    },
    {
        id: 5,
        title: "Blacklisted Accounts – Strict Actions",
        content: (
            <div className="space-y-4">
                <p>Users found violating Terms & Conditions may be blacklisted. Consequences include: • Permanent suspension of the account • Loss of access to all associated services • Ineligibility for future enrollments or platform usage</p>
                <p>These actions are taken to maintain service integrity and user safety.</p>
            </div>
        ),
        icon: UserX
    },
    {
        id: 6,
        title: "Legal Action for Severe Violations",
        content: "HireViva reserves the right to initiate legal proceedings against individuals or accounts involved in: • Fraudulent activities • Abuse or exploitation of the platform • Redistribution or unauthorized sharing of content • Any actions causing harm to the service, platform, or other users. Such actions may involve reporting incidents to relevant authorities as permitted under applicable laws.",
        icon: Gavel
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

export default function CancellationAndRefundPolicy() {
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
                                Cancellation, <span className="bg-gradient-to-r from-purple-glow via-cyan-accent to-pink-500 bg-clip-text text-transparent">Refund Policy</span> & Terms
                            </motion.h1>
                            <motion.div
                                variants={itemVariants}
                                className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-glow to-cyan-accent rounded-full mb-6"
                            />
                            <motion.p
                                variants={itemVariants}
                                className="text-lg text-muted-foreground max-w-3xl mx-auto"
                            >
                                Please review our strict no-refund policy and cancellation terms before making a purchase.
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
                                                    <section.icon size={20} className="text-white" />
                                                </div>
                                            </div>

                                            {/* Text */}
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-purple-glow text-lg">{section.id}.</span>
                                                    <h3 className="text-xl font-bold text-foreground group-hover:text-purple-glow transition-colors duration-300">
                                                        {section.title}
                                                    </h3>
                                                </div>
                                                <div className="text-muted-foreground leading-relaxed">
                                                    {section.content}
                                                </div>
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
