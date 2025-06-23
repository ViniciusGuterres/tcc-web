import { useEffect, useState } from "react";
import Form from "../../components/Form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import Button from "../../components/Button";
import endPoints from '../../constants/endpoints';
import transformArrayIntoSelectOptions from "../../utils/transformArrayIntoSelectOptions";

// ✅ Schema completo com validações para todos os campos
const productsSchema = z.object({
    name: z.string().nonempty("O nome do produto deve possuir no mínimo 3 caracteres"),
    price: z.string().nonempty("Preço obrigatório"),
    height: z.string().nonempty("Altura obrigatória"),
    width: z.string().nonempty("Largura obrigatória"),
    length: z.string().nonempty("Comprimento obrigatório"),
    typeId: z.number(), //.nonempty("Selecione um tipo de produto!"),
    lineId: z.number(),// .nonempty("Selecione uma linha de produto!"),
});

const END_POINT = endPoints.productsEndPoint;

interface Props {
    crudMode: CrudModesAllowed;
}

function ProductForm({ crudMode }: Props) {
    const [productData, setProductData] = useState<Record<string, any>>({});
    const [productLinesOptions, setProductLinesOptions] = useState<Array<Option>>([]);
    const [productTypesOptions, setProductTypesOptions] = useState<Array<Option>>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = crudMode === 'edit' && id;

    useEffect(() => {
        getProductLinesData();
        getProductTypesData();
        if (isEditMode) getProductData(id);
    }, []);

    const fields: FieldType[] = [
        { name: "name", label: "Nome", type: "text", placeholder: "Ex: Produto 544" },
        { name: "price", label: "Preço (R$)", type: "number", placeholder: "Ex: 19.90" },
        { name: "height", label: "Altura (cm)", type: "number", placeholder: "Ex: 6.5" },
        { name: "width", label: "Largura (cm)", type: "number", placeholder: "Ex: 20.0" },
        { name: "length", label: "Comprimento (cm)", type: "number", placeholder: "Ex: 26.0" },
        { name: "lineId", label: "Linha", options: productLinesOptions },
        { name: "typeId", label: "Tipo", options: productTypesOptions },
    ];

    const getProductData = async (productId: string) => {
        setLoading(true);
        const { data, err } = await fetchRequest(`${END_POINT}/${productId}`, 'GET', null);
        if (err || !data || typeof data !== 'object') {
            alert("Erro ao carregar os dados do produto.");
        } else {
            setProductData(data);
        }

        setLoading(false);
    };

    const getProductLinesData = async () => {
        const { data, err } = await fetchRequest(endPoints.productLinesEndPoint, 'GET', null);

        if (data && Array.isArray(data) && data.length > 0) {
            const productLinesOptions = transformArrayIntoSelectOptions(data, 'id', 'name');

            if (productLinesOptions && productLinesOptions.length > 0) {
                setProductLinesOptions(productLinesOptions);
            }

        }

        if (err) console.error("Erro ao buscar linhas:", err);
    };

    const getProductTypesData = async () => {
        const { data, err } = await fetchRequest(endPoints.productTypesEndPoint, 'GET', null);
        if (data && Array.isArray(data)) {
            const productTypesOptions = transformArrayIntoSelectOptions(data, 'id', 'name');

            if (productTypesOptions && productTypesOptions.length > 0) {
                setProductTypesOptions(productTypesOptions);
            } 
        }

        if (err) console.error("Erro ao buscar tipos:", err);
    };

    const goBackToList = () => navigate("/products");

    const handleSubmit = async (formData: any) => {
        setLoading(true);
        const method = isEditMode ? "PUT" : "POST";
        const endpoint = isEditMode ? `${END_POINT}/${id}` : END_POINT;

        const formattedData = {
            ...formData,
            price: Number(formData.price),
            height: Number(formData.height),
            width: Number(formData.width),
            length: Number(formData.length),
            typeId: Number(formData.typeId),
            lineId: Number(formData.lineId),
        };

        const { err } = await fetchRequest(endpoint, method, formattedData);

        if (err) {
            alert(typeof err === 'string' ? err : "Erro ao salvar os dados.");
            setLoading(false);
            return;
        }

        alert(isEditMode ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");
        navigate("/products");
    };

    return (
        <div className="flex flex-col gap-4">
            <Button
                name="Voltar"
                onClickFunc={goBackToList}
                isDisabled={false}
                icon={{ position: 'left', icon: 'fa-arrow-left' }}
            />

            <Form
                fields={fields}
                schema={productsSchema}
                submitFunc={handleSubmit}
                submitButtonLabel={isEditMode ? "Atualizar" : "Cadastrar"}
                initialData={productData}
                isLoading={loading}
            />
        </div>
    );
}

export default ProductForm;