/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, FormEvent, useEffect, useState } from "react";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../context/AuthContext";
import { useEnterpriseContext } from "../context/EnterpriseContext";
import toast from "react-hot-toast";
import {
  enterprisePivotUser,
  getEnterprises,
  updateEnterprise,
} from "../api/enterprise/enterpriseApi";

interface replaceEnterprisesProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface EnterpriseAcceptByUserPros {
  enterprise: {
    name: string;
    description: string;
    id: number;
  };
}

const ReplaceEnterprises: FC<replaceEnterprisesProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [listEnterprise, setListEnterprise] = useState<
    { id: number; name: string; description: string; user_id: number }[]
  >([]);

  const [enterpriseAcceptByUser, setEnterpriseAccpetByUser] = useState<
    EnterpriseAcceptByUserPros[]
  >([]);

  const [enterpriseSelectClick, setEnterpriseSelectedClick] = useState<{
    id: string;
  } | null>(null);

  const [nameEnterprise, setNameEnterprise] = useState<string>("");
  const [descriptionEnterprise, setDescription] = useState<string>("");
  const [linkEnterprise, setLinkEnterprise] = useState<string>("");
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [refreshEnterprises, setRefreshEnterprises] = useState<boolean>(false);

  // context

  const { getUserContext } = useAuth();
  const { enterprise, handleEnterpriseChange } = useEnterpriseContext();
  const userData = getUserContext();

  const handleClickEnterprise = (enterpriseItem: any) => {
    handleEnterpriseChange(enterpriseItem);
    toast.success("Empresa trocada com sucesso!");
    setIsOpen(false);
    localStorage.removeItem("selectedEnvironment");
  };

  const handleClickEditEnterprise = (
    enterprise: any,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setEnterpriseSelectedClick(enterprise);
    setOpenModalUpdate(true);
    setDescription(enterprise.description);
    setNameEnterprise(enterprise.name);
    setLinkEnterprise(enterprise.links);
  };

  useEffect(() => {
    const listEnterprisesPivots = async () => {
      try {
        if (userData != null) {
          const result = await enterprisePivotUser(userData.id.toString());

          setEnterpriseAccpetByUser(result.enterprise_pivot);
        }
      } catch (error) {
        console.log(error);
      }
    };

    listEnterprisesPivots();
  }, [userData]);

  const handleUpdateEnterprise = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (
        userData != null &&
        enterprise != null &&
        enterpriseSelectClick != null
      ) {
        const result = await updateEnterprise(
          enterpriseSelectClick.id,
          nameEnterprise,
          descriptionEnterprise,
          linkEnterprise,
          userData.id
        );

        toast.success("Empresa atualizada com sucesso!");
        setOpenModalUpdate(false);
        setRefreshEnterprises(!refreshEnterprises);
        localStorage.setItem(
          "selectedEnterprise",
          JSON.stringify(result.enterprise)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getListEnterprise = async () => {
      if (userData != null) {
        try {
          const enterprisesAll = await getEnterprises(userData.id);
          const enterprisesList = enterprisesAll.enterprises as {
            id: number;
            name: string;
            description: string;
            user_id: number;
          }[]; // Forçando o tipo
          setListEnterprise(enterprisesAll.enterprises);

          const storedEnterprise = localStorage.getItem("selectedEnterprise");

          if (storedEnterprise) {
            const parsedEnterprise = JSON.parse(storedEnterprise);
            handleEnterpriseChange(parsedEnterprise);
          } else if (enterprisesList.length > 0) {
            handleEnterpriseChange(enterprisesList[0]);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    getListEnterprise();
  }, [userData, refreshEnterprises, handleEnterpriseChange]);

  return (
    <>
      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-10">
        <div className="fixed inset-0" />

        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <div className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl">
                  <div className="flex flex-col flex-1 min-h-0 py-6 overflow-y-scroll">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                          Minhas empresas
                        </DialogTitle>
                        <div className="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="relative text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon aria-hidden="true" className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-1 w-full mt-6">
                      <div className="py-5 border-b border-gray-200">
                        <div className="flex flex-wrap items-center justify-between w-full -mt-2 sm:flex-nowrap">
                          <ul
                            role="list"
                            className="w-full divide-y divide-gray-200"
                          >
                            {listEnterprise &&
                              listEnterprise.map((enterpriseItem: any) => (
                                <div key={enterpriseItem.id}>
                                  {userData != null && (
                                    <>
                                      {enterpriseItem.user_id ===
                                        userData.id && (
                                        <li
                                          onClick={() =>
                                            handleClickEnterprise(
                                              enterpriseItem
                                            )
                                          }
                                        >
                                          <button
                                            type="button"
                                            className="block w-full hover:bg-gray-50"
                                          >
                                            <div className="px-6 py-4">
                                              <div className="flex items-center gap-1">
                                                <svg
                                                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                  viewBox="0 0 20 20"
                                                  fill="currentColor"
                                                  aria-hidden="true"
                                                >
                                                  <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z"></path>
                                                </svg>
                                                <div className="text-sm font-medium text-indigo-600 truncate">
                                                  {enterpriseItem.name}
                                                </div>
                                                <div className="ml-auto">
                                                  <button
                                                    onClick={(e) =>
                                                      handleClickEditEnterprise(
                                                        enterpriseItem,
                                                        e
                                                      )
                                                    }
                                                    type="button"
                                                    className="p-1 transition-all rounded-full hover:bg-gray-300"
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      fill="none"
                                                      viewBox="0 0 24 24"
                                                      strokeWidth={1.5}
                                                      stroke="currentColor"
                                                      className="size-5"
                                                    >
                                                      <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                      />
                                                    </svg>
                                                  </button>
                                                </div>
                                              </div>
                                              <div className="flex justify-between mt-2">
                                                <div className="sm:flex">
                                                  <div className="flex items-center mt-2 text-sm text-left text-gray-500">
                                                    {enterpriseItem.description}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </button>
                                        </li>
                                      )}
                                    </>
                                  )}
                                </div>
                              ))}
                          </ul>
                        </div>

                        <div className="flex flex-wrap items-center justify-between w-full mt-10 sm:flex-nowrap">
                          <ul
                            role="list"
                            className="w-full divide-y divide-gray-200"
                          >
                            {enterpriseAcceptByUser &&
                              enterpriseAcceptByUser.map(
                                (enterpriseItem: any) => (
                                  <li
                                    onClick={() =>
                                      handleClickEnterprise(
                                        enterpriseItem.enterprise
                                      )
                                    }
                                    key={enterpriseItem.enterprise.id}
                                  >
                                    <button
                                      type="button"
                                      className="block w-full hover:bg-gray-50"
                                    >
                                      <div className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                          <svg
                                            className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                          >
                                            <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z"></path>
                                          </svg>
                                          <div className="text-sm font-medium text-indigo-600 truncate">
                                            {enterpriseItem.enterprise.name}
                                          </div>
                                        </div>
                                        <div className="flex justify-between mt-2">
                                          <div className="sm:flex">
                                            <div className="flex items-center mt-2 text-sm text-left text-gray-500">
                                              {
                                                enterpriseItem.enterprise
                                                  .description
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </button>
                                  </li>
                                )
                              )}
                          </ul>
                        </div>
                      </div>
                      <div className="absolute bottom-0 w-full">
                        <button
                          type="button"
                          onClick={() => setIsOpen(true)}
                          className="flex w-full items-center gap-2 justify-center bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                          </svg>
                          Adicionar empresa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={openModalUpdate}
        onClose={setOpenModalUpdate}
        className="relative z-10"
      >
        <div className="fixed inset-0" />

        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <form
                  method="POST"
                  onSubmit={handleUpdateEnterprise}
                  className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl"
                >
                  <div className="flex flex-col flex-1 min-h-0 py-6 overflow-y-scroll">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                          Cadastrar empresa
                        </DialogTitle>
                        <div className="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            onClick={() => setOpenModalUpdate(false)}
                            className="relative text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon aria-hidden="true" className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-1 px-4 mt-6 sm:px-6">
                      <div className="mb-6">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Nome da empresa
                        </label>
                        <div className="mt-2">
                          <input
                            value={nameEnterprise}
                            onChange={(e) => setNameEnterprise(e.target.value)}
                            id="name"
                            name="name"
                            required
                            type="text"
                            placeholder="Digite um nome da sua empresa..."
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="comment"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Descrição
                        </label>
                        <div className="mt-2">
                          <textarea
                            value={descriptionEnterprise}
                            onChange={(e) => setDescription(e.target.value)}
                            id="comment"
                            name="comment"
                            rows={4}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            defaultValue={""}
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="company-website"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Link
                        </label>
                        <div className="mt-2">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <span className="flex items-center pl-3 text-gray-500 select-none sm:text-sm">
                              http://
                            </span>
                            <input
                              value={linkEnterprise}
                              onChange={(e) =>
                                setLinkEnterprise(e.target.value)
                              }
                              id="company-website"
                              name="company-website"
                              type="text"
                              placeholder="www.example.com"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end flex-shrink-0 px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setOpenModalUpdate(false)}
                      className="px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center px-3 py-2 ml-4 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ReplaceEnterprises;
