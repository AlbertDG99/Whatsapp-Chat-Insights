
import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import FadeInSection from '../common/FadeInSection';

const ContentAnalysis = ({ stats, chartOptions }) => {
    if (!stats) return null;

    return (
        <div className="dashboard-section">
            <h2 className="section-title">Análisis de Contenido</h2>
            <div className="dashboard-grid">
                <FadeInSection delay="0s">
                    <div className="card">
                        <h3>Multimedia Enviado</h3>
                        <div className="card-chart-container">
                            <Bar data={stats.mediaChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay="0.1s">
                    <div className="card">
                        <h3>Promedio de Longitud (Caracteres)</h3>
                        <div className="card-chart-container">
                            <Bar data={stats.avgLengthChartData} options={chartOptions} />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay="0.2s">
                    <div className="card">
                        <h3>Total Palabras</h3>
                        <div className="card-chart-container">
                            <Bar data={stats.wordChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay="0.3s">
                    <div className="card">
                        <h3>Emojis Más Usados</h3>
                        <div className="card-chart-container centered">
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
