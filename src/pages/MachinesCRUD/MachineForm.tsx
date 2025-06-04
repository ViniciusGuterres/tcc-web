import { useEffect, useState } from "react";
import Form from "../../components/Form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import Button from "../../components/Button";
import endPoints from "../../constants/endpoints";

const machineSchema = z.object({
    name: z.string().min(4, "O nome da máquina deve possuir no mínimo 4 caracteres"),
    power: z
        .string()
        // .min(1, "A potência é obrigatória")
        // .transform((val) => Number(val))
        // .refine((val) => !isNaN(val) && val >= 20, {
        //     message: "Deve haver no mínimo 20 CV",
        // }),
});

const fields: FieldType[] = [
    {
        name: "name",
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

const MACHINE_END_POINT = endPoints.machinesEndPoint;

interface Props {
    crudMode: CrudModesAllowed,
};

function MachineForm({ crudMode }: Props) {
    const [machineData, setMachineData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const { id } = useParams();

    const navigate = useNavigate();

    // Check if the crud mode is "edit", otherwise is "create"
    const isEditMode = crudMode === 'edit';

    useEffect(() => {
        // Verify edit mode (create or edit)
        if (isEditMode && id) {
            getMachineData(id);
        }

    }, []);

    const getMachineData = async machineId => {
        if (!machineId) return null;

        setLoading(true);

        const getMachineEndPoint = `${MACHINE_END_POINT}/${machineId}`;

        const { data, err } = await fetchRequest(getMachineEndPoint, 'GET', null);

        if (err || !data || typeof data !== 'object') {
            console.log(err || 'Missing req.data');

            alert(`Erro ao pegar os dados da máquina. Por favor, tente novamente`);
            return;
        }

        setMachineData(data);
        setLoading(true);

        return null;
    }

    const goBackToMachineList = () => {
        navigate("/machines");
    }

    const handleSubmit = async (formData: any) => {        
        setLoading(true);
        let response;

        // Edit existing machine
        if (isEditMode && id) {
            response = await fetchRequest(`${MACHINE_END_POINT}/${id}`, "PUT", formData);
        } else {
            // Create new machine
            response = await fetchRequest(MACHINE_END_POINT, "POST", formData);
        }

        if (response.err) {
            console.log(response.err)
            
            if (typeof response.err === 'string') {
                alert(response.err);
            } else {
                alert('Erro ao salvar os dados. Por favor, tente novamente.');
            }

            setLoading(false);
            return;
        }

        alert(isEditMode ? "Máquina atualizada com sucesso!" : "Máquina criada com sucesso!");
        navigate("/machines");
    };

    return (
        <div>
            {/* Go back button */}
            <Button
                name="Voltar"
                onClickFunc={goBackToMachineList}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-arrow-left'
                }}
            />

            <Form
                fields={fields}
                schema={machineSchema}
                submitFunc={handleSubmit}
                submitButtonLabel={isEditMode ? 'Atualizar' : 'Cadastrar'}
                initialData={machineData}
            />
        </div>
    );
}

export default MachineForm;