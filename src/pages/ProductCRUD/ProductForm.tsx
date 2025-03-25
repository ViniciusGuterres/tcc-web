import { useEffect, useState } from "react";
import Form from "../../components/Form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import Button from "../../components/Button";
import endPoints from '../../constants/endpoints';

const productsSchema = z.object({
    name: z.string().min(4, "O nome do produto deve possuir no mínimo 3 caracteres"),
});

const fields: FieldType[] = [
    {
        name: "name",
        label: "Nome",
        type: "text",
        placeholder: 'EX: Produto 1',
    },
    {
        name: "height",
        label: "Altura",
        type: "number",
        placeholder: 'EX: 3,05',
    },
    {
        name: "width",
        label: "Largura",
        type: "number",
        placeholder: 'EX: 3,05',
    },
    {
        name: "length",
        label: "Comprimento",
        type: "number",
        placeholder: 'EX: 3,05',
    },
];

const END_POINT = endPoints.productsEndPoint;

interface Props {
    crudMode: CrudModesAllowed,
};

function ProductForm({ crudMode }: Props) {
    const [productData, setProductData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const { id } = useParams();

    const navigate = useNavigate();

    // Check if the crud mode is "edit", otherwise is "create"
    const isEditMode = crudMode === 'edit' && id;

    useEffect(() => {
        // Verify edit mode (create or edit)
        if (isEditMode && id) {
            getProductData(id);
        }

    }, []);

    const getProductData = async productId => {
        if (!productId) return null;

        setLoading(true);

        const getProductEndPoint = `${END_POINT}/${productId}`;

        const { data, err } = await fetchRequest(getProductEndPoint, 'GET', null);

        if (err || !data || typeof data !== 'object') {
            console.log(err || 'Missing req.data');

            alert(`Erro ao pegar os dados do produto. Por favor, tente novamente`);
            return;
        }

        setProductData(data);
        setLoading(false);

        return null;
    }

    const goBackToList = () => {
        navigate("/products");
    }

    const handleSubmit = async (formData: any) => {
        setLoading(true);
        let response;

        // Edit existing product 
        if (isEditMode && id) {
            response = await fetchRequest(`${END_POINT}/${id}`, "PUT", formData);
        } else {
            // Create new product 
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

        alert(isEditMode ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");
        navigate("/products");
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        }}>
            {/* Go back button */}
            <div style={{ width: '100ox' }}>
                <Button
                    name="Voltar"
                    onClickFunc={goBackToList}
                    isDisabled={false}
                    icon={{
                        position: 'left',
                        icon: 'fa-arrow-left'
                    }}
                />
            </div>

            <Form
                fields={fields}
                schema={productsSchema}
                submitFunc={handleSubmit}
                submitButtonLabel={isEditMode ? 'Atualizar' : 'Cadastrar'}
                initialData={productData}
                isLoading={loading}
            />
        </div>
    );
}

export default ProductForm;