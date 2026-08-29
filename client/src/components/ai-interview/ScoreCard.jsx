import './ScoreCard.css'

const ScoreCard = ({ title, score, maxScore = 100, color = 'primary' }) => {
    const percentage = (score / maxScore) * 100

    const getGrade = (score) => {
        if (score >= 90) return { grade: 'A+', label: 'Excellent' }
        if (score >= 80) return { grade: 'A', label: 'Great' }
        if (score >= 70) return { grade: 'B', label: 'Good' }
        if (score >= 60) return { grade: 'C', label: 'Fair' }
        return { grade: 'D', label: 'Needs Improvement' }
    }

    const { grade, label } = getGrade(score)

    return (
        <div className="score-card">
            <div className="score-header">
                <h3 className="score-title">{title}</h3>
                <div className="score-grade">
                    <span className="grade">{grade}</span>
                    <span className="grade-label">{label}</span>
                </div>
            </div>
            <div className="score-value">{score}/{maxScore}</div>
            <div className="score-bar">
                <div
                    className={`score-progress ${color}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

export default ScoreCard
