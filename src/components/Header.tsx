function Header() {
    return (
        <header className="bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Empresa</span>
                        <img className="h-8 w-auto" src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="" />
                    </a>
                </div>
                
                {/* <div className="flex lg:hidden">
                    <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                        <span className="sr-only">Abrir menu</span>
                    </button>
                </div> */}

                <div className="hidden lg:flex lg:gap-x-12">
                    <a href="#" className="text-sm/6 font-semibold text-gray-900">Produção</a>
                    <a href="#" className="text-sm/6 font-semibold text-gray-900">Recursos</a>
                    <a href="#" className="text-sm/6 font-semibold text-gray-900">Relatórios</a>
                    <a href="#" className="text-sm/6 font-semibold text-gray-900">Resumo</a>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a href="#" className="text-sm/6 font-semibold text-gray-900">Log out <span aria-hidden="true">&rarr;</span></a>
                </div>
            </nav>
        </header>
    );
}

export default Header;