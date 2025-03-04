import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faArrowRightFromBracket, faHouse, faUser } from '@fortawesome/free-solid-svg-icons'

interface Props {
    iconClass: string,
    className?: string,
};

function Icon({
    iconClass,
    className,
}: Props) {
    const getIcon = () => {
        let icon = faBox;

        switch (iconClass) {
            case 'fa-house':
                icon = faHouse;
                break;

            case 'fa-user':
                icon = faUser;
                break;

            case 'fa-logout':
                icon = faArrowRightFromBracket;
                break;

            default:
                break; 
        }
        
        return icon;
    }


    return <FontAwesomeIcon
        icon={getIcon()}
        className={className}
    />;
}

export default Icon;