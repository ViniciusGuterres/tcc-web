import React, { useState } from "react"
import "./resources.css";

// Components
import Input from "../../components/Input";
import CustomSelect from "../../components/CustomSelect";
import Button from "../../components/Button";

// Globals
const CATEGORY_OPTIONS = [
    { value: "COMPONENT", label: "Componente" },
    { value: "ELECTRICITY", label: "Eletricidade" },
    { value: "GAS", label: "Gás" },
    { value: "RAW_MATERIAL", label: "Matéria-prima" },
    { value: "RETAIL", label: "Retalho" },
    { value: "SILICATE", label: "Silicato" },
    { value: "WATER", label: "Água" },
];

interface Option {
    value: string | number;
    label: string;
}

function CreateResource() {
    const [name, setName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Option | Option[] | null>(null);
    const [unityValue, setUnityValue] = useState('');

    function handleChangeName(evt: any) {

        setName(evt.target.value);
    }

    function handleChangeSelectedCategory(category: Option | Option[] | null) {
        setSelectedCategory(category);
    }

    function handleChangeUnityValue(evt: any) {
        setUnityValue(evt.target.value);
    }

    function handleCreateResource() {
        alert('Recurso criada');
        console.log('Resource created!!!')
    }

    return (
        <section className="main-container">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        {/* Header */}
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl header-h1">
                            Novo Recurso
                        </h1>

                        <form className="space-y-4 md:space-y-6">
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="resource_name"
                                    className="block mb-2 text-sm font-medium input-labels-color">
                                    Nome:
                                </label>

                                <Input
                                    onInputChanges={handleChangeName}
                                    value={name}
                                    placeholder='Ex: recurso'
                                    type="text"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label
                                    htmlFor="resource_category"
                                    className="block mb-2 text-sm font-medium input-labels-color"
                                >
                                    Categoria:
                                </label>

                                <CustomSelect
                                    options={CATEGORY_OPTIONS}
                                    value={selectedCategory}
                                    onChange={handleChangeSelectedCategory}
                                    isMulti={false}
                                    placeholder="Escolha uma categoria..."
                                />
                            </div>

                            {/* Unity value */}
                            <div>
                                <label
                                    htmlFor="resource_unity_value"
                                    className="block mb-2 text-sm font-medium input-labels-color"
                                >
                                    Valor unitário:
                                </label>

                                <Input
                                    onInputChanges={handleChangeUnityValue}
                                    placeholder='Ex: R$ 3.50'
                                    type="text"
                                    value={unityValue}
                                />
                            </div>

                            {/* <button
                                onClick={handleCreateResource}
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:bg-primary-700 dark:focus:ring-primary-800 input-labels-color"
                            >
                                Cadastrar
                            </button> */}

                            {/* Create button */}
                            <div className="action-button-container">
                                <Button 
                                    name='Cadastrar'
                                    onClickFunc={() => {}}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CreateResource;