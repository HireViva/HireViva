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
