/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { FC, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { InvisibleInput } from "../../../components/InvisibleInput";
import { useEnterpriseContext } from "../../../context/EnterpriseContext";
import { useAuth } from "../../../context/AuthContext";
import { createComments, getComments } from "../../../api/comments/commentsApi";
import { ptBR } from "date-fns/locale";
import InputMask from "react-input-mask";
import {
  updatedAnnotationCards,
  updatedCardData,
} from "../../../api/cards/cardsApi";
import toast from "react-hot-toast";
import {
  allInputsByCard,
  getAllInputs,
  updatedValuesInputs,
} from "../../../api/inputs/inputsApi";
import { TfiText } from "react-icons/tfi";
import { CheckIcon } from "@heroicons/react/20/solid";
import AddFields from "../../../components/AddFields";
import {
  deleteLabelActive,
  labelCardActive,
} from "../../../api/labelsCard/labelsCard";
import ModalIncludeUserTask from "../../../components/ModalIncludeUserTask";
import Datepicker from "react-tailwindcss-datepicker";
import { useEnvironmentContext } from "../../../context/EnvironmentContext";
import formatTimeLeft from "../../../traits/FormatTimeLeft";
import IncludeTags from "../../../components/IncludeTags";
interface PropsEditCard {
  card_id: number;
  titleCard: string;
  descriptionCard: string | undefined;
  emailTask: string | undefined;
  phoneTask: string | undefined;
  annotationText: string | undefined;
  data_conclusion: string | undefined;
  priorityText: string | undefined;
  isOpenModal: boolean;
  pipeline_id?: number;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loadingComments: boolean;
  setLoadingComments: React.Dispatch<React.SetStateAction<boolean>>;
  refreshCards: boolean;
  setRefreshCards: React.Dispatch<React.SetStateAction<boolean>>;
  refreshResponsable: boolean;
  setRefreshResponsable: React.Dispatch<React.SetStateAction<boolean>>;
  listResponsable: [];
}

interface InputEnvironmnt {
  id: number;
  name: string;
  type: "text" | "number" | "date" | "select";
  options?: string; // Supondo que opções sejam uma string que precisa ser convertida,
  content: string;
}

const EditTask: FC<PropsEditCard> = ({
  isOpenModal,
  setIsOpenModal,
  titleCard,
  descriptionCard,
  card_id,
  loadingComments,
  setLoadingComments,
  pipeline_id,
  refreshCards,
  setRefreshCards,
  annotationText,
  emailTask,
  phoneTask,
  data_conclusion,
  priorityText,
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

  const [message, setMessage] = useState<string>("");
  const [listComments, setComments] = useState<
    { name_user: string; created_at: string; id: number; comment: string }[]
  >([]);

  const [editableTitle, setEditableTitle] = useState<string>(titleCard);
  const [descriptionTask, setDescriptionTask] = useState<string | undefined>(
    descriptionCard
  );

  const [email, setEmail] = useState<string | undefined>(emailTask);
  const [phone, setPhone] = useState<string | undefined>(phoneTask);
  const [dateConclusion, setDateConclusion] = useState<string | undefined>(
    data_conclusion
  );
  const [annotation, setAnnotation] = useState<string | undefined>(
    annotationText
  );
  const [listInputs, setListInputs] = useState<[]>([]);
  const [refreshTags, setRefreshTags] = useState<boolean>(false);
  const [refreshTagsActive, setRefreshTagsActive] = useState<boolean>(false);

  const [refreshComments, setRefreshComments] = useState<boolean>(false);

  const { enterprise } = useEnterpriseContext();
  const { environment } = useEnvironmentContext();

  const [refreshFields, setRefreshFields] = useState<boolean>(false);

  const { getUserContext } = useAuth();
  const userData = getUserContext();

  const priority = [
    { color: "#fff", name: "Seleciona uma prioridade" },
    { color: "#22c55e", name: "Baixa" },
    { color: "#eab308", name: "Média" },
    { color: "#ef4444", name: "Alta" },
    { color: "#6366f1", name: "Urgente" },
  ];

  const [prioritySelected, setPrioritySelected] = useState(priority[0]);

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (userData != null && enterprise != null) {
        await createComments(
          message,
          userData.name,
          userData.id,
          card_id,
          enterprise.id
        );
        setMessage("");
        setRefreshComments(!refreshComments);
        toast.success("Comentário feito com sucesso!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [formValues, setFormValues] = useState<{
    [key: string]: { value: string | number | Date; id: number };
  }>({});

  const memoizedFormValues = useMemo(() => formValues, [formValues]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    id: number
  ) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: { value, id },
    });
  };

  useEffect(() => {
    if (isOpenModal) {
      setEditableTitle(titleCard);
      setAnnotation(annotationText);
      setPhone(phoneTask);
      setEmail(emailTask);
      setDescriptionTask(descriptionCard);
      setDateConclusion(data_conclusion);

      const selectedPriority = priority.find(
        (item) => item.name === priorityText
      );

      // Atualize o estado `prioritySelected` com o objeto completo
      if (selectedPriority) {
        setPrioritySelected(selectedPriority);
      }

      const listAllContentInputByCard = async () => {
        try {
          const result = await allInputsByCard(card_id.toString());

          const updatedFormValues = result.content.reduce(
            (acc: any, input: any) => {
              acc[input.name_input] = { value: input.content, id: input.id };
              return acc;
            },
            {}
          );

          // Atualiza o estado com os valores preenchidos
          setFormValues(updatedFormValues);
        } catch (error) {
          console.log(error);
        }
      };

      listAllContentInputByCard();
    } else {
      // setAnnotation("");
      setEmail("");
      setPhone("");
      setDescriptionTask("");

    }
  }, [
    titleCard,
    isOpenModal,
    annotationText,
    phoneTask,
    emailTask,
    descriptionCard,
    card_id,
    data_conclusion,
    priorityText,
  ]);

  useEffect(() => {
    const listComments = async () => {
      try {
        if (userData != null && enterprise != null && card_id != null) {
          const result = await getComments(userData.id, card_id, enterprise.id);
          setComments(result.comments);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingComments(false);
      }
    };

    if (isOpenModal) {
      listComments();
    }
  }, [
    card_id,
    enterprise,
    userData,
    isOpenModal,
    refreshComments,
    setLoadingComments,
  ]);

  const memoizedComments = useMemo(() => {
    return listComments.map((comment) => ({
      ...comment,
    }));
  }, [listComments]);

  useEffect(() => {
    const listInputsCards = async () => {
      if (enterprise != null) {
        const result = await getAllInputs(enterprise.id);

        setListInputs(result.inputs);
      }
    };

    listInputsCards();
  }, [enterprise, refreshFields]);

  const handleUpdateValueInputs = async (
    input_value: string,
    input_id: string,
    name_input: string
  ) => {
    try {
      await updatedValuesInputs(
        input_value,
        name_input,
        input_id,
        card_id.toString()
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userData != null) {
        await updatedCardData(
          card_id,
          editableTitle,
          email,
          phone,
          descriptionTask,
          userData.id,
          pipeline_id,
          dateConclusion,
          prioritySelected.name
        );
        setRefreshCards(!refreshCards);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateAnnotation = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (
        userData != null &&
        card_id != null &&
        pipeline_id &&
        annotation != undefined
      ) {
        await updatedAnnotationCards(
          card_id.toString(),
          editableTitle,
          annotation,
          userData.id,
          pipeline_id
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const convertOptionsStringToArray = (optionsString: string): string[] => {
    return optionsString
      .slice(1, -1) // Remove o primeiro e o último caractere ('[' e ']')
      .split("', '") // Divide a string nos separadores de opções
      .map((option) => option.replace(/'/g, "").trim()); // Remove aspas e espaços em branco
  };

  const renderInputsEnvironments = (input: InputEnvironmnt) => {
    const value = memoizedFormValues[input.name]?.value || ""; // Pega o valor do estado

    switch (input.type) {
      case "text":
      case "number":
      case "date":
        return (
          <div className="mb-3">
            <div className="relative mt-2">
              <div className="flex items-center">
                <div className="flex items-center gap-2 text-sm text-gray-400 name-input w-[200px]">
                  <TfiText className="size-5" />
                  {input.name}
                </div>
                <input
                  value={value}
                  onChange={(e) => handleInputChange(e, input.id)}
                  onBlur={() =>
                    handleUpdateValueInputs(
                      memoizedFormValues[input.name]?.value,
                      input.id,
                      input.name
                    )
                  }
                  name={input.name}
                  type={input.type}
                  placeholder={`Vazio...`}
                  className="peer block w-full resize-none border-0 focus:ring-0  bg-white py-1.5 text-gray-900 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        );

      case "select": {
        const optionsArray = convertOptionsStringToArray(input.options || "");

        return (
          <div className="mb-4">
            <div className="flex items-center">
              <div className="flex items-center gap-2 text-sm text-gray-400 name-input w-[200px]">
                <TfiText className="size-5" />
                {input.name}
              </div>

              <select
                value={value}
                name={input.name}
                onChange={(e) => handleInputChange(e, input.id)}
                onBlur={() =>
                  handleUpdateValueInputs(
                    memoizedFormValues[input.name]?.value,
                    input.id,
                    input.name
                  )
                }
                className="peer block w-full resize-none border-0 focus:ring-0 text-gray-400  bg-white py-1.5 text-gray-900 sm:text-sm sm:leading-6"
              >
                <option selected>Selecione algo</option>
                {optionsArray.map((option, index) => (
                  <option className="text-gray-400" key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const [showComments, setShowComments] = useState(false);

  

 

  // Função chamada ao adicionar uma nova etiqueta
  const handleKeyPress = (event) => {
    event.preventDefault(); // Evita que o dropdown feche
    event.stopPropagation();

    if (event.key === "Enter" && newTag.trim() !== "") {
      const exists = selectedTags.some((t) => t.name === newTag);
      const randomColor = getRandomColor();
      if (!exists) {
        const tagToAdd = {
          id: Date.now().toString(),
          name: newTag,
          color: randomColor.hex,
        };
        setSelectedTags([...selectedTags, tagToAdd]); // Adiciona a nova etiqueta aos selecionados
        // setOptions([...options, tagToAdd]); // Adiciona a nova etiqueta às opções
        setNewTag(""); // Limpa o campo de entrada
        handleTagsSubmit(tagToAdd.name, tagToAdd.color);
      }
    }
  };

  
  


 

  const [showModalTags, setShowModalTags] = useState<boolean>(false);
  const modalRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModalTags(false); // Fecha o modal se o clique for fora dele
      }
    };

    if (showModalTags) {
      document.addEventListener("mousedown", handleClickOutside); // Adiciona o ouvinte de clique
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Remove o ouvinte ao desmontar o componente
    };
  }, [showModalTags]);

  const handleDeleteLabelsActive = async (id: string) => {
    try {
      await deleteLabelActive(id);
      setRefreshTagsActive(!refreshTagsActive);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTagsActive = async (idTagActive: string) => {
    try {
      await labelCardActive(idTagActive, card_id, 1);
      toast.success("Tag ativada com sucesso!");
      setRefreshTagsActive(!refreshTagsActive);
    } catch (error) {
      console.log(error);
    }
  };

  const [value, setValue] = useState("");
  const [items, setItems] = useState([
    {
      email: "one@example.com",
      label: "One",
      value: "1",
    },
  ]);

  const sourceItems = [
    {
      email: "one@example.com",
      label: "One",
      value: "1",
    },
    {
      email: "two@example.com",
      label: "Two",
      value: "2",
    },
  ];

  return (
    <Dialog
      open={isOpenModal}
      onClose={setIsOpenModal}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex items-end justify-center min-h-full text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="size-full relative transform overflow-hidden rounded-lg bg-white pb-4  text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-screen-lg h-[91vh]  data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="flex items-center justify-between border-b ">
              <div className="w-[80%] px-6">
                <InvisibleInput
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "5px",
                  }}
                  className="w-full"
                  value={editableTitle}
                  onBlur={(e) => handleUpdateCard(e)}
                  setValue={setEditableTitle}
                ></InvisibleInput>
              </div>
              <div className="px-6">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="p-2 transition-all rounded-full hover:bg-gray-50"
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
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className=" wrapper-card-edit">
              <div className="mt-5">
                <div className="px-6">
                  <div className="grid grid-cols-2 gap-x-10 gap-y-3 ">
                    <div className="relative">
                      <div className="flex items-center justify-between gap-5">
                        <div className="flex items-center gap-2 text-sm text-gray-400 name-input w-[200px]">
                          <TfiText className="size-5" />
                          Descrição
                        </div>
                        <input
                          value={descriptionTask}
                          onChange={(e) => setDescriptionTask(e.target.value)}
                          onBlur={(e) => handleUpdateCard(e)}
                          name="description"
                          placeholder="Vazio..."
                          className="peer block w-full resize-none border-0 focus:ring-0 transition-all hover:bg-gray-300  bg-white py-1.5 text-gray-900 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="">
                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2 text-sm text-gray-400 name-input w-[200px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.404 14.596A6.5 6.5 0 1 1 16.5 10a1.25 1.25 0 0 1-2.5 0 4 4 0 1 0-.571 2.06A2.75 2.75 0 0 0 18 10a8 8 0 1 0-2.343 5.657.75.75 0 0 0-1.06-1.06 6.5 6.5 0 0 1-9.193 0ZM10 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          E-mail
                        </div>

                        <input
                          name="email"
                          value={email}
                          onBlur={(e) => handleUpdateCard(e)}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Vazio..."
                          className="peer block w-full resize-none border-0 transition-all hover:bg-gray-300  bg-white py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="">
                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2 text-sm text-gray-400 name-input w-[200px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path d="M8 16.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z" />
                            <path
                              fillRule="evenodd"
                              d="M4 4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4Zm4-1.5v.75c0 .414.336.75.75.75h2.5a.75.75 0 0 0 .75-.75V2.5h1A1.5 1.5 0 0 1 14.5 4v12a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 16V4A1.5 1.5 0 0 1 7 2.5h1Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Telefone
                        </div>
                        <InputMask
                          mask="(99) 99999-9999"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          onBlur={(e) => handleUpdateCard(e)}
                        >
                          {(inputProps: any) => (
                            <input
                              {...inputProps}
                              type="tel"
                              className="peer block w-full resize-none border-0 transition-all hover:bg-gray-300  bg-white py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                              placeholder="Vazio..."
                            />
                          )}
                        </InputMask>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2 text-sm text-gray-400 name-input w-[132px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
                          </svg>
                          Responsáveis
                        </div>

                      

                        <ModalIncludeUserTask
                          listResponsable={listResponsable}
                          refreshResponsable={refreshResponsable}
                          setRefreshResponsable={setRefreshResponsable}
                          card_id={card_id}
                        ></ModalIncludeUserTask>
                      </div>
                    </div>

                    <div className="">
                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2 text-sm text-gray-400 name-input w-[200px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Data
                        </div>
                        <Datepicker
                          displayFormat="DD/MM/YYYY"
                          useRange={false}
                          asSingle={true}
                          locale={ptBR}
                          placeholder="Selecione a data de finalização"
                          value={dateConclusion}
                          onBlur={(e) => handleUpdateCard(e)}
                          theme="light"
                          inputClassName="w-full border-0 cursor-pointer"
                          onChange={(newValue) => setDateConclusion(newValue)}
                        />
                      </div>
                    </div>

                    <div className="mb-1">
                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2 text-sm text-gray-400 name-input w-[200px]">
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
                              d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                            />
                          </svg>
                          Prioridade
                        </div>

                        <Listbox
                          value={prioritySelected}
                          onChange={setPrioritySelected}
                        >
                          <div className="relative w-full">
                            <ListboxButton className="relative cursor-pointer pl-3 w-full transition-all hover:bg-gray-300  bg-white py-1.5  text-left text-gray-400  sm:text-sm sm:leading-6">
                              <span className="flex items-center gap-2">
                                <div
                                  style={{
                                    backgroundColor: prioritySelected.color,
                                  }}
                                  class="w-3 h-3 rounded-full"
                                ></div>

                                <span className="block w-full text-gray-500 truncate">
                                  {prioritySelected.name}
                                </span>
                              </span>
                            </ListboxButton>

                            <ListboxOptions
                              transition
                              className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
                            >
                              {priority.map((item) => (
                                <ListboxOption
                                  value={item}
                                  onBlur={(e) => handleUpdateCard(e)}
                                  className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                                >
                                  <div className="flex items-center">
                                    <div
                                      style={{ backgroundColor: item.color }}
                                      className="flex-shrink-0 w-4 h-4 rounded-full"
                                    />
                                    <span className="ml-3 block truncate font-normal group-data-[selected]:font-semibold">
                                      {item.name}
                                    </span>
                                  </div>

                                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                    <CheckIcon
                                      aria-hidden="true"
                                      className="w-5 h-5"
                                    />
                                  </span>
                                </ListboxOption>
                              ))}
                            </ListboxOptions>
                          </div>
                        </Listbox>
                      </div>
                    </div>

                    {/* <div className="mb-2">
                      <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2 text-sm text-gray-400 name-input w-[130px]">
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
                              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                            />
                          </svg>
                          Status
                        </div>

                        <Listbox value={selected} onChange={setSelected}>
                          <div className="relative">
                            <div className="inline-flex w-full divide-x divide-gray-500 rounded-md shadow-sm">
                              <ListboxButton className="inline-flex items-center gap-x-1.5 rounded-l-md bg-gray-100 transition-all hover:bg-gray-300 px-3 py-2 text-gray-500 shadow-sm">
                                <CheckIcon
                                  aria-hidden="true"
                                  className="-ml-0.5 h-5 w-5"
                                />
                                <p className="text-sm font-semibold">
                                  {selected.title}
                                </p>
                              </ListboxButton>
                              <ListboxButton className="inline-flex items-center p-2 bg-gray-100 rounded-l-none rounded-r-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-50">
                                <span className="sr-only">
                                  Change published status
                                </span>
                                <ChevronDownIcon
                                  aria-hidden="true"
                                  className="w-5 h-5 text-gray-500"
                                />
                              </ListboxButton>
                            </div>

                            <ListboxOptions
                              transition
                              className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in"
                            >
                              {publishingOptions.map((option) => (
                                <ListboxOption
                                  key={option.title}
                                  value={option}
                                  className="group cursor-default select-none p-4 text-sm text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                                >
                                  <div className="flex flex-col">
                                    <div className="flex justify-between">
                                      <p className="font-normal group-data-[selected]:font-semibold">
                                        {option.title}
                                      </p>
                                      <span className="text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                                        <CheckIcon
                                          aria-hidden="true"
                                          className="w-5 h-5"
                                        />
                                      </span>
                                    </div>
                                    <p className="mt-2 text-gray-500 group-data-[focus]:text-indigo-200">
                                      {option.description}
                                    </p>
                                  </div>
                                </ListboxOption>
                              ))}
                            </ListboxOptions>
                          </div>
                        </Listbox>
                      </div>
                    </div> */}

                    <div className="relative">
                      <div className="flex items-start gap-5">
                        <div className="flex items-center gap-2 text-sm text-gray-400 name-input w-[200px]">
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
                              d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 6h.008v.008H6V6Z"
                            />
                          </svg>
                          Etiquetas
                        </div>
                        <IncludeTags card_id={card_id}></IncludeTags>
                        {/* <div className="flex flex-col-reverse items-center w-full gap-2 ">
                          <div className="flex w-full">
                            
                            {Array.isArray(listTagsActive.tags) &&
                              listTagsActive.tags.length > 0 &&
                              listTagsActive.tags.slice(0, 4).map((tag) => (
                                <div
                                  key={tag.label_card.id}
                                  className="relative flex items-start left-2"
                                >
                                  <>
                                    <span
                                      style={{
                                        backgroundColor: hexToRgba(
                                          tag.label_card.color,
                                          0.2
                                        ),
                                        color: tag.label_card.color,
                                        borderColor: tag.label_card.color,
                                      }}
                                      className="inline-flex border mr-1 mb-2 items-center gap-x-0.5 rounded-md px-2 py-1 text-xs font-medium"
                                    >
                                      {tag.label_card.name}
                                      <button
                                        onClick={() =>
                                          handleDeleteLabelsActive(
                                            tag.label_card.id
                                          )
                                        }
                                        type="button"
                                        className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-red-600/20"
                                      >
                                        <span className="sr-only">Remove</span>
                                        <svg
                                          style={{
                                            stroke: tag.label_card.color,
                                          }}
                                          viewBox="0 0 14 14"
                                          className="h-3.5 w-3.5"
                                        >
                                          <path d="M4 4l6 6m0-6l-6 6" />
                                        </svg>
                                        <span className="absolute -inset-1" />
                                      </button>
                                    </span>
                                  </>
                                </div>
                              ))}

                            {Array.isArray(listTagsActive.tags) &&
                              listTagsActive.tags.length > 4 && (
                                <span
                                  onClick={() =>
                                    setShowModalTags(!showModalTags)
                                  }
                                  className="mt-1 ml-3 text-xs text-gray-500 cursor-pointer"
                                >
                                  +{listTagsActive.tags.length - 4} mais
                                </span>
                              )}
                          </div>
                          {/* <input
                            value={newTag}
                            onKeyUp={handleKeyPress}
                            onFocus={() => setShowModalTags(!showModalTags)}
                            onChange={(e) => setNewTag(e.target.value)}
                            name="etiquetas"
                            
                            placeholder="Nome da etiqueta..."
                            className="peer block w-full resize-none border-0 focus:ring-0 transition-all hover:bg-gray-300  bg-white py-1.5 text-gray-900 sm:text-sm sm:leading-6"
                          /> */}
                        {/* </div> */} 
                      </div>
                      {/* {showModalTags && (
                        <div ref={modalRef} className="my-tags ">
                          <ul className="px-3 py-5 absolute w-full z-20  overflow-y-scroll bg-white border rounded-lg shadow-lg h-[300px]">
                            <div className="">
                              <p className="mb-3 text-sm text-gray-500">
                                Etiquetas ativas:
                              </p>
                              <div>
                                <div className="flex">
                                  {Array.isArray(listTagsActive.tags) &&
                                    listTagsActive.tags.length > 0 &&
                                    listTagsActive.tags.map((tag) => (
                                      <div
                                        key={tag.id}
                                        className="relative flex items-start left-2"
                                      >
                                        <span
                                          style={{
                                            backgroundColor: hexToRgba(
                                              tag.label_card.color,
                                              0.2
                                            ),
                                            color: tag.label_card.color,
                                            borderColor: tag.label_card.color,
                                          }}
                                          className="inline-flex border mr-1 mb-2 items-center gap-x-0.5 rounded-md px-2 py-1 text-xs font-medium"
                                        >
                                          {tag.label_card.name}
                                          <button
                                            onClick={() =>
                                              handleDeleteLabelsActive(
                                                tag.label_card.id
                                              )
                                            }
                                            type="button"
                                            className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-red-600/20"
                                          >
                                            <span className="sr-only">
                                              Remove
                                            </span>
                                            <svg
                                              style={{
                                                stroke: tag.label_card.color,
                                              }}
                                              viewBox="0 0 14 14"
                                              className="h-3.5 w-3.5"
                                            >
                                              <path d="M4 4l6 6m0-6l-6 6" />
                                            </svg>
                                            <span className="absolute -inset-1" />
                                          </button>
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>

                            <div className="mt-5">
                              <p className="mb-3 text-sm text-gray-500">
                                Minhas eitquetas:
                              </p>
                              {listTagsCard &&
                                listTagsCard.map((tag) => (
                                 f
                                ))}
                            </div>
                          </ul>
                        </div>
                      )} */}
                    </div>
                  </div>

                  <div className="w-full">
                    <h3 className="mt-5 text-lg font-semibold text-dark">
                      Campos personalizados
                    </h3>

                    <div className="grid grid-cols-2 mt-2">
                      {listInputs &&
                        listInputs.length > 0 &&
                        listInputs.map((input) => (
                          <>{renderInputsEnvironments(input)}</>
                        ))}
                    </div>
                  </div>

                  <AddFields
                    refresh={refreshFields}
                    setRefresh={setRefreshFields}
                  ></AddFields>

                  <div className="absolute w-full pr-6 bottom-3">
                    <form
                      onSubmit={handleSubmitForm}
                      method="POST"
                      className="relative flex items-center w-full gap-2"
                    >
                      {userData != null && (
                        <span
                          style={{
                            backgroundColor: getBackgroundColor(
                              userData.name.charAt(0).toUpperCase()
                            ),
                          }}
                          className="inline-flex items-center justify-center rounded-full h-9 w-9"
                        >
                          <span className="font-medium text-white">
                            {userData.name.charAt(0).toUpperCase()}
                          </span>
                        </span>
                      )}

                      <input
                        id="comment"
                        name="comment"
                        value={message}
                        onBlur={() => setShowComments(false)}
                        onFocus={() => setShowComments(true)}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Adicionar comentário..."
                        className="block w-full pb-2 pl-3 text-gray-900 border-0 border-transparent resize-none focus:border-indigo-600 focus:ring-0 sm:text-sm sm:leading-6"
                      />

                      <button
                        type="submit"
                        className="rounded-full absolute right-5 bg-indigo-600 p-1.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                        </svg>
                      </button>
                    </form>
                  </div>

                  <div
                    className={`absolute w-full p-5 mt-5 bg-gray-100 rounded-lg transition-all duration-200 z-10 -botton-[200px] ${
                      showComments
                        ? "bottom-[68px] opacity-100"
                        : "translate-y-10 opacity-0 pointer-events-none"
                    }`}
                  >
                    <ul role="list" className="overflow-y-scroll h-[400px]">
                      {loadingComments ? (
                        <div
                          role="status"
                          className="max-w-sm p-4 rounded animate-pulse md:p-6"
                        >
                          {/* Simulação do carregamento */}
                          <div className="flex items-center mt-4 mb-10">
                            <svg
                              className="w-10 h-10 text-gray-200 me-3"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                            </svg>
                            <div>
                              <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-2"></div>
                              <div className="w-64 h-2 mb-2 bg-gray-200 rounded-full"></div>
                              <div className="w-64 h-2 bg-gray-200 rounded-full "></div>
                            </div>
                          </div>
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        memoizedComments &&
                        memoizedComments.map((comment) => (
                          <li key={comment.id}>
                            <div className="relative pb-8">
                              <div className="relative flex items-start space-x-3">
                                <div className="relative">
                                  {userData != null && (
                                    <span
                                      style={{
                                        backgroundColor: getBackgroundColor(
                                          userData.name.charAt(0).toUpperCase()
                                        ),
                                      }}
                                      className="inline-flex items-center justify-center rounded-full w-9 h-9"
                                    >
                                      <span className="font-medium leading-none text-white">
                                        {userData.name.charAt(0).toUpperCase()}
                                      </span>
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div>
                                    <div className="text-sm">
                                      <a
                                        href="#"
                                        className="font-medium text-gray-900"
                                      >
                                        {comment.name_user}
                                      </a>
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500">
                                      {formatTimeLeft(comment.created_at)}
                                    </p>
                                  </div>
                                  <div className="mt-2 text-sm text-gray-700">
                                    <p>{comment.comment}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  <div className="h-full mt-6 annotation">
                    <div className="h-full mt-2">
                      <textarea
                        id="name"
                        name="name"
                        value={annotation}
                        onBlur={(e) => handleCreateAnnotation(e)}
                        onChange={(e) => setAnnotation(e.target.value)}
                        placeholder="Faça suas anotações..."
                        className="peer block w-full border-0 resize-none h-[165px] py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default EditTask;
