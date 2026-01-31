import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Home, RotateCcw } from "lucide-react";

export default function Result() {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Redirect if accessed directly
    if (!state) {
        navigate("/mock-test");
        return null;
    }

    const { score } = state;

    return (
        <div className="min-h-screen flex bg-gray-50 w-full">
            <main className="flex-1 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden text-center"
                >
                    <div className="bg-indigo-600 p-10 text-white relative overflow-hidden">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative z-10"
                        >
                            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300 drop-shadow-md" />
                            <h1 className="text-3xl font-bold">Quiz Completed!</h1>
                            <p className="text-indigo-200 mt-2">Great effort!</p>
                        </motion.div>

                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10" />
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full translate-x-10 translate-y-10" />
                    </div>

                    <div className="p-10">
                        <div className="mb-8">
                            <p className="text-gray-500 uppercase tracking-wide text-sm font-semibold mb-2">Your Total Score</p>
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                                className="text-6xl font-extrabold text-indigo-600"
                            >
                                {score}
                            </motion.div>
                        </div>

                        <div className="space-y-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/")}
                                className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center space-x-2 hover:bg-gray-800 transition"
                            >
                                <Home className="w-4 h-4" />
                                <span>Back to Home</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/mock-test")}
                                className="w-full bg-white text-gray-700 font-bold py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center space-x-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>Try Again</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
