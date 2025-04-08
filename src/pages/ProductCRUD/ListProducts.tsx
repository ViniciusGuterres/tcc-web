import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
import { useNavigate } from "react-router";
import endPoints from "../../constants/endpoints";
import productStateTranslate from "../../utils/productStateTranslate";

// Globals
const END_POINT = endPoints.productsEndPoint;
const TRANSACTIONS_END_POINT = endPoints.transactionsEndPoint;

const ListProducts = () => {
    const [productsList, setProductList] = useState<Product[]>([]);
    const [productsTransactions, setProductsTransactions] = useState({});

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

    const EXPANDABLE_ROW_COLUMNS = [
        {
            name: "state",
            header: "Estado",
            type: 'default',
            format: 'custom',
            customFormatFunction: productStateTranslate,
        },
        // {
        //     name: "quantity",
        //     header: "Quantidade",
        //     type: 'default',
        //     format: 'number',
        // },
        // {
        //     name: "cost",
        //     header: "Custo",
        //     type: 'default',
        //     format: "currency-BRL",
        // },
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
                onClickHandler: (id, entityId) => { handleClickEditProductTransaction(id, entityId) },
                enabled: true,
            },
        },
        {
            name: "delete",
            header: "Deletar",
            type: 'action',
            actionButton: {
                type: "delete",
                onClickHandler: (id, entityId) => { handleClickDeleteProductTransaction(id, entityId) },
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

                alert(err || `Erro ao deletar. Por favor, tente novamente`);
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

    const getProductsTransactions = async (productID: ID | undefined) => {
        if (!productID) return null;

        // Check if already have the transactions in memory
        if (productsTransactions?.[productID] != null) return null;

        let response;

        let productTransactionEndPoint = `${END_POINT}/${productID}/${TRANSACTIONS_END_POINT}`;

        response = await fetchRequest(productTransactionEndPoint, 'GET', null);

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
            const productsTransactionsCopy = { ...productsTransactions };
            productsTransactionsCopy[productID] = response.data;

            setProductsTransactions(productsTransactionsCopy);
        }
    }

    const handleClickEditProductTransaction = (transactionID: ID, productID: ID) => {
        if (!transactionID || !productID) return null;

        navigate(`/products/editTransaction/${productID}/${transactionID}`);
    }

    const handleClickDeleteProductTransaction = async (transactionID: ID, productID: ID) => {
        if (!transactionID) return null;

        if (window.confirm('Deseja realmente excluir essa transação ?')) {
            const deleteProductTransactionEndPoint = `${END_POINT}/${productID}/${TRANSACTIONS_END_POINT}/${transactionID}`;

            const { data, err } = await fetchRequest(deleteProductTransactionEndPoint, 'DELETE', null);

            if (err || !data) {
                console.log(err || 'Missing req.data');

                alert(err || 'Erro ao deletar. Por favor, tente novamente');
                return;
            }

            if (data === 'success') {
                alert(`Transação deletada com sucesso!`);
                window.location.reload();
            }

            return null;
        }
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
                rowsExpandable={true}
                expandableRowColumns={EXPANDABLE_ROW_COLUMNS}
                expandableRowsData={productsTransactions}
                onExpandRowFunction={getProductsTransactions}
            />
        </>
    );
};

export default ListProducts;