import { motion } from "framer-motion";
import { Eye, ArrowLeft, X, BookOpen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const studyMaterials = [
    {
        id: 1,
        title: "Data Structures & Algorithms",
        description: "Master fundamental data structures and algorithmic problem-solving techniques used in top tech interviews.",
        topics: ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Sorting & Searching", "Dynamic Programming"],
        gradient: "from-blue-600 to-cyan-500",
        glowColor: "rgba(59,130,246,0.15)",
        badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Binary_tree.svg/120px-Binary_tree.svg.png",
        pdfUrl: "https://drive.google.com/file/d/1CMOJIdqnDs3o4jmu9hcAU5z6gdMIyBlz/preview"
    },
    {
        id: 2,
        title: "Operating Systems",
        description: "Understand OS concepts, process management, memory management, and system architecture.",
        topics: ["Process Management", "Memory Management", "File Systems", "Deadlocks", "CPU Scheduling"],
        gradient: "from-purple-600 to-pink-500",
        glowColor: "rgba(168,85,247,0.15)",
        badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Tux.png/100px-Tux.png",
        pdfUrl: "https://drive.google.com/file/d/1f_ORPS2ug9HPfF-P8KgS-5m4br3VTUb_/preview"
    },
    {
        id: 3,
        title: "Database Management Systems",
        description: "Learn database design, SQL, normalization, and transaction management for robust applications.",
        topics: ["SQL Queries", "Normalization", "Transactions", "Indexing", "ER Diagrams"],
        gradient: "from-emerald-600 to-teal-500",
        glowColor: "rgba(16,185,129,0.15)",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Sql_data_base_with_logo.png/120px-Sql_data_base_with_logo.png",
        pdfUrl: "https://drive.google.com/file/d/1g14wzLvWufSvRdH53nrglVzjHMCAjaWR/preview"
    },
    {
        id: 4,
        title: "Computer Networks",
        description: "Explore networking protocols, the OSI model, routing, and network security fundamentals.",
        topics: ["OSI Model", "TCP/IP", "Routing Protocols", "Network Security", "HTTP/HTTPS"],
        gradient: "from-orange-600 to-red-500",
        glowColor: "rgba(249,115,22,0.15)",
        badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/IPv4_address_structure_and_writing_systems-en.svg/120px-IPv4_address_structure_and_writing_systems-en.svg.png",
        pdfUrl: "https://drive.google.com/file/d/1gR--nWd_UWLUROcV1ehcx2zUksgSLxun/preview"
    },
    {
        id: 5,
        title: "Object-Oriented Programming",
        description: "Master OOP principles, design patterns, and software engineering best practices.",
        topics: ["Classes & Objects", "Inheritance", "Polymorphism", "Encapsulation", "Design Patterns"],
        gradient: "from-indigo-600 to-violet-500",
        glowColor: "rgba(99,102,241,0.15)",
        badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/UML_logo.svg/120px-UML_logo.svg.png",
        pdfUrl: "https://drive.google.com/file/d/1YLNbLqm6fUKTVR6eLQrSy9l-LXCLkhda/preview"
    }
];

export default function StudyMaterial() {
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
                                <BookOpen className="w-5 h-5 text-primary" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                Core Subject Study Materials
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground ml-1">
                            Comprehensive resources to master core CS subjects for placements
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
                                style={{ boxShadow: `0 0 0 0 ${material.glowColor}` }}
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
                                    <BookOpen size={12} className="text-white" />
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
