
import React, { memo } from 'react';
import FadeInSection from '../common/FadeInSection';
import AccessibleChart from '../common/AccessibleChart';
import HistoricStreak from './HistoricStreak';
import WordSearchCard from './WordSearchCard';
import styles from '../Dashboard.module.css';

const SocialAnalysis = memo(({ stats, chartOptions, messages }) => {
    if (!stats) return null;

    return (
        <div className="dashboard-section">
            <h2 className={styles.sectionTitle}>Dinámicas Sociales y Curiosidades</h2>
            <div className={styles.grid}>
                {/* Historic Streak - Featured card */}
                <HistoricStreak streak={stats.historicStreak} />

                <FadeInSection>
                    <div className={styles.card}>
                        <h3 title="Participantes con mayor número de mensajes enviados">Más Participativos</h3>
                        <div className={styles.chartContainer}>
                            <AccessibleChart type="bar" data={stats.authorChartData} options={{ ...chartOptions, indexAxis: 'y' }} ariaLabel="Gráfico de barras horizontal: participantes más activos" />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className={styles.card}>
                        <h3 title="Mensajes enviados después de más de 4 horas sin actividad">Iniciadores de Conversación</h3>
                        <div className={styles.chartContainer}>
                            <AccessibleChart type="bar" data={stats.starterChartData} options={{ ...chartOptions, indexAxis: 'y' }} ariaLabel="Gráfico de barras horizontal: iniciadores de conversación" />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className={styles.card}>
                        <h3 title="Mensajes que contienen risas (jaja, haha, etc.)">Medidor de Risas</h3>
                        <div className={styles.chartContainer}>
                            <AccessibleChart type="bar" data={stats.laughterChartData} options={{ ...chartOptions, indexAxis: 'y' }} ariaLabel="Gráfico de barras horizontal: medidor de risas por participante" />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className={styles.card}>
                        <h3 title="Participantes que más enlaces comparten en la conversación">El de los Links</h3>
                        <div className={styles.chartContainer}>
                            <AccessibleChart type="bar" data={stats.linkChartData} options={{ ...chartOptions, indexAxis: 'y' }} ariaLabel="Gráfico de barras horizontal: enlaces compartidos por participante" />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <div className={styles.card}>
                        <h3 title="Participantes que más preguntas hacen en la conversación">El Preguntón (?)</h3>
                        <div className={styles.chartContainer}>
                            <AccessibleChart type="bar" data={stats.questionChartData} options={{ ...chartOptions, indexAxis: 'y' }} ariaLabel="Gráfico de barras horizontal: preguntas por participante" />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection>
                    <WordSearchCard messages={messages} />
                </FadeInSection>
            </div>
        </div>
    );
});

SocialAnalysis.displayName = 'SocialAnalysis';

export default SocialAnalysis;
