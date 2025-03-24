import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
import { useNavigate } from "react-router";
import endPoints from "../../constants/endpoints";


// Globals
const END_POINT = endPoints.productTypesEndPoint;

const ListProductTypes = () => {
    const [productTypesList, setProductTypesList] = useState<ProductType[]>([]);

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

    const handleClickDelete = async (productTypesID: string | number) => {
        if (!productTypesID) return null;

        if (window.confirm('Deseja realmente excluir esse tipo de produto ?')) {
            const deleteProductTypeEndPoint = `${END_POINT}/${productTypesID}`;

            const { data, err } = await fetchRequest(deleteProductTypeEndPoint, 'DELETE', null);

            if (err || !data) {
                console.log(err || 'Missing req.data');

                alert(`Erro ao deletar. Por favor, tente novamente`);
                return;
            }

            if (data === 'success') {
                alert(`Tipo de produto deletado com sucesso!`);
                window.location.reload();
            }

            return null;
        }
    }

    const handleClickEdit = (productTypeID: string | number) => {
        if (!productTypeID) return null;

        navigate(`/productTypes/edit/${productTypeID}`);
    }

    // Get initial data (product type list) when component did mount
    useEffect(() => {
        getInitialData();
    }, []);

    const getInitialData = async () => {
        const { err, data } = await fetchRequest(END_POINT, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar lista de tipos de produto');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
            setProductTypesList(data);
        }
    }

    const handleClickCreateNew = () => {
        navigate("/productTypes/create");
    }

    return (
        <>
            <Button
                name="Novo tipo de produto"
                onClickFunc={handleClickCreateNew}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-plus'

                }}
            />

            <Table
                data={productTypesList}
                columns={TABLE_COLUMNS}
            />
        </>
    );
};

export default ListProductTypes;