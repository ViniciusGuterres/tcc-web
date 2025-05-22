import React, { useState } from 'react';
import ReportDocument from './ReportDocument';
import fetchRequest from '../utils/fetchRequest';
import { pdf } from '@react-pdf/renderer';
import Icon from './Icon';

interface Props {
    reportEndPoint: string,
    buttonLabel?: string,
}

const ReportPDFButton: React.FC<Props> = ({
    reportEndPoint,
    buttonLabel = "Baixar Relatório PDF"
}) => {
    const [loadingData, setLoadingData] = useState(false);

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
            }


        } catch (error) {
            console.error("Erro ao carregar os dados do relatório:", error);
        } finally {
            setLoadingData(false);
        }
    };

    return (
        <button
            className="flex items-center rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={handleDownload}
            disabled={loadingData}
        >
            <div style={{ marginRight: '5px' }}>
                <Icon iconClass={'fa-download'} />
            </div>

            {loadingData ? "Gerando PDF..." : buttonLabel}
        </button>
    );
};

export default ReportPDFButton;