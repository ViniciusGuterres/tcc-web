import { Outlet } from "react-router-dom";
import React from "react";

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
        label: 'Bateladas',
        link: 'batches',
        icon: 'fa-bolt',
    },
    {
        label: 'Máquinas',
        link: 'machines',
        icon: 'fa-industry',
    },
    {
        label: 'Linha de Produto',
        link: 'productLines',
        icon: 'fa-layer-group',
    },
    {
        label: 'Tipo de Produto',
        link: 'productTypes',
        icon: 'fa-layer-group',
    },
    {
        label: 'Produto',
        link: 'products',
        icon: 'fa-layer-group',
    },
    {
        label: 'Forno',
        link: 'kilns',
        icon: 'fa-fire',
    },
    {
        label: 'Glasuras',
        link: 'glazes',
        icon: 'fa-bolt',
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