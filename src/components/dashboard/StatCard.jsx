import React from 'react';
import FadeInSection from '../common/FadeInSection';

const StatCard = ({ icon: Icon, title, value, subtitle, gradient, delay }) => {
    return (
        <FadeInSection delay={delay} className="col-span-1">
            <div className="card stat-card card-std">
                <div className="streak-header">
                    {Icon && <Icon className="streak-icon" style={{ color: gradient ? undefined : 'var(--color-primary)' }} />}
                    <h3>{title}</h3>
                </div>

                <div className="stat-card-value" style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    background: gradient || 'linear-gradient(135deg, #e9edef 0%, #8696a0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.5rem'
                }}>
                    {value}
                </div>

                {subtitle && (
                    <p className="subtitle" style={{ marginTop: 'auto' }}>
                        {subtitle}
                    </p>
                )}
            </div>
        </FadeInSection>
    );
};

export default StatCard;
