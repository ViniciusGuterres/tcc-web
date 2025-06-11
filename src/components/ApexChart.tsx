import React from 'react';
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface BaseChartProps {
    options: ApexOptions;
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
    width?: string,
    height?: string,
}

interface DonutChartProps extends BaseChartProps {
    labels: string[];
    width?: string,
    height?: string,
}

type ChartType = 'bar' | 'donut' | 'line';

interface ApexChartProps {
    type: ChartType;
    options: ApexOptions;
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
    labels?: string[];
    width?: string,
    height?: string,
}

const BarChart: React.FC<BaseChartProps> = ({ options, series, width, height }) => (
    <Chart
        options={options}
        series={series}
        type="bar"
        width={width || "100%"}
        height={height || "80%"}
    />
);

const DonutChart: React.FC<DonutChartProps> = ({ options, series, width, height }) =>
{
    return <Chart
        options={options}
        series={series}
        type="donut"
        width={width || "100%"}
        height={height || "80%"}
    />
};

const LineChart: React.FC<BaseChartProps> = ({ options, series, width, height }) => (
    <Chart
        options={options}
        series={series}
        type="line"
        width={width || "100%"}
        height={height || "80%"}
    />
);

const ApexChart: React.FC<ApexChartProps> = ({ type, options, series, labels, width, height }) => {
    const renderChart = () => {
        switch (type) {
            case 'bar':
                return <BarChart
                    options={options}
                    series={series}
                    width={width}
                    height={height}
                />;
            case 'donut':
                return <DonutChart
                    options={options}
                    series={series}
                    labels={labels || []}
                    width={width}
                    height={height}
                />;
            case 'line':
                return <LineChart
                    options={options}
                    series={series}
                    width={width}
                    height={height}
                />;
            default:
                return null;
        }
    };

    return <>{renderChart()}</>;
};
export default ApexChart;