/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { FC, FormEvent, useEffect, useRef, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { useEnterpriseContext } from "../../context/EnterpriseContext";
import {
  createPipelineEnterprise,
  deletePipeline,
  getPipelineEnterprise,
  updatedPipeline,
} from "../../api/pipeline/pipelineApi";

// import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  createCards,
  deleteCard,
  updateCardOrder,
  updatedCardData,
} from "../../api/cards/cardsApi";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

import { PipelineTitle } from "../../components/PipelineTitle";
import EditTask from "./modals/EditTask";
import { useEnvironmentContext } from "../../context/EnvironmentContext";
import Confirm from "../../components/Corfirm";
import toast, { Toaster } from "react-hot-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaCheckCircle } from "react-icons/fa";
import Aside from "../../components/Aside";
import Heading from "../../components/Heading";
import ListEnvironmentButtom from "./components/ListEnvironmentButtom";
import BaseButton from "../../components/BaseButton";

interface PipelineAtributtes {
  id: number;
  name: string;
  color: string;
  sort: number;
  environment_id: number;
  cards: [
    {
      id: number;
      title: string;
      description: string;
      created_at: string;
    }
  ];
}

interface Task {
  id: number; // ID do card
  title: string; // Título do card
  description?: string;
  pipeline_id?: number;
  annotation?: string;
  email?: string;
  phone?: string;
  date_conclusion?: string;
  priority?: string;
}

