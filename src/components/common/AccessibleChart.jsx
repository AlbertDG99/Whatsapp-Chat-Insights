import React from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

const chartComponents = {
    line: Line,
    bar: Bar,
    pie: Pie,
    doughnut: Doughnut
};

const generateSummary = (data) => {
    if (!data?.labels || !data?.datasets?.[0]?.data) return '';
    const pairs = data.labels.map((label, i) => `${label}: ${data.datasets[0].data[i]}`);
    return pairs.join(', ');
};

const AccessibleChart = ({ type, data, options, ariaLabel, plugins, ...rest }) => {
    const ChartComponent = chartComponents[type];
    if (!ChartComponent) return null;

    const chartProps = { data, options, ...rest };
    if (plugins) chartProps.plugins = plugins;

    return (
        <div role="img" aria-label={ariaLabel}>
            <ChartComponent {...chartProps} />
            <p className="sr-only">{generateSummary(data)}</p>
        </div>
    );
};

export default AccessibleChart;
