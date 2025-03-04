import React from "react"
// import './ResourcesCRUD.css';

// Components
import Input from "../../components/Input";
import CreateResource from "./CreateResource";
import ListResources from "./ListResources";

function ResourcesCRUD() {
    return (
        <div>
            {/* <CreateResource /> */}
            <ListResources />
        </div>
    );
}

export default ResourcesCRUD