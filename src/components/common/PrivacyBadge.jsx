import React from 'react';
import { Shield } from 'lucide-react';
import styles from './PrivacyBadge.module.css';

const PrivacyBadge = () => {
    return (
        <div className={styles.badge}>
            <Shield size={14} />
            <span>100% privado. Tus datos no salen de tu navegador.</span>
        </div>
    );
};

export default PrivacyBadge;
