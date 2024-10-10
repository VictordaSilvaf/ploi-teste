import { FC, FormEvent, useState } from "react";
import AsideProfile from "../../components/AsideProfile";
import { useAuth } from "../../context/AuthContext";
import { changePasswordUser } from "../../api/users/usersApi";
import toast from "react-hot-toast";
import MessageError from "../../components/MessageError";
import Aside from "../../components/Aside";

const Password: FC = () => {
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [passwordCurrent, setPasswordCurrent] = useState<string>("");
  const [passwordNew, setPasswordNew] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [errorMessageText, setErrorMessageText] = useState<string>("");
  const [showMessageError, setShoMessageError] = useState<boolean>(false);


  const { getUserContext } = useAuth();
  const userData = getUserContext();

    
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoadingButton(true);
    try {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;

      if (userData != null) {
        if (passwordNew.length < 8) {
            setErrorMessageText("A senha deve ter no mínimo 8 caracteres.");
            setShoMessageError(true);
            return false;
          } else if (!passwordRegex.test(passwordNew)) {
            setErrorMessageText(
              "A senha deve conter uma letra maiúscula, uma letra minúscula e um caractere especial."
            );
            setShoMessageError(true);
            return false;
          } else if (passwordNew === passwordConfirm) {
            await changePasswordUser(userData.id.toString(), passwordCurrent, passwordNew);
            toast.success("Senha trocada com sucesso!");
            setShoMessageError(false);
          } else {
            setErrorMessageText("Senhas são diferentes.");
            setShoMessageError(true);
            return false;
          }
      }
    } catch (error) {
      console.log(error);
      setErrorMessageText(
        "Senha atual inválida!"
      );
      setShoMessageError(true);
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <Aside>
      <AsideProfile>
        <form
          onSubmit={handleSubmit}
          className="divide-y divide-gray-200 lg:col-span-9"
          method="POST"
        >
          <div className="px-4 py-6 sm:p-6 lg:pb-8">
            {showMessageError && (
              <MessageError text={errorMessageText}></MessageError>
            )}

            <div>
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                Perfil de usuário
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Essas informações serão exibidas publicamente, portanto, tome
                cuidado com o que você compartilha.
              </p>
            </div>

            <div className="w-56 mt-6">
              <label
                htmlFor="password_current"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Senha atual
              </label>
              <div className="mt-2">
                <input
                  value={passwordCurrent}
                  onChange={(e) => setPasswordCurrent(e.target.value)}
                  id="password_current"
                  name="password_current"
                  type="text"
                  placeholder="Digite sua senha atual..."
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="flex items-center mt-3 gap-x-6">
              <div className="w-56 mt-6">
                <label
                  htmlFor="password_new"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nova senha
                </label>
                <div className="mt-2">
                  <input
                    value={passwordNew}
                    onChange={(e) => setPasswordNew(e.target.value)}
                    id="password_new"
                    name="password_new"
                    type="text"
                    placeholder="Digite sua nova senha..."
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="w-56 mt-6">
                <label
                  htmlFor="password_confirm"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirmar senha
                </label>
                <div className="mt-2">
                  <input
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    id="password_confirm"
                    name="password_confirm"
                    type="text"
                    placeholder="Confirmar senha..."
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-start mt-10 gap-x-3">
              <button
                type="button"
                className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`inline-flex justify-center px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                  loadingButton ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loadingButton}
              >
                {loadingButton ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-3 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      {/* Ícone de loading */}
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 017-7.937V4a8 8 0 100 16v-1.063A7.998 7.998 0 014 12z"
                      />
                    </svg>
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </button>

         
            </div>
          </div>
        </form>
      </AsideProfile>
    </Aside>
  );
};

export default Password;
