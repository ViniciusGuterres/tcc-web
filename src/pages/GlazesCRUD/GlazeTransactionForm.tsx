import { useEffect, useState } from "react";
import Form from "../../components/Form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import Button from "../../components/Button";
import { TRANSACTION_TYPES_OPTIONS } from "../../constants/transactionTypes";
import endPoints from "../../constants/endpoints";

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

const transactionSchema = z.object({
    type: z.string().nonempty("Por favor, preencha o tipo de transação"),
    quantity: z.string().nonempty("Por favor, Preencha a quantidade"),
});

const GLAZE_END_POINT = endPoints.glazesEndPoint;
const TRANSACTION_END_POINT = endPoints.transactionsEndPoint;

interface Props {
    crudMode: CrudModesAllowed,
};

function GlazeTransactionForm({ crudMode }: Props) {
    const [glazeTransactionData, setGlazeTransactionData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const { glazeID, transactionID } = useParams();

    // Check if the crud mode is "edit", otherwise is "create"
    const isEditMode = crudMode === 'edit' && glazeID && transactionID;

    const navigate = useNavigate();

    useEffect(() => {
        // Verify edit mode (create or edit)
        if (isEditMode && glazeID && transactionID) {
            getFormData(glazeID, transactionID);
        }

    }, []);

    const getFormData = async (glazeId: ID, transactionId: ID) => {        
        if (!glazeId || !transactionID) return null;

        setLoading(true);

        const glazeTransactionEndPoint = `${GLAZE_END_POINT}/${glazeId}/${TRANSACTION_END_POINT}/${transactionId}`;

        const { data, err } = await fetchRequest(glazeTransactionEndPoint, 'GET', null);

        if (err || !data || typeof data !== 'object') {
            console.log(err || 'Missing req.data');

            alert(`Erro ao pegar os dados da transação de glazuras. Por favor, tente novamente`);
            return;
        }

        setGlazeTransactionData(data);
        setLoading(true);

        return null;
    }

    const goBackToGlazeList = () => {
        navigate("/glazes");
    }

    const handleSubmit = async (formData: any) => {
        setLoading(true);
        let response;

        let glazeTransactionEndPoint = `${GLAZE_END_POINT}/${glazeID}/${TRANSACTION_END_POINT}`;

        // Edit existing glaze
        if (isEditMode) {
            response = await fetchRequest(`${glazeTransactionEndPoint}/${transactionID}`, "PUT", formData);
        } else {
            // Create new glaze
            response = await fetchRequest(glazeTransactionEndPoint, "POST", formData);
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

        alert(isEditMode ? "Transação de glazura atualizada com sucesso!" : "Transação de glazura criada com sucesso!");
        navigate("/glazes");
    }

    return (
        <div>
            {/* Go back button */}
            <Button
                name="Voltar"
                onClickFunc={goBackToGlazeList}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-arrow-left'
                }}
            />

            <Form
                fields={fields}
                schema={transactionSchema}
                submitFunc={handleSubmit}
                submitButtonLabel={isEditMode ? 'Atualizar' : 'Cadastrar'}
                initialData={glazeTransactionData}
            />
        </div>
    );
}

export default GlazeTransactionForm;