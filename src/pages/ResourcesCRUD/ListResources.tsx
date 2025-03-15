import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
interface Props {
    onChangeCrudMode: (newCrudMode: ResourceCrudModeTypesAllowed) => void
};

const handleClickDeleteResource = async (resourceID: string | number) => {
    if (!resourceID) return null;

    const deleteResourceEndPoint = `${RESOURCES_END_POINT}/${resourceID}`;

    const { data, err } = await fetchRequest(deleteResourceEndPoint, 'DELETE', null);

    if (err || !data ) {
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

// Globals
const RESOURCE_END_POINT = 'resources';

const TABLE_COLUMNS = [
    {
        name: "name",
        header: "Nome",
        type: 'default',
    },
    {
        name: "category",
        header: "Categoria",
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
            onClickHandler: () => {},
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

const RESOURCES_END_POINT = 'resources';

const ListResources = ({ onChangeCrudMode }: Props) => {
    const [resourcesList, setResourcesList] = useState<Resource[]>([]);

    // Get initial data (resource list) when component did mount
    useEffect(() => {
        getInitialData();
    }, []);

    const getInitialData = async () => {
        const { err, data } = await fetchRequest(RESOURCE_END_POINT, 'GET', null);

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
                onClickFunc={() => onChangeCrudMode('create')}
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