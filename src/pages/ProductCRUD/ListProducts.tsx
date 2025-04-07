import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
import { useNavigate } from "react-router";
import endPoints from "../../constants/endpoints";

// Globals
const END_POINT = endPoints.productsEndPoint;

const ListProducts = () => {
    const [productsList, setProductList] = useState<Product[]>([]);

    const navigate = useNavigate();

    const TABLE_COLUMNS = [
        {
            name: "name",
            header: "Nome",
            type: 'default',
        },
        {
            name: "height",
            header: "Altura",
            type: 'default',
            format: 'number',
        },
        {
            name: "width",
            header: "Largura",
            type: 'default',
            format: "number",
        },
        {
            name: "length",
            header: "Profundidade",
            type: 'default',
            format: "number",
        },
        {
            name: "price",
            header: "preço",
            type: 'default',
            format: "currency-BRL",
        },
        {
            name: "productStock",
            header: "Estoque",
            type: 'default',
            format: "number",
        },
        {
            name: "line",
            header: "Linha",
            type: 'default',
            format: "number",
        },
        {
            name: "type",
            header: "Tipo",
            type: 'default',
            format: "number",
        },
        // {
        //     name: "createdAt",
        //     header: "Data criação",
        //     type: 'default',
        //     format: "dbtimestamp",
        // },
        // {
        //     name: "updatedAt",
        //     header: "Data atualização",
        //     type: 'default',
        //     format: "dbtimestamp",
        // },
        {
            name: "createTransaction",
            header: "Ações",
            type: 'action',
            actionButton: {
                type: "custom",
                onClickHandler: (id) => { handleClickCreateNewTransaction(id) },
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

    const handleClickDelete = async (productID: string | number) => {
        if (!productID) return null;

        if (window.confirm('Deseja realmente excluir esse produto ?')) {
            const deleteProductEndPoint = `${END_POINT}/${productID}`;

            const { data, err } = await fetchRequest(deleteProductEndPoint, 'DELETE', null);

            if (err || !data) {
                console.log(err || 'Missing req.data');

                alert(`Erro ao deletar. Por favor, tente novamente`);
                return;
            }

            if (data === 'success') {
                alert(`Produto deletado com sucesso!`);
                window.location.reload();
            }

            return null;
        }
    }

    const handleClickCreateNewTransaction = (productId: ID) => {
        navigate(`/products/createTransaction/${productId}`);
    }

    const handleClickEdit = (productID: string | number) => {
        if (!productID) return null;

        navigate(`/products/edit/${productID}`);
    }

    // Get initial data (product list) when component did mount
    useEffect(() => {
        getInitialData();
    }, []);

    const getInitialData = async () => {
        const { err, data } = await fetchRequest(END_POINT, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar lista de produto');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
            setProductList(data);
        }
    }

    const handleClickCreateNew = () => {
        navigate("/products/create");
    }

    return (
        <>
            <Button
                name="Novo produto"
                onClickFunc={handleClickCreateNew}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-plus'

                }}
            />

            <Table
                data={productsList}
                columns={TABLE_COLUMNS}
            />
        </>
    );
};

export default ListProducts;