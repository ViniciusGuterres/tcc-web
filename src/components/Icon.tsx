import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBox,
    faArrowRightFromBracket,
    faHouse,
    faUser,
    faChartPie,
    faCubesStacked,
    faPlus,
    faArrowLeft,
    faIndustry,
    faBolt,
    faLayerGroup
} from '@fortawesome/free-solid-svg-icons'

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

            case 'fa-plus':
                icon = faPlus;
                break;

            case 'fa-arrow-left':
                icon = faArrowLeft;
                break;
            
            case 'fa-industry':
                icon = faIndustry;
                break;

            case 'fa-bolt':
                icon = faBolt;
                break;
            
            case 'fa-layer-group':
                icon = faLayerGroup;
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