import React, { useState } from "react"
import "./resources.css";

// Components
import Input from "../../components/Input";
import CustomSelect from "../../components/CustomSelect";
import Button from "../../components/Button";
import fetchRequest from "../../utils/fetchRequest";

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

interface Props {
    onChangeCrudMode: (newCrudMode: ResourceCrudModeTypesAllowed) => void
};

// Globals
const RESOURCE_END_POINT = 'resources';

function CreateResource({ onChangeCrudMode }: Props) {
    const [name, setName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
    const [unityValue, setUnityValue] = useState('');

    function handleChangeName(evt: any) {

        setName(evt.target.value);
    }

    function handleChangeSelectedCategory(category: Option | null) {
        setSelectedCategory(category);
    }

    function handleChangeUnityValue(evt: any) {
        setUnityValue(evt.target.value);
    }

    async function handleCreateResource() {
        const bodyData = {
            name,
            category: selectedCategory?.value,
            unitValue: unityValue,
        };

        const { data, err } = await fetchRequest(RESOURCE_END_POINT, 'POST', bodyData);

        if (err || !data) {
            console.log(err || 'Missing req.data');

            alert(`Erro ao cadastrar recurso`);
            return;
        }
    }

    function validateFields() {
        return Boolean(name) && Boolean(selectedCategory) && Boolean(unityValue);
    }

    return (
        <section className="main-container">
            {/* Go back button */}
            <Button
                name="Voltar"
                onClickFunc={() => onChangeCrudMode('list')}
                isDisabled={false}
                icon={{
                    position: 'left',
                    icon: 'fa-arrow-left'
                }}
            />

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

                            {/* Create button */}
                            <div className="action-button-container">
                                <Button
                                    name='Cadastrar'
                                    onClickFunc={handleCreateResource}
                                    isDisabled={!validateFields()}
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