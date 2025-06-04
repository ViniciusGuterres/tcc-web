import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import CustomSelect from "../../components/CustomSelect";

import { z } from "zod";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import endPoints from "../../constants/endpoints";
import transformArrayIntoSelectOptions from "../../utils/transformArrayIntoSelectOptions";

export const batchSchema = z.object({
    resourceUsages: z.array(
        z.object({
            resourceId: z.number().min(1, "Recurso obrigatório"),
            initialQuantity: z.number().nonnegative("Deve ser ≥ 0"),
            umidity: z.number().min(0).max(1),
            addedQuantity: z.number().nonnegative("Deve ser ≥ 0"),
        })
    ).min(1, "Adicione pelo menos um recurso"),

    machineUsages: z.array(
        z.object({
            machineId: z.number().min(1, "Máquina obrigatóri a"),
            usageTime: z.number().positive("Deve ser > 0"),
        })
    ).min(1, "Adicione pelo menos uma máquina"),
});

// endpoints
const BATCHES_END_POINT = endPoints.batchesEndPoint;
const MACHINES_END_POINT = endPoints.machinesEndPoint;
const RESOURCES_END_POINT = endPoints.resourcesEndPoint;

type BatchFormData = z.infer<typeof batchSchema>;

function BatchForm({ crudMode }) {
    const [resourceOptions, setResourceOptions] = useState<Array<Option>>([]);
    const [machineOptions, setMachineOptions] = useState<Array<Option>>([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    // Getting select options
    useEffect(() => {
        getMachinesAvailable();
        getResourcesAvailable();
        setIsLoading(false);
    }, []);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting, isValid, },
    } = useForm<BatchFormData>({
        resolver: zodResolver(batchSchema),
        defaultValues: {
            resourceUsages: [{ resourceId: 0, initialQuantity: 0, umidity: 0, addedQuantity: 0 }],
            machineUsages: [{ machineId: 0, usageTime: 0 }],
        },
    });

    const submitButtonDisabled = !isValid || isSubmitting || isLoading;
    const submitButtonLabel = 'Criar Batelada';

    const { fields: resourceFields, append: appendResource, remove: removeResource } = useFieldArray({
        control,
        name: "resourceUsages",
    });

    const { fields: machineFields, append: appendMachine, remove: removeMachine } = useFieldArray({
        control,
        name: "machineUsages",
    });

    const onSubmit = async (data: BatchFormData) => {
        setIsLoading(true);

        const { err } = await fetchRequest(BATCHES_END_POINT, "POST", data);
        if (err) {
            alert("Erro ao criar batelada.");
            return;
        }

        setIsLoading(false);

        alert("Batelada criada com sucesso!");
        navigate("/batches");
    };

    const handleInvalidSubmit = err => {
        console.log('Error to submit form obj: ', err);
        alert('Um erro inesperado ocorreu. Por favor, tente novamente!')
    }


    const getMachinesAvailable = async () => {
        const { err, data } = await fetchRequest(MACHINES_END_POINT, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar opções de máquinas');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
            const machineOptions = transformArrayIntoSelectOptions(data, 'id', 'name');

            if (machineOptions && machineOptions?.length > 0) {
                setMachineOptions(machineOptions);
            }
        }
    }

    const getResourcesAvailable = async () => {
        const { err, data } = await fetchRequest(RESOURCES_END_POINT, 'GET', null);

        if (err) {
            console.log(err || 'Erro ao pegar opções de recursos');

            alert(`Erro ao pegar dados`);
            return;
        }

        if (data && Array.isArray(data) && data.length > 0) {
            const resourcesOptions = transformArrayIntoSelectOptions(data, 'id', 'name');

            if (resourcesOptions && resourcesOptions?.length > 0) {
                setResourceOptions(resourcesOptions);
            }
        }
    }

    return (
        <form
            className="space-y-6 p-6 border rounded-md bg-white shadow-sm"
            onSubmit={(e) => {
                console.log("🚀 ~ BatchForm ~ e:", e)

                e.preventDefault();

                handleSubmit(data => {
                    if (onSubmit && typeof onSubmit === 'function') {
                        onSubmit(data);
                    }
                }, handleInvalidSubmit)(e);
            }}
        >
            <h2 className="text-xl font-semibold">Recursos utilizados</h2>

            {resourceFields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-md bg-gray-50 space-y-4">
                    <Controller
                        control={control}
                        name={`resourceUsages.${index}.resourceId`}
                        render={({ field }) => (
                            <CustomSelect
                                options={resourceOptions}
                                value={resourceOptions.find(opt => opt?.value === field?.value)}
                                onChange={option => field.onChange(option?.value)}
                            />
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Quantidade Inicial</label>
                            <input
                                type="number"
                                {...register(`resourceUsages.${index}.initialQuantity`, { valueAsNumber: true })}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Umidade</label>
                            <input
                                type="number"
                                step="any"
                                {...register(`resourceUsages.${index}.umidity`, { valueAsNumber: true })}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Quantidade Adicionada</label>
                            <input
                                type="number"
                                {...register(`resourceUsages.${index}.addedQuantity`, { valueAsNumber: true })}
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeResource(index)}
                        className="flex items-center text-red-600 hover:text-red-800 text-sm gap-1"
                    >
                        <Trash2 className="w-4 h-4" /> Remover recurso
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={() => appendResource({ resourceId: 0, initialQuantity: 0, umidity: 0, addedQuantity: 0 })}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
                <Plus className="w-4 h-4" /> Adicionar Recurso
            </button>

            <h2 className="text-xl font-semibold mt-6">Máquinas utilizadas</h2>

            {machineFields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-md bg-gray-50 space-y-4">
                    <Controller
                        control={control}
                        name={`machineUsages.${index}.machineId`}
                        render={({ field }) => (
                            <CustomSelect
                                options={machineOptions}
                                value={machineOptions.find(opt => opt.value === field.value)}
                                onChange={option => field.onChange(option?.value)}
                            />
                        )}
                    />
                    <div>
                        <label className="block text-sm font-medium">Tempo de uso</label>
                        <input
                            type="number"
                            step="any"
                            {...register(`machineUsages.${index}.usageTime`, { valueAsNumber: true })}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => removeMachine(index)}
                        className="flex items-center text-red-600 hover:text-red-800 text-sm gap-1"
                    >
                        <Trash2 className="w-4 h-4" /> Remover máquina
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={() => appendMachine({ machineId: 0, usageTime: 0 })}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
                <Plus className="w-4 h-4" /> Adicionar Máquina
            </button>

            <div className="pt-6">
                <button
                    type="submit"
                    disabled={submitButtonDisabled}
                    className={`bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex gap-4 ${submitButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >   
                    {isSubmitting ? "Processando..." : submitButtonLabel}
                </button>
            </div>
        </form>
    );
}

export default BatchForm;
