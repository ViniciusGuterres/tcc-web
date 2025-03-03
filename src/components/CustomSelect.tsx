import React from "react";
import Select from "react-select";

interface Option {
    value: string | number;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
    value?: Option | Option[] | null;
    onChange: (selectedOption: Option | Option[] | null) => void;
    placeholder?: string;
    isMulti?: boolean;
    isDisabled?: boolean;
    isSearchable?: boolean;
    className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    isMulti = false,
    isDisabled = false,
    isSearchable = true,
    className = "",
}) => {
    const customStyles = {
        control: (base: any) => ({
            ...base,
            borderRadius: "8px",
            border: "1px solid #ddd",
            boxShadow: "none",
            "&:hover": { borderColor: "#aaa" },
        }),
        menu: (base: any) => ({
            ...base,
            zIndex: 9999, // Ensures dropdown is above other elements
        }),
    };

    return (
        <Select
            className={className}
            styles={customStyles}
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            isMulti={false}
            isDisabled={isDisabled}
            isSearchable={isSearchable}
        />
    );
};

export default CustomSelect;
