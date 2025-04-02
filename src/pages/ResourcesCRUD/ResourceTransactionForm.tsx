import { useEffect, useState } from "react";
import Form from "../../components/Form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import Button from "../../components/Button";
import { TRANSACTION_TYPES_OPTIONS } from "../../constants/transactionTypes";

const fields: FieldType[] = [
    {
        name: "type",
        label: "Tipo de Transação",
        options: TRANSACTION_TYPES_OPTIONS,
    },
    {
        name: "quantity",
        label: "Quantidade",
        type: "number",
    },
];

const resourceSchema = z.object({
    type: z.string().nonempty("Por favor, preencha o tipo de transação"),
    quantity: z.string().nonempty("Por favor, Preencha a quantidade"),
});

const RESOURCE_END_POINT = 'resources';
const TRANSACTION_END_POINT = 'transactions';

interface Props {
    crudMode: CrudModesAllowed,
};

function ResourceTransactionForm({ crudMode }: Props) {
    const [resourceTransactionData, setResourceTransactionData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const { resourceID, transactionID } = useParams();

    // Check if the crud mode is "edit", otherwise is "create"
    const isEditMode = crudMode === 'edit' && resourceID && transactionID;

    const navigate = useNavigate();

    useEffect(() => {
        // Verify edit mode (create or edit)
        if (isEditMode && resourceID && transactionID) {
            getFormData(resourceID, transactionID);
        }

    }, []);

    const getFormData = async (resourceId: ID, transactionId: ID) => {
        console.log("🚀 ~ getFormData ~ getFormData:", getFormData)
        
        if (!resourceId || !transactionID) return null;

        setLoading(true);

        const resourceTransactionEndPoint = `${RESOURCE_END_POINT}/${resourceId}/${TRANSACTION_END_POINT}/${transactionId}`;

        const { data, err } = await fetchRequest(resourceTransactionEndPoint, 'GET', null);

        if (err || !data || typeof data !== 'object') {
            console.log(err || 'Missing req.data');

            alert(`Erro ao pegar os dados da transação de recursos. Por favor, tente novamente`);
            return;
        }
        console.log("🚀 ~ getFormData ~ data:", data)

        setResourceTransactionData(data);
        setLoading(true);

        return null;
    }

    const goBackToResourceList = () => {
        navigate("/resources");
    }

    const handleSubmit = async (formData: any) => {
        setLoading(true);
        let response;

        let resourceTransactionEndPoint = `${RESOURCE_END_POINT}/${resourceID}/${TRANSACTION_END_POINT}`;

        // Edit existing resource
        if (isEditMode) {
            response = await fetchRequest(`${resourceTransactionEndPoint}/${transactionID}`, "PUT", formData);
        } else {
            // Create new resource
            response = await fetchRequest(resourceTransactionEndPoint, "POST", formData);
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

        alert(isEditMode ? "Transação de recurso atualizado com sucesso!" : "Transação de recurso criado com sucesso!");
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
                initialData={resourceTransactionData}
            />
        </div>
    );
}

export default ResourceTransactionForm;