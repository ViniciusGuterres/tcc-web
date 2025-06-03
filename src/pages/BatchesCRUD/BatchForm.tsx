import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import Button from "../../components/Button";
import CustomSelect from "../../components/CustomSelect";

import { z } from "zod";
// import { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

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
            machineId: z.number().min(1, "Máquina obrigatória"),
            usageTime: z.number().positive("Deve ser > 0"),
        })
    ).min(1, "Adicione pelo menos uma máquina"),
});

const BATCH_END_POINT = "batches";
const resourceOptions = [{ value: 5, label: "test" }];
const machineOptions = [{ value: 5, label: "test" }];

type BatchFormData = z.infer<typeof batchSchema>;

function BatchForm({ crudMode }) {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<BatchFormData>({
        resolver: zodResolver(batchSchema),
        defaultValues: {
            resourceUsages: [{ resourceId: 0, initialQuantity: 0, umidity: 0, addedQuantity: 0 }],
            machineUsages: [{ machineId: 0, usageTime: 0 }],
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

    const onSubmit = async (data: BatchFormData) => {
        const { err } = await fetchRequest(BATCH_END_POINT, "POST", data);
        if (err) {
            alert("Erro ao criar o lote.");
            return;
        }
        alert("Lote criado com sucesso!");
        navigate("/batches");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 border rounded-md bg-white shadow-sm">
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
                                {...register(`resourceUsages.${index}.initialQuantity`)}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Umidade</label>
                            <input
                                type="number"
                                step="any"
                                {...register(`resourceUsages.${index}.umidity`)}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Quantidade Adicionada</label>
                            <input
                                type="number"
                                {...register(`resourceUsages.${index}.addedQuantity`)}
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
                            {...register(`machineUsages.${index}.usageTime`)}
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
                <Button
                    name={isSubmitting ? "Enviando..." : "Salvar"}
                    type="submit"
                    isDisabled={isSubmitting}
                />
            </div>
        </form>
    );
}

export default BatchForm;
