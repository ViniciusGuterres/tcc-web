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
const DRYING_ROOM_SESSION_END_POINT = endPoints.dryingRoomSessionEndPoint;

const ListDryingRooms = () => {
    const [dryingRoomList, setDryingRoomsList] = useState<DryingRoomList[]>([]);
    const [dryingRoomDetails, setDryingRoomDetails] = useState<DryingRoomDetails | null>(null);
    const [dryingRoomsSessions, setDryingRoomsSessions] = useState({});

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
            name: "createTransaction",
            header: "Ações",
            type: 'action',
            actionButton: {
                type: "custom",
                onClickHandler: (id) => { handleClickGoToDryingRoomSessionForm(id) },
                enabled: true,
                label: 'Nova sessão',
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

    const EXPANDABLE_ROW_COLUMNS = [
        {
            name: "hours",
            header: "Horas de uso",
            type: 'default',
            format: 'number',
        },
                {
            name: "costAtTime",
            header: "Custo",
            type: 'default',
            format: "currency-BRL",
        },
        {
            name: "createdAt",
            header: "Data de criação",
            type: 'default',
            format: "dbTimestamp",
        },
        {
            name: "updatedAt",
            header: "Data de atualização",
            type: 'default',
            format: "dbTimestamp",
        },
        {
            name: "edit",
            header: "Editar",
            type: 'action',
            actionButton: {
                type: "edit",
                onClickHandler: (id, entityId) => { handleClickEditDryingRoomSession(id, entityId) },
                enabled: true,
            },
        },
        {
            name: "delete",
            header: "Deletar",
            type: 'action',
            actionButton: {
                type: "delete",
                onClickHandler: (id, entityId) => { handleClickDeleteDryingRoomSession(id, entityId) },
                enabled: true,
            },
        },
    ];

    const handleClickEditDryingRoomSession = (sessionId: ID, dryingRoomId: ID) => {
        if (!sessionId || !dryingRoomId) return null;

        navigate(`/dryingRooms/editSession/${dryingRoomId}/${sessionId}`);
    }

    const handleClickDeleteDryingRoomSession = async (sessionId: ID, dryingRoomId: ID) => {
        if (!sessionId) return null;

        if (window.confirm('Deseja realmente excluir essa sessão da estufa ?')) {
            const deleteDryingRoomSessionEndPoint = `${ENTITY_END_POINT}/${dryingRoomId}/${DRYING_ROOM_SESSION_END_POINT}/${sessionId}`;

            const { data, err } = await fetchRequest(deleteDryingRoomSessionEndPoint, 'DELETE', null);

            if (err || !data) {
                console.log(err || 'Missing req.data');

                alert(err || 'Erro ao deletar. Por favor, tente novamente');
                return;
            }

            if (data === 'success') {
                alert(`Sessão de estufa deletada com sucesso!`);
                window.location.reload();
            }

            return null;
        }
    }

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

    const handleClickGoToDryingRoomSessionForm = (dryingRoomID: ID) => {
        navigate(`/dryingRooms/createSession/${dryingRoomID}`);
    }

    const handleClickEdit = (dryingRoomId: ID) => {
        if (!dryingRoomId) return null;

        navigate(`/dryingRooms/edit/${dryingRoomId}`);
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
        navigate("/dryingRooms/create");
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

    const getDryingRoomSessions = async (dryingRoomId: ID | undefined) => {
        if (!dryingRoomId) return null;

        // Check if already have the transactions in memory
        if (dryingRoomsSessions?.[dryingRoomId] != null) return null;

        let response;

        let dryingRoomSessionEndPoint = `${ENTITY_END_POINT}/${dryingRoomId}/${DRYING_ROOM_SESSION_END_POINT}`;

        response = await fetchRequest(dryingRoomSessionEndPoint, 'GET', null);

        if (response.err) {
            console.log(response.err)

            if (typeof response.err === 'string') {
                alert(response.err);
            } else {
                alert('Erro ao pegar os dados. Por favor, tente novamente.');
            }

            return;
        }

        if (response.data?.length > 0) {
            const dryingRoomsSessionsCopy = { ...dryingRoomsSessions };
            dryingRoomsSessionsCopy[dryingRoomId] = response.data;

            setDryingRoomsSessions(dryingRoomsSessionsCopy);
        }
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
                rowsExpandable={true}
                expandableRowColumns={EXPANDABLE_ROW_COLUMNS}
                expandableRowsData={dryingRoomsSessions}
                onExpandRowFunction={getDryingRoomSessions}
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