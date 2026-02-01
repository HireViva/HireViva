import { motion } from "framer-motion";
import { BookOpen, Eye, FileText, Video, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AptitudeStudyMaterial() {
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [zoom, setZoom] = useState(100);
    const navigate = useNavigate();

    const studyMaterials = [
        {
            id: 1,
            title: "Quantitative Aptitude",
            description: "Master numerical ability, data interpretation, and mathematical reasoning",
            topics: ["Number Systems", "Percentages", "Profit & Loss", "Time & Work", "Data Interpretation"],
            icon: FileText,
            color: "from-blue-500 to-cyan-500",
            pdfUrl: "https://drive.google.com/file/d/YOUR_QUANT_PDF_ID/preview"
        },
        {
            id: 2,
            title: "Logical Reasoning",
            description: "Develop analytical and logical thinking skills",
            topics: ["Puzzles", "Blood Relations", "Coding-Decoding", "Seating Arrangement", "Syllogism"],
            icon: BookOpen,
            color: "from-purple-500 to-pink-500",
            pdfUrl: "https://drive.google.com/file/d/YOUR_LOGICAL_PDF_ID/preview"
        },
        {
            id: 3,
            title: "Verbal Ability",
            description: "Enhance vocabulary, grammar, and comprehension skills",
            topics: ["Synonyms & Antonyms", "Sentence Correction", "Reading Comprehension", "Para Jumbles"],
            icon: Video,
            color: "from-green-500 to-emerald-500",
            pdfUrl: "https://drive.google.com/file/d/YOUR_VERBAL_PDF_ID/preview"
        }
    ];

    const handleViewPdf = (material) => {
        setSelectedPdf(material);
        setZoom(100);
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 25, 200));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 25, 50));
    };

    return (
        <>
            <Sidebar />
            <div className="min-h-screen bg-[#0f0f1e] p-6 lg:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 text-center"
                    >
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors absolute left-6"
                            >
                                <ArrowLeft size={24} className="text-white" />
                            </button>
                            <h1 className="text-4xl font-bold text-white">
                                Aptitude Study Materials
                            </h1>
                        </div>
                        <p className="text-gray-400">
                            Comprehensive resources to master aptitude tests for placements
                        </p>
                    </motion.div>

                    {/* Study Material Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {studyMaterials.map((material, index) => (
                            <motion.div
                                key={material.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#1a1a2e] border border-gray-800 rounded-xl p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all"
                            >
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${material.color} flex items-center justify-center mb-4`}>
                                    <material.icon className="text-white" size={24} />
                                </div>

                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {material.title}
                                </h3>

                                <p className="text-gray-400 text-sm mb-4">
                                    {material.description}
                                </p>

                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-white mb-2">Topics Covered:</h4>
                                    <ul className="space-y-1">
                                        {material.topics.map((topic, idx) => (
                                            <li key={idx} className="text-sm text-gray-400 flex items-center">
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>
                                                {topic}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => handleViewPdf(material)}
                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                                >
                                    <Eye size={16} />
                                    View PDF
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* PDF Viewer Modal */}
                {selectedPdf && (
                    <div className="fixed inset-0 bg-black/90 z-40 flex flex-col lg:ml-64">
                        {/* Controls */}
                        <div className="bg-[#1a1a2e] border-b border-gray-800 p-4 flex items-center justify-between">
                            <button
                                onClick={() => setSelectedPdf(null)}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} className="text-white" />
                            </button>
                            <h2 className="text-lg font-bold text-white flex-1 text-center">{selectedPdf.title}</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleZoomOut}
                                    disabled={zoom <= 50}
                                    className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    -
                                </button>
                                <span className="text-sm font-medium text-white min-w-[60px] text-center">
                                    {zoom}%
                                </span>
                                <button
                                    onClick={handleZoomIn}
                                    disabled={zoom >= 200}
                                    className="px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* PDF Embed */}
                        <div className="flex-1 overflow-auto bg-gray-900">
                            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
                                <iframe
                                    src={selectedPdf.pdfUrl}
                                    className="w-full h-screen border-0"
                                    title={selectedPdf.title}
                                    allow="autoplay"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
