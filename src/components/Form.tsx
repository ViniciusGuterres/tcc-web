import { useForm, SubmitHandler, Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import Button from "./Button";

interface FormProps<T> {
    fields: FieldType[];
    schema: ZodType<T>;
    onSubmit: SubmitHandler<any>;
    submitButtonLabel?: string,
}

const Form = <T extends Record<string, any>>({
    fields,
    schema,
    onSubmit,
    submitButtonLabel,
}: FormProps<T>) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<T>({
        resolver: zodResolver(schema),
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4 border rounded-md">
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

            <Button
                name={isSubmitting ? "Processando..." : (submitButtonLabel || 'Enviar')}
                type="submit"
                isDisabled={isSubmitting}
            />
        </form>
    );
};

export default Form;