import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Dialog, DialogPanel, DialogTitle, Label } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { FC, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useEnterpriseContext } from "../context/EnterpriseContext";
import { inviteEnterpriseUser } from "../api/enterprise/enterpriseApi";
import { getAllUsers } from "../api/users/usersApi";


interface InviteMembersProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const InviteMembers: FC<InviteMembersProps> = ({ isOpen, setIsOpen }) => {

    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const [selectedPerson, setSelectedPerson] = useState<{
        email: string;
    } | null>(null);

    const { enterprise } = useEnterpriseContext();
    

    const [listUsers, setListUsers] = useState<
        { id: string; email: string; name: string }[]
    >([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const result = await getAllUsers();
                setListUsers(result.users);
            } catch (error) {
                console.log(error);
            }
        };

        getUsers();
    }, []);

    const [query, setQuery] = useState("");

    const filteredPeople =
        query.trim() === ""
            ? listUsers
            : listUsers.filter((person) => {
                return person.email.toLowerCase() === query.trim().toLowerCase();
            });

    const handleInviteUsers = async (e: FormEvent) => {
        e.preventDefault();
        setLoadingButton(true);
        try {
            if (enterprise != null && selectedPerson != null) {
                await inviteEnterpriseUser(
                    selectedPerson.email,
                    enterprise.id.toString()
                );

                toast.success("Convite enviado com sucesso");
                setIsOpen(false);
                setSelectedPerson(null);
                setQuery("");
            }
        } catch (error) {
            console.log(error);
            toast.error("Selecione um usuário para enviar o convite");
        } finally {
            setLoadingButton(false);
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
        <Dialog
            open={isOpen}
            onClose={setIsOpen}
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
                                onSubmit={handleInviteUsers}
                                className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl"
                            >
                                <div className="flex flex-col flex-1 min-h-0 py-6 overflow-y-scroll">
                                    <div className="px-4 sm:px-6">
                                        <div className="flex items-start justify-between">
                                            <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                                                Vincular usuário na empresa
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
                                    <div className="relative flex-1 px-4 mt-6 sm:px-6">
                                        <Combobox
                                            as="div"
                                            value={selectedPerson}
                                            onChange={(person) => {
                                                setQuery("");
                                                setSelectedPerson(person);
                                            }}
                                        >
                                            <Label className="block text-sm font-medium leading-6 text-gray-900">
                                                Encontrar usuário
                                            </Label>
                                            <div className="relative mt-2">
                                                <ComboboxInput
                                                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    onChange={(event) => setQuery(event.target.value)}
                                                    onBlur={() => setQuery("")}
                                                    displayValue={(person: any | null) =>
                                                        person ? person.email : ""
                                                    }
                                                />


                                                {filteredPeople.length > 0 && (
                                                    <ComboboxOptions className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-56 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                                                                    <CheckIcon
                                                                        className="w-5 h-5"
                                                                        aria-hidden="true"
                                                                    />
                                                                </span>
                                                            </ComboboxOption>
                                                        ))}
                                                    </ComboboxOptions>
                                                )}
                                            </div>
                                        </Combobox>
                                    </div>
                                </div>
                                <div className="flex justify-end flex-shrink-0 px-4 py-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className={`inline-flex justify-center px-3 py-2 ml-4 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${loadingButton ? "opacity-50 cursor-not-allowed" : ""
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
                                                Enviando...
                                            </>
                                        ) : (
                                            "Enviar convite"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </DialogPanel>
                    </div>
                </div>
            </div>
        </Dialog>
    )

}

export default InviteMembers