/**
 * Shared chart configuration presets
 * Eliminates duplicated pie/doughnut options across components
 */

import ChartDataLabels from 'chartjs-plugin-datalabels';

export const PIE_CHART_PLUGINS = [ChartDataLabels];

export const PIE_CHART_OPTIONS = {
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
            labels: { color: '#e9edef' }
        },
        datalabels: {
            color: '#e9edef',
            font: { weight: 'bold', size: 11 },
            formatter: (value, ctx) => {
                const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                return pct >= 5 ? `${pct}%` : '';
            }
        }
    }
};
