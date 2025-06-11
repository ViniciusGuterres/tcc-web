import React, { useEffect, useState } from "react";
import ApexChart from "../../components/ApexChart";
import { ApexOptions } from "apexcharts";
import DownloadPDFButton from "../../components/DownloadPDFButton";
import endPoints from "../../constants/endpoints";
import fetchRequest from "../../utils/fetchRequest";

const RESOURCES_END_POINT = endPoints.resourcesEndPoint;

const Home: React.FC = () => {
    const [resourceChartLabels, setResourceChartLabels] = useState<string[]>([]);
    const [resourceChartSeries, setResourceChartSeries] = useState<number[]>([]);

    // Component did mount
    // Load charts data
    useEffect(() => {
        getResourceData();
    }, []);

    const getResourceData = async () => {
        const { err, data } = await fetchRequest(RESOURCES_END_POINT, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar dados dos recursos');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
            // Map chart data
            const labels: string[] = [];
            const series: number[] = [];

            data.forEach(({ name, currentQuantity }) => {
                if (currentQuantity > 0) {
                    series.push(currentQuantity);
                    labels.push(name);
                }
            });

            setResourceChartLabels(labels);
            setResourceChartSeries(series);
        }
    }

    const chartOptions: ApexOptions = {
        chart: {
            id: "basic-bar",
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May"],
        },
        title: {
            align: "center",
        },
    };

    const chartSeries = [
        {
            name: "Sales",
            data: [30, 40, 45, 50, 49],
        },
    ];

    return (
        <div
            //className="p-4 border rounded shadow"
            style={{
                height: "100%",
            }}
        >
            <div className="p-8">
                <DownloadPDFButton
                    reportEndPoint={endPoints.generalReportEndPoint}
                    buttonLabel="Relatório Anual de Faturamento"
                    hideTotalQuantities
                />
            </div>

            <div style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                alignItems: "center",
                height: "20%"
            }}>
                <div
                    style={{
                        width: "50%",
                        boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)",
                        borderRadius: "10px",
                    }}
                >
                    <h2 className="text-xl font-semibold mb-4">Faturamento Mensal</h2>
                    <ApexChart
                        type="bar"
                        options={chartOptions}
                        series={chartSeries}
                        width="100%"
                        height="100%"
                    />
                </div>

                <div
                    style={{
                        width: "50%",
                        boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)",
                        borderRadius: "10px",
                    }}
                >
                    <h2 className="text-xl font-semibold mt-10 mb-4">Recursos</h2>
                    {
                        resourceChartSeries?.length > 0
                            ?
                            <ApexChart
                                type="donut"
                                options={{
                                    labels: resourceChartLabels,
                                    legend: {
                                        position: 'bottom'
                                    },
                                    title: {
                                        align: 'center',
                                    }
                                }}
                                series={resourceChartSeries}
                                // labels={resourceChartLabels}
                                width="100%"
                                height="100%"
                            />
                            :
                            null
                    }

                </div>
            </div>

            <div style={{
                width: "100%",
                height: "70%",
                minHeight: "350px",
                boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)",
                borderRadius: "10px",
            }}>
                <h2 className="text-xl font-semibold mt-10 mb-4">Faturamento anual</h2>
                <ApexChart
                    type="line"
                    options={chartOptions}
                    series={chartSeries}
                    width="100%"
                    height="100%"
                />
            </div>
        </div>
    );
};

export default Home;
