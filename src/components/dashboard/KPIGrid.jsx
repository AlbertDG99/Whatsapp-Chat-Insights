import React, { memo } from 'react';
import { MessageCircle, Calendar, Users } from 'lucide-react';
import MiniStatCard from './MiniStatCard';
import FadeInSection from '../common/FadeInSection';
import styles from '../Dashboard.module.css';

const KPIGrid = memo(({ stats }) => {
    if (!stats) return null;

    return (
        <div className={styles.statsRow}>
            <FadeInSection delay="0s">
                <MiniStatCard
                    icon={MessageCircle}
                    title="Mensajes"
                    value={stats.totalMessages.toLocaleString()}
                />
            </FadeInSection>
            <FadeInSection delay="0.1s">
                <MiniStatCard
                    icon={Calendar}
                    title="Días Activos"
                    value={stats.daysActive.toLocaleString()}
                />
            </FadeInSection>
            <FadeInSection delay="0.2s">
                <MiniStatCard
                    icon={Users}
                    title="Participantes"
                    value={stats.uniqueAuthors}
                />
            </FadeInSection>
        </div>
    );
});

KPIGrid.displayName = 'KPIGrid';

export default KPIGrid;
