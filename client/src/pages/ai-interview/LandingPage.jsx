import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, AlertCircle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import AIInterviewLayout from './AIInterviewLayout';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setError('');
        setUploadSuccess(false);

        if (!selectedFile) return;

        // Client-side validation
        if (selectedFile.type !== 'application/pdf') {
            setError('Only PDF files are allowed.');
            return;
        }

        if (selectedFile.size > 2 * 1024 * 1024) {
            setError('File size must be less than 2MB.');
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await fetch('http://localhost:5000/api/resume/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setUploadSuccess(true);
            // Navigate to setup with resume text state
            setTimeout(() => {
                navigate('/ai-interview/setup', { state: { resumeText: data.text } });
            }, 1000);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSkip = () => {
        navigate('/ai-interview/setup');
    };

    return (
        <AIInterviewLayout>
            <div className="landing-page fade-in">
                <div className="landing-container">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/')}
                        className="back-button"
                        aria-label="Go back to HireViva"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to HireViva</span>
                    </button>

                    <div className="landing-header">
                        <div className="logo-icon-large">🎯</div>
                        <h1>AI Interview Platform</h1>
                        <p className="subtitle">Master your technical interview with strict, real-world AI simulation.</p>
                    </div>

                    <div className="upload-card glass">
                        <div className="card-content">
                            <h2>Upload Your Resume</h2>
                            <p className="description">
                                We'll analyze your resume to tailor the interview to your specific skills and experience.
                            </p>

                            <div className="upload-area">
                                <input
                                    type="file"
                                    id="resume-upload"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="file-input"
                                />
                                <label htmlFor="resume-upload" className={`upload-label ${file ? 'has-file' : ''}`}>
                                    {file ? (
                                        <div className="file-info">
                                            <FileText size={48} className="file-icon" />
                                            <span className="filename">{file.name}</span>
                                            <span className="filesize">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload size={48} className="upload-icon" />
                                            <span>Click to upload PDF</span>
                                            <span className="limit-text">Max 2MB. Virus scan included.</span>
                                        </>
                                    )}
                                </label>
                            </div>

                            {error && (
                                <div className="error-alert">
                                    <AlertCircle size={20} />
                                    <span>{error}</span>
                                </div>
                            )}

                            {uploadSuccess && (
                                <div className="success-alert">
                                    <CheckCircle size={20} />
                                    <span>Resume processed successfully! Redirecting...</span>
                                </div>
                            )}

                            <div className="actions">
                                <button
                                    onClick={handleUpload}
                                    className="btn btn-primary upload-btn"
                                    disabled={!file || isUploading || uploadSuccess}
                                >
                                    {isUploading ? 'Analyzing...' : 'Start Interview with Resume'}
                                </button>

                                <div className="divider">
                                    <span>OR</span>
                                </div>

                                <button onClick={handleSkip} className="btn btn-secondary skip-btn">
                                    <span>Continue without Resume</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AIInterviewLayout>
    );
};

export default LandingPage;
