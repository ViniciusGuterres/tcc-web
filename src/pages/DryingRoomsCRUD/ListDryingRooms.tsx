import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
import { useNavigate } from "react-router";
import endPoints from "../../constants/endpoints";
import ReportDocument from "../../components/ReportDocument";
import { pdf } from "@react-pdf/renderer";
import downloadPDF from "../../utils/downloadPDF";
import formatDbTimestamp from "../../utils/formatDbTimestamp";
import Modal from "../../components/Modal";

// Globals
const ENTITY_END_POINT = endPoints.dryingRoomsEndPoint;

const ListDryingRooms = () => {
    const [dryingRoomList, setDryingRoomsList] = useState<DryingRoomList[]>([]);
    const [dryingRoomDetails, setDryingRoomDetails] = useState<DryingRoomDetails | null>(null);

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
            name: "openDetails",
            header: "Ver detalhes",
            type: 'action',
            actionButton: {
                type: "edit",
                onClickHandler: id => { handleClickOpenDetails(id) },
                enabled: true,
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
                console.log(err || 'Erro ao pegar detalhes da estufa');

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

    const handleClickOpenDetails = async (dryingRoomId: ID) => {
        if (!dryingRoomId) return null;

        const { err, data } = await fetchRequest(`${ENTITY_END_POINT}/${dryingRoomId}`, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar detalhes da estufa');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && data !== null && typeof data === 'object') {
            const dryingRoomDetails = data as DryingRoomDetails;

            setDryingRoomDetails(dryingRoomDetails);
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

    const buildDryingRoomDetailsBody = (data: DryingRoomDetails) => {
        return (
            <div className="space-y-6 text-sm text-gray-800">
                <div>
                    <h2 className="text-lg font-semibold">Informações da estufa</h2>
                    <br />
                    <p><strong>Criado em:</strong> {formatDbTimestamp(data.createdAt)}</p>
                    <p><strong>Atualizado em:</strong> {formatDbTimestamp(data.updatedAt)}</p>
                    <p><strong>Nome:</strong> {data.name}</p>
                    <p><strong>Consumo de gás por hora:</strong> {data.gasConsumptionPerHour} m³</p>
                </div>

                <div>
                    <h3 className="font-semibold text-md mb-1">Máquinas Associadas</h3>
                    {data.machines.length > 0 ? (
                        <ul className="space-y-2">
                            {data.machines.map((machine, idx) => (
                                <li key={`machine-${idx}`} className="border p-2 rounded bg-gray-50">
                                    <p><strong>Nome:</strong> {machine.name}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="italic text-gray-500">Nenhuma máquina associada.</p>
                    )}
                </div>
            </div>
        );
    };

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

            <Modal
                isOpen={dryingRoomDetails != null}
                onClose={() => { setDryingRoomDetails(null) }}
                body={dryingRoomDetails ? buildDryingRoomDetailsBody(dryingRoomDetails) : null}
            />
        </>
    );
};

export default ListDryingRooms;