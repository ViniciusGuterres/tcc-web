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

    type ResourceCrudModeTypesAllowed = "list" | "create" | "edit";
    type MachinesCrudModeTypesAllowed = "list" | "create" | "edit";

    interface Machine {
        id: string,
        name: string,
        power: number,
        createdAt: string,
        updatedAt: string,
    }
};

export {};