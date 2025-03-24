import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
import resourceCategoryTranslate from "../../utils/resourceCategoryTranslate";
import { useNavigate } from "react-router";
import transactionTypeTranslate from "../../utils/transactionTypeTranslate";

// Globals
const RESOURCES_END_POINT = 'resources';
const TRANSACTIONS_END_POINT = 'transactions';

const ListResources = () => {
    const [resourcesList, setResourcesList] = useState<Resource[]>([]);
    const [resourcesTransactions, setResourcesTransactions] = useState({});

    const navigate = useNavigate();

    // Get initial data (resource list) when component did mount
    useEffect(() => {
        getInitialData();
    }, []);

    const TABLE_COLUMNS = [
        {
            name: "name",
            header: "Nome",
            type: 'default',
        },
        {
            name: "category",
            header: "Categoria",
            format: 'custom',
            customFormatFunction: resourceCategoryTranslate,
            type: 'default',
        },
        {
            name: "unitValue",
            header: "Valor unitário",
            format: "currency-BRL",
            type: 'default',
        },
        {
            name: "currentQuantity",
            header: "Quantidade",
            type: 'default',
            format: 'number',
        },
        {
            name: "currentQuantityPrice",
            header: "Preço",
            format: "currency-BRL",
            type: 'default',
        },
        {
            name: "createTransaction",
            header: "Ações",
            type: 'action',
            actionButton: {
                type: "custom",
                onClickHandler: (id) => { handleClickGoToResourceTransactionForm(id) },
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
                onClickHandler: (id) => { handleClickEdit(id) },
                enabled: true,
            },
        },
        {
            name: "delete",
            header: "Deletar",
            type: 'action',
            actionButton: {
                type: "delete",
                onClickHandler: (id) => { handleClickDeleteResource(id) },
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
    ];

    const handleClickGoToResourceTransactionForm = (resourceID: string | number) => {
        navigate(`/resources/createTransaction/${resourceID}`);
    }

    const handleClickEdit = (resourceId: string | number) => {
        if (!resourceId) return null;

        navigate(`/resources/edit/${resourceId}`);
    }

    const handleClickDeleteResource = async (resourceID: string | number) => {
        if (!resourceID) return null;

        if (window.confirm('Deseja realmente excluir esse recurso ?')) {
            const deleteResourceEndPoint = `${RESOURCES_END_POINT}/${resourceID}`;

            const { data, err } = await fetchRequest(deleteResourceEndPoint, 'DELETE', null);

            if (err || !data) {
                console.log(err || 'Missing req.data');

                alert(err || 'Erro ao deletar. Por favor, tente novamente');
                return;
            }

            if (data === 'success') {
                alert(`Recurso deletado com sucesso!`);
                window.location.reload();
            }

            return null;
        }
    }

    const getInitialData = async () => {
        const { err, data } = await fetchRequest(RESOURCES_END_POINT, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pagar lista de recursos');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
            setResourcesList(data);
        }
    }

    const getResourceTransactions = async (resourceId: ID | undefined) => {
        if (!resourceId) return null;

        // Check if already have the transactions in memory
        if (resourcesTransactions?.[resourceId] != null) return null;

        let response;

        let resourceTransactionEndPoint = `${RESOURCES_END_POINT}/${resourceId}/${TRANSACTIONS_END_POINT}`;

        response = await fetchRequest(resourceTransactionEndPoint, 'GET', null);

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
            const resourcesTransactionsCopy = { ...resourcesTransactions };
            resourcesTransactionsCopy[resourceId] = response.data;

            setResourcesTransactions(resourcesTransactionsCopy);
        } 
    }

    return (
        <>
            <Button
                name="Novo recurso"
                onClickFunc={() => { navigate('/resources/create') }}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-plus'

                }}
            />

            <Table
                data={resourcesList}
                columns={TABLE_COLUMNS}
                rowsExpandable={true}
                expandableRowColumns={EXPANDABLE_ROW_COLUMNS}
                expandableRowsData={resourcesTransactions}
                onExpandRowFunction={getResourceTransactions}
            />
        </>
    );
};

export default ListResources;