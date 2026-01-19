import FadeInSection from '../common/FadeInSection';
import { Trophy, Clock, MessageCircle } from 'lucide-react';

/**
 * HistoricStreak Component
 * Displays the historic streak with enhanced decoration and detailed information.
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

    const truncateMessage = (msg, maxLength = 25) => {
        if (!msg) return '-';
        return msg.length <= maxLength ? msg : `${msg.substring(0, maxLength)}...`;
    };

    return (
        <FadeInSection className="col-span-1">
            <div className="card historic-streak-card">
                <div className="streak-header">
                    <Trophy size={24} className="streak-icon" />
                    <h3>Chapa Histórica</h3>
                </div>

                <div className="streak-main-compact">
                    <div className="streak-author">{streak.author}</div>
                    <div className="streak-count-inline">
                        <span className="count-number-compact">{streak.count} </span>
                        <span className="count-label-compact">mensajes seguidos</span>
                    </div>
                </div>

                <div className="streak-timeline">
                    <div className="timeline-point start">
                        <Clock size={14} />
                        <span className="timeline-date">{formatDate(streak.startTimestamp)}</span>
                    </div>
                    <div className="timeline-connector"></div>
                    <div className="timeline-point end">
                        <Clock size={14} />
                        <span className="timeline-date">{formatDate(streak.endTimestamp)}</span>
                    </div>
                </div>

                <div className="streak-quotes">
                    <div className="quote-item first">
                        <MessageCircle size={12} />
                        <span className="quote-label">Primer mensaje:</span>
                        <span className="quote-text">"{truncateMessage(streak.startMessage)}"</span>
                    </div>
                    <div className="quote-item last">
                        <MessageCircle size={12} />
                        <span className="quote-label">Último mensaje:</span>
                        <span className="quote-text">"{truncateMessage(streak.endMessage)}"</span>
                    </div>
                </div>
            </div>
        </FadeInSection>
    );
};

export default HistoricStreak;
