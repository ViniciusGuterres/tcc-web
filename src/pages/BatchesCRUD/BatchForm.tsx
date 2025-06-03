import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import fetchRequest from "../../utils/fetchRequest";
import Button from "../../components/Button";
import CustomSelect from "../../components/CustomSelect";

import { z } from "zod";
import { useEffect } from "react";

export const batchSchema = z.object({
    resourceUsages: z.array(
        z.object({
            resourceId: z
                .number({ invalid_type_error: "Selecione um recurso válido" })
                .min(1, "Recurso obrigatório"),
            initialQuantity: z
                .number({ invalid_type_error: "Informe uma quantidade inicial" })
                .nonnegative("Deve ser maior ou igual a zero"),
            umidity: z
                .number({ invalid_type_error: "Informe a umidade" })
                .min(0, "Mínimo 0")
                .max(1, "Máximo 1"),
            addedQuantity: z
                .number({ invalid_type_error: "Informe a quantidade adicionada" })
                .nonnegative("Deve ser maior ou igual a zero"),
        })
    ).min(1, "Adicione pelo menos um recurso"),

    machineUsages: z.array(
        z.object({
            machineId: z
                .number({ invalid_type_error: "Selecione uma máquina válida" })
                .min(1, "Máquina obrigatória"),
            usageTime: z
                .number({ invalid_type_error: "Informe o tempo de uso" })
                .positive("O tempo deve ser maior que zero"),
        })
    ).min(1, "Adicione pelo menos uma máquina"),
});


const BATCH_END_POINT = "batches";
const resourceOptions = [{ value: 5, label: 'test' }]; 
const machineOptions = [{ value: 5, label: 'test' }]; 

type BatchFormData = z.infer<typeof batchSchema>;

function BatchForm({ crudMode }) {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting }
    } = useForm<BatchFormData>({
        resolver: zodResolver(batchSchema),
        defaultValues: {
            resourceUsages: [{ resourceId: 0, initialQuantity: 0, umidity: 0, addedQuantity: 0 }],
            machineUsages: [{ machineId: 0, usageTime: 0 }],
        },
    });

    useEffect(() => {
        
    }, []);

    const {
        fields: resourceFields,
        append: appendResource,
        remove: removeResource
    } = useFieldArray({ control, name: "resourceUsages" });

    const {
        fields: machineFields,
        append: appendMachine,
        remove: removeMachine
    } = useFieldArray({ control, name: "machineUsages" });

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 border rounded-md">

            <h2 className="text-lg font-bold">Recursos utilizados</h2>
            {resourceFields.map((field, index) => (
                <div key={field.id} className="space-y-2 border p-3 rounded-md bg-gray-50">
                    <Controller
                        control={control}
                        name={`resourceUsages.${index}.resourceId`}
                        render={({ field }) => (
                            <CustomSelect
                                options={resourceOptions}
                                value={resourceOptions.find((opt) => opt?.value === field?.value)}
                                onChange={(option) => field.onChange(option?.value)}
                            />
                        )}
                    />
                    <input {...register(`resourceUsages.${index}.initialQuantity`)} type="number" placeholder="Quantidade Inicial" />
                    <input {...register(`resourceUsages.${index}.umidity`)} type="number" step="any" placeholder="Umidade" />
                    <input {...register(`resourceUsages.${index}.addedQuantity`)} type="number" placeholder="Quantidade Adicionada" />
                    <button type="button" onClick={() => removeResource(index)}>Remover recurso</button>
                </div>
            ))}
            <button type="button" onClick={() => appendResource({ resourceId: 0, initialQuantity: 0, umidity: 0, addedQuantity: 0 })}>
                Adicionar Recurso
            </button>

            <h2 className="text-lg font-bold mt-4">Máquinas utilizadas</h2>
            {machineFields.map((field, index) => (
                <div key={field.id} className="space-y-2 border p-3 rounded-md bg-gray-50">
                    <Controller
                        control={control}
                        name={`machineUsages.${index}.machineId`}
                        render={({ field }) => (
                            <CustomSelect
                                options={machineOptions}
                                value={machineOptions.find((opt) => opt.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                            />
                        )}
                    />
                    <input {...register(`machineUsages.${index}.usageTime`)} type="number" step="any" placeholder="Tempo de uso" />
                    <button type="button" onClick={() => removeMachine(index)}>Remover máquina</button>
                </div>
            ))}
            <button type="button" onClick={() => appendMachine({ machineId: 0, usageTime: 0 })}>
                Adicionar Máquina
            </button>

            <div className="pt-4">
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
