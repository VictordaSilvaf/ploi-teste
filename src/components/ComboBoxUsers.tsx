import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { FC, useEffect, useState } from "react";
import { getAllUsers } from "../api/users/usersApi";

const ComboBoxUsers: FC = () => {

    const [listUsers, setListUsers] = useState<
    { id: string; email: string; name: string }[]
  >([]);

  const [query, setQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<{
    email: string;
  } | null>(null);

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

  const filteredPeople =
    query.trim() === ""
      ? listUsers
      : listUsers.filter((person) => {
        return person.email.toLowerCase() === query.trim().toLowerCase();
      });

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


  const handleClickCloseUser = () => {
    setQuery("")
    setSelectedPerson(null);
  }

  return (
    <Combobox
      as="div"
      value={selectedPerson}
      onChange={(person) => {
        setQuery("");
        setSelectedPerson(person);
      }}
    >
      {/* <Label className="block text-sm font-medium leading-6 text-gray-900">
        Encontrar usuário
      </Label> */}
      <div className="relative">
        <ComboboxInput
          className="w-full border-0 transition-all hover:bg-gray-300 bg-white py-1.5 pl-3  text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="Vazio..."
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery("")}
        />

        {selectedPerson && (
          <div className="absolute flex items-center rounded-lg left-2 top-1 bg-gray-50">
            <p className="inline-block p-1 text-sm ">{selectedPerson.email}</p>
            <button
            onClick={handleClickCloseUser}
              type="button"
              className="transition-all rounded-full hover:bg-gray-100"
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
          </div>
        )}

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
                  <CheckIcon className="w-5 h-5" aria-hidden="true" />
                </span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
};

export default ComboBoxUsers;
