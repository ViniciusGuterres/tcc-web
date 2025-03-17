import React, { useState } from "react"

// Components
import CreateMachine from "./CreateMachine";
import ListMachines from "./ListMachines";

type CrudModeTypesAllowed = "list" | "create" | "edit";

function MachinesCRUD() {
    const [crudMode, setCrudMode] = useState<CrudModeTypesAllowed>('list');

    const handleChangeCrudMode = (newCrudMode: CrudModeTypesAllowed) => {
        setCrudMode(newCrudMode);
    }

    const buildCrud = () => {
        switch(crudMode) {
            case 'list':
                return <ListMachines onChangeCrudMode={handleChangeCrudMode} />;
            
            case 'create':
                return <CreateMachine onChangeCrudMode={handleChangeCrudMode} />;
                
            default:
                    return <ListMachines onChangeCrudMode={handleChangeCrudMode} />;
        }
    }

    return (
        buildCrud()
    );
}

export default MachinesCRUD;