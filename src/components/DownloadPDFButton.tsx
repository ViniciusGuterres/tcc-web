import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReportDocument from './ReportDocument';
import fetchRequest from '../utils/fetchRequest';
import { pdf } from '@react-pdf/renderer';

interface Props {
    reportEndPoint: string,
}

const ReportPDFButton: React.FC<Props> = ({ reportEndPoint }) => {
    const [report, setReport] = useState<YearlyReport | null>(null);
    const [loadingData, setLoadingData] = useState(false);
    const [showDownload, setShowDownload] = useState(false);

    const handleDownload = async () => {
        setLoadingData(true);

        try {
            const { err, data } = await fetchRequest(reportEndPoint, 'GET', null);

            if (err) {
                console.log(err || 'Erro ao pegar detalhes da batelada');

                alert(`Erro ao pegar dados`);
                return;
            }

            if (data?.[0]) {
                const report = data[0];

                const blob = await pdf(<ReportDocument report={report} />).toBlob();

                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `relatorio_${report.year}.pdf`;
                link.click();
                URL.revokeObjectURL(url);

                setReport(data[0]);
            }

            setShowDownload(true);

        } catch (error) {
            console.error("Erro ao carregar os dados do relatório:", error);
        } finally {
            setLoadingData(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={loadingData}
            className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-100"
        >
            {loadingData ? "Gerando PDF..." : "Baixar Relatório PDF"}
        </button>
    );
};

export default ReportPDFButton;
