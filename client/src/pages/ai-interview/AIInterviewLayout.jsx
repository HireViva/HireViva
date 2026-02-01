import './ai-interview-global.css';

// AI Interview Layout Wrapper Component
// This wraps AI-Interview pages to provide the original standalone UI
const AIInterviewLayout = ({ children }) => {
    return (
        <div className="ai-interview-container">
            {children}
        </div>
    );
};

export default AIInterviewLayout;
