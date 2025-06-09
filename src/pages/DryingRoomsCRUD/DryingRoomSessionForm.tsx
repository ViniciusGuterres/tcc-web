import { useEffect, useState } from "react";
import Form from "../../components/Form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import Button from "../../components/Button";
import endPoints from "../../constants/endpoints";

const fields: FieldType[] = [
    {
        name: "hours",
        label: "Horas de uso",
        type: "number",
    },
];

const dryingRoomSessionSchema = z.object({
    hours: z.string().nonempty("Por favor, preencha o número de horas"),
});

const DRYING_ROOMS_ENDPOINT = endPoints.dryingRoomsEndPoint;
const SESSIONS_ENDPOINT = endPoints.dryingRoomSessionEndPoint;

interface Props {
    crudMode: CrudModesAllowed,
};

function DryingRoomSessionForm({ crudMode }: Props) {
    const [sessionData, setSessionData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<boolean>(false);

    const { dryingRoomID, sessionID } = useParams();
    const isEditMode = crudMode === 'edit' && dryingRoomID && sessionID;

    const navigate = useNavigate();

    useEffect(() => {
        if (isEditMode && dryingRoomID && sessionID) {
            getSessionData(dryingRoomID, sessionID);
        }
    }, []);

    const getSessionData = async (dryingRoomId: ID, sessionId: ID) => {
        if (!dryingRoomId || !sessionId) return;

        setLoading(true);
        const endpoint = `${DRYING_ROOMS_ENDPOINT}/${dryingRoomId}/${SESSIONS_ENDPOINT}/${sessionId}`;

        const { data, err } = await fetchRequest(endpoint, 'GET', null);

        setLoading(false);

        if (err || !data || typeof data !== 'object') {
            console.error(err || 'Missing session data');
            alert("Erro ao carregar os dados da sessão.");
            return;
        }

        setSessionData(data);
    };

    const handleSubmit = async (formData: any) => {
        setLoading(true);

        const endpointBase = `${DRYING_ROOMS_ENDPOINT}/${dryingRoomID}/${SESSIONS_ENDPOINT}`;
        const endpoint = isEditMode
            ? `${endpointBase}/${sessionID}`
            : endpointBase;

        const method = isEditMode ? "PUT" : "POST";
        const response = await fetchRequest(endpoint, method, formData);

        setLoading(false);

        if (response.err) {
            console.error(response.err);
            alert("Erro ao salvar os dados. Tente novamente.");
            return;
        }

        alert(isEditMode ? "Sessão atualizada com sucesso!" : "Sessão criada com sucesso!");
        navigate("/dryingRooms");
    };

    const goBack = () => {
        navigate("/dryingRooms");
    };

    return (
        <div>
            <Button
                name="Voltar"
                onClickFunc={goBack}
                isDisabled={false}
                icon={{
                    position: "left",
                    icon: "fa-arrow-left",
                }}
            />

            <Form
                fields={fields}
                schema={dryingRoomSessionSchema}
                submitFunc={handleSubmit}
                submitButtonLabel={isEditMode ? "Atualizar" : "Cadastrar"}
                initialData={sessionData}
            />
        </div>
    );
}

export default DryingRoomSessionForm;