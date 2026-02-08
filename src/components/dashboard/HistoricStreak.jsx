import FadeInSection from '../common/FadeInSection';
import { Trophy, Clock, MessageCircle } from 'lucide-react';
import styles from './HistoricStreak.module.css';

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
        <FadeInSection>
            <div className={styles.card}>
                <div className={styles.header}>
                    <Trophy size={24} />
                    <h3>Chapa Histórica</h3>
                </div>

                <div className={styles.main}>
                    <div className={styles.author}>{streak.author}</div>
                    <div>
                        <span className={styles.countNumber}>{streak.count} </span>
                        <span>mensajes seguidos</span>
                    </div>
                </div>

                <div className={styles.timeline}>
                    <div className="timeline-point start">
                        <Clock size={14} />
                        <span>{formatDate(streak.startTimestamp)}</span>
                    </div>
                    <div className={styles.timelineConnector}></div>
                    <div className="timeline-point end">
                        <Clock size={14} />
                        <span>{formatDate(streak.endTimestamp)}</span>
                    </div>
                </div>

                <div className={styles.quotes}>
                    <div className={`${styles.quoteItem} ${styles.first}`}>
                        <MessageCircle size={12} />
                        <span>Primer mensaje:</span>
                        <span className={styles.quoteText} title={streak.startMessage}>"{truncateMessage(streak.startMessage)}"</span>
                    </div>
                    <div className={`${styles.quoteItem} ${styles.last}`}>
                        <MessageCircle size={12} />
                        <span>Último mensaje:</span>
                        <span className={styles.quoteText} title={streak.endMessage}>"{truncateMessage(streak.endMessage)}"</span>
                    </div>
                </div>
            </div>
        </FadeInSection>
    );
};

export default HistoricStreak;
