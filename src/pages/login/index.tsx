import React, { useState } from "react"
import './login.css';

// Libs
import fetchRequest from "../../utils/fetchRequest";

// Components
import Input from "../../components/Input";
import Button from "../../components/Button";

// Globals
const LOGIN_END_POINT = 'auth/login';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChanged = (evt: ChangeEvent) => {
        setEmail(evt.target.value);
    }

    const handlePasswordChanged = (evt: ChangeEvent) => {
        setPassword(evt.target.value);
    }

    const handleLoginButtonClicked = async () => {
        const bodyData = {
            "email": email,
            "password": password
        };

        const fetchOptions = {
            method: "POST",
            body: JSON.stringify(bodyData),
            headers: {
                "Content-Type": "application/json",
            },
        };

        const req = await fetchRequest(LOGIN_END_POINT, fetchOptions);
        console.log("🚀 ~ handleLoginButtonClicked ~ req:", req)

        return;
    }

    const isLoginButtonDisabled = !email || !password;

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
                                    onInputChanges={handleEmailChanged}
                                    placeholder='email@gmail.com'
                                    type="email"
                                    value={email}
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
                                    onInputChanges={handlePasswordChanged}
                                    placeholder='******'
                                    type="password"
                                    value={password}
                                />
                            </div>

                            {/* Sign in button */}
                            <div className="action-button-container">
                                <Button
                                    name="Entrar"
                                    // type="submit"
                                    isDisabled={isLoginButtonDisabled}
                                    onClickFunc={handleLoginButtonClicked}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login