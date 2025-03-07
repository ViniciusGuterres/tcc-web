import { Link } from "react-router-dom";
import Icon from "./Icon";

type LinkType = {
    label: string,
    link: string,
    icon: string,
};

interface Props {
    links: LinkType[],
};

function SidebarMenu({ links }: Props) {
    const buildMenuLinks = () => {
        const linksListItem = links.map(({ label, link, icon }) => {
            return (
                <li key={`menu_link_${label}_${Date.now()}`}>
                    <Link
                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        to={link}
                    >
                        <Icon 
                            iconClass={icon}
                        />

                        <span className="ms-3">
                            {label}
                        </span>
                    </Link >
                </li >
            );
        });

        return (
            <ul className="space-y-2 font-medium">
                {linksListItem}
            </ul>
        );
    }

    return (
        <>

            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <span className="flex items-center ps-2.5 mb-5">
                        {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 me-3 sm:h-7" alt="Flowbite Logo" /> */}
                        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Nome da empresa</span>
                    </span>

                    {/* Menu links */}
                    {
                        links?.length > 0
                            ?
                            buildMenuLinks()
                            :
                            null
                    }

                </div>
            </aside>
        </>
    );
}

export default SidebarMenu;