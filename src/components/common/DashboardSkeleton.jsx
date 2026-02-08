import React from 'react';
import styles from './DashboardSkeleton.module.css';

const DashboardSkeleton = () => {
    return (
        <div className={styles.skeleton}>
            <div className={styles.header}>
                <div className={`${styles.bone} ${styles.titleBone}`} />
                <div className={styles.filters}>
                    <div className={`${styles.bone} ${styles.filterBone}`} />
                    <div className={`${styles.bone} ${styles.filterBone}`} />
                    <div className={`${styles.bone} ${styles.filterBone}`} />
                </div>
            </div>
            <div className={styles.kpis}>
                {[1, 2, 3].map(i => (
                    <div key={i} className={`${styles.bone} ${styles.kpiBone}`} />
                ))}
            </div>
            <div className={styles.grid}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className={`${styles.bone} ${styles.cardBone}`} />
                ))}
            </div>
        </div>
    );
};

export default DashboardSkeleton;
