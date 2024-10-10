/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC, FormEvent, useEffect, useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEnterpriseContext } from "../../context/EnterpriseContext";
import { useAuth } from "../../context/AuthContext";
import {
  createEnvironment,
  deleteEnvironment,
  getAllEnvironment,
  updateEnvironment,
} from "../../api/environments/environmentsApi";
import {
  createPipelineEnterprise,
  getPipelineEnterprise,
  updatedPipeline,
} from "../../api/pipeline/pipelineApi";
import { Link } from "react-router-dom";
import { useEnvironmentContext } from "../../context/EnvironmentContext";
import Confirm from "../../components/Corfirm";
import toast from "react-hot-toast";
import { userInEnterprise } from "../../api/enterprise/enterpriseApi";
import Aside from "../../components/Aside";
import Heading from "../../components/Heading";
import BaseButton from "../../components/BaseButton";

interface Pipeline {
  id: string;
  name: string;
}

interface ColumNameProps {
  name: string;
  color: string;
}

const Settings: FC = () => {
  const [openAddPipelines, setOpenAddPipelines] = useState<boolean>(false);
  const [openUpdatePipeline, setOpenUpdatePipeline] = useState<boolean>(false);

  const [namePipeline, setNamePipeline] = useState("");

  const [newsColumns, setNewsColumns] = useState<{
    [key: number]: { name: string; color: string }[];
  }>({
    1: [
      { name: "Pendente", color: "#3b82f6" },
      { name: "Em andamento", color: "#22c55e" },
      { name: "Entregue", color: "#ef4444" },
    ],
  });

  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [loadingButtonDelete, setLoadingButtonDelete] =
    useState<boolean>(false);
  const [listEnvironments, setListEnvironmets] = useState<{ name: string }[]>(
    []
  );
  const [confirm, setConfirm] = useState<boolean>(false);
  const [refreshEnvironments, setRefreshEnvironments] =
    useState<boolean>(false);
  const [refreshPipelines, setRefreshPipelines] = useState<boolean>(false);
  const [pipelineSelected, setPipelineSelected] = useState<Pipeline | null>(
    null
  );
  const [listPipelinesByEnvironment, setListPipelineByEnvironment] = useState<
    { environment_id: string; name: string }[]
  >([]);

  const [columns, setColumns] = useState<any[]>([]); // quando for da o update da pipeline

  const [permission, setPermission] = useState<string>("");

  const [listUsers, setListUsers] = useState<[]>([]);
  //context

  // Função para lidar com a mudança de valor
  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPermission(e.target.value);
  };

  const { handleEnvironmentChange } = useEnvironmentContext();
  const { enterprise } = useEnterpriseContext();
  const { getUserContext } = useAuth();

  const userData = getUserContext();

  // Função para adicionar uma nova opção ao campo
  // Função para adicionar uma nova opção com um valor e uma cor padrão
  const addOptionToField = (fieldId: number) => {
    setNewsColumns((prevOptions) => ({
      ...prevOptions,
      [fieldId]: [
        ...(prevOptions[fieldId] || []),
        { name: "", color: "#ddd" }, // Adiciona uma opção com valor vazio e cor padrão (branca)
      ],
    }));
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

  // Função para atualizar o valor e a cor de uma opção existente
  const handleOptionChange = (
    fieldId: number,
    optionIndex: number,
    value: string,
    color: string
  ) => {
    setNewsColumns((prevOptions) => {
      const updatedOptions = [...(prevOptions[fieldId] || [])];
      updatedOptions[optionIndex] = { name: value, color: color }; // Atualiza tanto o valor quanto a cor
      return { ...prevOptions, [fieldId]: updatedOptions };
    });
  };

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();

    setLoadingButton(true);

    try {
      if (enterprise != null && userData != null) {
        const result = await createEnvironment(
          namePipeline,
          userData.id,
          enterprise.id
        );

        // funçáo para enviar varios dados para o banco
        const promises = Object.entries(newsColumns).flatMap(
          ([fieldId, columns]: any) => {
            return columns.map((columnName: ColumNameProps) => {
              console.log(fieldId);
              return createPipelineEnterprise(
                columnName.name,
                enterprise.id,
                result.environment.id,
                columnName.color,
                permission
              );
            });
          }
        );

        await Promise.all(promises);

        toast.success("Pipeline cadastrada com sucesso!");
        setNamePipeline("");
        setOpenAddPipelines(false);
        setRefreshEnvironments(!refreshEnvironments);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingButton(false);
    }
  };

  useEffect(() => {
    const listEnvironments = async () => {
      // setLoading(true);
      try {
        if (enterprise != null && userData != null) {
          const result = await getAllEnvironment(userData.id, enterprise.id);

          setListEnvironmets(result.environments);
        }
      } catch (error) {
        console.log(error);
      }
    };

    listEnvironments();
  }, [enterprise, userData, refreshEnvironments]);

  useEffect(() => {
    const listPipelines = async () => {
      try {
        if (enterprise != null) {
          const result = await getPipelineEnterprise(enterprise.id);
          setListPipelineByEnvironment(result.pipelines);
        }
      } catch (error) {
        console.log(error);
      }
    };

    listPipelines();
  }, [enterprise, refreshPipelines]);

  const handleDelete = async () => {
    // logica para deletar a pipeline

    setLoadingButtonDelete(true);

    try {
      if (pipelineSelected != null) {
        await deleteEnvironment(pipelineSelected.id);
        toast.success("Pipeline deletada com sucesso!");
        setConfirm(false);
        setPipelineSelected(null);
        setRefreshEnvironments(!refreshEnvironments);
        localStorage.removeItem("selectedEnvironment");
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

  const handleClickBtnDelete = (pipeline: any) => {
    setConfirm(true);
    setPipelineSelected(pipeline);
  };

  const handleClickBtnUpdate = (pipeline: any) => {
    setOpenUpdatePipeline(true);
    setPipelineSelected(pipeline);
    setNamePipeline(pipeline.name);
  };

  const handleUpdateEnvironment = async (e: FormEvent) => {
    e.preventDefault();

    setLoadingButton(true);

    try {
      if (enterprise != null && pipelineSelected != null) {
        await updateEnvironment(
          pipelineSelected.id,
          enterprise.id,
          namePipeline
        );

        const promises = Object.entries(columns).flatMap(
          ([fieldId, column]: any) => {
            console.log(fieldId);
            return updatedPipeline(
              column.id,
              column.name,
              column.sort,
              enterprise.id,
              Number(pipelineSelected.id),
              column.color
            );
          }
        );

        await Promise.all(promises);

        setOpenUpdatePipeline(false);
        setRefreshEnvironments(!refreshEnvironments);
        setRefreshPipelines(!refreshPipelines);
        toast.success("Pipeline atualizada com sucesso!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingButton(false);
    }
  };

  useEffect(() => {
    if (pipelineSelected?.id && listPipelinesByEnvironment) {
      const filteredColumns = listPipelinesByEnvironment
        .filter((column) => column.environment_id === pipelineSelected.id)
        .map((column) => ({ ...column })); // Crie uma cópia para manter os campos editáveis

      setColumns(filteredColumns); // Inicialize o estado com as colunas do ambiente selecionado
    }
  }, [pipelineSelected, listPipelinesByEnvironment]);

  // Função para atualizar o nome da coluna no estado
  const handleColumnChange = (index: number, value: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column, i) =>
        i === index ? { ...column, name: value } : column
      )
    );
  };

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
    <Aside>
      <Heading
        title="Configurações da pipeline"
        rightButtomGroup={
          <BaseButton onClick={() => setOpenAddPipelines(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Adicionar pipeline
          </BaseButton>
        }
      ></Heading>
      <Confirm
        loadingButton={loadingButtonDelete}
        setLoadingButton={setLoadingButtonDelete}
        onCancel={handleCancel}
        onConfirm={handleDelete}
        isOpen={confirm}
        setIsOpen={setConfirm}
        title="Deseja deletar a pipeline?"
      ></Confirm>

      <div className="">
        <div className="w-full mt-3 text-base max-w-[600px]">
          A pipeline vai agilizar o desenvolvimento do seu projeto, garantindo
          entregas mais rápidas e com maior qualidade. Ela detecta erros
          antecipadamente, evitando falhas no resultado final. Com isso, você
          ganha eficiência e tranquilidade durante todo o processo.
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flow-root mt-8">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block w-full py-2 align-middle">
                
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Pipelines
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        ></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {listEnvironments ? (
                        listEnvironments.map((environment: any) => (
                          <tr key={environment.id}>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap w-[80%]">
                              <Link
                                onClick={() =>
                                  handleEnvironmentChange(environment)
                                }
                                to="/opportunity"
                              >
                                {environment.name}
                              </Link>
                            </td>

                            <td className="flex items-center gap-3 px-3 py-4 text-sm text-gray-500 cursor-pointer whitespace-nowrap">
                              <Link
                                onClick={() =>
                                  handleEnvironmentChange(environment)
                                }
                                to="/opportunity"
                                className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              >
                                Acessar pipeline
                              </Link>

                              <button
                                onClick={() =>
                                  handleClickBtnUpdate(environment)
                                }
                                className="p-1 text-indigo-600 transition-all rounded-full hover:text-indigo-900"
                                type="button"
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
                              </button>

                              <button
                                className="p-1 text-indigo-600 transition-all rounded-full hover:text-indigo-900"
                                onClick={() =>
                                  handleClickBtnDelete(environment)
                                }
                                type="button"
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
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="px-6 py-4 text-center text-gray-400">
                            Nenhuma pipeline cadastrada!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={openAddPipelines}
        onClose={setOpenAddPipelines}
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
                  onSubmit={handleSubmitForm}
                  className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl"
                >
                  <div className="flex flex-col flex-1 min-h-0 py-6 overflow-y-scroll">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                          Cadastrar Pipeline
                        </DialogTitle>
                        <div className="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            onClick={() => setOpenAddPipelines(false)}
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
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Nome da Pipeline
                        </label>
                        <div className="mt-2 mb-6">
                          <input
                            value={namePipeline}
                            onChange={(e) => setNamePipeline(e.target.value)}
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Digite o nome da pipeline..."
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <label
                              htmlFor="columns"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Colunas
                            </label>
                            <button
                              onClick={() => addOptionToField(1)}
                              type="button"
                              className="p-1 text-white bg-indigo-600 rounded-full shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              <PlusIcon
                                aria-hidden="true"
                                className="w-5 h-5"
                              />
                            </button>
                          </div>
                          {newsColumns[1]?.map((column, index) => (
                            <div className="mt-2" key={index}>
                              {/* Input para o nome da coluna */}
                              <input
                                value={column.name} // Acessa o 'name' do objeto column
                                id="columns"
                                onChange={
                                  (e) =>
                                    handleOptionChange(
                                      1,
                                      index,
                                      e.target.value,
                                      column.color
                                    ) // Passa o valor do nome e mantém a cor atual
                                }
                                name="columns"
                                type="text"
                                placeholder="Digite o nome da coluna..."
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          ))}

                          {permission === "people" && (
                            <div className="mt-6">
                              <h3 className="text-sm font-medium leading-6 text-gray-900">
                                Membros da empresa
                              </h3>
                              <div className="mt-2">
                                <div className="flex space-x-2">
                                  {listUsers.length > 0 &&
                                    listUsers.map((person: any) => (
                                      <div
                                        key={person.email}
                                        className="flex items-start"
                                      >
                                        <a className="relative rounded-full hover:opacity-75">
                                          <span
                                            style={{
                                              backgroundColor:
                                                getBackgroundColor(
                                                  person.name
                                                    .charAt(0)
                                                    .toUpperCase()
                                                ),
                                            }}
                                            className={`inline-flex items-center justify-center rounded-full w-9 h-9`}
                                          >
                                            <span className="font-medium leading-none text-white">
                                              {person.name
                                                .charAt(0)
                                                .toUpperCase()}
                                            </span>
                                          </span>
                                        </a>
                                        <button type="button">
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
                                    ))}
                                  <button
                                    type="button"
                                    className="relative inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-gray-400 bg-white border-2 border-gray-200 border-dashed rounded-full hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                  >
                                    <span className="absolute -inset-2" />
                                    <span className="sr-only">
                                      Add team member
                                    </span>
                                    <PlusIcon
                                      aria-hidden="true"
                                      className="w-5 h-5"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          <fieldset className="mt-6">
                            <legend className="text-sm font-medium leading-6 text-gray-900">
                              Privacidade
                            </legend>
                            <div className="mt-2 space-y-4">
                              <div className="relative flex items-start">
                                <div className="absolute flex items-center h-6">
                                  <input
                                    value="public"
                                    checked={permission === "public"}
                                    onChange={handlePermissionChange}
                                    id="privacy-public"
                                    name="privacy"
                                    type="radio"
                                    aria-describedby="privacy-public-description"
                                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                                  />
                                </div>
                                <div className="text-sm leading-6 pl-7">
                                  <label
                                    htmlFor="privacy-public"
                                    className="font-medium text-gray-900"
                                  >
                                    Acesso público
                                  </label>
                                  <p
                                    id="privacy-public-description"
                                    className="text-gray-500"
                                  >
                                    Todos membros verão este pipeline.
                                  </p>
                                </div>
                              </div>
                              <div>
                                <div className="relative flex items-start">
                                  <div className="absolute flex items-center h-6">
                                    <input
                                      value="people"
                                      checked={permission === "people"}
                                      onChange={handlePermissionChange}
                                      id="privacy-private-to-project"
                                      name="privacy"
                                      type="radio"
                                      aria-describedby="privacy-private-to-project-description"
                                      className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                                    />
                                  </div>
                                  <div className="text-sm leading-6 pl-7">
                                    <label
                                      htmlFor="privacy-private-to-project"
                                      className="font-medium text-gray-900"
                                    >
                                      Privado para membros
                                    </label>
                                    <p
                                      id="privacy-private-to-project-description"
                                      className="text-gray-500"
                                    >
                                      Somente os membros selecionados terão
                                      acesso.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="relative flex items-start">
                                  <div className="absolute flex items-center h-6">
                                    <input
                                      value="private"
                                      checked={permission === "private"}
                                      onChange={handlePermissionChange}
                                      id="privacy-private"
                                      name="privacy"
                                      type="radio"
                                      aria-describedby="privacy-private-to-project-description"
                                      className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                                    />
                                  </div>
                                  <div className="text-sm leading-6 pl-7">
                                    <label
                                      htmlFor="privacy-private"
                                      className="font-medium text-gray-900"
                                    >
                                      Privado para você
                                    </label>
                                    <p
                                      id="privacy-private-description"
                                      className="text-gray-500"
                                    >
                                      Somente você terá acesso.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end flex-shrink-0 px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setOpenAddPipelines(false)}
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
        open={openUpdatePipeline}
        onClose={setOpenUpdatePipeline}
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
                  onSubmit={handleUpdateEnvironment}
                  method="POST"
                  className="flex flex-col h-full bg-white divide-y divide-gray-200 shadow-xl"
                >
                  <div className="flex flex-col flex-1 min-h-0 py-6 overflow-y-scroll">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                          Atualizar Pipeline
                        </DialogTitle>
                        <div className="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            onClick={() => setOpenUpdatePipeline(false)}
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
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Nome da Pipeline
                        </label>
                        <div className="mt-2 mb-6">
                          <input
                            value={namePipeline}
                            onChange={(e) => setNamePipeline(e.target.value)}
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Digite o nome da pipeline..."
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label
                              htmlFor="columns"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Colunas
                            </label>
                          </div>
                          {listPipelinesByEnvironment &&
                          listPipelinesByEnvironment.length === 0 ? (
                            <div>nenhuma coluna</div>
                          ) : (
                            columns.map((column, index) => (
                              <div className="mt-2" key={index}>
                                <input
                                  value={column.name}
                                  id={`columns-${index}`}
                                  onChange={(e) =>
                                    handleColumnChange(index, e.target.value)
                                  } // Atualiza o nome da coluna
                                  name="columns"
                                  type="text"
                                  placeholder="Digite o nome da coluna..."
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end flex-shrink-0 px-4 py-4">
                    <button
                      type="button"
                      onClick={() => setOpenUpdatePipeline(false)}
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
                          Atualizando...
                        </>
                      ) : (
                        "Atualizar"
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

export default Settings;
