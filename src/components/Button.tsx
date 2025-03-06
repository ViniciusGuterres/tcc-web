import Icon from "./Icon";

type Position = "right" | "left";

type ButtonType = "submit" | "reset" | "button" | undefined;

type Icon = {
    position: Position,
    icon: string,
}

interface Props {
    className?: string,
    name: string,
    onClickFunc: () => void,
    icon?: Icon,
    type?: ButtonType,
    isDisabled?: boolean,
}

function Button({
    name,
    className,
    onClickFunc,
    icon,
    type,
    isDisabled = true,
}: Props) {
    let buttonClassName = 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow justify-center items-center flex gap-4';

    if (isDisabled) {
        buttonClassName = 'bg-white opacity-50 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow justify-center items-center flex gap-4 cursor-not-allowed';
    }

    const handleButtonClicked = (event: ButtonEvent): void => {
        event.preventDefault();

        if (!isDisabled) onClickFunc();
    }

    return (
        <>
            <button
                className={`${buttonClassName} ${className || ''}`}
                type={type}
                onClick={e => handleButtonClicked(e)}
            >
                {
                    icon?.position === 'left'
                        ?
                        <Icon iconClass={icon.icon} />
                        :
                        null
                }

                {name}

                {
                    icon?.position === 'right'
                        ?
                        <Icon iconClass={icon.icon} />
                        :
                        null
                }
            </button>
        </>
    );
}

export default Button;