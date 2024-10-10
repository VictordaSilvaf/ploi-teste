/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { FC, FormEvent, useEffect, useState } from "react";
import { Field, Label, Switch } from "@headlessui/react";
import { useAuth } from "../../context/AuthContext";
import { getUser, updateUser } from "../../api/users/usersApi";
import toast from "react-hot-toast";
import AsideProfile from "../../components/AsideProfile";
import Aside from "../../components/Aside";

const ProfileUser: FC = () => {
  const [allowCommenting, setAllowCommenting] = useState(true);
  const [allowMentions, setAllowMentions] = useState(true);

  const { getUserContext } = useAuth();
  const userData = getUserContext();

  const [selectedImage, setSelectedImage] = useState<null>(null);
  const [userName, setUserName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const user = {
    name: "Debbie Lewis",
    handle: "deblewis",
    email: "debbielewis@example.com",
    imageUrl:
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=320&h=320&q=80",
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (userData != null) {
          const result = await getUser(userData.id.toString());
          const user = result.user;
          if (user) {
            setUserName(user.name);
            setFirstName(user.first_name);
            setLastName(user.last_name);
            setUrl(user.url);
            setAbout(user.about);
            setCompany(user.company);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, [userData]);

  const imageChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingButton(true);

    try {
      if (userData != null && selectedImage != null) {
        await updateUser(
          userData.id.toString(),
          userName,
          firstName,
          lastName,
          about,
          url,
          company,
          selectedImage
        );
        toast.success("Perfil atualizado com sucesso!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <Aside>
      <AsideProfile>
        <form
          onSubmit={handleSubmit}
          method="POST"
          className="divide-y divide-gray-200 lg:col-span-9"
        >
          {/* Profile section */}
          <div className="px-4 py-6 sm:p-6 lg:pb-8">
            <div>
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                Perfil de usuário
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Essas informações serão exibidas publicamente, portanto, tome
                cuidado com o que você compartilha.
              </p>
            </div>

            <div className="flex flex-col mt-6 lg:flex-row">
              <div className="flex-grow space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Username
                  </label>
                  <div className="flex mt-2 rounded-md shadow-sm">
                    <input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      className="block w-full min-w-0 flex-grow rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Sobre
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="about"
                      name="about"
                      className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Breve descrição do seu perfil
                  </p>
                </div>
              </div>

              <div className="flex-grow mt-6 lg:ml-6 lg:mt-0 lg:flex-shrink-0 lg:flex-grow-0">
                <p
                  aria-hidden="true"
                  className="text-sm font-medium leading-6 text-gray-900"
                >
                  Imagem
                </p>
                {selectedImage ? (
                  <div className="relative hidden overflow-hidden rounded-full lg:block">
                    <img
                      alt=""
                      src={URL.createObjectURL(selectedImage)}
                      className="relative object-cover object-center w-40 h-40 rounded-full"
                    />
                    <label
                      htmlFor="desktop-user-photo"
                      className="absolute inset-0 flex items-center justify-center w-full h-full text-sm font-medium text-white focus-within:opacity-100 hover:opacity-100"
                    >
                      <span>Change</span>
                      <span className="sr-only"> user photo</span>
                      <input
                        onChange={imageChange}
                        id="desktop-user-photo"
                        name="user-photo"
                        type="file"
                        className="absolute inset-0 w-full h-full border-gray-300 rounded-md opacity-0 cursor-pointer"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="relative hidden overflow-hidden rounded-full lg:block">
                    <img
                      alt=""
                      src={userData?.picture}
                      className="relative w-40 h-40 rounded-full"
                    />
                    <label
                      htmlFor="desktop-user-photo"
                      className="absolute inset-0 flex items-center justify-center w-full h-full text-sm font-medium text-white bg-black bg-opacity-75 opacity-0 focus-within:opacity-100 hover:opacity-100"
                    >
                      <span>Change</span>
                      <span className="sr-only"> user photo</span>
                      <input
                        id="desktop-user-photo"
                        name="user-photo"
                        type="file"
                        onChange={imageChange}
                        className="absolute inset-0 w-full h-full border-gray-300 rounded-md opacity-0 cursor-pointer"
                      />
                    </label>
                  </div>
                )}
                <div className="mt-2 lg:hidden">
                  <div className="flex items-center">
                    <div
                      aria-hidden="true"
                      className="flex-shrink-0 inline-block w-12 h-12 overflow-hidden rounded-full"
                    >
                      <img
                        alt=""
                        src={user.imageUrl}
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <div className="relative ml-5">
                      <input
                        id="mobile-user-photo"
                        name="user-photo"
                        type="file"
                        className="absolute w-full h-full rounded-md opacity-0 peer"
                      />
                      <label
                        htmlFor="mobile-user-photo"
                        className="block px-3 py-2 text-sm font-semibold text-gray-900 rounded-md shadow-sm pointer-events-none ring-1 ring-inset ring-gray-300 peer-hover:ring-gray-400 peer-focus:ring-2 peer-focus:ring-indigo-600"
                      >
                        <span>Change</span>
                        <span className="sr-only"> user photo</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 mt-6">
              <div className="col-span-12 sm:col-span-6">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nome
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-0 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Sobrenome
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-0 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="col-span-12">
                <label
                  htmlFor="url"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  URL
                </label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  id="url"
                  name="url"
                  type="text"
                  className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-0 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="col-span-12 sm:col-span-6">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Empresa
                </label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:border-0 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          {/* Privacy section */}
          <div className="pt-6 divide-y divide-gray-200">
            <div className="px-4 sm:px-6">
              <div>
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                  Privacidade
                </h2>
              </div>
              <ul role="list" className="mt-2 divide-y divide-gray-200">
                <Field
                  as="li"
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex flex-col">
                    <Label
                      as="p"
                      passive
                      className="text-sm font-medium leading-6 text-gray-900"
                    >
                      Permitir comentários
                    </Label>
                  </div>
                  <Switch
                    checked={allowCommenting}
                    onChange={setAllowCommenting}
                    disabled
                    className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 data-[checked]:bg-teal-500"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                    />
                  </Switch>
                </Field>
                <Field
                  as="li"
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex flex-col">
                    <Label
                      as="p"
                      passive
                      className="text-sm font-medium leading-6 text-gray-900"
                    >
                      Permitir menções
                    </Label>
                  </div>
                  <Switch
                    checked={allowMentions}
                    disabled
                    onChange={setAllowMentions}
                    className="group relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 data-[checked]:bg-teal-500"
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                    />
                  </Switch>
                </Field>
              </ul>
            </div>
            <div className="flex justify-end px-4 py-4 mt-4 gap-x-3 sm:px-6">
              <button
                type="button"
                className="inline-flex justify-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`inline-flex justify-center px-3 py-2 ml-4 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
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

export default ProfileUser;
