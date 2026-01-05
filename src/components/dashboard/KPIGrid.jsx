
import React from 'react';
import FadeInSection from '../common/FadeInSection';

const KPIGrid = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="dashboard-grid kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
            <FadeInSection>
                <div className="card">
                    <h3>Mensajes Totales</h3>
                    <div className="kpi-value">{stats.totalMessages.toLocaleString()}</div>
                </div>
            </FadeInSection>
            <FadeInSection>
                <div className="card">
                    <h3>Días Activos</h3>
                    <div className="kpi-value">{stats.daysActive.toLocaleString()}</div>
                </div>
            </FadeInSection>
            <FadeInSection>
                <div className="card">
                    <h3>Participantes</h3>
                    <div className="kpi-value">{stats.uniqueAuthors}</div>
                </div>
            </FadeInSection>
        </div>
    );
};

export default KPIGrid;
