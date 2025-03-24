import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
import { useNavigate } from "react-router";

// Globals
const ENTITY_END_POINT = 'product-lines';

const ListProductLines = () => {
    const [productLinesList, setProductLinesList] = useState<ProductLine[]>([]);

    const navigate = useNavigate();

    const TABLE_COLUMNS = [
        {
            name: "name",
            header: "Nome",
            type: 'default',
        },
        {
            name: "productQuantity",
            header: "Quantidade de produtos",
            type: 'default',
            format: 'number',
        },
        {
            name: "createdAt",
            header: "Data criação",
            type: 'default',
            format: "dbTimestamp",
        },
        {
            name: "updatedAt",
            header: "Data atualização",
            type: 'default',
            format: "dbTimestamp",
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

    const handleClickDelete = async (productLinesID: string | number) => {
        if (!productLinesID) return null;

        if (window.confirm('Deseja realmente excluir essa linha de produto ?')) {
            const deleteProductLineEndPoint = `${ENTITY_END_POINT}/${productLinesID}`;

            const { data, err } = await fetchRequest(deleteProductLineEndPoint, 'DELETE', null);

            if (err || !data) {
                console.log(err || 'Missing req.data');

                alert(`Erro ao deletar. Por favor, tente novamente`);
                return;
            }

            if (data === 'success') {
                alert(`Linha de produto deletada com sucesso!`);
                window.location.reload();
            }

            return null;
        }
    }

    const handleClickEdit = (productLineID: string | number) => {
        if (!productLineID) return null;

        navigate(`/productLines/edit/${productLineID}`);
    }

    // Get initial data (product line list) when component did mount
    useEffect(() => {
        getInitialData();
    }, []);

    const getInitialData = async () => {
        const { err, data } = await fetchRequest(ENTITY_END_POINT, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar lista de linhas de produto');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
            setProductLinesList(data);
        }
    }

    const handleClickCreateNew = () => {
        navigate("/productLines/create");
    }

    return (
        <>
            <Button
                name="Nova linha de produto"
                onClickFunc={handleClickCreateNew}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-plus'

                }}
            />

            <Table
                data={productLinesList}
                columns={TABLE_COLUMNS}
            />
        </>
    );
};

export default ListProductLines;