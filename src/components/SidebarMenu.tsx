import { Link } from "react-router-dom";

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
                        <span className="ms-3">
                            {label}
                        </span>
                    </Link >
                    
                    {/* <a href={link} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                        </svg>
            
                    </a> */}
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