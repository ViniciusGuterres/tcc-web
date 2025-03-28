declare global {
    type ID = string | number;
    interface Settings {
        server: {
            host: string,
            port: string
        }
    }

    type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

    type ButtonEvent = React.MouseEvent<HTMLButtonElement>;

    type TransactionTypes = 'OUTGOING' | 'INCOMING';

    interface Resource {
        category: string,
        currentQuantity: number,
        currentQuantityPrice: number,
        id: ID,
        name: string,
    };

    interface ResourceTransaction {
        id: ID,
        createAt: string,
        updatedAt: string,
        type: TransactionTypes,
        quantity: number,
        resourceName: string,
        batchId: ID | null,
        cost: number,
    }

    type CrudModesAllowed = "list" | "create" | "edit";

    type OnClickEvent = React.MouseEvent<Element, MouseEvent>;

    interface Machine {
        id: string,
        name: string,
        power: number,
        createdAt: string,
        updatedAt: string,
    }

    interface ProductLine {
        id: ID,
        createdAt: string,
        updatedAt: string,
        name: string,
        productQuantity: number,
    }

    interface ProductType {
        id: ID,
        createdAt: string,
        updatedAt: string,
        name: string,
        productQuantity: number,
    }

    interface Product {
        id: ID,
        createdAt: string,
        updatedAt: string,
        name: string,
        price: number,
        height: number,
        length: number,
        width: number,
        typeId: ID,
        lineId: ID,
        productStock: number,
    }

    interface Batch {
        id: ID,
        createdAt: string,
        updatedAt: string,
        batchFinalCost: number,
    }

    interface Option {
        value: string | number;
        label: string;
    }

    // Form component types
    type FieldType = {
        name: string;
        label: string;
        placeholder?: string;
        type?: "text" | "email" | "number" | "password" | "float";
        useFloat?: boolean,
        options?: Option[];
    };
};

export { };