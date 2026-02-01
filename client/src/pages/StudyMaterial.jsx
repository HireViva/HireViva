import { motion } from "framer-motion";
import { BookOpen, Eye, Database, Cpu, Network, Code, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function StudyMaterial() {
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [zoom, setZoom] = useState(100);
    const navigate = useNavigate();

    const studyMaterials = [
        {
            id: 1,
            title: "Data Structures & Algorithms",
            description: "Master fundamental data structures and algorithmic problem-solving techniques",
            topics: ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Sorting & Searching", "Dynamic Programming"],
            icon: Code,
            color: "from-blue-500 to-cyan-500",
            pdfUrl: "https://drive.google.com/file/d/1CMOJIdqnDs3o4jmu9hcAU5z6gdMIyBlz/preview"
        },
        {
            id: 2,
            title: "Operating Systems",
            description: "Understand OS concepts, process management, and system architecture",
            topics: ["Process Management", "Memory Management", "File Systems", "Deadlocks", "CPU Scheduling"],
            icon: Cpu,
            color: "from-purple-500 to-pink-500",
            pdfUrl: "https://drive.google.com/file/d/1f_ORPS2ug9HPfF-P8KgS-5m4br3VTUb_/preview"
        },
        {
            id: 3,
            title: "Database Management Systems",
            description: "Learn database design, SQL, normalization, and transaction management",
            topics: ["SQL Queries", "Normalization", "Transactions", "Indexing", "ER Diagrams"],
            icon: Database,
            color: "from-green-500 to-emerald-500",
            pdfUrl: "https://drive.google.com/file/d/1g14wzLvWufSvRdH53nrglVzjHMCAjaWR/preview"
        },
        {
            id: 4,
            title: "Computer Networks",
            description: "Explore networking protocols, OSI model, and network security",
            topics: ["OSI Model", "TCP/IP", "Routing Protocols", "Network Security", "HTTP/HTTPS"],
            icon: Network,
            color: "from-orange-500 to-red-500",
            pdfUrl: "https://drive.google.com/file/d/1gR--nWd_UWLUROcV1ehcx2zUksgSLxun/preview"
        },
        {
            id: 5,
            title: "Object-Oriented Programming",
            description: "Master OOP principles, design patterns, and best practices",
            topics: ["Classes & Objects", "Inheritance", "Polymorphism", "Encapsulation", "Design Patterns"],
            icon: BookOpen,
            color: "from-indigo-500 to-blue-500",
            pdfUrl: "https://drive.google.com/file/d/1YLNbLqm6fUKTVR6eLQrSy9l-LXCLkhda/preview"
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
                                Core Subject Study Materials
                            </h1>
                        </div>
                        <p className="text-gray-400">
                            Comprehensive resources to master core computer science subjects for placements
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
import React from 'react';
import { X, Folder, ExternalLink } from 'lucide-react';
import Sidebar from "../components/Sidebar";

const StudyMaterial = () => {
    const [selectedPdf, setSelectedPdf] = React.useState(null);

    const materials = [
        { id: 1, title: 'Data Structures', url: 'https://drive.google.com/file/d/1CMOJIdqnDs3o4jmu9hcAU5z6gdMIyBlz/preview' },
        { id: 2, title: 'Algorithms', url: 'https://drive.google.com/file/d/1CMOJIdqnDs3o4jmu9hcAU5z6gdMIyBlz/preview' },
        { id: 3, title: 'Operating Systems', url: 'https://drive.google.com/file/d/1f_ORPS2ug9HPfF-P8KgS-5m4br3VTUb_/preview' },
        { id: 4, title: 'Database Management', url: 'https://drive.google.com/file/d/1g14wzLvWufSvRdH53nrglVzjHMCAjaWR/preview' },
        { id: 5, title: 'Computer Networks', url: 'https://drive.google.com/file/d/1gR--nWd_UWLUROcV1ehcx2zUksgSLxun/preview' },
        { id: 6, title: 'Object Oriented Programming', url: 'https://drive.google.com/file/d/1YLNbLqm6fUKTVR6eLQrSy9l-LXCLkhda/preview' },
    ];

    return (
        <div className="min-h-screen bg-background flex w-full">
            <Sidebar />
            <main className="flex-1 overflow-auto p-4 sm:p-6 lg:ml-64 relative h-screen">
                {selectedPdf ? (
                    <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-border/50 relative">
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={() => setSelectedPdf(null)}
                                className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors shadow-lg"
                                title="Close"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <iframe
                            src={selectedPdf}
                            className="w-full h-full"
                            allow="autoplay"
                            title="Study Material"
                        ></iframe>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materials.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedPdf(item.url)}
                                className="bg-[#0f172a] hover:bg-[#1e293b] cursor-pointer rounded-xl p-6 border border-slate-800 shadow-lg hover:shadow-xl transition-all group flex flex-col justify-between h-48"
                            >
                                <div>
                                    <Folder className="w-10 h-10 text-blue-500 mb-4 stroke-1" />
                                    <h3 className="font-bold text-xl text-white line-clamp-2">{item.title}</h3>
                                </div>
                                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                                    <span>View folder</span>
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudyMaterial;
