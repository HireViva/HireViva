import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Contact() {
    return (
        <div className="min-h-screen bg-background flex w-full">
            <Sidebar />

            <main className="relative flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 overflow-x-hidden bg-background flex flex-col">
                {/* Global background glow */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-1/4 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
                        <div className="glow-orb w-full h-full bg-purple-glow/20" />
                    </div>
                    <div className="absolute right-[10%] bottom-[20%] w-[600px] h-[600px]">
                        <div className="glow-orb w-full h-full bg-cyan-accent/15" style={{ animationDelay: "2s" }} />
                    </div>
                </div>

                <div className="relative max-w-6xl mx-auto w-full pt-12 lg:pt-0 flex-1 flex flex-col">
                    <Header />

                    <div className="flex-1 flex items-center justify-center py-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-3xl"
                        >
                            <div className="relative group">
                                {/* Glow Effect behind the card */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-glow/20 via-cyan-accent/20 to-purple-glow/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Main Card */}
                                <div className="relative bg-muted/40 backdrop-blur-md border border-border/50 rounded-3xl p-8 sm:p-12 text-center space-y-8 shadow-2xl">

                                    {/* Icon */}
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-glow/20 to-cyan-accent/20 flex items-center justify-center border border-purple-glow/30 shadow-inner">
                                            <Phone className="w-10 h-10 text-purple-glow" />
                                        </div>
                                    </div>

                                    {/* Heading */}
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-glow via-cyan-accent to-pink-500 bg-clip-text text-transparent">
                                        Contact Us
                                    </h1>

                                    {/* Content */}
                                    <div className="space-y-6 text-base sm:text-lg text-muted-foreground">
                                        <p>
                                            You can reach us at{" "}
                                            <a href="mailto:hireviva@gmail.com" className="text-foreground font-semibold hover:text-purple-glow transition-colors">
                                                hireviva@gmail.com
                                            </a>{" "}
                                            by dropping an email. We usually get back within 48-72 hours.
                                        </p>

                                        <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-border to-transparent" />

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="font-medium text-foreground">Address:</span>
                                                <span>Haldia, West Bengal, India</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="font-medium text-foreground">Phone Number:</span>
                                                <span className="opacity-70">+91 8597236321</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
