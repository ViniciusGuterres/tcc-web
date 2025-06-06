import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
import { useNavigate } from "react-router";
import endPoints from "../../constants/endpoints";
import ReportDocument from "../../components/ReportDocument";
import { pdf } from "@react-pdf/renderer";
import downloadPDF from "../../utils/downloadPDF";

// Globals
const ENTITY_END_POINT = endPoints.dryingRoomsEndPoint;

const ListDryingRooms = () => {
    const [dryingRoomList, setDryingRoomsList] = useState<DryingRoomList[]>([]);

    const navigate = useNavigate();

    const TABLE_COLUMNS = [
        {
            name: "name",
            header: "Nome da estufa",
            type: 'default',
        },
        {
            name: "gasConsumptionPerHour",
            header: "Consumo de gás por hora",
            type: 'default',
        },
        {
            name: "createdAt",
            header: "Data criação",
            type: 'default',
            format: 'dbTimestamp'
        },
        {
            name: "downloadDryingRoomYearlyReport",
            header: "Baixar relatório",
            type: 'action',
            actionButton: {
                type: "custom",
                onClickHandler: (id) => { handleClickDownloadYearlyDryingRoomReport(id) },
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

    const handleClickDelete = async (dryingRoomID: string | number) => {
        if (!dryingRoomID) return null;

        if (window.confirm('Deseja realmente excluir essa estufa ?')) {
            const deleteDryingRoomEndPoint = `${ENTITY_END_POINT}/${dryingRoomID}`;

            const { data, err } = await fetchRequest(deleteDryingRoomEndPoint, 'DELETE', null);

            if (err || !data) {
                console.log(err || 'Missing req.data');

                alert(`Erro ao deletar. Por favor, tente novamente`);
                return;
            }

            if (data === 'success') {
                alert(`Estufa deletada com sucesso!`);
                window.location.reload();
            }

            return null;
        }
    }

    const handleClickDownloadYearlyDryingRoomReport = async (dryingRoomID: ID) => {
        try {
            const { err, data } = await fetchRequest(`${ENTITY_END_POINT}/${dryingRoomID}/${endPoints.yearlyReportEndPoint}`, 'GET', null);

            if (err) {
                console.log(err || 'Erro ao pegar detalhes da batelada');

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

    const handleClickEdit = (dryingRoomId: string | number) => {
        if (!dryingRoomId) return null;

        navigate(`/drying-rooms/edit/${dryingRoomId}`);
    }

    // Get initial data (drying-room list) when component did mount
    useEffect(() => {
        getInitialData();
    }, []);

    const getInitialData = async () => {
        const { err, data } = await fetchRequest(ENTITY_END_POINT, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar lista de estufas');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
            setDryingRoomsList(data);
        }
    }

    const handleClickCreateNewDryingRoom = () => {
        navigate("/drying-rooms/create");
    }

    return (
        <>
            <Button
                name="Nova estufa"
                onClickFunc={handleClickCreateNewDryingRoom}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-plus'

                }}
            />

            <Table
                data={dryingRoomList}
                columns={TABLE_COLUMNS}
            />
        </>
    );
};

export default ListDryingRooms;