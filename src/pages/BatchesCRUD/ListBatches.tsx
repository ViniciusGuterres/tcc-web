import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
import { useNavigate } from "react-router";

// Globals
const ENTITY_END_POINT = 'batches';

const ListBatches = () => {
    const [batchesList, setBatchesList] = useState<Batch[]>([]);

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
                alert(`Btelada deletada com sucesso!`);
                window.location.reload();
            }

            return null;
        }
    }

    const handleClickEdit = (batchId: string | number) => {
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
        </>
    );
};

export default ListBatches;