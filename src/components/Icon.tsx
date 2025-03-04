import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faArrowRightFromBracket, faHouse, faUser, faChartPie, faCubesStacked } from '@fortawesome/free-solid-svg-icons'

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

            case 'fa-chart-pie':
                icon = faChartPie;
                break;
                
            case 'fa-cubes-stacked':
                icon = faCubesStacked;
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