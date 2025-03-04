import React from "react";

// Components
import Header from "./Header";
import SidebarMenu from "./SidebarMenu";

const menuLinks = [
    {
        label: 'Home',
        link: 'resources',
        icon: 'fa-house',
    },
    {
        label: 'Kanban',
        link: 'Kanban',
        icon: 'fa-home',
    },
    {
        label: 'Inbox',
        link: 'Inbox',
        icon: 'fa-home',
    },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <Header />

            <SidebarMenu 
                links={menuLinks}
            />

            <main className="p-4 sm:ml-64">
                {children}
            </main>
        </div>
    );
};

export default Layout;
