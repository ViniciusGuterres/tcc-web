import React, { useState } from "react"
// import './ResourcesCRUD.css';

// Components
import CreateResource from "./CreateResource";
import ListResources from "./ListResources";

type CrudModeTypesAllowed = "list" | "create" | "edit";

function ResourcesCRUD() {
    const [crudMode, setCrudMode] = useState<CrudModeTypesAllowed>('list');

    const handleChangeCrudMode = (newCrudMode: CrudModeTypesAllowed) => {
        setCrudMode(newCrudMode);
    }

    const buildCrud = () => {
        switch(crudMode) {
            case 'list':
                return <ListResources onChangeCrudMode={handleChangeCrudMode} />;
            
            case 'create':
                return <CreateResource />;
                
            default:
                    return <ListResources onChangeCrudMode={handleChangeCrudMode} />;
        }
    }

    return (
        buildCrud()
    );
}

export default ResourcesCRUD;