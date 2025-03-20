import { useForm, SubmitHandler, Path, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import Button from "./Button";
import { useEffect } from "react";

interface FormProps<T> {
    fields: FieldType[];
    schema: ZodType<T>;
    submitFunc?: SubmitHandler<any>;
    submitButtonLabel?: string,
    initialData?: Partial<T>,
}

const Form = <T extends Record<string, any>>({
    fields,
    schema,
    submitFunc,
    submitButtonLabel,
    initialData,
}: FormProps<T>) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<T>({
        resolver: zodResolver(schema),
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

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();

                handleSubmit(data => {
                    if (submitFunc && typeof submitFunc === 'function') {
                        submitFunc(data);
                    }
                }, handleInvalidSubmit)(e);
            }}
            className="p-4 space-y-4 border rounded-md"
        >
            {fields.map((field) => (
                <div key={field.name}>
                    <label className="block">{field.label}:</label>

                    <input
                        type={field.type || "text"}
                        {...register(field.name as Path<T>)}
                        className="border p-2 w-full"
                        placeholder={field.placeholder || ''}
                    />

                    {errors[field.name as keyof T] && (
                        <p className="text-red-500">
                            {errors[field.name as keyof T]?.message?.toString()}
                        </p>
                    )}
                </div>
            ))}
            {/* 
            <Button
                onClickFunc={handleSubmit(onSubmitt)}
                name={isSubmitting ? "Processando..." : (submitButtonLabel || 'Enviar')}
                type="submit"
                isDisabled={isSubmitting}
            /> */}

            <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <button
                    // onClick={}
                    type="submit"
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow justify-center items-center flex gap-4"
                >
                    {submitButtonLabel}
                </button>
            </div>
        </form>
    );
};

export default Form;