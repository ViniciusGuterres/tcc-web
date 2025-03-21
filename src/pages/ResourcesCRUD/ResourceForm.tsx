import { useEffect, useState } from "react";
import Form from "../../components/Form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import Button from "../../components/Button";
import { RESOURCE_CATEGORY_OPTIONS } from "../../constants/resourceCategory";

const fields: FieldType[] = [
    {
        name: "name",
        label: "Nome do recurso",
        type: "text",
        placeholder: 'EX: Água',
    },
    {
        name: "category",
        label: "Categoria",
        options: RESOURCE_CATEGORY_OPTIONS,
    },
    {
        name: "unitValue",
        label: "Valor unitário",
        type: "number",
    },
];

const resourceSchema = z.object({
    name: z.string().nonempty("Por favor, preencha o nome do recurso"),
    category: z.string().nonempty("Selecione uma categoria!"),
    unitValue: z.string().nonempty("Por favor, Preencha o valor unitário"),
});

const RESOURCE_END_POINT = 'resources';

interface Props {
    crudMode: CrudModesAllowed,
};

function ResourceForm({ crudMode }: Props) {
    const [resourceData, setResourceData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const { id } = useParams();

    const navigate = useNavigate();

    // Check if the crud mode is "edit", otherwise is "create"
    const isEditMode = crudMode === 'edit' && id;

    useEffect(() => {
        // Verify edit mode (create or edit)
        if (isEditMode && id) {
            getFormData(id);
        }

    }, []);


    const getFormData = async resourceId => {
        if (!resourceId) return null;

        setLoading(true);

        const resourceEndPoint = `${RESOURCE_END_POINT}/${resourceId}`;

        const { data, err } = await fetchRequest(resourceEndPoint, 'GET', null);

        if (err || !data || typeof data !== 'object') {
            console.log(err || 'Missing req.data');

            alert(`Erro ao pegar os dados dos recursos. Por favor, tente novamente`);
            return;
        }

        setResourceData(data);
        setLoading(true);

        return null;
    }



    const goBackToResourceList = () => {
        navigate("/resources");
    }

    const handleSubmit = async (formData: any) => {
        setLoading(true);
        let response;

        // Edit existing resource
        if (isEditMode) {
            response = await fetchRequest(`${RESOURCE_END_POINT}/${id}`, "PUT", formData);
        } else {
            // Create new resource
            response = await fetchRequest(RESOURCE_END_POINT, "POST", formData);
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

        alert(isEditMode ? "Recurso atualizado com sucesso!" : "Recurso criado com sucesso!");
        navigate("/resources");
    }

    return (
        <div>
            {/* Go back button */}
            <Button
                name="Voltar"
                onClickFunc={goBackToResourceList}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-arrow-left'
                }}
            />

            <Form
                fields={fields}
                schema={resourceSchema}
                submitFunc={handleSubmit}
                submitButtonLabel={isEditMode ? 'Atualizar' : 'Cadastrar'}
                initialData={resourceData}
            />
        </div>
    );
}

export default ResourceForm;