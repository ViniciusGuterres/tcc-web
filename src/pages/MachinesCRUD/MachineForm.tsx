import { useEffect } from "react";
import Form from "../../components/Form";
import { z } from "zod";

const userSchema = z.object({
    machineName: z.string().min(4, "O nome da máquina deve possuir no minimo 4 caracteres"),
    power: z.number().min(20, "Deve haver no minimo 20 caracteres"),
});

const fields: FieldType[] = [
    {
        name: "machineName",
        label: "Nome da máquina",
        type: "text",
        placeholder: 'EX: Misturador',
    },
    {
        name: "power",
        label: "Potência (CV)",
        type: "number",
        placeholder: 'EX: 150 CV',
    },
];

interface Props {
    onChangeCrudMode: () => void,
    crudMode: CrudModesAllowed,
};

function MachineForm({ onChangeCrudMode, crudMode }) {
    useEffect(() => {
        // Verify edit mode (create or edit)
        if (crudMode === 'edit') {

        }

    }, []);

    const getMachineData = machineId => {
    }

    return (
        <Form
            fields={fields}
            schema={userSchema}
            onSubmit={() => { }}
            submitButtonLabel="Cadastrar"
        />
    );
}

export default MachineForm;