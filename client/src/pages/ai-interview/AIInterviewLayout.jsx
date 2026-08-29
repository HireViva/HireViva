import './ai-interview-global.css';
import Sidebar from "../../components/Sidebar";

// AI Interview Layout Wrapper Component
// This wraps AI-Interview pages to provide the original standalone UI within the main layout
const AIInterviewLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background flex w-full">
            <Sidebar />
            <main className="relative flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 overflow-x-hidden bg-background">
                <div className="ai-interview-container h-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AIInterviewLayout;
