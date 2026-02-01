import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Clock, Award } from "lucide-react";
import Sidebar from "../components/Sidebar";
import api from "../api";

export default function AptitudeMockTestDashboard() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const response = await api.get("/aptitude-quiz/tests");
            if (response.data.success) {
                setTests(response.data.tests);
            }
        } catch (error) {
            console.error("Error fetching tests:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex w-full">
            <Sidebar />
            <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 lg:ml-64 relative">
                {/* Background Gradients */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto">
                    <header className="mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
                        >
                            Aptitude Mock Tests
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-muted-foreground"
                        >
                            Test your aptitude skills and prepare for placement tests with our curated mock tests.
                        </motion.p>
                    </header>

                    {loading ? (
                        <div className="text-center text-muted-foreground">Loading tests...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tests.map((test, index) => (
                                <motion.div
                                    key={test.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -5 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link to={`/aptitude-mock-test/${test.id}/start`} className="block group">
                                        <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                    <BookOpen size={24} />
                                                </div>
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                                    Free
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                                {test.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm mb-6">
                                                {test.description}
                                            </p>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={16} />
                                                    <span>~30 mins</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                                                Start Test <ArrowRight size={16} className="ml-1" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
