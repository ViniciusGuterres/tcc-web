import { useEffect, useState } from "react";
import Form from "../../components/Form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import Button from "../../components/Button";
import endPoints from '../../constants/endpoints';

const productLineSchema = z.object({
    name: z.string().min(4, "O nome da linha deve possuir no mínimo 3 caracteres"),
});

const fields: FieldType[] = [
    {
        name: "name",
        label: "Nome da linha",
        type: "text",
        placeholder: 'EX: Linha Oval',
    },
];

const END_POINT = endPoints.productLinesEndPoint;

interface Props {
    crudMode: CrudModesAllowed,
};

function ProductLineForm({ crudMode }: Props) {
    const [productLineData, setProductLineData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const { id } = useParams();

    const navigate = useNavigate();

    // Check if the crud mode is "edit", otherwise is "create"
    const isEditMode = crudMode === 'edit' && id;

    useEffect(() => {
        // Verify edit mode (create or edit)
        if (isEditMode && id) {
            getProductLineData(id);
        }

    }, []);

    const getProductLineData = async productLineId => {
        if (!productLineId) return null;

        setLoading(true);

        const getProductLineEndPoint = `${END_POINT}/${productLineId}`;

        const { data, err } = await fetchRequest(getProductLineEndPoint, 'GET', null);

        if (err || !data || typeof data !== 'object') {
            console.log(err || 'Missing req.data');

            alert(`Erro ao pegar os dados da linha de produto. Por favor, tente novamente`);
            return;
        }

        setProductLineData(data);
        setLoading(true);

        return null;
    }

    const goBackToList = () => {
        navigate("/productLines");
    }

    const handleSubmit = async (formData: any) => {
        setLoading(true);
        let response;

        // Edit existing product line
        if (isEditMode && id) {
            response = await fetchRequest(`${END_POINT}/${id}`, "PUT", formData);
        } else {
            // Create new product line
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

        alert(isEditMode ? "Linha de produto atualizada com sucesso!" : "Linha de produto criada com sucesso!");
        navigate("/productLines");
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
                schema={productLineSchema}
                submitFunc={handleSubmit}
                submitButtonLabel={isEditMode ? 'Atualizar' : 'Cadastrar'}
                initialData={productLineData}
            />
        </div>
    );
}

export default ProductLineForm;