import { useForm, SubmitHandler, Path, DefaultValues, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { useEffect } from "react";

// Components
import CustomSelect from "./CustomSelect";

interface FormProps<T> {
    fields: FieldType[];
    schema: ZodType<T>;
    submitFunc?: SubmitHandler<any>;
    submitButtonLabel?: string,
    initialData?: Partial<T>,
    isLoading?: boolean,
}

const Form = <T extends Record<string, any>>({
    fields,
    schema,
    submitFunc,
    submitButtonLabel,
    initialData,
    isLoading,
}: FormProps<T>) => {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting, isValid, },
    } = useForm<T>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: initialData as DefaultValues<T> || {} as DefaultValues<T>,
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData as DefaultValues<T>);
        }
    }, [initialData, reset]);

    const handleInvalidSubmit = err => {
        console.log('Error to submit form obj: ', err);
        alert('Um erro inesperado ocorreu. Por favor, tente novamente!')
    }

    const submitButtonDisabled = !isValid || isSubmitting || isLoading;

    return (
        <form
            className="p-4 space-y-4 border rounded-md"
            onSubmit={(e) => {
                e.preventDefault();

                handleSubmit(data => {
                    if (submitFunc && typeof submitFunc === 'function') {
                        submitFunc(data);
                    }
                }, handleInvalidSubmit)(e);
            }}
        >
            {fields.map((field) => (
                <div key={field.name}>
                    <label className="block">{field.label}:</label>

                    {field.options ? (
                        // If options exist, render CustomSelect
                        <Controller
                            control={control}
                            name={field.name as Path<T>}
                            rules={{ required: "Esse campo é obrigatorio" }}
                            render={({ field: { onChange, value } }) => (
                                <CustomSelect
                                    options={field.options || []}
                                    value={field.options?.find((opt) => opt.value === value) || null}
                                    onChange={(selectedOption) => onChange(selectedOption?.value)}
                                />
                            )}
                        />
                    ) : (
                        // Otherwise, render normal input
                        <input
                            type={field.type || "text"}
                            {...register(field.name as Path<T>)}
                            className="border p-2 w-full"
                            placeholder={field.placeholder || ""}
                        />
                    )}

                    {errors[field.name as keyof T] && (
                        <p className="text-red-500">{errors[field.name as keyof T]?.message?.toString()}</p>
                    )}
                </div>
            ))}

            <div className="flex justify-center">
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

};

export default Form;