import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
import { useNavigate } from "react-router";
import endPoints from "../../constants/endpoints";
import Modal from "../../components/Modal";
import formatDbTimestamp from "../../utils/formatDbTimestamp";
import ReportDocument from "../../components/ReportDocument";
import downloadPDF from "../../utils/downloadPDF";
import { pdf } from "@react-pdf/renderer";
import transactionTypeTranslate from "../../utils/transactionTypeTranslate";

// Globals
const ENTITY_END_POINT = endPoints.glazesEndPoint;
const TRANSACTIONS_END_POINT = endPoints.transactionsEndPoint;

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
    const [glazesTransactions, setGlazesTransactions] = useState({});

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
            name: "downloadGlazeYearlyReport",
            header: "Baixar relatório",
            type: 'action',
            actionButton: {
                type: "custom",
                onClickHandler: (id) => { handleClickDownloadYearlyGlazeReport(id) },
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
                onClickHandler: (id) => { handleClickGoToGlazeTransactionForm(id) },
                enabled: true,
                label: 'Nova transação',
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
            name: "type",
            header: "Tipo",
            type: 'default',
            format: 'custom',
            customFormatFunction: transactionTypeTranslate,
        },
        {
            name: "quantity",
            header: "Quantidade",
            type: 'default',
            format: 'number',
        },
        {
            name: "cost",
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
                onClickHandler: (id, entityId) => { handleClickEditGlazeTransaction(id, entityId) },
                enabled: true,
            },
        },
        {
            name: "delete",
            header: "Deletar",
            type: 'action',
            actionButton: {
                type: "delete",
                onClickHandler: (id, entityId) => { handleClickDeleteGlazeTransaction(id, entityId) },
                enabled: true,
            },
        },
    ];

    const handleClickEditGlazeTransaction = (transactionId: ID, glazeId: ID) => {
        if (!transactionId || !glazeId) return null;

        navigate(`/glazes/editTransaction/${glazeId}/${transactionId}`);
    }

    const handleClickDeleteGlazeTransaction = async (transactionId: ID, glazeId: ID) => {
        if (!transactionId) return null;

        if (window.confirm('Deseja realmente excluir essa transação de glazura ?')) {
            const deleteGlazeTransactionEndPoint = `${ENTITY_END_POINT}/${glazeId}/${TRANSACTIONS_END_POINT}/${transactionId}`;

            const { data, err } = await fetchRequest(deleteGlazeTransactionEndPoint, 'DELETE', null);

            if (err || !data) {
                console.log(err || 'Missing req.data');

                alert(err || 'Erro ao deletar. Por favor, tente novamente');
                return;
            }

            if (data === 'success') {
                alert(`Transação de glazura deletada com sucesso!`);
                window.location.reload();
            }

            return null;
        }
    }

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

    const handleClickDownloadYearlyGlazeReport = async (glazeID: ID) => {
        try {
            const { err, data } = await fetchRequest(`${ENTITY_END_POINT}/${glazeID}/${endPoints.yearlyReportEndPoint}`, 'GET', null);

            if (err) {
                console.log(err || 'Erro ao pegar detalhes da glazura');

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

    const handleClickGoToGlazeTransactionForm = (glazeID: ID) => {
        navigate(`/glazes/createTransaction/${glazeID}`);
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

    const getGlazeTransactions = async (glazeId: ID | undefined) => {
        if (!glazeId) return null;

        // Check if already have the transactions in memory
        if (glazesTransactions?.[glazeId] != null) return null;

        let response;

        let glazeTransactionEndPoint = `${ENTITY_END_POINT}/${glazeId}/${TRANSACTIONS_END_POINT}`;

        response = await fetchRequest(glazeTransactionEndPoint, 'GET', null);

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
            const glazesTransactionsCopy = { ...glazesTransactions };
            glazesTransactionsCopy[glazeId] = response.data;

            setGlazesTransactions(glazesTransactionsCopy);
        }
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
                rowsExpandable={true}
                expandableRowColumns={EXPANDABLE_ROW_COLUMNS}
                expandableRowsData={glazesTransactions}
                onExpandRowFunction={getGlazeTransactions}
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