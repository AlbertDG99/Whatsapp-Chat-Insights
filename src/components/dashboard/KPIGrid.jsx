import React from 'react';
import FadeInSection from '../common/FadeInSection';

const KPIGrid = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="layout-grid" style={{ marginBottom: '2rem' }}>
            <FadeInSection className="col-span-1">
                <div className="card card-std">
                    <h3>Mensajes Totales</h3>
                    <div className="kpi-value">{stats.totalMessages.toLocaleString()}</div>
                </div>
            </FadeInSection>
            <FadeInSection className="col-span-1">
                <div className="card card-std">
                    <h3>Días Activos</h3>
                    <div className="kpi-value">{stats.daysActive.toLocaleString()}</div>
                </div>
            </FadeInSection>
            <FadeInSection className="col-span-1">
                <div className="card card-std">
                    <h3>Participantes</h3>
                    <div className="kpi-value">{stats.uniqueAuthors}</div>
                </div>
            </FadeInSection>
        </div>
    );
};

export default KPIGrid;
