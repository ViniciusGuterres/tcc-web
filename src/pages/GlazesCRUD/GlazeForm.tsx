import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import fetchRequest from "../../utils/fetchRequest";
import CustomSelect from "../../components/CustomSelect";
import transformArrayIntoSelectOptions from "../../utils/transformArrayIntoSelectOptions";
import endPoints from "../../constants/endpoints";

const glazeSchema = z.object({
    color: z.string().min(1, "Cor obrigatória"),
    unitValue: z.number().nonnegative("Valor deve ser ≥ 0"),

    resourceUsages: z.array(
        z.object({
            resourceId: z.number().min(1, "Recurso obrigatório"),
            quantity: z.number().positive("Quantidade deve ser > 0"),
        })
    ).min(1, "Adicione pelo menos um recurso"),

    machineUsages: z.array(
        z.object({
            machineId: z.number().min(1, "Máquina obrigatória"),
            usageTime: z.number().positive("Tempo deve ser > 0"),
        })
    ).min(1, "Adicione pelo menos uma máquina"),
});

type GlazeFormData = z.infer<typeof glazeSchema>;

const GLAZES_END_POINT = endPoints.glazesEndPoint;
const MACHINES_END_POINT = endPoints.machinesEndPoint;
const RESOURCES_END_POINT = endPoints.resourcesEndPoint;

function GlazeForm({ crudMode }) {
    const [resourceOptions, setResourceOptions] = useState<Array<Option>>([]);
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
    } = useForm<GlazeFormData>({
        resolver: zodResolver(glazeSchema),
        defaultValues: {
            color: "",
            unitValue: 0,
            resourceUsages: [],
            machineUsages: [],
        },
    });

    const { fields: resourceFields, append: appendResource, remove: removeResource } = useFieldArray({
        control,
        name: "resourceUsages",
    });

    const { fields: machineFields, append: appendMachine, remove: removeMachine } = useFieldArray({
        control,
        name: "machineUsages",
    });

    useEffect(() => {
        getMachinesAvailable();
        getResourcesAvailable();
        if (isEditMode && id) getGlazeData(id);
        setIsLoading(false);
    }, []);

    const getMachinesAvailable = async () => {
        const { err, data } = await fetchRequest(MACHINES_END_POINT, "GET", null);

        if (err) return alert("Erro ao carregar máquinas");

        if (data && Array.isArray(data) && data.length > 0) {
            const machinesOptions = transformArrayIntoSelectOptions(data, "id", "name");

            if (machinesOptions && machineOptions?.length > 0) {
                setMachineOptions(machinesOptions);
            }
        }
    };

    const getResourcesAvailable = async () => {
        const { err, data } = await fetchRequest(RESOURCES_END_POINT, "GET", null);

        if (err) return alert("Erro ao carregar recursos");

        if (data && Array.isArray(data) && data.length > 0) {
            const resourcesOptions = transformArrayIntoSelectOptions(data, "id", "name");

            if (resourcesOptions && resourcesOptions?.length > 0) {
                setResourceOptions(resourcesOptions);
            }
        }
    };

    const getGlazeData = async (glazeId: string) => {
        const { data, err } = await fetchRequest(`${GLAZES_END_POINT}/${glazeId}`, "GET", null);

        if (err || !data) return alert("Erro ao carregar dados do esmalte");

        const glazeData = data as GlazePostBody;

        if (
            glazeData
            && glazeData.color
            && glazeData.unitValue
            && glazeData.resourceUsages?.length > 0
            && glazeData.machineUsages?.length > 0
        ) {
        reset({
            color: glazeData.color,
            unitValue: Number(glazeData.unitValue),
            resourceUsages: glazeData.resourceUsages.map(r => ({
                resourceId: Number(r.resourceId),
                quantity: Number(r.quantity),
            })),
            machineUsages: glazeData.machineUsages.map(m => ({
                machineId: Number(m.machineId),
                usageTime: Number(m.usageTime),
            })),
        });
        }
    };

    const onSubmit = async (formData: GlazeFormData) => {
        setIsLoading(true);
        const method = isEditMode ? "PUT" : "POST";
        const url = isEditMode ? `${GLAZES_END_POINT}/${id}` : GLAZES_END_POINT;
        const { err } = await fetchRequest(url, method, formData);
        if (err) {
            alert("Erro ao salvar esmalte");
        } else {
            alert("Esmalte salvo com sucesso!");
            navigate("/glazes");
        }
        setIsLoading(false);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-6 border rounded-md bg-white shadow-sm"
        >
            <div>
                <label className="block font-medium">Cor</label>
                <input
                    type="text"
                    {...register("color")}
                    className="input input-bordered w-full"
                />
                {errors.color && <p className="text-red-500 text-sm">{errors.color.message}</p>}
            </div>

            <div>
                <label className="block font-medium">Valor Unitário</label>
                <input
                    type="number"
                    step="any"
                    {...register("unitValue", { valueAsNumber: true })}
                    className="input input-bordered w-full"
                />
                {errors.unitValue && <p className="text-red-500 text-sm">{errors.unitValue.message}</p>}
            </div>

            <h2 className="text-xl font-semibold">Recursos utilizados</h2>

            {resourceFields.map((field, index) => (
                <div key={field.id} className="bg-gray-50 p-4 rounded-md border space-y-2">
                    <Controller
                        control={control}
                        name={`resourceUsages.${index}.resourceId`}
                        render={({ field }) => (
                            <CustomSelect
                                options={resourceOptions}
                                value={resourceOptions.find(opt => opt.value === field.value)}
                                onChange={opt => field.onChange(opt?.value)}
                            />
                        )}
                    />
                    <input
                        type="number"
                        step="any"
                        placeholder="Quantidade"
                        {...register(`resourceUsages.${index}.quantity`, { valueAsNumber: true })}
                        className="input input-bordered w-full"
                    />
                    <button
                        type="button"
                        onClick={() => removeResource(index)}
                        className="text-red-500 flex gap-1 items-center text-sm"
                    >
                        <Trash2 className="w-4 h-4" /> Remover recurso
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={() => appendResource({ resourceId: 0, quantity: 0 })}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm"
            >
                <Plus className="w-4 h-4" /> Adicionar Recurso
            </button>

            <h2 className="text-xl font-semibold mt-6">Máquinas utilizadas</h2>

            {machineFields.map((field, index) => (
                <div key={field.id} className="bg-gray-50 p-4 rounded-md border space-y-2">
                    <Controller
                        control={control}
                        name={`machineUsages.${index}.machineId`}
                        render={({ field }) => (
                            <CustomSelect
                                options={machineOptions}
                                value={machineOptions.find(opt => opt.value === field.value)}
                                onChange={opt => field.onChange(opt?.value)}
                            />
                        )}
                    />
                    <input
                        type="number"
                        step="any"
                        placeholder="Tempo de uso"
                        {...register(`machineUsages.${index}.usageTime`, { valueAsNumber: true })}
                        className="input input-bordered w-full"
                    />
                    <button
                        type="button"
                        onClick={() => removeMachine(index)}
                        className="text-red-500 flex gap-1 items-center text-sm"
                    >
                        <Trash2 className="w-4 h-4" /> Remover máquina
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={() => appendMachine({ machineId: 0, usageTime: 0 })}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm"
            >
                <Plus className="w-4 h-4" /> Adicionar Máquina
            </button>

            <div className="pt-6">
                <button
                    type="submit"
                    disabled={!isValid || isSubmitting || isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? "Salvando..." : isEditMode ? "Atualizar Esmalte" : "Criar Esmalte"}
                </button>
            </div>
        </form>
    );
}

export default GlazeForm;
