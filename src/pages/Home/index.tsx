import React from "react";
import ApexChart from "../../components/ApexChart";
import { ApexOptions } from "apexcharts";

const Home: React.FC = () => {
    const chartOptions: ApexOptions = {
        chart: {
            id: "basic-bar",
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May"],
        },
        title: {
            text: "Monthly Sales",
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
        <div className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Bar Chart Example</h2>
            <ApexChart
                type="bar"
                options={chartOptions}
                series={chartSeries}
            />

            <h2 className="text-xl font-semibold mt-10 mb-4">Donut Chart Example</h2>
            <ApexChart
                type="donut"
                options={{}}
                series={[44, 55, 13]}
                labels={chartLabels}
            />

            <h2 className="text-xl font-semibold mt-10 mb-4">Line Chart Example</h2>
            <ApexChart
                type="line"
                options={chartOptions}
                series={chartSeries}
            />
        </div>
    );
};

export default Home;
