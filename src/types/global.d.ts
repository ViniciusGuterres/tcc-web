declare global {
    interface Settings {
        server: {
            host: string,
            port: string
        }
    }

    type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

    type ButtonEvent = React.MouseEvent<HTMLButtonElement>;

    interface Resource {
        category: string,
        currentQuantity: number,
        currentQuantityPrice: number,
        id: number,
        name: string,
    };

    type CrudModesAllowed ="list" | "create" | "edit";

    type ResourceCrudModeTypesAllowed = "list" | "create" | "edit";
    type MachinesCrudModeTypesAllowed = "list" | "create" | "edit";

    interface Machine {
        id: string,
        name: string,
        power: number,
        createdAt: string,
        updatedAt: string,
    }


    // Form component types
    type FieldType = {
        name: string;
        label: string;
        placeholder?: string;
        type?: "text" | "email" | "number" | "password";
    };
};

export {};