import React from 'react';
import { MessageCircle, Calendar, Users } from 'lucide-react';
import MiniStatCard from './MiniStatCard';
import FadeInSection from '../common/FadeInSection';

const KPIGrid = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="stats-row">
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
};

export default KPIGrid;
