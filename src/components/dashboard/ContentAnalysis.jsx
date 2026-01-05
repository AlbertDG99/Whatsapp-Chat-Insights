
import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import FadeInSection from '../common/FadeInSection';

const ContentAnalysis = ({ stats, chartOptions }) => {
    if (!stats) return null;

    return (
        <div className="dashboard-section">
            <h2 className="section-title">Análisis de Contenido</h2>
            <div className="dashboard-grid">
                <FadeInSection>
                    <div className="card">
                        <h3>Multimedia Enviado</h3>
                        <div style={{ height: '300px' }}>
                            <Bar data={stats.mediaChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className="card">
                        <h3>Promedio de Longitud (Caracteres)</h3>
                        <div style={{ height: '300px' }}>
                            <Bar data={stats.avgLengthChartData} options={chartOptions} />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className="card">
                        <h3>Total Palabras</h3>
                        <div style={{ height: '300px' }}>
                            <Bar data={stats.wordChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className="card">
                        <h3>Emojis Más Usados</h3>
                        <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                            <Doughnut data={stats.emojiChartData} options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'right', labels: { color: '#e9edef' } } }
                            }} />
                        </div>
                    </div>
                </FadeInSection>
            </div>
        </div>
    );
};

export default ContentAnalysis;
