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
    faLayerGroup,
    faFire,
    faDownload,
    faTemperatureHigh,
    faBucket
} from '@fortawesome/free-solid-svg-icons'

interface Props {
    iconClass: string,
    className?: string,
    onClickFunc?: Function,
};

function Icon({
    iconClass,
    className,
    onClickFunc,
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

            case 'fa-fire':
                icon = faFire;
                break;

            case 'fa-download':
                icon = faDownload;
                break;

            case 'fa-temperature-high':
                icon = faTemperatureHigh;
                break;
            case 'fa-bucket':
                icon = faBucket;
                break;

            default:
                break;
        }

        return icon;
    }


    return (
        <FontAwesomeIcon
            icon={getIcon()}
            className={className}
            onClick={() => onClickFunc?.()}
        />
    );
}

export default Icon;