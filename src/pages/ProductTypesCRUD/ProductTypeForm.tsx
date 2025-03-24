import { useEffect, useState } from "react";
import Form from "../../components/Form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import Button from "../../components/Button";
import endPoints from '../../constants/endpoints';

const productTypesSchema = z.object({
    name: z.string().min(4, "O nome do tipo de produto deve possuir no mínimo 3 caracteres"),
});

const fields: FieldType[] = [
    {
        name: "name",
        label: "Nome do tipo",
        type: "text",
        placeholder: 'EX: Vaso',
    },
];

const END_POINT = endPoints.productTypesEndPoint;

interface Props {
    crudMode: CrudModesAllowed,
};

function ProductTypeForm({ crudMode }: Props) {
    const [productTypeData, setProductTypeData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const { id } = useParams();

    const navigate = useNavigate();

    // Check if the crud mode is "edit", otherwise is "create"
    const isEditMode = crudMode === 'edit' && id;

    useEffect(() => {
        // Verify edit mode (create or edit)
        if (isEditMode && id) {
            getProductTypeData(id);
        }

    }, []);

    const getProductTypeData = async productTypeId => {
        if (!productTypeId) return null;

        setLoading(true);

        const getProductTypeEndPoint = `${END_POINT}/${productTypeId}`;

        const { data, err } = await fetchRequest(getProductTypeEndPoint, 'GET', null);

        if (err || !data || typeof data !== 'object') {
            console.log(err || 'Missing req.data');

            alert(`Erro ao pegar os dados do tipo de produto. Por favor, tente novamente`);
            return;
        }

        setProductTypeData(data);
        setLoading(false);

        return null;
    }

    const goBackToList = () => {
        navigate("/productTypes");
    }

    const handleSubmit = async (formData: any) => {
        setLoading(true);
        let response;

        // Edit existing product type
        if (isEditMode && id) {
            response = await fetchRequest(`${END_POINT}/${id}`, "PUT", formData);
        } else {
            // Create new product type
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

        alert(isEditMode ? "Tipo de produto atualizado com sucesso!" : "Tipo de produto criado com sucesso!");
        navigate("/productTypes");
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
                schema={productTypesSchema}
                submitFunc={handleSubmit}
                submitButtonLabel={isEditMode ? 'Atualizar' : 'Cadastrar'}
                initialData={productTypeData}
                isLoading={loading}
            />
        </div>
    );
}

export default ProductTypeForm;