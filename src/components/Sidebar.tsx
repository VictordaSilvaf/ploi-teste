/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

// import {
//   Combobox,
//   ComboboxInput,
//   ComboboxOption,
//   ComboboxOptions,
//   Dialog,
//   DialogPanel,
//   DialogTitle,
//   Disclosure,
//   DisclosureButton,
//   DisclosurePanel,
//   Label,
//   Listbox,
//   ListboxButton,
//   ListboxOption,
//   ListboxOptions,
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuItems,
// } from "@headlessui/react";
// import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
// import { FC, FormEvent, ReactNode, useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import {
//   acceptInvite,
//   createEnterprise,
//   enterprisePivotUser,
//   getEnterprises,
//   getInvites,
//   inviteEnterpriseUser,
//   updateEnterprise,
// } from "../api/enterprise/enterpriseApi";
// import { useEnterpriseContext } from "../context/EnterpriseContext";
// import logo from "../assets/images/logo-escuro.png";
// import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
// import { IoMdSettings } from "react-icons/io";
// import { Link } from "react-router-dom";
// import {
//   Environment,
//   getAllEnvironment,
// } from "../api/environments/environmentsApi";
// import { useEnvironmentContext } from "../context/EnvironmentContext";
// import SettingsPipeline from "../pages/opportunity/modals/SettingsPipeline";

// import { FaRegTrashAlt } from "react-icons/fa";
// import { MdLogout } from "react-icons/md";
// import TrashedItens from "../pages/opportunity/modals/TrashedItens";
// import { getAllUsers } from "../api/users/usersApi";
// import toast, { Toaster } from "react-hot-toast";

// function classNames(...classes: string[]) {
//   return classes.filter(Boolean).join(" ");
// }

// interface PropsSidebar {
//   children: ReactNode;
//   title: string;
//   rightButtonsTitle?: ReactNode;
// }

