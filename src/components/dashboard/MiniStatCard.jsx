import React, { memo } from 'react';
import FadeInSection from '../common/FadeInSection';
import styles from './MiniStatCard.module.css';

const MiniStatCard = memo(({ icon: Icon, title, value, subtitle }) => {
    return (
        <FadeInSection>
            <div className={styles.card}>
                <div className={styles.header}>
                    {Icon && <Icon size={18} className={styles.icon} />}
                    <span className={styles.title}>{title}</span>
                </div>
                <div className={styles.value}>{value}</div>
                {subtitle && <span className="mini-stat-subtitle">{subtitle}</span>}
            </div>
        </FadeInSection>
    );
});

MiniStatCard.displayName = 'MiniStatCard';

export default MiniStatCard;
