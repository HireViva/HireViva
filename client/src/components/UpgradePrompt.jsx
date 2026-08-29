import { AlertCircle, Crown, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './UpgradePrompt.css';

const UpgradePrompt = ({ currentTier, requiredTier, feature, onClose }) => {
    const navigate = useNavigate();

    const tierInfo = {
        basic: {
            name: 'Basic',
            price: '₹299',
            icon: Zap,
            color: 'blue'
        },
        pro: {
            name: 'Pro',
            price: '₹599',
            icon: Crown,
            color: 'purple'
        }
    };

    const required = tierInfo[requiredTier];
    const Icon = required?.icon || Crown;

    return (
        <div className="upgrade-prompt-overlay" onClick={onClose}>
            <div className="upgrade-prompt-modal" onClick={(e) => e.stopPropagation()}>
                <div className="upgrade-icon">
                    <AlertCircle size={48} />
                </div>

                <h2>Upgrade Required</h2>

                <p className="upgrade-message">
                    {feature || 'This feature'} requires a {required?.name || 'higher'} subscription.
                </p>

                <div className="current-plan-info">
                    <p>Current Plan: <strong>{currentTier.toUpperCase()}</strong></p>
                </div>

                {required && (
                    <div className={`upgrade-card ${required.color}`}>
                        <div className="upgrade-card-icon">
                            <Icon size={32} />
                        </div>
                        <div className="upgrade-card-content">
                            <h3>{required.name} Plan</h3>
                            <p className="upgrade-price">{required.price}/month</p>
                        </div>
                    </div>
                )}

                <div className="upgrade-actions">
                    <button
                        className="btn-upgrade"
                        onClick={() => navigate('/pricing')}
                    >
                        View Plans & Upgrade
                    </button>
                    <button
                        className="btn-cancel"
                        onClick={onClose}
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradePrompt;