// interface EnterpriseAcceptByUserPros {
//   enterprise: {
//     name: string;
//     description: string;
//     id: number;
//   };
// }

  // const location = window.location.pathname;

  // //states
  // // const [selectedImage, setSelectedImage] = useState<null>(null);
  // const [nameEnterprise, setNameEnterprise] = useState<string>("");
  // const [descriptionEnterprise, setDescription] = useState<string>("");
  // const [linkEnterprise, setLinkEnterprise] = useState<string>("");
  // const [listEnterprise, setListEnterprise] = useState<
  //   { id: number; name: string; description: string; user_id: number }[]
  // >([]);

  // const [refreshEnterprises, setRefreshEnterprises] = useState<boolean>(false);
  // const [openReplaceEnterprises, setOpenReplacesEnterprises] =
  //   useState<boolean>(false);
  // const [environmentsEnterprise, setEnvironmentsEnterprise] = useState<
  //   Environment[]
  // >([]);

  // const [openModalConfigPipeline, setOpenModalConfigPipeline] =
  //   useState<boolean>(false);
  // const [openModalTrashedItens, setOpenModalTrashedItens] =
  //   useState<boolean>(false);
  // const [openModalCreateEnterprise, setOpenModalCreateEnterprise] =
  //   useState<boolean>(false);

  // const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  // const [openModalAddUserEnterprise, setOpenModalAddUserEnterprise] =
  //   useState<boolean>(false);

  // const [enterpriseSelectClick, setEnterpriseSelectedClick] = useState<{
  //   id: string;
  // } | null>(null);

  // const [listUsers, setListUsers] = useState<
  //   { id: string; email: string; name: string }[]
  // >([]);

  // const [query, setQuery] = useState("");
  // const [selectedPerson, setSelectedPerson] = useState<{
  //   email: string;
  // } | null>(null);

  // const [listInvitesUser, setListInvitesUser] = useState<
  //   { enterprise_name: string; enterprise_id: string }[]
  // >([]);
  // const [enterpriseAcceptByUser, setEnterpriseAccpetByUser] = useState<
  //   EnterpriseAcceptByUserPros[]
  // >([]);
  // const [loadingButton, setLoadingButton] = useState<boolean>(false);

  // //context
  // const { getUserContext, logoutContext } = useAuth();
  // const userData = getUserContext();

  // const { enterprise, handleEnterpriseChange } = useEnterpriseContext();
  // const { environment, handleEnvironmentChange } = useEnvironmentContext();

  
  // const navigation = [
  //   { name: "Dashboard", href: "/", current: true },
  //   { name: "Oportunidades", href: "/opportunity", current: false },
  //   { name: "Contatos", href: "/contact", current: false },
  //   { name: "Configurações", href: "/settings", current: false },
  //   { name: "Notas", href: "/notes", current: false },
  //   { name: "Tarefas", href: "/tasks", current: false },
  // ];

  // useEffect(() => {
  //   const listEnvironments = async () => {
  //     try {
  //       if (userData != null && enterprise?.id != null) {
  //         const result = await getAllEnvironment(
  //           enterprise.user_id,
  //           enterprise.id
  //         );

  //         setEnvironmentsEnterprise(result.environments);

  //         const storedEnvironment = localStorage.getItem("selectedEnvironment");

  //         if (storedEnvironment) {
  //           const parsedEnvironment = JSON.parse(storedEnvironment);
  //           if (parsedEnvironment) {
  //             // Verifique se parsedEnvironment é válido
  //             handleEnvironmentChange(parsedEnvironment);
  //           }
  //         } else if (result.environments.length > 0) {
  //           const firstEnvironment = result.environments[0];
  //           if (firstEnvironment) {
  //             // Verifique se firstEnvironment é válido
  //             handleEnvironmentChange(firstEnvironment);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   listEnvironments();
  // }, [enterprise, userData, handleEnvironmentChange]);

  // useEffect(() => {
  //   const getListEnterprise = async () => {
  //     if (userData != null) {
  //       try {
  //         const enterprisesAll = await getEnterprises(userData.id);
  //         const enterprisesList = enterprisesAll.enterprises as {
  //           id: number;
  //           name: string;
  //           description: string;
  //           user_id: number;
  //         }[]; // Forçando o tipo
  //         setListEnterprise(enterprisesAll.enterprises);

  //         const storedEnterprise = localStorage.getItem("selectedEnterprise");

  //         if (storedEnterprise) {
  //           const parsedEnterprise = JSON.parse(storedEnterprise);
  //           handleEnterpriseChange(parsedEnterprise);
  //         } else if (enterprisesList.length > 0) {
  //           handleEnterpriseChange(enterprisesList[0]);
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   };

  //   getListEnterprise();
  // }, [userData, refreshEnterprises, handleEnterpriseChange]);

  // useEffect(() => {
  //   const getUsers = async () => {
  //     try {
  //       const result = await getAllUsers();
  //       setListUsers(result.users);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   getUsers();
  // }, []);

  // useEffect(() => {
  //   const listInvitesUser = async () => {
  //     if (userData != null) {
  //       const result = await getInvites(userData.id.toString());
  //       setListInvitesUser(result.invites);
  //     }
  //   };

  //   listInvitesUser();
  // }, [userData]);

  // useEffect(() => {
  //   const listEnterprisesPivots = async () => {
  //     try {
  //       if (userData != null) {
  //         const result = await enterprisePivotUser(userData.id.toString());

  //         setEnterpriseAccpetByUser(result.enterprise_pivot);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   listEnterprisesPivots();
  // }, [userData]);

  // const handleSubmitForm = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (userData != null) {
  //     try {
  //       await createEnterprise(
  //         nameEnterprise,
  //         userData.id,
  //         descriptionEnterprise,
  //         "",
  //         linkEnterprise
  //       );
  //       setDescription("");
  //       setLinkEnterprise("");
  //       setNameEnterprise("");
  //       setRefreshEnterprises(!refreshEnterprises);
  //       toast.success("Empresa cadastrada com sucesso!");
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  // const handleClickEnterprise = (enterpriseItem: any) => {
  //   handleEnterpriseChange(enterpriseItem);
  //   toast.success("Empresa trocada com sucesso!");
  //   setOpenReplacesEnterprises(false);
  //   localStorage.removeItem("selectedEnvironment");
  // };

  // const handleClickEnvironments = (environmentItem: any) => {
  //   handleEnvironmentChange(environmentItem);
  //   toast.success("Pipeline trocada com sucesso");
  // };

  // const handleLogout = () => {
  //   logoutContext();
  // };

  // const handleClickEditEnterprise = (
  //   enterprise: any,
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   event.stopPropagation();
  //   setEnterpriseSelectedClick(enterprise);
  //   setOpenModalUpdate(true);
  //   setDescription(enterprise.description);
  //   setNameEnterprise(enterprise.name);
  //   setLinkEnterprise(enterprise.links);
  // };

  // const handleUpdateEnterprise = async (e: FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     if (
  //       userData != null &&
  //       enterprise != null &&
  //       enterpriseSelectClick != null
  //     ) {
  //       const result = await updateEnterprise(
  //         enterpriseSelectClick.id,
  //         nameEnterprise,
  //         descriptionEnterprise,
  //         linkEnterprise,
  //         userData.id
  //       );

  //       toast.success("Empresa atualizada com sucesso!");
  //       setOpenModalUpdate(false);
  //       setRefreshEnterprises(!refreshEnterprises);
  //       localStorage.setItem(
  //         "selectedEnterprise",
  //         JSON.stringify(result.enterprise)
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const filteredPeople =
  //   query.trim() === ""
  //     ? listUsers
  //     : listUsers.filter((person) => {
  //         return person.email.toLowerCase() === query.trim().toLowerCase();
  //       });

  // const handleInviteUsers = async (e: FormEvent) => {
  //   e.preventDefault();
  //   setLoadingButton(true);
  //   try {
  //     if (enterprise != null) {
  //       await inviteEnterpriseUser(
  //         selectedPerson.email,
  //         enterprise.id.toString()
  //       );

  //       toast.success("Convite enviado com sucesso");
  //       setOpenModalAddUserEnterprise(false);
  //       setSelectedPerson(null);
  //       setQuery("");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Selecione um usuário para enviar o convite");
  //   } finally {
  //     setLoadingButton(false);
  //   }
  // };

  // const handleAcceptInvite = async (enterprise_id: string) => {
  //   try {
  //     if (userData != null) {
  //       await acceptInvite(enterprise_id, userData.id.toString());
  //       toast.success("Convite aceito com sucesso!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

    // <>
    //   <div className="relative min-h-full">
    //     {location != "/login" &&
    //       location != "/registro" &&
    //       location != "/esqueceu-senha" && (
    //         <div className="pb-32 bg-gray-800">
    //           <Toaster position="top-right"></Toaster>

    //           <Disclosure as="nav" className="bg-gray-800">
    //             <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
    //               <div className="border-b border-gray-700">
    //                 <div className="flex items-center justify-between h-16 px-4 sm:px-0">
    //                   <div className="flex items-center">
    //                     <div className="flex-shrink-0">
    //                       <a href="/">
    //                         <img
    //                           alt="Your Company"
    //                           src={logo}
    //                           className="w-[70px]"
    //                         />
    //                       </a>
    //                     </div>
    //                     <div className="hidden md:block">
    //                       <div className="flex items-baseline ml-10 space-x-4">
    //                         {navigation.map((item) => (
    //                           <a
    //                             key={item.name}
    //                             href={item.href}
    //                             className={classNames(
    //                               location === item.href
    //                                 ? "bg-gray-900 text-white"
    //                                 : "text-gray-300 hover:bg-gray-700 hover:text-white",
    //                               "rounded-md px-3 py-2 text-sm font-medium"
    //                             )}
    //                           >
    //                             {item.name}
    //                           </a>
    //                         ))}
    //                       </div>
    //                     </div>
    //                   </div>
    //                   <div className="hidden md:block">
    //                     <div className="flex items-center ml-4 md:ml-6">
    //                       <button
    //                         onClick={() => setOpenModalTrashedItens(true)}
    //                         type="button"
    //                         className="ml-auto cursor-pointer"
    //                       >
    //                         <FaRegTrashAlt
    //                           className="w-5 h-5 mr-2"
    //                           fill="#ccc"
    //                         />
    //                       </button>

    //                       <Menu
    //                         as="div"
    //                         className="relative inline-block text-left"
    //                       >
    //                         <div>
    //                           <MenuButton className="relative p-1 text-gray-400 bg-gray-800 rounded-full outline-none hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
    //                             {listInvitesUser && (
    //                               <span className="absolute -inset-1.5 bg-indigo-600 rounded-full w-5 h-5 text-white left-3 text-sm">
    //                                 {listInvitesUser.length}
    //                               </span>
    //                             )}

    //                             <span className="sr-only">
    //                               View notifications
    //                             </span>
    //                             <BellIcon
    //                               aria-hidden="true"
    //                               className="w-6 h-6"
    //                             />
    //                           </MenuButton>
    //                         </div>

    //                         <MenuItems
    //                           transition
    //                           className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
    //                         >
    //                           <div className="py-1">
    //                             {listInvitesUser &&
    //                             listInvitesUser.length > 0 ? (
    //                               listInvitesUser.map((invite) => (
    //                                 <MenuItem key={invite.id}>
    //                                   <div className="pointer-events-auto w-full max-w-sm ring-1 ring-black ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
    //                                     <div className="p-4">
    //                                       <div className="flex items-start">
    //                                         <div className="flex-shrink-0 pt-0.5">
    //                                           <img
    //                                             alt=""
    //                                             src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
    //                                             className="w-10 h-10 rounded-full"
    //                                           />
    //                                         </div>
    //                                         <div className="flex-1 w-0 ml-3">
    //                                           <p className="text-sm font-medium text-gray-900">
    //                                             {invite.enterprise_name}
    //                                           </p>
    //                                           <p className="mt-1 text-sm text-gray-500">
    //                                             enviou um convite para entrar na
    //                                             empresa dele.!
    //                                           </p>
    //                                           <div className="flex mt-4">
    //                                             <button
    //                                               onClick={() =>
    //                                                 handleAcceptInvite(
    //                                                   invite.enterprise_id
    //                                                 )
    //                                               }
    //                                               type="button"
    //                                               className="inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    //                                             >
    //                                               Aceitar
    //                                             </button>
    //                                             <button
    //                                               type="button"
    //                                               className="ml-3 inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    //                                             >
    //                                               Recusar
    //                                             </button>
    //                                           </div>
    //                                         </div>
    //                                       </div>
    //                                     </div>
    //                                   </div>
    //                                 </MenuItem>
    //                               ))
    //                             ) : (
    //                               <MenuItem>
    //                                 <p className="p-2 text-center">
    //                                   Nenhuma notificação.
    //                                 </p>
    //                               </MenuItem>
    //                             )}
    //                           </div>
    //                         </MenuItems>
    //                       </Menu>

    //                       {/* Profile dropdown */}
    //                       <Menu as="div" className="relative ml-3">
    //                         <div>
    //                           <MenuButton className="relative flex items-center max-w-xs text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
    //                             <span className="absolute -inset-1.5" />
    //                             <span className="sr-only">Open user menu</span>
    //                             {userData != null && (
    //                               <span
    //                                 style={{
    //                                   backgroundColor: getBackgroundColor(
    //                                     userData.name.charAt(0).toUpperCase()
    //                                   ),
    //                                 }}
    //                                 className={`inline-flex items-center justify-center rounded-full w-9 h-9`}
    //                               >
    //                                 <span className="font-medium leading-none text-white">
    //                                   {userData.name.charAt(0).toUpperCase()}
    //                                 </span>
    //                               </span>
    //                             )}
    //                           </MenuButton>
    //                         </div>
    //                         <MenuItems
    //                           transition
    //                           className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
    //                         >
    //                           {userData != null && (
    //                             <MenuItem>
    //                               <Link
    //                                 to="/profile-user"
    //                                 className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
    //                               >
    //                                 {userData.name}
    //                                 <svg
    //                                   xmlns="http://www.w3.org/2000/svg"
    //                                   fill="none"
    //                                   viewBox="0 0 24 24"
    //                                   strokeWidth={1.5}
    //                                   stroke="currentColor"
    //                                   className="size-6"
    //                                 >
    //                                   <path
    //                                     strokeLinecap="round"
    //                                     strokeLinejoin="round"
    //                                     d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    //                                   />
    //                                 </svg>
    //                               </Link>
    //                             </MenuItem>
    //                           )}

    //                           <MenuItem>
    //                             <a
    //                               href="/settings"
    //                               className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
    //                             >
    //                               Configurações
    //                             </a>
    //                           </MenuItem>

    //                           <MenuItem>
    //                             <a
    //                               onClick={() =>
    //                                 setOpenModalAddUserEnterprise(true)
    //                               }
    //                               href="#"
    //                               className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
    //                             >
    //                               Convidar membro
    //                             </a>
    //                           </MenuItem>

    //                           {enterprise != null && userData != null && (
    //                             <>
    //                               <MenuItem>
    //                                 <p
    //                                   onClick={() =>
    //                                     setOpenReplacesEnterprises(true)
    //                                   }
    //                                   className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 cursor-pointer"
    //                                 >
    //                                   {enterprise.name}
    //                                   <svg
    //                                     xmlns="http://www.w3.org/2000/svg"
    //                                     viewBox="0 0 20 20"
    //                                     fill="currentColor"
    //                                     className="size-5"
    //                                   >
    //                                     <path
    //                                       fillRule="evenodd"
    //                                       d="M13.2 2.24a.75.75 0 0 0 .04 1.06l2.1 1.95H6.75a.75.75 0 0 0 0 1.5h8.59l-2.1 1.95a.75.75 0 1 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 0 0-1.06.04Zm-6.4 8a.75.75 0 0 0-1.06-.04l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 1 0 1.02-1.1l-2.1-1.95h8.59a.75.75 0 0 0 0-1.5H4.66l2.1-1.95a.75.75 0 0 0 .04-1.06Z"
    //                                       clipRule="evenodd"
    //                                     />
    //                                   </svg>
    //                                 </p>
    //                               </MenuItem>
    //                             </>
    //                           )}

    //                           <MenuItem>
    //                             <p
    //                               onClick={handleLogout}
    //                               className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 cursor-pointer"
    //                             >
    //                               Sair
    //                               <MdLogout className="size-5" />
    //                             </p>
    //                           </MenuItem>
    //                         </MenuItems>
    //                       </Menu>
    //                     </div>
    //                   </div>
    //                   <div className="flex -mr-2 md:hidden">
    //                     {/* Mobile menu button */}
    //                     <DisclosureButton className="relative inline-flex items-center justify-center p-2 text-gray-400 bg-gray-800 rounded-md group hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
    //                       <span className="absolute -inset-0.5" />
    //                       <span className="sr-only">Open main menu</span>
    //                       <Bars3Icon
    //                         aria-hidden="true"
    //                         className="block h-6 w-6 group-data-[open]:hidden"
    //                       />
    //                       <XMarkIcon
    //                         aria-hidden="true"
    //                         className="hidden h-6 w-6 group-data-[open]:block"
    //                       />
    //                     </DisclosureButton>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>

    //             <DisclosurePanel className="border-b border-gray-700 md:hidden">
    //               <div className="px-2 py-3 space-y-1 sm:px-3">
    //                 {navigation.map((item) => (
    //                   <DisclosureButton
    //                     key={item.name}
    //                     as="a"
    //                     href={item.href}
    //                     aria-current={item.current ? "page" : undefined}
    //                     className={classNames(
    //                       item.current
    //                         ? "bg-gray-900 text-white"
    //                         : "text-gray-300 hover:bg-gray-700 hover:text-white",
    //                       "block rounded-md px-3 py-2 text-base font-medium"
    //                     )}
    //                   >
    //                     {item.name}
    //                   </DisclosureButton>
    //                 ))}
    //               </div>
    //               <div className="pt-4 pb-3 border-t border-gray-700">
    //                 <div className="flex items-center px-5">
    //                   <div className="flex-shrink-0">
    //                     <img
    //                       alt=""
    //                       src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    //                       className="w-10 h-10 rounded-full"
    //                     />
    //                   </div>
    //                   <div className="ml-3">
    //                     {userData != null && (
    //                       <>
    //                         <div className="text-base font-medium leading-none text-white">
    //                           {userData.name}
    //                         </div>
    //                         <div className="text-sm font-medium leading-none text-gray-400">
    //                           {userData.email}
    //                         </div>
    //                       </>
    //                     )}
    //                   </div>
    //                   <button
    //                     type="button"
    //                     className="relative flex-shrink-0 p-1 ml-auto text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
    //                   >
    //                     <span className="absolute -inset-1.5" />
    //                     <span className="sr-only">View notifications</span>
    //                     <BellIcon aria-hidden="true" className="w-6 h-6" />
    //                   </button>
    //                 </div>
    //                 <div className="px-2 mt-3 space-y-1">
    //                   <DisclosureButton className="block px-3 py-2 text-base font-medium text-gray-400 rounded-md hover:bg-gray-700 hover:text-white">
    //                     Configurações
    //                   </DisclosureButton>

    //                   <DisclosureButton className="block px-3 py-2 text-base font-medium text-gray-400 rounded-md hover:bg-gray-700 hover:text-white">
    //                     Nome da empresa
    //                   </DisclosureButton>
    //                 </div>
    //               </div>
    //             </DisclosurePanel>
    //           </Disclosure>
    //           <header className="py-10">
    //             <div className="flex items-center gap-6 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
    //               {location === "/settings" && (
    //                 <Link to="/opportunity">
    //                   <svg
    //                     xmlns="http://www.w3.org/2000/svg"
    //                     fill="none"
    //                     viewBox="0 0 24 24"
    //                     strokeWidth={1.5}
    //                     stroke="currentColor"
    //                     className="text-white size-6"
    //                   >
    //                     <path
    //                       strokeLinecap="round"
    //                       strokeLinejoin="round"
    //                       d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
    //                     />
    //                   </svg>
    //                 </Link>
    //               )}

    //               <div className="flex flex-row items-center justify-between w-full">
    //                 <div className="flex flex-row flex-1 gap-5">
    //                   <h1 className="text-3xl font-bold tracking-tight text-white">
    //                     {title}
    //                   </h1>
    //                   {location === "/opportunity" && enterprise != null && (
    //                     <Listbox>
    //                       <Label className="sr-only">
    //                         Change published status
    //                       </Label>
    //                       <div className="relative">
    //                         <div className="inline-flex divide-x divide-indigo-700 rounded-md shadow-sm">
    //                           <div className="inline-flex items-center gap-x-1.5 rounded-l-md bg-white border border-indigo-600 px-3 py-2 text-dark shadow-sm">
    //                             <ListboxButton className="text-sm font-semibold">
    //                               {environment?.name}
    //                             </ListboxButton>
    //                           </div>
    //                           <ListboxButton className="inline-flex items-center p-2 bg-indigo-600 rounded-l-none rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-50">
    //                             <span className="sr-only">
    //                               Change published status
    //                             </span>
    //                             <ChevronDownIcon
    //                               aria-hidden="true"
    //                               className="w-5 h-5 text-white"
    //                             />
    //                           </ListboxButton>
    //                         </div>

    //                         <ListboxOptions
    //                           transition
    //                           className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in"
    //                         >
    //                           {environmentsEnterprise && (
    //                             <>
    //                               {environmentsEnterprise.map((environment) => (
    //                                 <ListboxOption
    //                                   onClick={() =>
    //                                     handleClickEnvironments(environment)
    //                                   }
    //                                   key={environment.id}
    //                                   value={environment}
    //                                   className="group cursor-pointer select-none p-4 text-sm text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
    //                                 >
    //                                   <div className="flex flex-col">
    //                                     <div className="flex justify-between">
    //                                       <p className="font-normal group-data-[selected]:font-semibold">
    //                                         {environment.name}
    //                                       </p>
    //                                       <span className="text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
    //                                         <CheckIcon
    //                                           aria-hidden="true"
    //                                           className="w-5 h-5"
    //                                         />
    //                                       </span>
    //                                     </div>
    //                                   </div>
    //                                 </ListboxOption>
    //                               ))}
    //                             </>
    //                           )}

    //                           <ListboxOption
    //                             value=" "
    //                             className="group cursor-default select-none text-sm text-purple-700 bg-purple-50 data-[focus]:bg-indigo-600 data-[focus]:text-white"
    //                           >
    //                             <Link to="/settings" className="flex flex-col">
    //                               <div className="flex items-center gap-2 p-4">
    //                                 <IoMdSettings className="text-purple-700 size-5" />
    //                                 <p className="font-semibold group-data-[selected]:font-semibold">
    //                                   Configurações do pipeline
    //                                 </p>
    //                                 <span className="text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
    //                                   <CheckIcon
    //                                     aria-hidden="true"
    //                                     className="w-5 h-5"
    //                                   />
    //                                 </span>
    //                               </div>
    //                             </Link>
    //                           </ListboxOption>
    //                         </ListboxOptions>
    //                       </div>
    //                     </Listbox>
    //                   )}
    //                 </div>
    //                 <div className="flex flex-row gap-5">
    //                   {rightButtonsTitle && (
    //                     <div className="">{rightButtonsTitle}</div>
    //                   )}

    //                   {location === "/opportunity" && (
    //                     <>
    //                       <div className="flex items-center justify-end gap-3 ml-auto">
    //                         <div
    //                           onClick={() => setOpenModalConfigPipeline(true)}
    //                           className="ml-auto cursor-pointer config-btn"
    //                         >
    //                           <IoMdSettings className="size-8" fill="#fff" />
    //                         </div>
    //                       </div>
    //                       <SettingsPipeline
    //                         isOpenModal={openModalConfigPipeline}
    //                         setIsOpenModal={setOpenModalConfigPipeline}
    //                       ></SettingsPipeline>
    //                     </>
    //                   )}
    //                 </div>
    //               </div>
    //             </div>
    //           </header>
    //         </div>
    //       )}

    //     {location != "/login" &&
    //     location != "/registro" &&
    //     location != "/esqueceu-senha" &&
    //     location != "/opportunity" ? (
    //       <main className="-mt-32">
    //         <div className="px-4 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
    //           <div className="px-5 py-4 bg-white rounded-lg shadow sm:px-6">
    //             {children}
    //           </div>
    //         </div>
    //       </main>
    //     ) : (
    //       <div className="flex flex-1">{children}</div>
    //     )}
    //   </div>

      

    //   <Dialog
    //     open={openModalCreateEnterprise}
    //     onClose={setOpenModalCreateEnterprise}
    //     className="relative z-10"
    //   >
    //     <div className="fixed inset-0" />

    //     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0">
    //       <div className="absolute inset-0 overflow-hidden">
    //         <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
    //           <DialogPanel
    //             transition
    //             className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
    //           >
    //             <form
    //               method="POST"
    //               onSubmit={handleSubmitForm}
    //               className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl"
    //             >
    //               <div className="flex flex-col flex-1 min-h-0 py-6 overflow-y-scroll">
    //                 <div className="px-4 sm:px-6">
    //                   <div className="flex items-start justify-between">
    //                     <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
    //                       Cadastrar empresa
    //                     </DialogTitle>
    //                     <div className="flex items-center ml-3 h-7">
    //                       <button
    //                         type="button"
    //                         onClick={() => setOpenModalCreateEnterprise(false)}
    //                         className="relative text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //                       >
    //                         <span className="absolute -inset-2.5" />
    //                         <span className="sr-only">Close panel</span>
    //                         <XMarkIcon aria-hidden="true" className="w-6 h-6" />
    //                       </button>
    //                     </div>
    //                   </div>
    //                 </div>
    //                 <div className="relative flex-1 px-4 mt-6 sm:px-6">
    //                   <div className="mb-6">
    //                     <label
    //                       htmlFor="email"
    //                       className="block text-sm font-medium leading-6 text-gray-900"
    //                     >
    //                       Nome da empresa
    //                     </label>
    //                     <div className="mt-2">
    //                       <input
    //                         value={nameEnterprise}
    //                         onChange={(e) => setNameEnterprise(e.target.value)}
    //                         id="name"
    //                         name="name"
    //                         required
    //                         type="text"
    //                         placeholder="Digite um nome da sua empresa..."
    //                         className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //                       />
    //                     </div>
    //                   </div>

    //                   <div className="mb-6">
    //                     <label
    //                       htmlFor="comment"
    //                       className="block text-sm font-medium leading-6 text-gray-900"
    //                     >
    //                       Descrição
    //                     </label>
    //                     <div className="mt-2">
    //                       <textarea
    //                         value={descriptionEnterprise}
    //                         onChange={(e) => setDescription(e.target.value)}
    //                         id="comment"
    //                         name="comment"
    //                         rows={4}
    //                         className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //                         defaultValue={""}
    //                       />
    //                     </div>
    //                   </div>

    //                   <div className="mb-6">
    //                     <label
    //                       htmlFor="company-website"
    //                       className="block text-sm font-medium leading-6 text-gray-900"
    //                     >
    //                       Link
    //                     </label>
    //                     <div className="mt-2">
    //                       <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
    //                         <span className="flex items-center pl-3 text-gray-500 select-none sm:text-sm">
    //                           http://
    //                         </span>
    //                         <input
    //                           value={linkEnterprise}
    //                           onChange={(e) =>
    //                             setLinkEnterprise(e.target.value)
    //                           }
    //                           id="company-website"
    //                           name="company-website"
    //                           type="text"
    //                           placeholder="www.example.com"
    //                           className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
    //                         />
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //               <div className="flex justify-end flex-shrink-0 px-4 py-4">
    //                 <button
    //                   type="button"
    //                   onClick={() => setOpenModalCreateEnterprise(false)}
    //                   className="px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
    //                 >
    //                   Cancelar
    //                 </button>
    //                 <button
    //                   type="submit"
    //                   className="inline-flex justify-center px-3 py-2 ml-4 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    //                 >
    //                   Salvar
    //                 </button>
    //               </div>
    //             </form>
    //           </DialogPanel>
    //         </div>
    //       </div>
    //     </div>
    //   </Dialog>

    //   <Dialog
    //     open={openModalUpdate}
    //     onClose={setOpenModalUpdate}
    //     className="relative z-10"
    //   >
    //     <div className="fixed inset-0" />

    //     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0">
    //       <div className="absolute inset-0 overflow-hidden">
    //         <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
    //           <DialogPanel
    //             transition
    //             className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
    //           >
    //             <form
    //               method="POST"
    //               onSubmit={handleUpdateEnterprise}
    //               className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl"
    //             >
    //               <div className="flex flex-col flex-1 min-h-0 py-6 overflow-y-scroll">
    //                 <div className="px-4 sm:px-6">
    //                   <div className="flex items-start justify-between">
    //                     <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
    //                       Cadastrar empresa
    //                     </DialogTitle>
    //                     <div className="flex items-center ml-3 h-7">
    //                       <button
    //                         type="button"
    //                         onClick={() => setOpenModalUpdate(false)}
    //                         className="relative text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    //                       >
    //                         <span className="absolute -inset-2.5" />
    //                         <span className="sr-only">Close panel</span>
    //                         <XMarkIcon aria-hidden="true" className="w-6 h-6" />
    //                       </button>
    //                     </div>
    //                   </div>
    //                 </div>
    //                 <div className="relative flex-1 px-4 mt-6 sm:px-6">
    //                   <div className="mb-6">
    //                     <label
    //                       htmlFor="email"
    //                       className="block text-sm font-medium leading-6 text-gray-900"
    //                     >
    //                       Nome da empresa
    //                     </label>
    //                     <div className="mt-2">
    //                       <input
    //                         value={nameEnterprise}
    //                         onChange={(e) => setNameEnterprise(e.target.value)}
    //                         id="name"
    //                         name="name"
    //                         required
    //                         type="text"
    //                         placeholder="Digite um nome da sua empresa..."
    //                         className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //                       />
    //                     </div>
    //                   </div>

    //                   <div className="mb-6">
    //                     <label
    //                       htmlFor="comment"
    //                       className="block text-sm font-medium leading-6 text-gray-900"
    //                     >
    //                       Descrição
    //                     </label>
    //                     <div className="mt-2">
    //                       <textarea
    //                         value={descriptionEnterprise}
    //                         onChange={(e) => setDescription(e.target.value)}
    //                         id="comment"
    //                         name="comment"
    //                         rows={4}
    //                         className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    //                         defaultValue={""}
    //                       />
    //                     </div>
    //                   </div>

    //                   <div className="mb-6">
    //                     <label
    //                       htmlFor="company-website"
    //                       className="block text-sm font-medium leading-6 text-gray-900"
    //                     >
    //                       Link
    //                     </label>
    //                     <div className="mt-2">
    //                       <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
    //                         <span className="flex items-center pl-3 text-gray-500 select-none sm:text-sm">
    //                           http://
    //                         </span>
    //                         <input
    //                           value={linkEnterprise}
    //                           onChange={(e) =>
    //                             setLinkEnterprise(e.target.value)
    //                           }
    //                           id="company-website"
    //                           name="company-website"
    //                           type="text"
    //                           placeholder="www.example.com"
    //                           className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
    //                         />
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //               <div className="flex justify-end flex-shrink-0 px-4 py-4">
    //                 <button
    //                   type="button"
    //                   onClick={() => setOpenModalUpdate(false)}
    //                   className="px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
    //                 >
    //                   Cancelar
    //                 </button>
    //                 <button
    //                   type="submit"
    //                   className="inline-flex justify-center px-3 py-2 ml-4 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    //                 >
    //                   Salvar
    //                 </button>
    //               </div>
    //             </form>
    //           </DialogPanel>
    //         </div>
    //       </div>
    //     </div>
    //   </Dialog>

    //  
    //   <TrashedItens
    //     isOpen={openModalTrashedItens}
    //     setIsOpen={setOpenModalTrashedItens}
    //   ></TrashedItens>
    // </>



