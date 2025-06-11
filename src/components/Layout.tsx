import { Outlet } from "react-router-dom";

// Components
import Header from "./Header";
import SidebarMenu from "./SidebarMenu";

const menuLinks = [
    {
        label: 'Home',
        link: 'home',
        icon: 'fa-chart-pie',
    },
    {
        label: 'Recursos',
        link: 'resources',
        icon: 'fa-cubes-stacked',
    },
    {
        label: 'Máquinas',
        link: 'machines',
        icon: 'fa-industry',
    },
    {
        label: 'Bateladas',
        link: 'batches',
        icon: 'fa-bucket',
    },
    {
        label: 'Glasuras',
        link: 'glazes',
        icon: 'fa-bolt',
    },
    {
        label: 'Tipo de Produto',
        link: 'productTypes',
        icon: 'fa-layer-group',
    },
    {
        label: 'Linha de Produto',
        link: 'productLines',
        icon: 'fa-layer-group',
    },
    {
        label: 'Produtos',
        link: 'products',
        icon: 'fa-layer-group',
    },
    {
        label: 'Fornos',
        link: 'kilns',
        icon: 'fa-fire',
    },
    {
        label: 'Estufas',
        link: 'dryingRooms',
        icon: 'fa-temperature-high',
    },
];

function Layout() {
    return (
        <div>
            <Header />

            <SidebarMenu
                links={menuLinks}
            />

            <main className="p-4 sm:ml-64">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;