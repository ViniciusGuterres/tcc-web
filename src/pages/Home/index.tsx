import React, { useEffect } from "react";
import ApexChart from "../../components/ApexChart";
import { ApexOptions } from "apexcharts";
import DownloadPDFButton from "../../components/DownloadPDFButton";
import endPoints from "../../constants/endpoints";

const Home: React.FC = () => {
    // Component did mount
    // Load charts data
    useEffect(() => {


    }, []);

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

    const chartLabels = ["Product A", "Product B", "Product C"];

    return (
        <div
            //className="p-4 border rounded shadow"
            style={{
                height: "100%",
            }}
        >
            <div className="p-8">
                <DownloadPDFButton
                    reportEndPoint={endPoints.generalReportEndPont}
                    buttonLabel="Relatório Anual de faturamento"
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
                    <h2 className="text-xl font-semibold mb-4">Bar Chart Example</h2>
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
                    <h2 className="text-xl font-semibold mt-10 mb-4">Donut Chart Example</h2>
                    <ApexChart
                        type="donut"
                        options={{}}
                        series={[44, 55, 13]}
                        labels={chartLabels}
                        width="100%"
                        height="100%"
                    />
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
