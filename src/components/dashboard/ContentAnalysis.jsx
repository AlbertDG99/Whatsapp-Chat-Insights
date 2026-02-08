
import React, { memo } from 'react';
import FadeInSection from '../common/FadeInSection';
import AccessibleChart from '../common/AccessibleChart';
import { PIE_CHART_OPTIONS, PIE_CHART_PLUGINS } from '../../utils/chartConfig';
import styles from '../Dashboard.module.css';

const ContentAnalysis = memo(({ stats, chartOptions }) => {
    if (!stats) return null;

    return (
        <div className="dashboard-section">
            <h2 className={styles.sectionTitle}>Análisis de Contenido</h2>
            <div className={styles.grid}>
                <FadeInSection delay="0s">
                    <div className={styles.card}>
                        <h3 title="Cantidad de archivos multimedia enviados por cada participante">Multimedia Enviado</h3>
                        <div className={styles.chartContainer}>
                            <AccessibleChart type="bar" data={stats.mediaChartData} options={{ ...chartOptions, indexAxis: 'y' }} ariaLabel="Gráfico de barras horizontal: multimedia enviado por participante" />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay="0.1s">
                    <div className={styles.card}>
                        <h3 title="Promedio de caracteres por mensaje de texto de cada participante">Promedio de Longitud (Caracteres)</h3>
                        <div className={styles.chartContainer}>
                            <AccessibleChart type="bar" data={stats.avgLengthChartData} options={chartOptions} ariaLabel="Gráfico de barras: promedio de longitud de mensaje en caracteres" />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay="0.2s">
                    <div className={styles.card}>
                        <h3 title="Total de palabras escritas por cada participante">Total Palabras</h3>
                        <div className={styles.chartContainer}>
                            <AccessibleChart type="bar" data={stats.wordChartData} options={{ ...chartOptions, indexAxis: 'y' }} ariaLabel="Gráfico de barras horizontal: total de palabras por participante" />
                        </div>
                    </div>
                </FadeInSection>

                <FadeInSection delay="0.3s">
                    <div className={styles.card}>
                        <h3 title="Los 5 emojis más utilizados en la conversación">Emojis Más Usados</h3>
                        <div className={`${styles.chartContainer} ${styles.centered}`}>
                            <AccessibleChart type="doughnut" data={stats.emojiChartData} options={PIE_CHART_OPTIONS} plugins={PIE_CHART_PLUGINS} ariaLabel="Gráfico de dona: emojis más usados" />
                        </div>
                    </div>
                </FadeInSection>
            </div>
        </div>
    );
});

ContentAnalysis.displayName = 'ContentAnalysis';

export default ContentAnalysis;
