import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, CheckCircle, Play, Home } from "lucide-react";
import api from "../api";

export default function AptitudeStartTest() {
    const navigate = useNavigate();
    const { testId } = useParams();

    const testDetails = {
        title: `Aptitude Mock Test ${testId}`,
        description: "Master your aptitude skills with this comprehensive assessment.",
        duration: "30 Min",
        questions: "Varies",
        color: "from-purple-400 to-pink-500",
        iconColor: "text-purple-600"
    };

    const startTest = async () => {
        try {
            console.log("Starting aptitude test:", testId);
            const res = await api.post("/aptitude-quiz/start", {
                testId: testId
            });

            navigate(`/aptitude-mock-test/${testId}/attempt`, {
                state: {
                    attemptId: res.data.attemptId,
                    endTime: res.data.endTime
                }
            });
        } catch (err) {
            console.error("Error starting test:", err);
            const msg = err.response?.data?.message || err.message || "Failed to start test";
            alert(`Error: ${msg}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col w-full">
            {/* Header with back to home button */}
            <header className="p-4 sm:p-6">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors group"
                >
                    <Home className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Home</span>
                </button>
            </header>

            <main className="flex-1 p-6 md:p-12 flex flex-col items-center justify-center">
                <div className="max-w-4xl w-full">
                    <div className="mb-12 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Start Aptitude Quiz
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl">
                            You are about to start {testDetails.title}. Good luck!
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all border border-gray-100 flex flex-col max-w-2xl mx-auto"
                    >
                        <div className={`bg-gradient-to-r ${testDetails.color} p-8 text-white relative overflow-hidden h-40 flex flex-col justify-center`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                            <h2 className="text-3xl font-bold relative z-10">{testDetails.title}</h2>
                            <p className="opacity-90 relative z-10 text-sm font-medium mt-1">{testDetails.description}</p>
                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                                    <Clock className={`w-6 h-6 mb-2 ${testDetails.iconColor}`} />
                                    <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Time</span>
                                    <span className="text-lg font-bold text-gray-800">{testDetails.duration}</span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center">
                                    <CheckCircle className={`w-6 h-6 mb-2 ${testDetails.iconColor}`} />
                                    <span className="text-gray-500 text-xs uppercase font-bold tracking-wider">Qs</span>
                                    <span className="text-lg font-bold text-gray-800">{testDetails.questions}</span>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={startTest}
                                    className={`w-full bg-gradient-to-r ${testDetails.color} text-white font-bold py-4 rounded-xl shadow-lg transition-transform flex items-center justify-center space-x-2 group`}
                                >
                                    <span className="text-lg">Start Test</span>
                                    <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
