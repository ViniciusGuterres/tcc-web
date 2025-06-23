import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import fetchRequest from "../../utils/fetchRequest";
import CustomSelect from "../../components/CustomSelect";
import endPoints from "../../constants/endpoints";
import transformArrayIntoSelectOptions from "../../utils/transformArrayIntoSelectOptions";
import { useNavigate, useParams } from "react-router";

import { z } from "zod";

const dryingRoomSchema = z.object({
    name: z.string().min(1, "Nome obrigatório"),
    gasConsumptionPerHour: z.number().positive("Campo obrigatório"),
    machines: z.array(
        z.object({
            machineId: z.number().min(1, "Máquina inválida"),
        })
    ).min(1, "Selecione ao menos uma máquina"),
});

type DryingRoomFormData = z.infer<typeof dryingRoomSchema>;

const DRYING_ROOMS_ENDPOINT = endPoints.dryingRoomsEndPoint;
const MACHINES_ENDPOINT = endPoints.machinesEndPoint;

function DryingRoomForm({ crudMode }) {
    const [machineOptions, setMachineOptions] = useState<Array<Option>>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { id } = useParams();
    const isEditMode = crudMode === "edit";
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<DryingRoomFormData>({
        resolver: zodResolver(dryingRoomSchema),
        defaultValues: {
            name: "",
            gasConsumptionPerHour: 0,
            machines: [],
        },
    });

    const { fields: machineFields, append: appendMachine, remove: removeMachine } = useFieldArray({
        control,
        name: "machines",
    });

    useEffect(() => {
        gethMachines();

        if (isEditMode && id) getDryingRoom(id);

        setIsLoading(false);
    }, []);

    const gethMachines = async () => {
        const { data, err } = await fetchRequest(MACHINES_ENDPOINT, "GET", null);
        if (err) {
            alert("Erro ao buscar máquinas.");
            return;
        }

        if (data && Array.isArray(data) && data.length > 0) {

            const machineSelectOptions = transformArrayIntoSelectOptions(data, "id", "name");

            if (machineSelectOptions && machineSelectOptions.length > 0) {
                setMachineOptions(machineSelectOptions);
            }
        }
    };

    const getDryingRoom = async (roomId: string) => {
        setIsLoading(true);

        const { data, err } = await fetchRequest(`${DRYING_ROOMS_ENDPOINT}/${roomId}`, "GET", null);

        if (err || !data) {
            alert("Erro ao carregar dados da estufa.");
            return;
        }

        const dryingRoomData = data as DryingRoomPostBody;

        if (
            dryingRoomData
            && dryingRoomData.machines?.length > 0
            && dryingRoomData.name
            && dryingRoomData.gasConsumptionPerHour
        ) {
            reset({
                name: dryingRoomData.name,
                gasConsumptionPerHour: Number(dryingRoomData.gasConsumptionPerHour),
                machines: dryingRoomData.machines.map(id => ({ machineId: id })),
            });
        }

        setIsLoading(false);
    };

    const onSubmit = async (formData: DryingRoomFormData) => {
        setIsLoading(true);

        const method = isEditMode ? "PUT" : "POST";
        const endpoint = isEditMode ? `${DRYING_ROOMS_ENDPOINT}/${id}` : DRYING_ROOMS_ENDPOINT;

        const formattedData = {
            ...formData,
            machines: formData.machines.map((m) => m.machineId),
        };

        const { err } = await fetchRequest(endpoint, method, formattedData);


        if (err) {
            alert("Erro ao salvar estufa.");
            setIsLoading(false);
            return;
        }

        alert(`Estufa ${isEditMode ? "atualizada" : "criada"} com sucesso!`);
        navigate("/dryingRooms");
    };

    return (
        <form
            className="space-y-6 p-6 border rounded-md bg-white shadow-sm"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div>
                <label className="block text-sm font-medium">Nome</label>
                <input
                    type="text"
                    {...register("name")}
                    className="input input-bordered w-full"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium">Consumo de gás por hora</label>
                <input
                    type="number"
                    step="any"
                    {...register("gasConsumptionPerHour", { valueAsNumber: true })}
                    className="input input-bordered w-full"
                />
                {errors.gasConsumptionPerHour && <p className="text-sm text-red-600">{errors.gasConsumptionPerHour.message}</p>}
            </div>

            <div className="space-y-4">
                {machineFields.map((field, index) => (
                    <div key={field.id} className="border p-4 rounded-md bg-gray-50 space-y-4">
                        <Controller
                            control={control}
                            name={`machines.${index}.machineId`}
                            render={({ field }) => (
                                <CustomSelect
                                    options={machineOptions}
                                    value={machineOptions.find(opt => opt.value === field.value)}
                                    onChange={option => field.onChange(option?.value)}
                                />
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => removeMachine(index)}
                            className="flex items-center text-red-600 hover:text-red-800 text-sm gap-1"
                        >
                            Remover máquina
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => appendMachine({ machineId: +machineOptions[0]?.value })}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                    + Adicionar máquina
                </button>

                {errors.machines && (
                    <p className="text-sm text-red-500">{errors.machines.message as string}</p>
                )}
            </div>


            <div className="pt-6">
                <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className={`bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow ${isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                        }`}
                >
                    {isSubmitting ? "Salvando..." : isEditMode ? "Atualizar Estufa" : "Criar Estufa"}
                </button>
            </div>
        </form>
    );
}

export default DryingRoomForm;
