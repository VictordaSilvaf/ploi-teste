/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login } from "../../services/auth";
import MessageError from "../../components/MessageError";
import logoEscura from '../../assets/images/logo-claro.png'
const Login: FC = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const [showMessageError, setShowMessageError] = useState<boolean>(false);

    const [showPassword, setShowPassword] = useState(false); // Estado para o campo de senha
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const { loginContext } = useAuth();

    const handleEmail = (e: any) => {
        setEmail(e.target.value);
        setShowMessageError(false);
    }

    const handlePassword = (e: any) => {
        setPassword(e.target.value);
        setShowMessageError(false);
    }

    const handleSubmitFormLogin = async (e: FormEvent) => {
        e.preventDefault();

        setLoadingButton(true);

        try {
            const response = await login(email, password);
            loginContext({ user: response.user, token: response.token })

            console.log(response);

        } catch (error) {
            console.log(error);
            setShowMessageError(true);

        } finally {
            setLoadingButton(false);
        }

    }


    return (
        <>
            <div className="flex flex-1 h-screen">
                <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">

                    <div className="w-full max-w-sm mx-auto lg:w-96">
                        <div>
                            <img
                                alt="Your Company"
                                src={logoEscura}
                                className="w-auto h-10"
                            />
                            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Faça login na sua conta
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Não é um membro?{' '}
                                <Link to="/sign-up" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Comece um teste gratuito de 14 dias
                                </Link>
                            </p>
                        </div>

                        <div className="mt-10">
                            <div>

                                {showMessageError &&
                                    <MessageError text="E-mail/senha incorretos!"></MessageError>
                                }

                                <form onSubmit={handleSubmitFormLogin} method="POST" className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            E-mail
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                autoComplete="email"
                                                onChange={handleEmail}
                                                value={email}
                                                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div>

                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                                Senha
                                            </label>
                                            <div className="mt-2 relative">
                                                <input
                                                    value={password}
                                                    onChange={handlePassword}
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"} // Alterna entre "password" e "text"
                                                    required
                                                    autoComplete="current-password"
                                                    className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={toggleShowPassword}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                                >
                                                    {showPassword ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                id="remember-me"
                                                name="remember-me"
                                                type="checkbox"
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                                            />
                                            <label htmlFor="remember-me" className="block ml-3 text-sm leading-6 text-gray-700">
                                                Lembre-me
                                            </label>
                                        </div>

                                        <div className="text-sm leading-6">
                                            <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                                Esqueceu sua senha?
                                            </Link>
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className={`w-full inline-flex justify-center px-3 py-2 ml-4 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${loadingButton ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={loadingButton}
                                        >
                                            {loadingButton ? (
                                                <>
                                                    <svg className="w-5 h-5 mr-3 animate-spin" viewBox="0 0 24 24">
                                                        {/* Ícone de loading */}
                                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path fill="currentColor" d="M4 12a8 8 0 017-7.937V4a8 8 0 100 16v-1.063A7.998 7.998 0 014 12z" />
                                                    </svg>
                                                    Entrando...
                                                </>
                                            ) : (
                                                'Entrar'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>


                        </div>
                    </div>
                </div>
                <div className="relative flex-1 hidden w-0 lg:block">
                    <img
                        alt=""
                        src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                        className="absolute inset-0 object-cover w-full h-full"
                    />
                </div>
            </div>
        </>

    )

}

export default Login;