import React from 'react';
import FadeInSection from '../common/FadeInSection';

/**
 * MiniStatCard Component
 * Compact stat card with icon, value, and optional subtitle.
 * Used consistently across both multi-user and single-user dashboards.
 */
const MiniStatCard = ({ icon: Icon, title, value, subtitle }) => {
    return (
        <FadeInSection className="col-span-1">
            <div className="card mini-stat-card">
                <div className="mini-stat-header">
                    {Icon && <Icon size={18} className="mini-stat-icon" />}
                    <span className="mini-stat-title">{title}</span>
                </div>
                <div className="mini-stat-value">{value}</div>
                {subtitle && <span className="mini-stat-subtitle">{subtitle}</span>}
            </div>
        </FadeInSection>
    );
};

export default MiniStatCard;
