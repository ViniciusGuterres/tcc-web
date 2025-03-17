import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";

// Globals
const ENTITY_END_POINT = 'machines';

const handleClickDelete = async (machineID: string | number) => {
    if (!machineID) return null;

    const deleteMachineEndPoint = `${ENTITY_END_POINT}/${machineID}`;

    const { data, err } = await fetchRequest(deleteMachineEndPoint, 'DELETE', null);

    if (err || !data ) {
        console.log(err || 'Missing req.data');

        alert(`Erro ao deletar. Por favor, tente novamente`);
        return;
    }

    if (data === 'success') {
        alert(`Máquina deletada com sucesso!`);
        window.location.reload();
    }

    return null;
}

const TABLE_COLUMNS = [
    {
        name: "name",
        header: "Nome",
        type: 'default',
    },
    {
        name: "power",
        header: "Potência",
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
            onClickHandler: (id) => { handleClickDelete(id) },
            enabled: true,
        },
    },
];

interface Props {
    onChangeCrudMode: (newCrudMode: MachinesCrudModeTypesAllowed) => void
};

const ListMachines = ({ onChangeCrudMode }: Props) => {
    const [machinesList, setMachinesList] = useState<Machine[]>([]);

    // Get initial data (machine list) when component did mount
    useEffect(() => {
        getInitialData();
    }, []);

    const getInitialData = async () => {
        const { err, data } = await fetchRequest(ENTITY_END_POINT, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pagar lista de máquinas');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
            setMachinesList(data);
        }
    }

    return (
        <>
            <Button
                name="Nova máquina"
                onClickFunc={() => onChangeCrudMode('create')}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-plus'

                }}
            />

            <Table
                data={machinesList}
                columns={TABLE_COLUMNS}
            />
        </>
    );
};

export default ListMachines;