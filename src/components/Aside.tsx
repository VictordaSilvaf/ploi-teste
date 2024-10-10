

import { FC, ReactNode, useEffect } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEnterpriseContext } from "../context/EnterpriseContext";
import ReplaceEnterprises from "./ReplaceEnterprise";
import LogoClaro from "../assets/images/logo-escuro.png";
import InviteMembers from "./InviteMembers";
import { acceptInvite, getInvites } from "../api/enterprise/enterpriseApi";
import toast from "react-hot-toast";

interface AsideProps {
  children: ReactNode;
}

const Aside: FC<AsideProps> = ({ children }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
    {
      name: "Oportunidades",
      href: "/opportunity",
      icon: UsersIcon,
      current: false,
    },
    { name: "Contatos", href: "/contact", icon: FolderIcon, current: false },
    {
      name: "Configurações",
      href: "/settings",
      icon: CalendarIcon,
      current: false,
    },
    {
      name: "Notas",
      href: "/notes",
      icon: DocumentDuplicateIcon,
      current: false,
    },
    { name: "Tarefas", href: "/tasks", icon: ChartPieIcon, current: false },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { enterprise } = useEnterpriseContext();

  //context
  const { getUserContext, logoutContext } = useAuth();
  const userData = getUserContext();

  const handleLogout = () => {
    logoutContext();
  };

  const [isOpenReplaceEnterprises, setIsOpenReplaceEnterprises] =
    useState<boolean>(false);

  const [isOpenInviteUser, setIsOpenInviteUser] = useState<boolean>(false);
  // const [isOpenTrashedItens, setIsOpenTrashedItens] = useState<boolean>(false);

  const [listInvitesUser, setListInvitesUser] = useState<
    { enterprise_name: string; enterprise_id: string }[]
  >([]);

  useEffect(() => {
      const listInvitesUser = async () => {
        if (userData != null) {
          const result = await getInvites(userData.id.toString());
          setListInvitesUser(result.invites);
        }
      };
  
      listInvitesUser();
    }, [userData]);

    const handleAcceptInvite = async (enterprise_id: string) => {
        try {
          if (userData != null) {
            await acceptInvite(enterprise_id, userData.id.toString());
            toast.success("Convite aceito com sucesso!");
          }
        } catch (error) {
          console.log(error);
        }
      };

  const alphabetColors: { [key: string]: string } = {
    A: "#3B82F6", // Azul
    B: "#10B981", // Verde
    C: "#6366F1", // Índigo
    D: "#8B5CF6", // Roxo
    E: "#F59E0B", // Amarelo
    F: "#EC4899", // Rosa
    G: "#14B8A6", // Verde-azulado
    H: "#EF4444", // Vermelho
    I: "#10B981", // Esmeralda
    J: "#F59E0B", // Âmbar
    K: "#F43F5E", // Rosa intenso
    L: "#84CC16", // Limão
    M: "#06B6D4", // Ciano
    N: "#D946EF", // Fúcsia
    O: "#8B5CF6", // Violeta
    P: "#0EA5E9", // Azul Céu
    Q: "#F97316", // Laranja
    R: "#60A5FA", // Azul claro
    S: "#4ADE80", // Verde claro
    T: "#818CF8", // Índigo claro
    U: "#A78BFA", // Roxo claro
    V: "#FBBF24", // Amarelo claro
    W: "#F472B6", // Rosa claro
    X: "#2DD4BF", // Verde-azulado claro
    Y: "#FB7185", // Vermelho claro
    Z: "#34D399", // Esmeralda claro
  };

  const getBackgroundColor = (letter: string): string => {
    const upperLetter = letter.toUpperCase();
    return alphabetColors[upperLetter] || "#D1D5DB"; // Cor padrão em hexadecimal (cinza)
  };

  return (
    <div>
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon
                    aria-hidden="true"
                    className="w-6 h-6 text-white"
                  />
                </button>
              </div>
            </TransitionChild>
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex flex-col px-6 pb-4 overflow-y-auto bg-gray-900 grow gap-y-5 ring-1 ring-white/10">
              <div className="flex items-center h-16 shrink-0">
                <img
                  alt="Your Company"
                  src={LogoClaro}
                  className="w-auto h-8"
                />
              </div>
              <nav className="flex flex-col flex-1">
                <ul role="list" className="flex flex-col flex-1 gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className="w-6 h-6 shrink-0"
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>

                  <li className="mt-auto">
                    <Menu
                      as="div"
                      className="relative inline-block w-full text-left"
                    >
                      <div className="w-full">
                        {enterprise != null && (
                          <MenuButton className="flex w-full p-2 -mx-2 text-sm font-semibold leading-6 text-gray-400 rounded-md group gap-x-3 hover:bg-gray-800 hover:text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="size-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2.24 6.8a.75.75 0 0 0 1.06-.04l1.95-2.1v8.59a.75.75 0 0 0 1.5 0V4.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0L2.2 5.74a.75.75 0 0 0 .04 1.06Zm8 6.4a.75.75 0 0 0-.04 1.06l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75a.75.75 0 0 0-1.5 0v8.59l-1.95-2.1a.75.75 0 0 0-1.06-.04Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {enterprise.name}
                          </MenuButton>
                        )}
                      </div>

                      <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                      >
                        <div className="py-1">
                          <MenuItem>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                            >
                              Account settings
                            </a>
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </Menu>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-col px-6 pb-4 overflow-y-auto bg-gray-900 grow gap-y-5">
          <div className="flex items-center h-16 shrink-0">
            <img alt="Your Company" src={LogoClaro} className="w-auto h-8" />
          </div>
          <nav className="flex flex-col flex-1">
            <ul role="list" className="flex flex-col flex-1 gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className="w-6 h-6 shrink-0"
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="mt-auto">
                <Menu
                  as="div"
                  className="relative inline-block w-full text-left"
                >
                  <div className="w-full">
                    {enterprise != null && (
                      <MenuButton className="flex w-full p-2 -mx-2 text-sm font-semibold leading-6 text-gray-400 rounded-md group gap-x-3 hover:bg-gray-800 hover:text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="size-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.53 3.47a.75.75 0 0 0-1.06 0L6.22 6.72a.75.75 0 0 0 1.06 1.06L10 5.06l2.72 2.72a.75.75 0 1 0 1.06-1.06l-3.25-3.25Zm-4.31 9.81 3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 1 0-1.06-1.06L10 14.94l-2.72-2.72a.75.75 0 0 0-1.06 1.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {enterprise.name}
                      </MenuButton>
                    )}
                  </div>

                  <MenuItems
                    transition
                    className="absolute  z-10 mt-2 w-full -top-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <div className="py-1">
                      <MenuItem>
                        <a
                          href="#"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 0 1 .804.98v1.361a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.262.125l-1.25-.834a6.953 6.953 0 0 1-1.416.587l-.294 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.262l.834-1.25a6.957 6.957 0 0 1-.587-1.416l-1.473-.294A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.38 3.03l1.25.834a6.957 6.957 0 0 1 1.416-.587l.294-1.473ZM13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Configurações
                        </a>
                      </MenuItem>

                      <MenuItem>
                        <a
                          onClick={() => setIsOpenInviteUser(true)}
                          href="#"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
                          </svg>
                          Convidar membro
                        </a>
                      </MenuItem>

                      <MenuItem>
                        <a
                          href="#"
                          onClick={() => setIsOpenReplaceEnterprises(true)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M13.2 2.24a.75.75 0 0 0 .04 1.06l2.1 1.95H6.75a.75.75 0 0 0 0 1.5h8.59l-2.1 1.95a.75.75 0 1 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 0 0-1.06.04Zm-6.4 8a.75.75 0 0 0-1.06-.04l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 1 0 1.02-1.1l-2.1-1.95h8.59a.75.75 0 0 0 0-1.5H4.66l2.1-1.95a.75.75 0 0 0 .04-1.06Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Trocar empresa
                        </a>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm shrink-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="w-6 h-6" />
          </button>

          {/* Separator */}
          <div
            aria-hidden="true"
            className="w-px h-6 bg-gray-900/10 lg:hidden"
          />

          <div className="flex self-stretch flex-1 gap-x-4 lg:gap-x-6">
            <form action="#" method="GET" className="relative flex flex-1">
              <label htmlFor="search-field" className="sr-only">
                Search
              </label>
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-5 h-full text-gray-400 pointer-events-none"
              />
              <input
                id="search-field"
                name="search"
                type="search"
                placeholder="Search..."
                className="block w-full h-full py-0 pl-8 pr-0 text-gray-900 border-0 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
              />
            </form>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="relative p-1 text-gray-400 rounded-full outline-none hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    {listInvitesUser && (
                      <span className="absolute -inset-1.5 bg-indigo-600 rounded-full w-5 h-5 text-white left-3 text-sm">
                        {listInvitesUser.length}
                      </span>
                    )}

                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="w-6 h-6" />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <div className="py-1">
                    {listInvitesUser && listInvitesUser.length > 0 ? (
                      listInvitesUser.map((invite) => (
                        <MenuItem>
                          <div className="pointer-events-auto w-full max-w-sm ring-1 ring-black ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
                            <div className="p-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                  <img
                                    alt=""
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                                    className="w-10 h-10 rounded-full"
                                  />
                                </div>
                                <div className="flex-1 w-0 ml-3">
                                  <p className="text-sm font-medium text-gray-900">
                                    {invite.enterprise_name}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500">
                                    enviou um convite para entrar na empresa
                                    dele.!
                                  </p>
                                  <div className="flex mt-4">
                                    <button
                                      onClick={() =>
                                        handleAcceptInvite(invite.enterprise_id)
                                      }
                                      type="button"
                                      className="inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                      Aceitar
                                    </button>
                                    <button
                                      type="button"
                                      className="ml-3 inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                      Recusar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem>
                        <p className="p-2 text-center">Nenhuma notificação.</p>
                      </MenuItem>
                    )}
                  </div>
                </MenuItems>
              </Menu>
             

              {/* Separator */}
              <div
                aria-hidden="true"
                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
              />

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <MenuButton className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  {userData != null && (
                    <span
                      style={{
                        backgroundColor: getBackgroundColor(
                          userData.name.charAt(0).toUpperCase()
                        ),
                      }}
                      className={`inline-flex items-center justify-center rounded-full w-9 h-9`}
                    >
                      <span className="font-medium leading-none text-white">
                        {userData.name.charAt(0).toUpperCase()}
                      </span>
                    </span>
                  )}
                  <span className="hidden lg:flex lg:items-center">
                    {userData != null && (
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                      >
                        {userData.name}
                      </span>
                    )}

                    <ChevronDownIcon
                      aria-hidden="true"
                      className="w-5 h-5 ml-2 text-gray-400"
                    />
                  </span>
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <Link
                      to="/profile/profile-user"
                      className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                    >
                      Meu perfil
                    </Link>
                  </MenuItem>

                  <MenuItem>
                    <Link
                      onClick={handleLogout}
                      to="#"
                      className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                    >
                      Sair
                    </Link>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
      {isOpenReplaceEnterprises && (
        <ReplaceEnterprises
          isOpen={isOpenReplaceEnterprises}
          setIsOpen={setIsOpenReplaceEnterprises}
        />
      )}

      {isOpenInviteUser && (
        <InviteMembers
          isOpen={isOpenInviteUser}
          setIsOpen={setIsOpenInviteUser}
        />
      )}

      {/* {isOpenTrashedItens && <TrashedItens />} */}
    </div>
  );
};

export default Aside;
