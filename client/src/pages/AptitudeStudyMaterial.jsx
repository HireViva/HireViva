import { motion } from "framer-motion";
import { Eye, ArrowLeft, X, Brain } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const studyMaterials = [
    {
        id: 1,
        title: "Quantitative Aptitude",
        description: "Master numerical ability, data interpretation, and mathematical reasoning for placement tests.",
        topics: ["Number Systems", "Percentages", "Profit & Loss", "Time & Work", "Data Interpretation"],
        gradient: "from-blue-600 to-cyan-500",
        glowColor: "rgba(59,130,246,0.15)",
        badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Simple_algebra_maths.svg/120px-Simple_algebra_maths.svg.png",
        pdfUrl: "https://drive.google.com/file/d/YOUR_QUANT_PDF_ID/preview"
    },
    {
        id: 2,
        title: "Logical Reasoning",
        description: "Develop analytical and logical thinking skills essential for cracking aptitude rounds.",
        topics: ["Puzzles", "Blood Relations", "Coding-Decoding", "Seating Arrangement", "Syllogism"],
        gradient: "from-purple-600 to-pink-500",
        glowColor: "rgba(168,85,247,0.15)",
        badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Rubik%27s_cube_scrambled.svg/120px-Rubik%27s_cube_scrambled.svg.png",
        pdfUrl: "https://drive.google.com/file/d/YOUR_LOGICAL_PDF_ID/preview"
    },
    {
        id: 3,
        title: "Verbal Ability",
        description: "Enhance vocabulary, grammar, and comprehension skills for verbal sections in placement exams.",
        topics: ["Synonyms & Antonyms", "Sentence Correction", "Reading Comprehension", "Para Jumbles", "Fill in the Blanks"],
        gradient: "from-emerald-600 to-teal-500",
        glowColor: "rgba(16,185,129,0.15)",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Latin_alphabet_letter_A.svg/100px-Latin_alphabet_letter_A.svg.png",
        pdfUrl: "https://drive.google.com/file/d/YOUR_VERBAL_PDF_ID/preview"
    }
];

export default function AptitudeStudyMaterial() {
    const [selectedPdf, setSelectedPdf] = useState(null);
    const navigate = useNavigate();

    return (
        <>
            <Sidebar />
            <div className="min-h-screen bg-background p-4 sm:p-6 lg:ml-64">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 rounded-xl bg-primary/10">
                                <Brain className="w-5 h-5 text-primary" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                Aptitude Study Materials
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground ml-1">
                            Comprehensive resources to master aptitude tests for placements
                        </p>
                    </motion.div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {studyMaterials.map((material, index) => (
                            <motion.div
                                key={material.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.07 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="group relative bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300"
                                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 30px ${material.glowColor}`}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 0 0 ${material.glowColor}`}
                            >
                                {/* Gradient Banner with Logo */}
                                <div className={`relative h-28 bg-gradient-to-br ${material.gradient} flex items-center justify-between px-5 overflow-hidden`}>
                                    {/* Decorative circles */}
                                    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
                                    <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-black/10" />

                                    <div className="relative z-10">
                                        <h3 className="text-base font-bold text-white leading-snug max-w-[160px]">
                                            {material.title}
                                        </h3>
                                        <span className="text-xs text-white/70 font-medium">
                                            {material.topics.length} Topics
                                        </span>
                                    </div>

                                    {/* Subject Logo */}
                                    <div className="relative z-10 w-14 h-14 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center p-1.5 shrink-0">
                                        <img
                                            src={material.logoUrl}
                                            alt={material.title}
                                            className="w-full h-full object-contain drop-shadow-lg"
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-4">
                                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                                        {material.description}
                                    </p>

                                    {/* Topic Chips */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {material.topics.map((topic, idx) => (
                                            <span
                                                key={idx}
                                                className={`text-xs px-2 py-0.5 rounded-full border font-medium ${material.badgeColor}`}
                                            >
                                                {topic}
                                            </span>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => setSelectedPdf(material)}
                                        className={`w-full bg-gradient-to-r ${material.gradient} text-white py-2 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md`}
                                    >
                                        <Eye size={14} /> View Study Material
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* PDF Viewer Modal */}
                {selectedPdf && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/90 z-50 flex flex-col lg:ml-64"
                    >
                        {/* Toolbar */}
                        <div className="bg-card border-b border-border/50 px-4 py-2.5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded bg-gradient-to-br ${selectedPdf.gradient} flex items-center justify-center`}>
                                    <Brain size={12} className="text-white" />
                                </div>
                                <span className="text-sm font-semibold text-foreground">{selectedPdf.title}</span>
                            </div>
                            <button
                                onClick={() => setSelectedPdf(null)}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                            >
                                <X size={18} className="text-muted-foreground" />
                            </button>
                        </div>

                        {/* PDF Embed */}
                        <div className="flex-1 overflow-hidden bg-gray-950">
                            <iframe
                                src={selectedPdf.pdfUrl}
                                className="w-full h-full border-0"
                                title={selectedPdf.title}
                                allow="autoplay"
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    );
}
