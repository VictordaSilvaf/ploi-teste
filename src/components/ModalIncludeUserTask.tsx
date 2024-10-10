/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


import { FC, useEffect, useRef, useState } from "react";
import { useEnterpriseContext } from "../context/EnterpriseContext";
import { userInEnterprise } from "../api/enterprise/enterpriseApi";
import {
  deleteResponsable,
  responsableCardPeople,
} from "../api/responsable/responsableApi";
import toast from "react-hot-toast";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import Badge from "./Badge";
import { CheckIcon } from "@heroicons/react/20/solid";

interface ModalIncludeUsersProps {
  open: boolean;
  card_id: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refreshResponsable: boolean;
  setRefreshResponsable: React.Dispatch<React.SetStateAction<boolean>>;
  listResponsable: [];
}

const ModalIncludeUserTask: FC<ModalIncludeUsersProps> = ({
  card_id,
  setRefreshResponsable,
  refreshResponsable,
  listResponsable,
}) => {
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

  const [selectedUsers, setSelectedUsers] = useState<
    {
      id: number;
      name: string;
      email?: string;
    }[]
  >([]);

  const [showModalUserEnterprise, setShowModalUserEnterprise] =
    useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const modalRef = useRef(null);
  const [listUsers, setListUsers] = useState<[]>([]);

  const { enterprise } = useEnterpriseContext();

  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleSubmitResponsable = async (user_id: string) => {
    try {
      await responsableCardPeople(user_id, card_id.toString());

      setRefreshResponsable(!refreshResponsable);
      toast.success("Responsável alocado a tarefa com sucesso!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveResposable = async (id: string) => {
    try {
      await deleteResponsable(id);
      toast.success("responsavel removido com sucesso");
      setRefreshResponsable(!refreshResponsable);
      setSelectedUsers([]);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredPeople =
    query === ""
      ? listUsers
      : listUsers.filter((person: any) => {
          return person.email.toLowerCase().includes(query.toLowerCase());
        });

  useEffect(() => {
    const getUsers = async () => {
      try {
        if (enterprise != null) {
          const result = await userInEnterprise(enterprise.id.toString());

          setListUsers(result.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [enterprise]);




  return (
    <Combobox
      as="div"
      className="w-full"
      onChange={(
        person: {
          id: number;
          email: string;
          name: string;
        } | null
      ) => {
        if (person && !selectedUsers.some((user) => user.id === person.id)) {
          setSelectedUsers([
            ...selectedUsers,
            {
              id: person.id,
              email: person.email,
              name: person.name,
            },
          ]);
          setQuery("");
          handleSubmitResponsable(person.id);
        }
      }}
    >
      <div className="gap-3 pr-0.5 flex flex-row items-center rounded-md border-0 py-0.5 bg-white text-gray-900  ring-0 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        <div className="flex flex-row gap-x-3">
          {selectedUsers && (
            <div className="py-1.5">
              {selectedUsers.map((person) => (
                <Badge
                  key={person.id}
                  color="indigo"
                  style={{ marginLeft: 12 }}
                >
                  {person.email}

                  <button
                    onClick={() => setSelectedUsers([])}
                    type="button"
                    className="ml-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {listResponsable && (
            <div className="py-1.5">
              {listResponsable.map((person: any) => (
                <Badge
                  key={person.user.id}
                  color="indigo"
                  style={{ marginLeft: 12 }}
                >
                  {person.user.name}

                  <button
                    onClick={() => handleRemoveResposable(person.id)}
                    type="button"
                    className="ml-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-4"
                    >
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        <ComboboxInput
          className="flex-1 text-sm border-none focus:ring-0 focus:border-none"
          placeholder="Adicionar pessoas"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          
          onBlur={() => {
            setQuery("");
            setIsFocused(false)
          }}
          
          onFocus={() => setIsFocused(true)}
        />

        {isFocused &&
          filteredPeople.length > 0 && ( // Verifica se o input está focado e se há pessoas filtradas
            <ComboboxOptions className="absolute z-10 py-1 overflow-auto text-base bg-white rounded-md shadow-lg top-14 max-h-56 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPeople.map((person) => (
                <ComboboxOption
                  key={person.id}
                  value={person}
                  className="group relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                >
                  <div className="flex items-center">
                    <span
                      style={{
                        backgroundColor: getBackgroundColor(
                          person.name.charAt(0).toUpperCase()
                        ),
                      }}
                      className={`inline-flex items-center justify-center rounded-full w-6 h-6`}
                    >
                      <span className="font-medium leading-none text-white">
                        {person.name.charAt(0).toUpperCase()}
                      </span>
                    </span>
                    <span className="ml-3 truncate group-data-[selected]:font-semibold">
                      {person.email}
                    </span>
                  </div>

                  <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                    <CheckIcon className="w-5 h-5" aria-hidden="true" />
                  </span>
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          )}
      </div>
    </Combobox>
    // <div className="relative">
    //   {listResponsable && listResponsable.length > 0 ?

    //     listResponsable.map((userSelected) =>
    //       <div className="flex items-center gap-2 mb-3">
    //         <span
    //           style={{
    //             backgroundColor: getBackgroundColor(
    //               userSelected.user.name.charAt(0).toUpperCase()
    //             ),
    //           }}
    //           className="inline-flex items-center justify-center w-6 h-6 rounded-full"
    //         >
    //           <span className="text-xs font-medium text-white">
    //             {userSelected.user.name.charAt(0).toUpperCase()}
    //           </span>
    //         </span>
    //         <div className="text-sm text-gray-500">{userSelected.user.email}</div>
    //         <button onClick={() => handleRemoveResposable(userSelected.id)} type="button" className="text-gray-500">
    //           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
    //             <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    //           </svg>

    //         </button>
    //       </div>
    //     )

    //     :
    //     <button onClick={() => setShowModalUserEnterprise(true)} type="button" className="peer pl-3 text-left block text-gray-500 resize-none border-0 transition-all hover:bg-gray-300 w-full  bg-white py-1.5  focus:ring-0 sm:text-sm sm:leading-6">
    //       Selecione pessoas para tarefa...
    //     </button>
    //   }

    //   {showModalUserEnterprise &&
    //     <div ref={modalRef} className="wrapper-reponsable px-3 py-5 absolute w-full z-20  overflow-y-scroll bg-white border rounded-lg shadow-lg h-[300px]">

    //       <input
    //         value={query}
    //         onFocus={() => setIsFocused(true)}
    //         onChange={(e) => setQuery(e.target.value)}
    //         name="etiquetas"
    //         placeholder="E-mail do responsável..."
    //         className="block w-full mb-5 rounded-md border-0 py-1.5  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
    //       {isFocused && (
    //         <>
    //           {filteredPeople && filteredPeople.map((userEnterprise: any, index) =>

    //             <div onClick={() => handleSubmitResponsable(userEnterprise.id)} key={index} className="flex items-center p-1 transition-all cursor-pointer gap-x-2 hover:bg-gray-300">
    //               <span
    //                 style={{
    //                   backgroundColor: getBackgroundColor(
    //                     userEnterprise.name.charAt(0).toUpperCase()
    //                   ),
    //                 }}
    //                 className="inline-flex items-center justify-center w-6 h-6 rounded-full"
    //               >
    //                 <span className="text-xs font-medium text-white">
    //                   {userEnterprise.name.charAt(0).toUpperCase()}
    //                 </span>
    //               </span>
    //               <div className="text-sm text-gray-500">{userEnterprise.email}</div>
    //             </div>
    //           )}
    //         </>

    //       )}

    //     </div>
    //   }

    //   {/* <Multiselect
    //     placeholder="Selecione pessoas para tarefa"
    //     className="w-full"
    //     options={listUsers} // Opções para exibir no dropdown
    //     selectedValues={selectedUsers} // Valores pré-selecionados (listResponsable)
    //     onSelect={onSelect} // Função chamada ao selecionar uma opção
    //     onRemove={onRemove} // Função chamada ao remover uma opção
    //     displayValue="email" // Propriedade do objeto para exibir no dropdown
    //     showCheckbox={false} // Mostra um checkbox para seleção múltipla (opcional)
    //   /> */}
    // </div>
  );
};

export default ModalIncludeUserTask;
