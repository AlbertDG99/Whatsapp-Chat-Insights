import FadeInSection from '../common/FadeInSection';
import { Trophy } from 'lucide-react';

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

    const truncateMessage = (msg, maxLength = 20) => {
        if (!msg) return '-';
        return msg.length <= maxLength ? msg : `${msg.substring(0, maxLength)}...`;
    };

    return (
        <FadeInSection className="col-span-1 row-span-2">
            <div className="card historic-streak-card card-tall">
                <div className="streak-header">
                    <Trophy size={28} className="streak-icon" />
                    <h3>Chapa Histórica</h3>
                </div>

                <div className="streak-main">
                    <div className="streak-author">{streak.author}</div>
                    <div className="streak-count">
                        <span className="count-number">{streak.count}</span>
                        <div className="count-label">mensajes</div>
                    </div>
                </div>

                <div className="streak-details">
                    <div className="streak-detail-row">
                        <span className="detail-label">Inicio:</span>
                        <span className="detail-value">{formatDate(streak.startTimestamp)}</span>
                    </div>
                    <div className="streak-detail-row">
                        <span className="detail-label">Fin:</span>
                        <span className="detail-value">{formatDate(streak.endTimestamp)}</span>
                    </div>
                </div>

                <div className="streak-messages" style={{ marginTop: 'auto', fontSize: '0.8rem', opacity: 0.8 }}>
                    <div style={{ fontStyle: 'italic' }}>"{truncateMessage(streak.startMessage)}"</div>
                    <div style={{ textAlign: 'center' }}>⬇</div>
                    <div style={{ fontStyle: 'italic' }}>"{truncateMessage(streak.endMessage)}"</div>
                </div>
            </div>
        </FadeInSection>
    );
};

export default HistoricStreak;
