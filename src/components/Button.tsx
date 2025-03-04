import Icon from "./Icon";

type Position = "right" | "left";

type Icon = {
    position: Position,
    icon: string,
}

interface Props {
    className?: string,
    name: string,
    onClickFunc: () => void,
    icon?: Icon,
}

function Button({
    name,
    className,
    onClickFunc,
    icon
}: Props) {
    return (
        <>
            <button
                className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow justify-center items-center flex gap-4 ${className || ''}`}
                onClick={onClickFunc}
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