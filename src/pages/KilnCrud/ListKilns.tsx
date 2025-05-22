import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
import { useNavigate } from "react-router";
import endPoints from "../../constants/endpoints";
import { pdf } from "@react-pdf/renderer";
import ReportDocument from "../../components/ReportDocument";
import downloadPDF from "../../utils/downloadPDF";

// Globals
const ENTITY_END_POINT = endPoints.kilnsEndPoint;

const ListKilns = () => {
    const [kilnsList, setKilnsList] = useState<Kiln[]>([]);

    const navigate = useNavigate();

    const TABLE_COLUMNS = [
        {
            name: "name",
            header: "Nome do forno",
            type: 'default',
        },
        {
            name: "power",
            header: "Potência (CV)",
            type: 'default',
        },
        {
            name: "downloadKilnYearlyReport",
            header: "Baixar relatório",
            type: 'action',
            actionButton: {
                type: "custom",
                onClickHandler: (id) => { handleClickDownloadYearlyKilnReport(id) },
                enabled: true,
                label: 'Baixar',
            },
        },
        {
            name: "edit",
            header: "Editar",
            type: 'action',
            actionButton: {
                type: "edit",
                onClickHandler: id => { handleClickEdit(id) },
                enabled: true,
            },
        },
        {
            name: "delete",
            header: "Deletar",
            type: 'action',
            actionButton: {
                type: "delete",
                onClickHandler: id => { handleClickDelete(id) },
                enabled: true,
            },
        },
    ];

    const handleClickDelete = async (kilnID: ID) => {
        if (!kilnID) return null;

        if (window.confirm('Deseja realmente excluir esse forno ?')) {
            const deleteKilnEndPoint = `${ENTITY_END_POINT}/${kilnID}`;

            const { data, err } = await fetchRequest(deleteKilnEndPoint, 'DELETE', null);

            if (err || !data) {
                console.log(err || 'Missing req.data');

                alert(`Erro ao deletar. Por favor, tente novamente`);
                return;
            }

            if (data === 'success') {
                alert(`Forno deletado com sucesso!`);
                window.location.reload();
            }

            return null;
        }
    }

    const handleClickDownloadYearlyKilnReport = async (kilnID: ID) => {        
        try {
            const { err, data } = await fetchRequest(`${ENTITY_END_POINT}/${kilnID}/${endPoints.yearlyReportEndPoint}`, 'GET', null);

            if (err) {
                console.log(err || 'Erro ao pegar detalhes do forno');

                alert(`Erro ao pegar dados`);
                return;
            }

            if (data?.[0]) {
                const report = data[0];
                const blob = await pdf(<ReportDocument report={report} />).toBlob();

                downloadPDF(blob, `relatorio_${report.year}`);
            } else {
                alert("Nenhum dado encontrado");
            }


        } catch (error) {
            console.error("Erro ao carregar os dados do relatório:", error);
            alert("Erro ao carregar os dados");
        } 
    }

    const handleClickEdit = (kilnId: string | number) => {
        if (!kilnId) return null;

        navigate(`/kilns/edit/${kilnId}`);
    }

    // Get initial data (kiln list) when component did mount
    useEffect(() => {
        getInitialData();
    }, []);

    const getInitialData = async () => {
        const { err, data } = await fetchRequest(ENTITY_END_POINT, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar lista de fornos');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
            setKilnsList(data);
        }
    }

    const handleClickCreateNewKiln = () => {
        navigate("/kilns/create");
    }

    return (
        <>
            <Button
                name="Novo forno"
                onClickFunc={handleClickCreateNewKiln}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-plus'

                }}
            />

            <Table
                data={kilnsList}
                columns={TABLE_COLUMNS}
            />
        </>
    );
};

export default ListKilns;