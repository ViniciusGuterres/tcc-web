import React from "react";

interface Props {
    type?: string,
    placeholder?: string,
    value: string,
    onInputChanges(evt: any): void,
}

function Input({ 
    placeholder,
    type,
    value,
    onInputChanges,
}: Props) {
    return (
        <div>
            <input
                type={type || "text"}
                value={value}
                id="first_name"
                className="bg-gray-50 rounded-lg shadow dark: text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={placeholder || ''}
                onChange={onInputChanges}
                required
            />
        </div>
    );
}

export default Input;