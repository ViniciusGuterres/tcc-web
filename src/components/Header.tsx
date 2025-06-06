import { Link } from "react-router-dom";
import Icon from "./Icon";
import removeBrowserCookie from "../utils/removeBrowserCookie";

function Header() {
    const handleLogout = () => {
        removeBrowserCookie("user_token");
        window.location.href = 'login';
    }

    return (
        <header className="bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Empresa</span>
                        <img className="h-8 w-auto" src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="" />
                    </a>
                </div>

                {/* <div className="hidden lg:flex lg:gap-x-12">
                    <a href="#" className="text-sm/6 font-semibold text-gray-900">Produção</a>
                    <a href="#" className="text-sm/6 font-semibold text-gray-900">Recursos</a>
                    <a href="#" className="text-sm/6 font-semibold text-gray-900">Relatórios</a>
                    <a href="#" className="text-sm/6 font-semibold text-gray-900">Resumo</a>
                </div> */}

                {/* Log out */}
                <div
                    onClick={handleLogout}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        cursor: "pointer",
                    }}
                >
                    <span className="text-sm/6 font-semibold text-gray-900">
                        Log out
                    </span>

                    <Icon
                        iconClass="fa-logout"
                        className="text-sm/6 font-semibold text-gray-900"
                    />
                </div>
            </nav>
        </header>
    );
}

export default Header;