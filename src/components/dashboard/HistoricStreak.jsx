import FadeInSection from '../common/FadeInSection';
import { Trophy, Clock, MessageSquare } from 'lucide-react';

/**
 * HistoricStreak Component
 * Displays the historic streak with enhanced decoration and detailed information
 */
const HistoricStreak = ({ streak }) => {
    if (!streak || !streak.author) return null;

    const formatDate = (date) => {
        if (!date) return '-';
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateMessage = (msg, maxLength = 50) => {
        if (!msg) return '-';
        if (msg.length <= maxLength) return msg;
        return msg.substring(0, maxLength) + '...';
    };

    return (
        <FadeInSection>
            <div className="card historic-streak-card">
                <div className="streak-header">
                    <Trophy size={28} className="streak-icon" />
                    <h3>🏆 Chapa Histórica</h3>
                </div>

                <div className="streak-main">
                    <div className="streak-author">{streak.author}</div>
                    <div className="streak-count">
                        <span className="count-number">{streak.count}</span>
                        <span className="count-label">mensajes seguidos</span>
                    </div>
                </div>

                <div className="streak-details">
                    <div className="streak-detail-row">
                        <Clock size={14} />
                        <span className="detail-label">Inicio:</span>
                        <span className="detail-value">{formatDate(streak.startTimestamp)}</span>
                    </div>
                    <div className="streak-detail-row">
                        <Clock size={14} />
                        <span className="detail-label">Fin:</span>
                        <span className="detail-value">{formatDate(streak.endTimestamp)}</span>
                    </div>
                </div>

                <div className="streak-messages">
                    <div className="streak-message-item">
                        <MessageSquare size={14} />
                        <span className="message-label">Primer mensaje:</span>
                        <span className="message-content" title={streak.startMessage}>
                            "{truncateMessage(streak.startMessage)}"
                        </span>
                    </div>
                    <div className="streak-message-item">
                        <MessageSquare size={14} />
                        <span className="message-label">Último mensaje:</span>
                        <span className="message-content" title={streak.endMessage}>
                            "{truncateMessage(streak.endMessage)}"
                        </span>
                    </div>
                </div>
            </div>
        </FadeInSection>
    );
};

export default HistoricStreak;
