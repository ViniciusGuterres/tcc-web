import { useEffect, useState } from "react";
import Form from "../../components/Form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import Button from "../../components/Button";
import endPoints from "../../constants/endpoints";

const kilnSchema = z.object({
    name: z.string().min(4, "O nome do forno deve possuir no mínimo 3 caracteres"),
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
        label: "Nome do forno",
        type: "text",
        placeholder: 'EX: Forno 1',
    },
    {
        name: "power",
        label: "Potência (CV)",
        type: "number",
        placeholder: 'EX: 150 CV',
    },
];

const END_POINT = endPoints.kilnsEndPoint;

interface Props {
    crudMode: CrudModesAllowed,
};

function KilnForm({ crudMode }: Props) {
    const [kilnData, setKilnData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const { id } = useParams();

    const navigate = useNavigate();

    // Check if the crud mode is "edit", otherwise is "create"
    const isEditMode = crudMode === 'edit';

    useEffect(() => {
        // Verify edit mode (create or edit)
        if (isEditMode && id) {
            getKilnData(id);
        }

    }, []);

    const getKilnData = async kilnId => {
        if (!kilnId) return null;

        setLoading(true);

        const getKilnEndPoint = `${END_POINT}/${kilnId}`;

        const { data, err } = await fetchRequest(getKilnEndPoint, 'GET', null);

        if (err || !data || typeof data !== 'object') {
            console.log(err || 'Missing req.data');

            alert(`Erro ao pegar os dados do forno. Por favor, tente novamente`);
            return;
        }

        setKilnData(data);
        setLoading(true);

        return null;
    }

    const goBackToKilnList = () => {
        navigate("/kilns");
    }

    const handleSubmit = async (formData: any) => {        
        setLoading(true);
        let response;

        // Edit existing kiln
        if (isEditMode && id) {
            response = await fetchRequest(`${END_POINT}/${id}`, "PUT", formData);
        } else {
            // Create new kiln
            response = await fetchRequest(END_POINT, "POST", formData);
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

        alert(isEditMode ? "forno atualizado com sucesso!" : "forno criado com sucesso!");
        navigate("/kilns");
    };

    return (
        <div>
            {/* Go back button */}
            <Button
                name="Voltar"
                onClickFunc={goBackToKilnList}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-arrow-left'
                }}
            />

            <Form
                fields={fields}
                schema={kilnSchema}
                submitFunc={handleSubmit}
                submitButtonLabel={isEditMode ? 'Atualizar' : 'Cadastrar'}
                initialData={kilnData}
            />
        </div>
    );
}

export default KilnForm;