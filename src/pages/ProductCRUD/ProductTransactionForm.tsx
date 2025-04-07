import { useEffect, useState } from "react";
import Form from "../../components/Form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import Button from "../../components/Button";
import endPoints from "../../constants/endpoints";

const fields: FieldType[] = [
    {
        name: "quantity",
        label: "Quantidade",
        type: "number",
    },
];

const productTransactionSchema = z.object({
    quantity: z.string().nonempty("Por favor, Preencha a quantidade"),
});

const PRODUCT_END_POINT = endPoints.productsEndPoint;
const TRANSACTION_END_POINT = endPoints.transactionsEndPoint;

interface Props {
    crudMode: CrudModesAllowed,
};

function ProductTransactionForm({ crudMode }: Props) {
    const [productTransactionData, setProductTransactionData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const { productID, transactionID } = useParams();

    // Check if the crud mode is "edit", otherwise is "create"
    const isEditMode = crudMode === 'edit' && productID && transactionID;

    const navigate = useNavigate();

    useEffect(() => {
        // Verify edit mode (create or edit)
        if (isEditMode && productID && transactionID) {
            getFormData(productID, transactionID);
        }

    }, []);

    const getFormData = async (productId: ID, transactionId: ID) => {        
        if (!productId || !transactionID) return null;

        setLoading(true);

        const productTransactionEndPoint 
            = `${PRODUCT_END_POINT}/${productId}/${TRANSACTION_END_POINT}/${transactionId}`;

        const { data, err } = await fetchRequest(productTransactionEndPoint, 'GET', null);

        if (err || !data || typeof data !== 'object') {
            console.log(err || 'Missing req.data');

            alert(`Erro ao pegar os dados da transação de produtos. Por favor, tente novamente`);
            return;
        }

        setProductTransactionData(data);
        setLoading(true);

        return null;
    }

    const goBackToProductList = () => {
        navigate("/products");
    }

    const handleSubmit = async (formData: any) => {
        if (!formData.quantity) return null;
        
        setLoading(true);
        let response;

        let productTransactionEndPoint =
            `${PRODUCT_END_POINT}/${productID}/${TRANSACTION_END_POINT}?quantity=${formData.quantity}`;

        console.log("🚀 ~ handleSubmit ~ productTransactionEndPoint:", productTransactionEndPoint)

        // Edit existing product transaction
        if (isEditMode) {
            response = await fetchRequest(`${productTransactionEndPoint}/${transactionID}`, "PUT", formData);
        } else {
            // Create new product transaction
            response = await fetchRequest(productTransactionEndPoint, "POST", formData);
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

        alert(isEditMode ? "Transação de produto atualizado com sucesso!" : "Transação de produto criado com sucesso!");
        navigate("/products");
    }

    return (
        <div>
            {/* Go back button */}
            <Button
                name="Voltar"
                onClickFunc={goBackToProductList}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-arrow-left'
                }}
            />

            <Form
                fields={fields}
                schema={productTransactionSchema}
                submitFunc={handleSubmit}
                submitButtonLabel={isEditMode ? 'Atualizar' : 'Cadastrar'}
                initialData={productTransactionData}
            />
        </div>
    );
}

export default ProductTransactionForm;