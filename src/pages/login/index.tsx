import React from "react"
import './login.css';

// Components
import Input from "../../components/Input";

function Login() {
    return (
        <section className="main-container">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        {/* Header */}
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl header-h1">
                            Entre na sua conta
                        </h1>

                        <form className="space-y-4 md:space-y-6">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium input-labels-color">
                                    Email:
                                </label>

                                <Input
                                    placeholder='email@gmail.com'
                                    type="email"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium input-labels-color"
                                >
                                    Senha:
                                </label>

                                <Input
                                    placeholder='******'
                                    type="password"
                                />
                            </div>

                            {/* Sign in button */}
                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:hover:bg-primary-700 dark:focus:ring-primary-800 input-labels-color"
                            >
                                Entrar
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login