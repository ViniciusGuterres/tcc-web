import React from 'react';
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface BaseChartProps {
    options: ApexOptions;
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
}

interface DonutChartProps extends BaseChartProps {
    labels: string[];
}

type ChartType = 'bar' | 'donut' | 'line';

interface ApexChartProps {
    type: ChartType;
    options: ApexOptions;
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
    labels?: string[];
}

const BarChart: React.FC<BaseChartProps> = ({ options, series }) => (
    <Chart
        options={options}
        series={series}
        type="bar"
        width="100%"
        height="80%"
    />
);

const DonutChart: React.FC<DonutChartProps> = ({ options, series, labels }) => (
    <Chart
        options={{ ...options, labels }}
        series={series}
        type="donut"
        width="100%"
        height="80%"
    />
);

const LineChart: React.FC<BaseChartProps> = ({ options, series }) => (
    <Chart
        options={options}
        series={series}
        type="line"
        width="100%"
        height="80%"
    />
);

const ApexChart: React.FC<ApexChartProps> = ({ type, options, series, labels }) => {
    const renderChart = () => {
        switch (type) {
            case 'bar':
                return <BarChart options={options} series={series} />;
            case 'donut':
                return <DonutChart options={options} series={series} labels={labels || []} />;
            case 'line':
                return <LineChart options={options} series={series} />;
            default:
                return null;
        }
    };

    return <>{renderChart()}</>;
};
export default ApexChart;