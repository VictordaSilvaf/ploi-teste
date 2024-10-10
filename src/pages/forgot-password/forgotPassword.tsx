import { FC, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../../services/auth";
import MessageSuccess from '../../components/MessageSuccess'
import MessageError from "../../components/MessageError";
import logoEscura from '../../assets/images/logo-claro.png'

const ForgotPassword: FC = () => {


    const [email, setEmail] = useState<string>('');
    const [showMessageSuccess, setShowMessageSuccess] = useState<boolean>(false);
    const [showMessageError, setShowMessageError] = useState<boolean>(false);
    const [loadingButton, setLoadingButton] = useState<boolean>(false);


    const handleSubmitForm = async (e: FormEvent) => {

        e.preventDefault();

        setLoadingButton(true);

        try {

            await resetPassword(email);
            setShowMessageSuccess(true);
            setEmail('');

        } catch (error) {
            console.log(error)
            setShowMessageError(true);
            setEmail('');
            
        } finally {
            setLoadingButton(false);
        }

    }

    return (
        <div className="flex flex-col justify-center flex-1 h-screen py-12 sm:px-6 lg:px-8 bg-gray-50">

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                    alt="Your Company"
                    src={logoEscura}
                    className="w-auto h-10 mx-auto"
                />
                <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
                    Esqueceu sua senha?
                </h2>

                <p className="mt-3 text-center text-dark dark:text-dark">Não se preocupe! Basta digitar seu e-mail e enviaremos um código para redefinir sua senha!</p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="px-6 py-12 bg-white shadow sm:rounded-lg sm:px-12">
                    {showMessageSuccess &&
                        <MessageSuccess text="E-mail enviado com sucesso"></MessageSuccess>
                    }
                    {showMessageError &&
                        <MessageError text="E-mail não encontrado!"></MessageError>
                    }
                    <form onSubmit={handleSubmitForm} method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>


                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                disabled={loadingButton} // Desabilitar botão durante o carregamento
                            >
                                {loadingButton ? (
                                    <>
                                        <svg className="w-5 h-5 mr-3 animate-spin" viewBox="0 0 24 24">
                                            {/* Ícone de loading */}
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path fill="currentColor" d="M4 12a8 8 0 017-7.937V4a8 8 0 100 16v-1.063A7.998 7.998 0 014 12z" />
                                        </svg>
                                        Processando...
                                    </>
                                ) : (
                                    'Resetar senha'
                                )}
                            </button>
                        </div>
                    </form>


                </div>

                <p className="mt-10 text-sm text-center text-gray-500">
                    Nao é um membro?{' '}
                    <Link to="/sign-up" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">

                        Comece um teste gratuito de 14 dias
                    </Link>
                </p>
            </div>
        </div>

    )

}


export default ForgotPassword;