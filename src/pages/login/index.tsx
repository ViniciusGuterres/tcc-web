import React from "react"
import Input from "../../components/Input";
// import ''

function Login() {
    return (
        <section className="main-container">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Entre na sua conta
                        </h1>

                        <form className="space-y-4 md:space-y-6">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email: </label>

                                <Input 
                                    placeholder='email@gmail.com'
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                                
                                <Input 
                                    placeholder='******'
                                />
                            </div>

                            {/* Sign in button */}
                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Logar
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login