import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
import { useNavigate } from "react-router";
import endPoints from "../../constants/endpoints";
import Modal from "../../components/Modal";
import formatDbTimestamp from "../../utils/formatDbTimestamp";

// Globals
const ENTITY_END_POINT = endPoints.batchesEndPoint;

type BatchDetails = {
    createdAt: string;
    updatedAt: string;
    resourceUsages: {
        resourceId: number;
        name: string;
        initialQuantity: number;
        umidity: number;
        addedQuantity: number;
        totalQuantity: number;
        totalWater: number;
        totalCost: number;
    }[];
    machineUsages: {
        machineId: number;
        name: string;
        usageTime: number;
        energyConsumption: number;
    }[];
    batchTotalWater: number;
    batchTotalWaterCost: number;
    resourceTotalQuantity: number;
    resourceTotalCost: number;
    machinesEnergyConsumption: number;
    machinesEnergyConsumptionCost: number;
    batchFinalCost: number;
};

const ListBatches = () => {
    const [batchesList, setBatchesList] = useState<Batch[]>([]);
    const [batchDetails, setBatchDetails] = useState<null | {}>(null);

    const navigate = useNavigate();

    const TABLE_COLUMNS = [
        {
            name: "createdAt",
            header: "Data criação",
            type: 'default',
            format: 'dbTimestamp'
        },
        {
            name: "updatedAt",
            header: "Data atualização",
            type: 'default',
            format: 'dbTimestamp'
        },
        {
            name: "batchFinalCost",
            header: "Custo batelada",
            type: 'default',
            format: "currency-BRL",
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

    const handleClickDelete = async (batchID: string | number) => {
        if (!batchID) return null;

        if (window.confirm('Deseja realmente excluir essa batelada ?')) {
            const deleteBatchEndPoint = `${ENTITY_END_POINT}/${batchID}`;

            const { data, err } = await fetchRequest(deleteBatchEndPoint, 'DELETE', null);

            if (err || !data) {
                console.log(err || 'Missing req.data');

                alert(`Erro ao deletar. Por favor, tente novamente`);
                return;
            }

            if (data === 'success') {
                alert(`Batelada deletada com sucesso!`);
                window.location.reload();
            }

            return null;
        }
    }

    const handleClickOpenDetails = async (batchId: ID) => {
        if (!batchId) return null;

        const { err, data } = await fetchRequest(`${ENTITY_END_POINT}/${batchId}`, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar detalhes da batelada');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && data !== null && typeof data === 'object') {
            setBatchDetails(data);
        }
    }

    const handleClickEdit = (batchId: ID) => {
        if (!batchId) return null;

        navigate(`/batches/edit/${batchId}`);
    }

    // Get initial data (baches list) when component did mount
    useEffect(() => {
        getInitialData();
    }, []);

    const getInitialData = async () => {
        const { err, data } = await fetchRequest(ENTITY_END_POINT, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar lista de bateladas');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
            setBatchesList(data);
        }
    }

    const handleClickCreateNew = () => {
        navigate("/batches/create");
    }

    const buildBatchDetailsBody = (data) => {
        return (
            <div className="space-y-6 text-sm text-gray-800">
                <div>
                    <h2 className="text-lg font-semibold">Informações da batelada</h2>
                    <br></br>
                    <p><strong>Criado em:</strong> {formatDbTimestamp(data.createdAt)}</p>
                    <p><strong>Atualizado em:</strong> {formatDbTimestamp(data.updatedAt)}</p>
                </div>

                <div>
                    <h3 className="font-semibold text-md mb-1">Recursos Utilizados</h3>
                    <ul className="space-y-2">
                        {data.resourceUsages.map((res, idx) => (
                            <li key={`res-${idx}`} className="border p-2 rounded bg-gray-50">
                                <p><strong>Nome:</strong> {res.name}</p>
                                <p><strong>Quantidade inicial:</strong> {res.initialQuantity}</p>
                                <p><strong>Umidade:</strong> {res.umidity}</p>
                                <p><strong>Quantidade adicionada:</strong> {res.addedQuantity}</p>
                                <p><strong>Quantidade total:</strong> {res.totalQuantity}</p>
                                <p><strong>Água total:</strong> {res.totalWater}</p>
                                <p><strong>Custo total:</strong> R$ {res.totalCost.toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold text-md mb-1">Máquinas Utilizadas</h3>
                    <ul className="space-y-2">
                        {data.machineUsages.map((mac, idx) => (
                            <li key={`mac-${idx}`} className="border p-2 rounded bg-gray-50">
                                <p><strong>Nome:</strong> {mac.name}</p>
                                <p><strong>Tempo de uso:</strong> {mac.usageTime}h</p>
                                <p><strong>Consumo de energia:</strong> {mac.energyConsumption.toFixed(2)} kWh</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold text-md mb-1">Totais</h3>
                    <p><strong>Água total do lote:</strong> {data.batchTotalWater}</p>
                    <p><strong>Custo da água:</strong> R$ {data.batchTotalWaterCost.toFixed(2)}</p>
                    <p><strong>Quantidade total de recursos:</strong> {data.resourceTotalQuantity}</p>
                    <p><strong>Custo total dos recursos:</strong> R$ {data.resourceTotalCost.toFixed(2)}</p>
                    <p><strong>Consumo total de energia:</strong> {data.machinesEnergyConsumption.toFixed(2)} kWh</p>
                    <p><strong>Custo da energia:</strong> R$ {data.machinesEnergyConsumptionCost.toFixed(2)}</p>
                    <p><strong>Custo final do lote:</strong> R$ {data.batchFinalCost.toFixed(2)}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Button
                name="Nova batelada"
                onClickFunc={handleClickCreateNew}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-plus'

                }}
            />

            <Table
                data={batchesList}
                columns={TABLE_COLUMNS}
            />

            <Modal
                isOpen={batchDetails != null}
                onClose={() => { setBatchDetails(null) }}
                body={batchDetails ? buildBatchDetailsBody(batchDetails) : null}
            />
        </>
    );
};

export default ListBatches;