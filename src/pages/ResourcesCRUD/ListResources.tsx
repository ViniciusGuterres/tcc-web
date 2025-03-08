import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";

type CrudModeTypesAllowed = "list" | "create" | "edit";

interface Props {
    onChangeCrudMode: (newCrudMode: CrudModeTypesAllowed) => void
};

// Globals
const RESOURCE_END_POINT = 'resources';

const TABLE_COLUMNS = [
    {
        name: "name",
        header: "Nome",
    },
    {
        name: "category",
        header: "Categoria",
    },
    {
        name: "currentQuantity",
        header: "Quantidade",
    },
    {
        name: "currentQuantityPrice",
        header: "Preço",
    },
];

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

        console.log("🚀 ~ getInitialData ~ data:", data)

        if (data && Array.isArray(data) && data.length > 0) {
            setResourcesList(data);
        }   
    }

    return (
        <>
            <Button
                name="Novo recurso"
                onClickFunc={() => onChangeCrudMode('create')}
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