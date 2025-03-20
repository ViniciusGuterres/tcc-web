import { useEffect, useState } from "react";
import Form from "../../components/Form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import Button from "../../components/Button";


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
        type: "text",
    },
    {
        name: "unity",
        label: "Valor unitário",
        type: "number",
    },
];

const resourceSchema = z.object({
    name: z.string().min(4, "O nome do recurso deve possuir no mínimo 4 caracteres"),
    category: z.string().min(4, "O nome do recurso deve possuir no mínimo 4 caracteres"),
    unity: z.string().min(4, "O nome do recurso deve possuir no mínimo 4 caracteres"),
});

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

    const goBackToResourceList = () => {
        navigate("/resources");
    }

    const handleSubmit = async (FormData: any) => {

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