import React, { useEffect, useState } from "react";
import ApexChart from "../../components/ApexChart";
import { ApexOptions } from "apexcharts";
import DownloadPDFButton from "../../components/DownloadPDFButton";
import endPoints from "../../constants/endpoints";
import fetchRequest from "../../utils/fetchRequest";

const RESOURCES_END_POINT = endPoints.resourcesEndPoint;
const GENERAL_REPORT_END_POINT = endPoints.generalReportEndPoint;

const Home: React.FC = () => {
    const [resourceChartLabels, setResourceChartLabels] = useState<string[]>([]);
    const [resourceChartSeries, setResourceChartSeries] = useState<number[]>([]);
    const [annualSallesData, setAnnualSallesData] = useState<number[]>([]);
    const [annualIncommingCost, setAnnualIncommingCost] = useState<number[]>([]);;

    // Component did mount
    // Load charts data
    useEffect(() => {
        getResourceData();
        getAnnualSalles();
    }, []);

    const getAnnualSalles = async () => {
        const { err, data } = await fetchRequest(GENERAL_REPORT_END_POINT, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar dados dos recursos');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && Array.isArray(data) && data[0] && data[0].months) {
            const annualSallesDataArray: number[] = [];
            const annualIncommingCost: number[] = [];

            const dataMonths = data[0].months;

            dataMonths.forEach(currentMonth => {
                annualSallesDataArray.push(parseFloat(currentMonth.outgoingProfit || 0));
                annualIncommingCost.push(parseFloat(currentMonth.incomingCost || 0));
            });

            setAnnualSallesData(annualSallesDataArray);
            setAnnualIncommingCost(annualIncommingCost);
        }
    }

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
            categories: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        },
        title: {
            align: "center",
        },
    };

    const lineChartSeries = [
        {
            name: "Sales",
            data: annualSallesData,
        },
    ];

    const barChartSeries = [
        {
            name: "incomming",
            data: annualIncommingCost,
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
                {/* Bar chart */}
                {
                    annualIncommingCost.length > 0
                        ?
                        <div
                            style={{
                                width: "50%",
                                boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)",
                                borderRadius: "10px",
                            }}
                        >
                            <h2 className="text-xl font-semibold mb-4">Despesas Mensais</h2>
                            <ApexChart
                                type="bar"
                                options={chartOptions}
                                series={barChartSeries}
                                width="100%"
                                height="100%"
                            />
                        </div>
                        :
                        <div
                            className="skeleton"
                            style={{
                                width: "50%",
                                boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)",
                                borderRadius: "10px",
                            }}
                        ></div>
                }

                {/* Donut chart */}
                {
                    resourceChartSeries.length > 0
                        ?
                        <div
                            style={{
                                width: "50%",
                                boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)",
                                borderRadius: "10px",
                            }}
                        >
                            <h2 className="text-xl font-semibold mt-10 mb-4">Recursos</h2>

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
                                width="100%"
                                height="100%"
                            />
                        </div>
                        :
                        <div
                            className="skeleton"
                            style={{
                                width: "50%",
                                boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)",
                                borderRadius: "10px",
                            }}
                        ></div>
                }
            </div>

            {/* Line chart */}
            {
                annualSallesData?.length > 0
                    ?
                    <div style={{
                        width: "100%",
                        height: "70%",
                        minHeight: "350px",
                        boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)",
                        borderRadius: "10px",
                    }}>
                        <h2 className="text-xl font-semibold mt-10 mb-4">Faturamento Mensal</h2>
                        <ApexChart
                            type="line"
                            options={chartOptions}
                            series={lineChartSeries}
                            width="100%"
                            height="100%"
                        />
                    </div>
                    :
                    <div
                        className="skeleton"
                        style={{
                            width: "100%",
                            height: "70%",
                            minHeight: "350px",
                            boxShadow: "0 0.5rem 1rem rgb(0 0 0 / 15%)",
                            borderRadius: "10px",
                        }}
                    ></div>
            }
        </div >
    );
};

export default Home;
