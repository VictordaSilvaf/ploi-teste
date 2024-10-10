/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { FC, FormEvent, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import InputMask from "react-input-mask";
import { useEnterpriseContext } from "../../context/EnterpriseContext";
import {
  createContact,
  deleteContact,
  getContacts,
  putContact,
} from "../../api/contact/contactApi";

import { format } from "date-fns";
import Confirm from "../../components/Corfirm";
import toast, { Toaster } from "react-hot-toast";
import Aside from "../../components/Aside";
import Heading from "../../components/Heading";
import BaseButton from "../../components/BaseButton";

interface Contact {
  name: string;
  email: string;
  owner: string;
  created_at: string;
  id: string;
  phone_number: string;
  surname: string;
}

const Contact: FC = () => {
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [loadingButtonDelete, setLoadingButtonDelete] =
    useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [refreshContact, setRefreshContact] = useState<boolean>(false);
  const [listContactsEnterprise, setListContactEnterprise] = useState<
    Contact[]
  >([]);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [contactSelected, setContactSelected] = useState<Contact | null>(null);

  const { enterprise } = useEnterpriseContext();

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingButton(true);

    try {
      if (enterprise != null) {
        await createContact(
          enterprise.id,
          email,
          enterprise.name,
          phone,
          name,
          surname
        );
        toast.success("Contato criado com sucesso!");
        setRefreshContact(!refreshContact);
        setOpenModalCreate(false);
        setName("");
        setEmail("");
        setSurname("");
        setPhone("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingButton(false);
    }
  };

  useEffect(() => {
    const listContacts = async () => {
      if (enterprise != null) {
        const result = await getContacts(enterprise.id);

        setListContactEnterprise(result.contacts);
      }
    };

    listContacts();
  }, [enterprise, refreshContact]);

  const handleDeleteContact = async () => {
    setLoadingButtonDelete(true);
    try {
      if (contactSelected != null) {
        await deleteContact(contactSelected.id);
        toast.success("Contato excluído com sucesso!");
        setRefreshContact(!refreshContact);
        setConfirm(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingButtonDelete(false);
    }
  };

  const handleCancel = () => {
    setConfirm(false);
  };

  console.log("contato selecionado", contactSelected);

  const handleConfirm = (contact: Contact) => {
    setContactSelected(contact);
    setConfirm(true);
  };

  const handleClickBtnEdit = (contact: Contact) => {
    setContactSelected(contact);
    setOpenModalUpdate(true);
    setName(contact.name);
    setEmail(contact.email);
    setSurname(contact.surname);
    setPhone(contact.phone_number);
  };

  const handleCloseModalUpdate = () => {
    setOpenModalUpdate(false);
    setName("");
    setEmail("");
    setSurname("");
    setPhone("");
  };

  const handleUpdateForm = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingButton(true);

    try {
      if (enterprise != null && contactSelected != null) {
        await putContact(
          contactSelected.id,
          enterprise.id,
          email,
          enterprise.name,
          phone,
          name,
          surname
        );
        toast.success("Contato atualizado com sucesso!");
        setRefreshContact(!refreshContact);
        setName("");
        setEmail("");
        setSurname("");
        setPhone("");
        setOpenModalUpdate(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <Aside>
      <Heading
        title="Contatos"
        rightButtomGroup={
          <BaseButton onClick={() => setOpenModalCreate(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Adicionar contato
          </BaseButton>
        }
      ></Heading>
      <Toaster position="top-right"></Toaster>
      <Confirm
        loadingButton={loadingButtonDelete}
        setLoadingButton={setLoadingButtonDelete}
        onConfirm={handleDeleteContact}
        title="Deseja deletar o contato?"
        onCancel={handleCancel}
        isOpen={confirm}
        setIsOpen={setConfirm}
      ></Confirm>

      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            {/* <p className="mt-2 text-sm text-gray-700">
              Uma lista de todos os contatos da sua conta, incluindo nome,
              cargo, e-mail e telefone.
            </p> */}
          </div>
        </div>
        <div className="flow-root mt-8">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Sobrenome
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      E-mail
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Proprietário
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Celular
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Data adicionada
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {listContactsEnterprise && listContactsEnterprise.length ? (
                    listContactsEnterprise.map((contact) => (
                      <tr key={contact.email}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6 lg:pl-8">
                          {contact.name}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {contact.surname}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {contact.email}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 rounded-md bg-green-50 ring-1 ring-inset ring-green-600/20">
                            Active
                          </span>
                        </td>

                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {contact.owner}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {contact.phone_number}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {format(contact.created_at, "dd/MM/yyyy")}
                        </td>
                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6 lg:pr-8">
                          <button
                            onClick={() => handleClickBtnEdit(contact)}
                            className="mr-2 text-indigo-600 hover:text-indigo-900"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                            <span className="sr-only">, {contact.name}</span>
                          </button>

                          <button
                            onClick={() => handleConfirm(contact)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>

                            <span className="sr-only">, {contact.name}</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="w-full">
                      <td className="px-3 py-4 text-sm text-center text-gray-500">
                        <p>Nenhum contato cadastrado</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={openModalCreate}
        onClose={setOpenModalCreate}
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
                  onSubmit={handleSubmitForm}
                  className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl"
                >
                  <div className="flex flex-col flex-1 min-h-0 py-6 overflow-y-scroll">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                          Cadastrar contato
                        </DialogTitle>
                        <div className="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            onClick={() => setOpenModalCreate(false)}
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
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Nome
                        </label>
                        <div className="mt-2">
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Digite um nome..."
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="surname"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Sobrenome
                        </label>
                        <div className="mt-2">
                          <input
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            id="surname"
                            name="surname"
                            type="text"
                            placeholder="Digite um sobrenome..."
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          E-mail
                        </label>
                        <div className="mt-2">
                          <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Digite um e-mail..."
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Celular
                        </label>
                        <InputMask
                          mask="(99) 99999-9999"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        >
                          {(inputProps: any) => (
                            <input
                              {...inputProps}
                              type="tel"
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="(00) 00000-0000"
                            />
                          )}
                        </InputMask>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end flex-shrink-0 px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setOpenModalCreate(false)}
                      className="px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
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
                </form>
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
                  onSubmit={handleUpdateForm}
                  className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl"
                >
                  <div className="flex flex-col flex-1 min-h-0 py-6 overflow-y-scroll">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                          Cadastrar contato
                        </DialogTitle>
                        <div className="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            onClick={handleCloseModalUpdate}
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
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Nome
                        </label>
                        <div className="mt-2">
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Digite um nome..."
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="surname"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Sobrenome
                        </label>
                        <div className="mt-2">
                          <input
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            id="surname"
                            name="surname"
                            type="text"
                            placeholder="Digite um sobrenome..."
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          E-mail
                        </label>
                        <div className="mt-2">
                          <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Digite um e-mail..."
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Celular
                        </label>
                        <InputMask
                          mask="(99) 99999-9999"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        >
                          {(inputProps: any) => (
                            <input
                              {...inputProps}
                              type="tel"
                              required
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="(00) 00000-0000"
                            />
                          )}
                        </InputMask>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end flex-shrink-0 px-4 py-4">
                    <button
                      type="button"
                      onClick={handleCloseModalUpdate}
                      className="px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
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
                </form>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </Aside>
  );
};

export default Contact;
