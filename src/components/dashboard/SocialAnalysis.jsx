
import React from 'react';
import { Bar } from 'react-chartjs-2';
import FadeInSection from '../common/FadeInSection';
import HistoricStreak from './HistoricStreak';

const SocialAnalysis = ({ stats, chartOptions }) => {
    if (!stats) return null;

    return (
        <div className="dashboard-section">
            <h2 className="section-title">Dinámicas Sociales y Curiosidades</h2>
            <div className="dashboard-grid">
                {/* Historic Streak - Featured card */}
                <HistoricStreak streak={stats.historicStreak} />

                <FadeInSection>
                    <div className="card">
                        <h3>Más Participativos</h3>
                        <div className="card-chart-container">
                            <Bar data={stats.authorChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className="card">
                        <h3>Iniciadores de Conversación</h3>
                        <div className="card-chart-container">
                            <Bar data={stats.starterChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className="card">
                        <h3>Medidor de Risas</h3>
                        <div className="card-chart-container">
                            <Bar data={stats.laughterChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className="card">
                        <h3>El de los Links</h3>
                        <div className="card-chart-container">
                            <Bar data={stats.linkChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className="card">
                        <h3>El Preguntón (?)</h3>
                        <div className="card-chart-container">
                            <Bar data={stats.questionChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
                        </div>
                    </div>
                </FadeInSection>
            </div>
        </div>
    );
};

export default SocialAnalysis;
