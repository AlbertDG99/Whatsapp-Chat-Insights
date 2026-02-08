
import React, { memo } from 'react';
import FadeInSection from '../common/FadeInSection';
import AccessibleChart from '../common/AccessibleChart';
import { PIE_CHART_OPTIONS, PIE_CHART_PLUGINS } from '../../utils/chartConfig';
import styles from '../Dashboard.module.css';

const TemporalAnalysis = memo(({ stats, chartOptions }) => {
    if (!stats) return null;

    return (
        <div className="dashboard-section">
            <h2 className={styles.sectionTitle}>Análisis Temporal</h2>
            <div className={styles.grid}>
                <FadeInSection delay="0s">
                    <div className={`${styles.card} ${styles.fullWidth}`}>
                        <h3 title="Mensajes agrupados por trimestre a lo largo del tiempo">Actividad en el Tiempo</h3>
                        <div className={styles.chartContainer}>
                            <AccessibleChart type="line" data={stats.timelineChartData} options={chartOptions} ariaLabel="Gráfico de actividad en el tiempo por trimestre" />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay="0.1s">
                    <div className={styles.card}>
                        <h3 title="Distribución de mensajes por hora del día (0-23h)">Actividad por Hora del Día</h3>
                        <div className={styles.chartContainer}>
                            <AccessibleChart type="bar" data={stats.hourlyChartData} options={chartOptions} ariaLabel="Gráfico de barras: actividad por hora del día" />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay="0.2s">
                    <div className={styles.card}>
                        <h3 title="Distribución de mensajes por día de la semana (lunes a domingo)">Actividad por Día de la Semana</h3>
                        <div className={styles.chartContainer}>
                            <AccessibleChart type="bar" data={stats.dayOfWeekChartData} options={chartOptions} ariaLabel="Gráfico de barras: actividad por día de la semana" />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay="0.3s">
                    <div className={styles.card}>
                        <h3 title="Proporción de mensajes en fin de semana vs días laborables">Fin de Semana vs Laborables</h3>
                        <div className={`${styles.chartContainer} ${styles.centered}`}>
                            <AccessibleChart type="pie" data={stats.weekendChartData} options={PIE_CHART_OPTIONS} plugins={PIE_CHART_PLUGINS} ariaLabel="Gráfico circular: fin de semana vs días laborables" />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay="0.4s">
                    <div className={`${styles.card} ${styles.fullWidth}`}>
                        <h3 title="Tendencia de mensajes por mes del año">Estacionalidad (Mensual)</h3>
                        <div className={styles.chartContainer}>
                            <AccessibleChart type="line" data={stats.seasonalityChartData} options={chartOptions} ariaLabel="Gráfico de línea: estacionalidad mensual de mensajes" />
                        </div>
                    </div>
                </FadeInSection>
            </div>
        </div>
    );
});

TemporalAnalysis.displayName = 'TemporalAnalysis';

export default TemporalAnalysis;
