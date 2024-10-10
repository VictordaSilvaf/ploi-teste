import toast from "react-hot-toast";

import { FormEvent, useEffect, useState } from "react";
import { userInEnterprise } from "../../api/enterprise/enterpriseApi";
import { useEnterpriseContext } from "../../context/EnterpriseContext";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import Badge from "../../components/Badge";
import { useParams } from "react-router-dom";
import Aside from "../../components/Aside";
import { InvisibleInput } from "../../components/InvisibleInput";
import { getNoteDetails, updateNote } from "../../api/notes/notesApi";

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

export default function NotesNew() {
  const [loading, setLoading] = useState(false);
  const { enterprise } = useEnterpriseContext();
  const [query, setQuery] = useState("");
  const [listUsers, setListUsers] = useState<
    { id: string; email: string; name: string }[]
  >([]);

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const { id } = useParams();
  const [selectedUsers, setSelectedUsers] = useState<
    {
      id: number;
      name: string;
      email?: string;
    }[]
  >([]);

  const filteredPeople =
    query.trim() === ""
      ? listUsers
      : listUsers.filter((person) => {
          return person.email.toLowerCase() === query.trim().toLowerCase();
        });

  const getBackgroundColor = (letter: string): string => {
    const upperLetter = letter.toUpperCase();
    return alphabetColors[upperLetter] || "#D1D5DB"; // Cor padrão em hexadecimal (cinza)
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (id)
        updateNote(title, description, tags, selectedUsers, id)
          .then((response) => {
            if (!response.message) {
              throw new Error("Network response was not ok");
            }
          })
          .catch((error) => {
            console.error("Failed to create note:", error);
            toast.error("Erro ao criar nota");
          });
    } catch (error) {
      console.error("Failed to create note:", error);
      // Handle error (e.g., show an error message)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        if (enterprise?.id) {
          const result = await userInEnterprise(enterprise.id.toString());
          setListUsers(result.users);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, [enterprise?.id]);

  useEffect(() => {
    if (id) {
      const getNote = async () => {
        try {
          const data = await getNoteDetails(id);
          setTitle(data.title);
          setDescription(data.description);
          setTags(
            data.tag.map((t: { content: string }) => t.content).join(", ")
          );
          setSelectedUsers(data.mark || []);

          console.log(data.mark);
        } catch (error) {
          console.error("Failed to fetch note:", error);
          // Handle error (e.g., show an error message)
        }
      };

      getNote();
    }
  }, [id]);

  return (
    <Aside>
      {!loading ? (
        <>
          <div>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              <div className="relative flex-1 w-full">
                <div className="flex flex-row flex-1 w-full gap-4">
                  <Combobox
                    as="div"
                    className="w-full"
                    onChange={(
                      person: { id: number; email: string; name: string } | null
                    ) => {
                      if (
                        person &&
                        !selectedUsers.some((user) => user.id === person.id)
                      ) {
                        setSelectedUsers([
                          ...selectedUsers,
                          {
                            id: person.id,
                            email: person.email,
                            name: person.name,
                          },
                        ]);
                        setQuery("");
                      }
                    }}
                  >
                    <div className="gap-3 pr-0.5 flex flex-row items-center rounded-md border-0 py-0.5 bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
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
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <ComboboxInput
                        className="flex-1 border-none focus:ring-0 focus:border-none"
                        placeholder="Adicionar pessoas"
                        onChange={(event) => {
                          setQuery(event.target.value);
                        }}
                        onBlur={(e) => {
                          setQuery("");
                          handleSubmit(e);
                        }}
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

                  <input
                    placeholder="Ex: tag1, tag2, tag3"
                    type="text"
                    id="tag"
                    name="tag"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    onBlur={(e) => handleSubmit(e)}
                    className="block w-1/3 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <InvisibleInput
                value={title}
                setValue={setTitle}
                onBlur={(e) => handleSubmit(e)}
                onChange={(e) => setTitle(e.target.value)}
                id="title"
                name="title"
                placeholder="Título"
                style={{ fontSize: "1.875rem" }}
              />
              <div>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Digíte aqui a descrição da nota"
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={(e) => handleSubmit(e)}
                  value={description ?? ""}
                  rows={3}
                  className="block w-full mt-1 border-none rounded-md min-h-96 focus:ring-0"
                ></textarea>
              </div>

              {/* <div className="flex justify-end mt-5 sm:mt-6 gap-x-4">
                <a href="/notes" className="">
                  <BaseButton type="button" variation="border">
                    Voltar
                  </BaseButton>
                </a>
                <div className="">
                  <BaseButton type="submit">Criar nova tarefa</BaseButton>
                </div>
              </div> */}
            </form>
          </div>
        </>
      ) : (
        <div className="min-h-[50vh] h-full text-app-primary flex justify-center items-center">
          <svg className="w-10 h-10 mr-3 animate-spin" viewBox="0 0 24 24">
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
        </div>
      )}
    </Aside>
  );
}