const Opportunity: FC = () => {
  const [listPipelines, setListPipelines] = useState<PipelineAtributtes[]>([]);
 

  const [openPipelineCreate, setOpenPipelineCreate] = useState<boolean>(false);

  const [nameColumn, setNameColumn] = useState<string>("");

  const [refreshColumns, setRefreshColumns] = useState<boolean>(false);

  const [nameTask, setNameTask] = useState<string>("");
  const [descriptionTask, setDescriptionTask] = useState<string>("");
  const [pipelineIdSelected, setPipelineIdSelected] = useState<number>(0);

  const [refreshCards, setRefreshCards] = useState<boolean>(false);

  const [openFormAddCard, setOpenFormAddCard] = useState<{
    [key: number]: boolean;
  }>({});
  const [hideButtonAddCard, setHideButtonAddCard] = useState<{
    [key: number]: boolean;
  }>({});

  const [openCardEdit, setOpenCardEdit] = useState<boolean>(false);

  const [selectedCard, setSelectedCard] = useState<Task | null>(null);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);
  const [visibleDropdownId, setVisibleDropdownId] = useState<number | null>(
    null
  ); //hover dos cards
  const [loadingButtonDelete, setLoadingButtonDelete] =
    useState<boolean>(false);
  const [loadingPipelines, setLoadingPipelines] = useState<boolean>(true);

  const [confirm, setConfirm] = useState<boolean>(false);
  const [confirmCard, setConfirmCard] = useState<boolean>(false);
  const [refreshResponsable, setRefreshResponsable] = useState<boolean>(false);

  const { environment } = useEnvironmentContext();

  // abre a tarefa ao clicar nela
  const handleEditClick = (task: Task) => {
    setSelectedCard(task);
    setOpenCardEdit(true);
    setLoadingComments(true);
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef(null);

  const optionsColors = [
    { name: "Pink", color: "text-pink-500", hex: "#ec4899" },
    { name: "Purple", color: "text-purple-500", hex: "#a855f7" },
    { name: "Blue", color: "text-blue-500", hex: "#3b82f6" },
    { name: "Green", color: "text-green-500", hex: "#22c55e" },
    { name: "Yellow", color: "text-yellow-500", hex: "#eab308" },
    { name: "Red", color: "text-red-500", hex: "#ef4444" },
    { name: "Orange", color: "text-orange-500", hex: "#f97316" },
    { name: "Teal", color: "text-teal-500", hex: "#14b8a6" },
    { name: "Cyan", color: "text-cyan-500", hex: "#06b6d4" },
    { name: "Indigo", color: "text-indigo-500", hex: "#6366f1" },
    { name: "Lime", color: "text-lime-500", hex: "#84cc16" },
    { name: "Amber", color: "text-amber-500", hex: "#f59e0b" },
    { name: "Emerald", color: "text-emerald-500", hex: "#10b981" },
    { name: "Rose", color: "text-rose-500", hex: "#f43f5e" },
    { name: "Fuchsia", color: "text-fuchsia-500", hex: "#d946ef" },
    { name: "Sky", color: "text-sky-500", hex: "#0ea5e9" },
    { name: "Violet", color: "text-violet-500", hex: "#8b5cf6" },
    { name: "Slate", color: "text-slate-500", hex: "#64748b" },
    { name: "Stone", color: "text-stone-500", hex: "#78716c" },
    { name: "Zinc", color: "text-zinc-500", hex: "#71717a" },

    { name: "Dark", color: "text-dark", hex: "#000" },

    { name: "Deep Orange", color: "text-orange-600", hex: "#ea580c" },
    { name: "Cool Cyan", color: "text-cyan-600", hex: "#0891b2" },
    { name: "Emerald Green", color: "text-emerald-600", hex: "#059669" },
  ];

  const [selectedColor, setSelectedColor] = useState(optionsColors[1]);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const handleClickButtonAddCard = (pipelineId: number) => {
    setOpenFormAddCard((prev) => ({
      ...prev,
      [pipelineId]: true, // Abre o form apenas para o pipelineId clicado
    }));

    setHideButtonAddCard((prev) => ({
      ...prev,
      [pipelineId]: true, // Esconde o botão apenas para o pipelineId clicado
    }));
    setPipelineIdSelected(pipelineId);
  };

  const { getUserContext } = useAuth();
  const userData = getUserContext();

  const { enterprise } = useEnterpriseContext();


  useEffect(() => {
    const getPipelines = async () => {
      try {
        if (enterprise != null) {
          const result = await getPipelineEnterprise(enterprise.id.toString());
          setListPipelines(result.pipelines);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingPipelines(false);
      }
    };

    getPipelines();
  }, [enterprise, refreshColumns, refreshCards, refreshResponsable]);


  // cria uma nova coluna
  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (enterprise != null && environment != null) {
        await createPipelineEnterprise(
          nameColumn,
          enterprise?.id,
          environment.id,
          selectedColor as any
        );
        toast.success("Coluna cadastrada com sucesso!");
        setOpenPipelineCreate(false);
        setRefreshColumns(!refreshColumns);
      }
    } catch (error) {
      console.log(error);
      toast.error("Selecione uma cor!");
    }
  };

  // cria uma nova tarefa
  const handleSubmitCard = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (userData != null) {
        await createCards(
          nameTask,
          descriptionTask,
          userData.id,
          pipelineIdSelected
        );
        toast.success("Tarefa criada com sucesso!");
        setRefreshCards(!refreshCards);
        setOpenFormAddCard((prev) => ({
          ...prev,
          [pipelineIdSelected]: false, // Fecha o form após o submit
        }));
        setHideButtonAddCard((prev) => ({
          ...prev,
          [pipelineIdSelected]: false, // Exibe o botão novamente após o submit
        }));

        setNameTask("");
        setDescriptionTask("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // faz o kanban
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    // Verifica se não houve mudança no local de drop
    if (!destination) return;

    const sourcePipelineId = Number(source.droppableId);
    const destinationPipelineId = Number(destination.droppableId);
    const destinationPipelineIdString = destination.droppableId.toString(); // criada somente para passar via parametro da api;

    // Lógica para mover o card entre pipelines
    setListPipelines((prevPipelines) => {
      const newPipelines = [...prevPipelines];

      // Remove o card da sua posição original
      const sourcePipelineIndex = newPipelines.findIndex(
        (pipeline) => pipeline.id === sourcePipelineId
      );
      const [movedCard] = newPipelines[sourcePipelineIndex].cards.splice(
        source.index,
        1
      );

      // Adiciona o card na nova posição
      const destinationPipelineIndex = newPipelines.findIndex(
        (pipeline) => pipeline.id === destinationPipelineId
      );
      newPipelines[destinationPipelineIndex].cards.splice(
        destination.index,
        0,
        movedCard
      );

      return newPipelines;
    });

    // Aqui você pode enviar as atualizações para o backend

    try {
      await updateCardOrder(
        destinationPipelineIdString,
        destination.index,
        result.draggableId
      );
    } catch (error) {
      console.log(error);
    }
  };

  //deleta a pipeline

  // atualiza a cor da pipeline
  const handleUpdateColorPipeline = async (
    pipelineId: string | number,
    name: string,
    sort: number,
    color: string
  ) => {
    if (enterprise != null && environment != null) {
      try {
        await updatedPipeline(
          pipelineId,
          name,
          sort,
          enterprise.id,
          environment.id,
          color
        );
        setRefreshColumns(!refreshColumns);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Função para fechar o modal quando clicar fora
  const handleClickOutside = (event: MouseEvent) => {
    // Verifica se o clique foi fora do modal
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setOpenPipelineCreate(false); // Fecha o modal
      setNameColumn("");
    }

    if (
      modalCardRef.current &&
      !modalCardRef.current.contains(event.target as Node)
    ) {
      setNameTask("");
      setOpenFormAddCard((prev) => ({
        ...prev,
        [pipelineIdSelected]: false, // Fecha o form após o submit
      }));
      setHideButtonAddCard((prev) => ({
        ...prev,
        [pipelineIdSelected]: false, // Exibe o botão novamente
      }));
    }
  };

  useEffect(() => {
    if (hideButtonAddCard[pipelineIdSelected]) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hideButtonAddCard]);

  // Adiciona e remove o event listener para fechar ao clicar fora
  useEffect(() => {
    if (openPipelineCreate) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup quando o modal é fechado
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPipelineCreate]);

  const handleDropdownClick = (event: any) => {
    event.stopPropagation(); // Evita que o clique no dropdown ative o clique do pai
  };

  const handleDelete = async () => {
    setLoadingButtonDelete(true);

    try {
      await deletePipeline(pipelineIdSelected as any);
      toast.success("Pipeline excluída com sucesso!");
      setRefreshColumns(!refreshColumns);
      setConfirm(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingButtonDelete(false);
    }
  };

  const handleCancel = () => {
    setConfirm(false);
  };

  const handleConfirm = (id: number) => {
    setConfirm(true);
    setPipelineIdSelected(id);
  };

  const handleCancelCard = () => {
    setConfirmCard(false);
  };

  const handleClickDeleteCard = (task: Task) => {
    setConfirmCard(true);
    setSelectedCard(task);
  };

  const handleDeleteCard = async () => {
    setLoadingButtonDelete(true);
    try {
      if (selectedCard != null) {
        await deleteCard(selectedCard.id.toString());
        setRefreshCards(!refreshCards);
        setConfirmCard(false);
        toast.success("Tarefa deletada com sucesso");
        // setSelectedCard(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingButtonDelete(false);
    }
  };

  const handleFinallyTask = async (e: any, task: Task) => {
    e.stopPropagation();
    setSelectedCard(task);

    const dateCurrent = format(new Date(), "dd/MM/yyyy", {
      locale: ptBR,
    });

    if (userData != null) {
      await updatedCardData(
        task.id,
        task.title,
        task.email,
        task.phone,
        task.description,
        userData.id,
        task.pipeline_id,
        dateCurrent,
        task.priority
      );

      toast.success("Tarefa concluida com sucesso!");
      setRefreshCards(!refreshCards);
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
    <Aside>
      <Toaster position="top-right"></Toaster>
      <Confirm
        loadingButton={loadingButtonDelete}
        setLoadingButton={setLoadingButtonDelete}
        onConfirm={handleDelete}
        title="Deseja deletar a coluna?"
        onCancel={handleCancel}
        isOpen={confirm}
        setIsOpen={setConfirm}
      ></Confirm>
      <Confirm
        loadingButton={loadingButtonDelete}
        setLoadingButton={setLoadingButtonDelete}
        onConfirm={handleDeleteCard}
        title="Deseja deletar a tarefa?"
        onCancel={handleCancelCard}
        isOpen={confirmCard}
        setIsOpen={setConfirmCard}
      ></Confirm>

      <Heading
        leftButtomGroup={<ListEnvironmentButtom />}
        // rightButtomGroup={
        //   <BaseButton>
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       viewBox="0 0 20 20"
        //       fill="currentColor"
        //       className="size-5"
        //     >
        //       <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
        //     </svg>
        //     Adicionar tarefa
        //   </BaseButton>
        // }
      ></Heading>

      <div className="relative w-full py-5 overflow-x-hidden bg-white kanbanboard sm:px-6">
        {/* Kanban Board Wrapper with horizontal scroll */}
        <div className="flex items-start w-full h-full px-4 py-0 overflow-x-auto gap-x-6">
          <DragDropContext
            onDragEnd={(result) => {
              //const pipelineId = Number(result.source.droppableId);
              handleDragEnd(result);
            }}
          >
            <div className="flex items-start h-[100vh]">
              {loadingPipelines ? (
                <div
                  role="status"
                  className="w-full h-full p-4 animate-pulse md:p-6 "
                >
                  <div className="flex items-center gap-[130px]">
                    <div>
                      <div className="h-2.5 bg-gray-200 rounded-full w-32 mb-2.5"></div>
                      <div className="w-48 h-2 mb-10 bg-gray-200 rounded-full "></div>
                    </div>

                    <div>
                      <div className="h-2.5 bg-gray-200 rounded-full w-32 mb-2.5"></div>
                      <div className="w-48 h-2 mb-10 bg-gray-200 rounded-full "></div>
                    </div>

                    <div>
                      <div className="h-2.5 bg-gray-200 rounded-full w-32 mb-2.5"></div>
                      <div className="w-48 h-2 mb-10 bg-gray-200 rounded-full "></div>
                    </div>
                  </div>

                  <div className="flex items-baseline h-[96%] mt-4">
                    <div className="w-[280px] h-[96%] bg-gray-200 rounded-t-lg  "></div>
                    <div className="w-[280px] h-[96%] bg-gray-200 rounded-t-lg ms-6 "></div>
                    <div className="w-[280px] h-[96%] bg-gray-200 rounded-t-lg ms-6 "></div>
                  </div>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <>
                  {listPipelines && listPipelines.length > 0 && (
                    <>
                      {listPipelines
                        .filter(
                          (pipelineItem) =>
                            pipelineItem.environment_id === environment?.id
                        )
                        .map((pipelineItem) => (
                          <div key={pipelineItem.id}>
                            <div
                              className="w-[280px] h-[96%]"
                              key={pipelineItem.id}
                            >
                              <div className="flex items-center justify-between w-full pipeline-header h-[50px]">
                                <div className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-800 capitalize rounded-md">
                                  <Menu
                                    as="div"
                                    className="relative p-1 transition-all rounded-md"
                                  >
                                    <MenuButton>
                                      <RadioGroup
                                        onChange={setSelectedColor}
                                        className="flex items-center space-x-3"
                                      >
                                        <Radio
                                          key={pipelineItem.id}
                                          value={pipelineItem.color}
                                          aria-label={pipelineItem.name}
                                          className={classNames(
                                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-current focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1"
                                          )}
                                        >
                                          <span
                                            aria-hidden="true"
                                            style={{
                                              backgroundColor:
                                                pipelineItem.color,
                                            }} // Aplicando a cor hexadecimal diretamente
                                            className="w-[15px] h-[15px] border border-black rounded-full border-opacity-10"
                                          />
                                        </Radio>
                                      </RadioGroup>
                                    </MenuButton>

                                    <MenuItems className="absolute w-[233px] left-0 z-10 inline-block mt-2 transition origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg top-7 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                      <div className="pb-4 pl-3">
                                        <MenuItem>
                                          <RadioGroup
                                            value={selectedColor}
                                            onChange={(newColor) => {
                                              setSelectedColor(newColor); // Atualiza o selectedColor
                                              handleUpdateColorPipeline(
                                                pipelineItem.id,
                                                pipelineItem.name,
                                                pipelineItem.sort,
                                                newColor as any
                                              ); // Chama a função com o novo valor
                                            }}
                                            className="flex flex-wrap items-center gap-3 mt-6"
                                          >
                                            {optionsColors.map((option) => (
                                              <Radio
                                                key={option.name}
                                                value={option.hex}
                                                aria-label={option.name}
                                                className={classNames(
                                                  option.color,
                                                  "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-current focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1"
                                                )}
                                              >
                                                <span
                                                  aria-hidden="true"
                                                  className="w-[15px] h-[15px] bg-current border border-black rounded-full border-opacity-10"
                                                />
                                              </Radio>
                                            ))}
                                          </RadioGroup>
                                        </MenuItem>
                                      </div>
                                    </MenuItems>
                                  </Menu>

                                  <PipelineTitle
                                    pipelineItem={pipelineItem as any}
                                  ></PipelineTitle>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Menu
                                    as="div"
                                    className="relative p-1 transition-all rounded-md hover:bg-gray-200 h-[28px]"
                                  >
                                    <MenuButton>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="size-5"
                                      >
                                        <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                                      </svg>
                                    </MenuButton>

                                    <MenuItems
                                      transition
                                      className="absolute right-0 z-10 inline-block mt-2 transition origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg top-7 ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    >
                                      <div className="py-1">
                                        <MenuItem>
                                          <a
                                            onClick={() =>
                                              handleConfirm(pipelineItem.id)
                                            }
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700 transition-all hover:bg-gray-50"
                                          >
                                            Deletar
                                          </a>
                                        </MenuItem>

                                        {/* <MenuItem>
                                            <a
                                              href="#"
                                              className="block px-4 py-2 text-sm text-gray-700 transition-all hover:bg-gray-50"
                                            >
                                              Ocultar
                                            </a>
                                          </MenuItem> */}
                                      </div>
                                    </MenuItems>
                                  </Menu>

                                  {!hideButtonAddCard[pipelineItem.id] && (
                                    <button
                                      onClick={() =>
                                        handleClickButtonAddCard(
                                          pipelineItem.id
                                        )
                                      }
                                      type="button"
                                      className="p-1 transition-all rounded-md hover:bg-gray-200"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="size-5"
                                      >
                                        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              </div>

                              <Droppable droppableId={String(pipelineItem.id)}>
                                {(provided) => (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="min-h-[80%] p-2"
                                  >
                                    {pipelineItem.cards.map((task, index) => (
                                      <div key={task.id}>
                                        <Draggable
                                          draggableId={String(task.id)}
                                          index={index}
                                        >
                                          {(provided) => (
                                            <div className="flex items-center justify-between">
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                  ...provided.draggableProps
                                                    .style,
                                                  borderLeftColor:
                                                    pipelineItem.color,
                                                  marginBottom: "10px",
                                                }}
                                                className={`bg-white rounded-lg relative shadow border cursor-pointer border-l-8 transition-all w-full`}
                                              >
                                                <div
                                                  key={task.id}
                                                  onMouseOver={() => {
                                                    setVisibleDropdownId(
                                                      task.id
                                                    );
                                                  }}
                                                  onMouseOut={() => {
                                                    setVisibleDropdownId(null);
                                                  }}
                                                  className="px-3 py-3 min-h-[120px] outline-none sm:px-3 relative"
                                                  onClick={() =>
                                                    handleEditClick(task)
                                                  }
                                                >
                                                  <div className="flex items-center gap-2">
                                                    <button
                                                      onClick={(e) =>
                                                        handleFinallyTask(
                                                          e,
                                                          task
                                                        )
                                                      }
                                                      type="button"
                                                      className=""
                                                    >
                                                      {!task.date_conclusion ? (
                                                        <svg
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          viewBox="0 0 20 20"
                                                          fill="currentColor"
                                                          className="text-gray-400 border-2 p-[2px] rounded-full size-5"
                                                        >
                                                          <path
                                                            fillRule="evenodd"
                                                            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                                                            clipRule="evenodd"
                                                          />
                                                        </svg>
                                                      ) : (
                                                        <FaCheckCircle className="text-green-500 size-5" />
                                                      )}
                                                    </button>
                                                    <div className="text-sm font-medium">
                                                      {task.title}
                                                    </div>
                                                  </div>

                                                  <div className="inline-block w-full min-h-[30px] mt-2 text-sm text-left text-gray-500 line-clamp-3">
                                                    {task.description}
                                                  </div>

                                                  <div className="flex items-end justify-end w-full priority-text">
                                                    {task.priority ===
                                                      "Alta" && (
                                                      <span class="mb-[30px] inline-flex items-center gap-x-1.5 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                                        <div className="">
                                                          🔥
                                                        </div>
                                                        {task.priority}
                                                      </span>
                                                    )}

                                                    {task.priority ===
                                                      "Baixa" && (
                                                      <span class="mb-[30px] inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                        <div className="">
                                                          ⏳
                                                        </div>
                                                        {task.priority}
                                                      </span>
                                                    )}

                                                    {task.priority ===
                                                      "Média" && (
                                                      <span class="mb-[30px] inline-flex items-center gap-x-1.5 rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                                                        <div className="">
                                                          🌟
                                                        </div>
                                                        {task.priority}
                                                      </span>
                                                    )}

                                                    {task.priority ===
                                                      "Urgente" && (
                                                      <span class="mb-[30px] inline-flex items-center gap-x-1.5 rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
                                                        <div className="">
                                                          💥
                                                        </div>
                                                        {task.priority}
                                                      </span>
                                                    )}
                                                  </div>

                                                  <div className="absolute bottom-2 icons-task">
                                                    <div className="flex items-center gap-3">
                                                      <div className="flex -space-x-1 overflow-hidden">
                                                        {task.responsable.map(
                                                          (respon) => (
                                                            <span
                                                              style={{
                                                                backgroundColor:
                                                                  getBackgroundColor(
                                                                    respon.user.name
                                                                      .charAt(0)
                                                                      .toUpperCase()
                                                                  ),
                                                              }}
                                                              className="inline-flex items-center justify-center rounded-full h-7 w-7"
                                                            >
                                                              <span className="text-sm font-medium text-white">
                                                                {respon.user.name
                                                                  .charAt(0)
                                                                  .toUpperCase()}
                                                              </span>
                                                            </span>
                                                          )
                                                        )}
                                                      </div>
                                                      {task.responsable.length >
                                                      0 ? (
                                                        <button
                                                          type="button"
                                                          className="p-1 border-2 border-gray-300 border-dashed rounded-full"
                                                        >
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            className="text-gray-300 size-4"
                                                          >
                                                            <path
                                                              strokeLinecap="round"
                                                              strokeLinejoin="round"
                                                              d="M12 4.5v15m7.5-7.5h-15"
                                                            />
                                                          </svg>
                                                        </button>
                                                      ) : (
                                                        <button
                                                          type="button"
                                                          className="p-1 border-2 border-gray-300 border-dashed rounded-full"
                                                        >
                                                          <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            className="text-gray-300 size-4"
                                                          >
                                                            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                                                          </svg>
                                                        </button>
                                                      )}

                                                      {visibleDropdownId ===
                                                        task.id && (
                                                        <Menu
                                                          as="div"
                                                          onMouseOver={() =>
                                                            setVisibleDropdownId(
                                                              task.id
                                                            )
                                                          }
                                                          onMouseOut={() =>
                                                            setVisibleDropdownId(
                                                              null
                                                            )
                                                          }
                                                          className="relative inline-block text-left"
                                                        >
                                                          <div>
                                                            <MenuButton
                                                              onClick={(e) =>
                                                                e.stopPropagation()
                                                              }
                                                              onMouseOver={() =>
                                                                setVisibleDropdownId(
                                                                  task.id
                                                                )
                                                              }
                                                              onMouseOut={() =>
                                                                setVisibleDropdownId(
                                                                  null
                                                                )
                                                              }
                                                              type="button"
                                                              className="p-1 border-2 border-gray-300 border-dashed rounded-full"
                                                            >
                                                              <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                                className="text-gray-300 size-4"
                                                              >
                                                                <path
                                                                  fillRule="evenodd"
                                                                  d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                                                                  clipRule="evenodd"
                                                                />
                                                              </svg>
                                                            </MenuButton>
                                                          </div>
                                                        </Menu>
                                                      )}
                                                    </div>
                                                  </div>
                                                  {visibleDropdownId ===
                                                    task.id && (
                                                    <div
                                                      className="absolute bottom-2 right-3 icon-comments"
                                                      onClick={(e) =>
                                                        e.stopPropagation()
                                                      }
                                                    >
                                                      <button
                                                        type="button"
                                                        className="flex items-center gap-2 text-gray-300"
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
                                                            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                                                          />
                                                        </svg>
                                                        0
                                                      </button>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              {visibleDropdownId ===
                                                task.id && (
                                                <Menu
                                                  as="div"
                                                  onMouseOver={() =>
                                                    setVisibleDropdownId(
                                                      task.id
                                                    )
                                                  }
                                                  onMouseOut={() =>
                                                    setVisibleDropdownId(null)
                                                  }
                                                  className="relative inline-block text-left"
                                                >
                                                  <div>
                                                    <MenuButton className="absolute flex items-center p-1 rounded-full text-dark -top-14 -left-10 hover:text-gray-600 focus:outline-none hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                                      <span className="sr-only">
                                                        Open options
                                                      </span>
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        className="size-5"
                                                      >
                                                        <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                                                      </svg>
                                                    </MenuButton>
                                                  </div>

                                                  <MenuItems
                                                    transition
                                                    className="absolute right-0 -top-10 z-10 mt-2 w-20 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                                  >
                                                    <div className="py-1">
                                                      <MenuItem>
                                                        <button
                                                          type="button"
                                                          onClick={() =>
                                                            handleClickDeleteCard(
                                                              task
                                                            )
                                                          }
                                                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                                        >
                                                          Deletar
                                                        </button>
                                                      </MenuItem>

                                                      <MenuItem>
                                                        <a
                                                          href="#"
                                                          onClick={
                                                            handleDropdownClick
                                                          }
                                                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                                        >
                                                          Mover
                                                        </a>
                                                      </MenuItem>
                                                    </div>
                                                  </MenuItems>
                                                </Menu>
                                              )}
                                            </div>
                                          )}
                                        </Draggable>
                                      </div>
                                    ))}

                                    {provided.placeholder}
                                    {!hideButtonAddCard[pipelineItem.id] && (
                                      <button
                                        onClick={() =>
                                          handleClickButtonAddCard(
                                            pipelineItem.id
                                          )
                                        }
                                        className="flex items-center justify-center w-full px-5 py-2 text-sm font-medium text-gray-500 duration-300 bg-transparent border-2 border-gray-200 border-dashed rounded-lg whitespace-nowrap hover:border-gray-300 hover:bg-gray-100"
                                        type="button"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                          className="size-5"
                                        >
                                          <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                                        </svg>
                                        Adicionar nova tarefa
                                      </button>
                                    )}

                                    {openFormAddCard[pipelineItem.id] && (
                                      <div
                                        style={{
                                          borderLeftColor: pipelineItem.color,
                                        }}
                                        ref={modalCardRef}
                                        className={`w-full transition-all bg-white border border-l-8 rounded-lg shadow cursor-pointer`}
                                      >
                                        <form
                                          method="POST"
                                          onSubmit={handleSubmitCard}
                                          className="px-4 py-3"
                                        >
                                          <div className="mb-6">
                                            <div className="relative mt-2">
                                              <input
                                                required
                                                value={nameTask}
                                                onChange={(e) =>
                                                  setNameTask(e.target.value)
                                                }
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="Digite a tarefa..."
                                                className="peer pl-0 block w-full border-0 bg-white py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                                                onFocus={(e) => {
                                                  const borderElement = e.target
                                                    .nextElementSibling as HTMLElement; // Afirma que é um HTMLElement
                                                  if (borderElement) {
                                                    borderElement.style.borderBottom = `2px solid ${pipelineItem.color}`; // Aplica a borda colorida
                                                  }
                                                }}
                                                onBlur={(e) => {
                                                  const borderElement = e.target
                                                    .nextElementSibling as HTMLElement; // Afirma que é um HTMLElement
                                                  if (borderElement) {
                                                    borderElement.style.borderBottom =
                                                      "none"; // Remove a borda
                                                  }
                                                }}
                                              />
                                              <div
                                                aria-hidden="true"
                                                className="absolute inset-x-0 bottom-0 border-transparent peer-focus:border-t-2"
                                              />
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-2">
                                            <button
                                              type="submit"
                                              style={{
                                                backgroundColor:
                                                  pipelineItem.color,
                                              }}
                                              className="px-2 py-1 text-sm font-semibold text-white transition-all rounded shadow-sm hover:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            >
                                              Salvar
                                            </button>
                                          </div>
                                        </form>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          </div>
                        ))}
                    </>
                  )}
                </>
              )}

              <div className="pipeline">
                {!openPipelineCreate && (
                  <div className="ml-3 pipeline-header mt-[13px]">
                    <button
                      onClick={() => setOpenPipelineCreate(true)}
                      type="button"
                      className="flex items-center justify-center w-full px-5 py-2 text-sm font-medium text-gray-500 duration-300 bg-transparent border-2 border-gray-200 border-dashed rounded-lg whitespace-nowrap hover:border-gray-300 hover:bg-gray-100 "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="size-5"
                      >
                        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                      </svg>
                      Adicionar nova coluna
                    </button>
                  </div>
                )}

                {openPipelineCreate && (
                  <div className="inset-0 flex items-start justify-center bg-transparent ">
                    <div
                      ref={modalRef}
                      className="ml-3 transition-all bg-white border rounded-lg shadow cursor-pointer w-[264px]"
                    >
                      <form
                        ref={formRef}
                        method="POST"
                        onSubmit={handleSubmitForm}
                        className="p-4"
                      >
                        <div className="mb-6">
                          <div className="relative mt-2">
                            <input
                              required
                              value={nameColumn}
                              onChange={(e) => setNameColumn(e.target.value)}
                              id="name"
                              name="name"
                              type="text"
                              placeholder="Cria nova coluna..."
                              className="peer pl-0 block w-full border-0 bg-white py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                            />
                          </div>

                          <div className="mb-6">
                            <div className="mt-2">
                              <RadioGroup
                                value={selectedColor}
                                onChange={setSelectedColor}
                                className="flex flex-wrap items-center gap-3 mt-6"
                              >
                                {optionsColors.map((option) => (
                                  <Radio
                                    key={option.name}
                                    value={option.hex}
                                    aria-label={option.name}
                                    className={classNames(
                                      option.color,
                                      "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ring-current focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1"
                                    )}
                                  >
                                    <span
                                      aria-hidden="true"
                                      className="w-[15px] h-[15px] bg-current border border-black rounded-full border-opacity-10"
                                    />
                                  </Radio>
                                ))}
                              </RadioGroup>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="submit"
                            className="px-2 py-1 text-sm font-semibold text-white bg-indigo-600 rounded shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Salvar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DragDropContext>
        </div>
      </div>

      {selectedCard && (
        <EditTask
          refreshCards={refreshCards}
          setRefreshCards={setRefreshCards}
          loadingComments={loadingComments}
          setLoadingComments={setLoadingComments}
          card_id={selectedCard.id}
          pipeline_id={selectedCard.pipeline_id}
          titleCard={selectedCard.title}
          descriptionCard={selectedCard.description}
          annotationText={selectedCard.annotation}
          setIsOpenModal={setOpenCardEdit}
          isOpenModal={openCardEdit}
          emailTask={selectedCard.email}
          phoneTask={selectedCard.phone}
          data_conclusion={selectedCard.date_conclusion}
          priorityText={selectedCard.priority}
          setRefreshResponsable={setRefreshResponsable}
          refreshResponsable={refreshResponsable}
          listResponsable={selectedCard.responsable}
        ></EditTask>
      )}
    </Aside>
  );
};

export default Opportunity;
