import { useEffect, useState } from "react";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";
import Table from "../../components/Table";
import { useNavigate } from "react-router";

// Globals
const ENTITY_END_POINT = 'machines';

const ListMachines = () => {
    const [machinesList, setMachinesList] = useState<Machine[]>([]);

    const navigate = useNavigate();

    const TABLE_COLUMNS = [
        {
            name: "name",
            header: "Nome da máquina",
            type: 'default',
        },
        {
            name: "power",
            header: "Potência (CV)",
            type: 'default',
        },
        {
            name: "edit",
            header: "Editar",
            type: 'action',
            actionButton: {
                type: "edit",
                onClickHandler: id => {handleClickEdit(id) },
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

    const handleClickDelete = async (machineID: string | number) => {
        if (!machineID) return null;

        const deleteMachineEndPoint = `${ENTITY_END_POINT}/${machineID}`;

        const { data, err } = await fetchRequest(deleteMachineEndPoint, 'DELETE', null);

        if (err || !data) {
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

    const handleClickEdit = (machineId: string | number) => {
        if (!machineId) return null;

        navigate(`/machines/edit/${machineId}`);
    }

    // Get initial data (machine list) when component did mount
    useEffect(() => {
        getInitialData();
    }, []);

    const getInitialData = async () => {
        const { err, data } = await fetchRequest(ENTITY_END_POINT, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar lista de máquinas');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
            setMachinesList(data);
        }
    }

    const handleClickCreateNewMachine = () => {
        navigate("/machines/create");
    }

    return (
        <>
            <Button
                name="Nova máquina"
                onClickFunc={handleClickCreateNewMachine}
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