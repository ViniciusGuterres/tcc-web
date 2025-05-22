import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
import { useNavigate } from "react-router";
import endPoints from "../../constants/endpoints";
import Modal from "../../components/Modal";
import formatDbTimestamp from "../../utils/formatDbTimestamp";

// Globals
const ENTITY_END_POINT = endPoints.glazesEndPoint;

type glazeDetails = {
    id: ID,
    createdAt: string;
    updatedAt: string;
    color: string;
    unitValue: number;  
    resourceUsages: {
        resourceId: number;
        resourceName: string;
        quantity: number;
    }[];
    machineUsages: {
        machineId: number;
        machineName: string;
        usageTime: number;
    }[];
    unitCost: number,
    currentQuantity: number,
    currentQuantityPrice: number
};

const ListGlazes = () => {
    const [glazesList, setGlazesList] = useState<Glaze[]>([]);
    const [glazeDetails, setGlazeDetails] = useState<null | {}>(null);

    const navigate = useNavigate();

    const TABLE_COLUMNS = [
        {
            name: "color",
            header: "Cor",
            type: 'default',
        },
        {
            name: "unitValue",
            header: "Valor unitário",
            type: 'default',
            format: "currency-BRL",
        },
        {
            name: "unitCost",
            header: "Custo",
            type: 'default',
            format: "currency-BRL",
        },
        {
            name: "currentQuantity",
            header: "Quantidade",
            type: 'default',
            format: "currency-BRL",
        },
        {
            name: "currentQuantityPrice",
            header: "Preço",
            type: 'default',
            format: "currency-BRL",
        },
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

    const handleClickDelete = async (glazeID: string | number) => {
        if (!glazeID) return null;

        if (window.confirm('Deseja realmente excluir essa glazura ?')) {
            const deleteGlazeEndPoint = `${ENTITY_END_POINT}/${glazeID}`;

            const { data, err } = await fetchRequest(deleteGlazeEndPoint, 'DELETE', null);

            if (err || !data) {
                console.log(err || 'Missing req.data');

                alert(`Erro ao deletar. Por favor, tente novamente`);
                return;
            }

            if (data === 'success') {
                alert(`Glazura deletada com sucesso!`);
                window.location.reload();
            }

            return null;
        }
    }

    const handleClickOpenDetails = async (glazeId: ID) => {
        if (!glazeId) return null;

        const { err, data } = await fetchRequest(`${ENTITY_END_POINT}/${glazeId}`, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar detalhes da glazura');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && data !== null && typeof data === 'object') {
            setGlazeDetails(data);
        }
    }

    const handleClickEdit = (glazeId: ID) => {
        if (!glazeId) return null;

        navigate(`/glazes/edit/${glazeId}`);
    }

    // Get initial data (glazes list) when component did mount
    useEffect(() => {
        getInitialData();
    }, []);

    const getInitialData = async () => {
        const { err, data } = await fetchRequest(ENTITY_END_POINT, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar lista de glazuras');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
            setGlazesList(data);
        }
    }

    const handleClickCreateNew = () => {
        navigate("/glazes/create");
    }

    const buildGlazeDetailsBody = (data) => {
        return (
            <div className="space-y-6 text-sm text-gray-800">
                <div>
                    <h2 className="text-lg font-semibold">Informações da glazura</h2>
                    <br />
                    <p><strong>Criado em:</strong> {formatDbTimestamp(data.createdAt)}</p>
                    <p><strong>Atualizado em:</strong> {formatDbTimestamp(data.updatedAt)}</p>
                    <p><strong>Cor:</strong> {data.color}</p>
                    <p><strong>Valor por unidade:</strong> R$ {data.unitValue.toFixed(2)}</p>
                    <p><strong>Quantidade atual:</strong> {data.currentQuantity}</p>
                    <p><strong>Preço do total atual:</strong> R$ {data.currentQuantityPrice.toFixed(2)}</p>
                </div>
    
                <div>
                    <h3 className="font-semibold text-md mb-1">Recursos Utilizados</h3>
                    <ul className="space-y-2">
                        {data.resourceUsages.map((res, idx) => (
                            <li key={`res-${idx}`} className="border p-2 rounded bg-gray-50">
                                <p><strong>Nome:</strong> {res.resourceName}</p>
                                <p><strong>Quantidade:</strong> {res.quantity}</p>
                            </li>
                        ))}
                    </ul>
                </div>
    
                <div>
                    <h3 className="font-semibold text-md mb-1">Máquinas Utilizadas</h3>
                    <ul className="space-y-2">
                        {data.machineUsages.map((mac, idx) => (
                            <li key={`mac-${idx}`} className="border p-2 rounded bg-gray-50">
                                <p><strong>Nome:</strong> {mac.machineName}</p>
                                <p><strong>Tempo de uso:</strong> {mac.usageTime}h</p>
                            </li>
                        ))}
                    </ul>
                </div>
    
                <div>
                    <h3 className="font-semibold text-md mb-1">Totais</h3>
                    <p><strong>Custo unitário:</strong> R$ {data.unitCost.toFixed(2)}</p>
                </div>
            </div>
        );
    };
    
    return (
        <>
            <Button
                name="Nova glazura"
                onClickFunc={handleClickCreateNew}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-plus'

                }}
            />

            <Table
                data={glazesList}
                columns={TABLE_COLUMNS}
            />

            <Modal
                isOpen={glazeDetails != null}
                onClose={() => { setGlazeDetails(null) }}
                body={glazeDetails ? buildGlazeDetailsBody(glazeDetails) : null}
            />
        </>
    );
};

export default ListGlazes;