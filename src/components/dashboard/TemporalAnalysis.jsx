
import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import FadeInSection from '../common/FadeInSection';

const TemporalAnalysis = ({ stats, chartOptions }) => {
    if (!stats) return null;

    return (
        <div className="dashboard-section">
            <h2 className="section-title">Análisis Temporal</h2>
            <div className="dashboard-grid">
                <FadeInSection delay="0s">
                    <div className="card full-width">
                        <h3>Actividad en el Tiempo</h3>
                        <div className="card-chart-container">
                            <Line data={stats.timelineChartData} options={chartOptions} />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay="0.1s">
                    <div className="card">
                        <h3>Actividad por Hora del Día</h3>
                        <div className="card-chart-container">
                            <Bar data={stats.hourlyChartData} options={chartOptions} />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay="0.2s">
                    <div className="card">
                        <h3>Actividad por Día de la Semana</h3>
                        <div className="card-chart-container">
                            <Bar data={stats.dayOfWeekChartData} options={chartOptions} />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay="0.3s">
                    <div className="card">
                        <h3>Fin de Semana vs Laborables</h3>
                        <div className="card-chart-container centered">
                            <Pie data={stats.weekendChartData} options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'right', labels: { color: '#e9edef' } } }
                            }} />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay="0.4s">
                    <div className="card full-width">
                        <h3>Estacionalidad (Mensual)</h3>
                        <div className="card-chart-container">
                            <Line data={stats.seasonalityChartData} options={chartOptions} />
                        </div>
                    </div>
                </FadeInSection>
            </div>
        </div>
    );
};

export default TemporalAnalysis;
