import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
import resourceCategoryTranslate from "../../utils/resourceCategoryTranslate";
import { useNavigate } from "react-router";

// Globals
const RESOURCES_END_POINT = 'resources';

const ListResources = () => {
    const [resourcesList, setResourcesList] = useState<Resource[]>([]);

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
        },
        {
            name: "currentQuantityPrice",
            header: "Preço",
            type: 'default',
        },
        {
            name: "edit",
            header: "Editar",
            type: 'action',
            actionButton: {
                type: "edit",
                onClickHandler: () => { },
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

    const handleClickDeleteResource = async (resourceID: string | number) => {
        if (!resourceID) return null;

        if (window.confirm('Deseja realmente excluir esse recurso ?')) {
            const deleteResourceEndPoint = `${RESOURCES_END_POINT}/${resourceID}`;

            const { data, err } = await fetchRequest(deleteResourceEndPoint, 'DELETE', null);

            if (err || !data) {
                console.log(err || 'Missing req.data');

                alert(`Erro ao deletar. Por favor, tente novamente`);
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
            />
        </>
    );
};

export default ListResources;