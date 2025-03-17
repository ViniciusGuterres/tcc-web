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
        label: 'Máquinas',
        link: 'machines',
        icon: 'fa-industry',
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