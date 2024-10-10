// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { FC, useEffect, useState } from "react";
import {
  deleteInputsEnvironment,
  getAllInputs,
} from "../../../api/inputs/inputsApi";
import toast from "react-hot-toast";
import { useEnterpriseContext } from "../../../context/EnterpriseContext";
import { useEnvironmentContext } from "../../../context/EnvironmentContext";
import {
  deletePipeline,
  getPipelineEnterprise,
  updatedPipeline,
} from "../../../api/pipeline/pipelineApi";
import { updateEnvironment } from "../../../api/environments/environmentsApi";

interface PropsSettingsPipeline {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsPipeline: FC<PropsSettingsPipeline> = ({
  isOpenModal,
  setIsOpenModal,
}) => {
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [listInputsEnterprise, setListInputsEnterprise] = useState<[]>([]);
  const { enterprise } = useEnterpriseContext();
  const { environment } = useEnvironmentContext();

  const [nameEnvironmentSelected, setnameEnvironmentSelected] =
    useState<string>("");

  const [refreshInput, setRefreshInput] = useState<boolean>(false);
  const [refreshPipelines, setRefreshPipelines] = useState<boolean>(false);

  useEffect(() => {
    if (environment != null) {
      setnameEnvironmentSelected(environment.name);
    }
  }, [environment]);

  useEffect(() => {
    const getInputsEnterprise = async () => {
      try {
        if (enterprise != null) {
          const result = await getAllInputs(enterprise.id);

          setListInputsEnterprise(result.inputs);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getInputsEnterprise();
  }, [enterprise, refreshInput]);

  const handleDeleteInput = async (id: string) => {
    try {
      await deleteInputsEnvironment(id);
      toast.success("Campo deletado com sucesso");
      setRefreshInput(!refreshInput);
    } catch (error) {
      console.log(error);
    }
  };

  const [columns, setColumns] = useState<[]>([]);

  const handleColumnChange = (index: number, value: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column, i) =>
        i === index ? { ...column, name: value } : column
      )
    );
  };

  useEffect(() => {
    const getColumnsPipeline = async () => {
      if (enterprise != null) {
        const result = await getPipelineEnterprise(enterprise.id);

        setColumns(result.pipelines);
      }
    };

    getColumnsPipeline();
  }, [enterprise, refreshPipelines]);

  const handleUpdateEnvironment = async (e: FormEvent) => {
    e.preventDefault();

    setLoadingButton(true);

    try {
      if (enterprise != null && environment != null) {
        await updateEnvironment(
          environment.id,
          enterprise.id,
          nameEnvironmentSelected
        );

        const promises = Object.entries(columns).flatMap(
          ([fieldId, column]: any) => {
            console.log(fieldId);
            return updatedPipeline(
              column.id,
              column.name,
              column.sort,
              enterprise.id,
              environment.id,
              column.color
            );
          }
        );

        await Promise.all(promises);

        toast.success("Pipeline atualizada com sucesso!");
        setRefreshPipelines(!refreshPipelines);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingButton(false);
    }
  };

  const handlePipelineDelete = async (id: string) => {
    try {
      await deletePipeline(id);
      toast.success("Coluna deletada com sucesso!");
      setRefreshPipelines(!refreshPipelines);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={isOpenModal}
      onClose={setIsOpenModal}
      className="relative z-10"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 z-10 overflow-hidden">
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
                        Editar Pipeline
                      </DialogTitle>
                      <div className="flex items-center ml-3 h-7">
                        <button
                          type="button"
                          onClick={() => setIsOpenModal(false)}
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
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Nome da Pipeline
                      </label>
                      <div className="mt-2">
                        <input
                          value={nameEnvironmentSelected}
                          onChange={(e) =>
                            setnameEnvironmentSelected(e.target.value)
                          }
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Pipeline..."
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="mt-10">
                      {listInputsEnterprise.length > 0 && (
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Campos da Pipeline
                        </label>
                      )}

                      {listInputsEnterprise.length > 0 &&
                        listInputsEnterprise.map((input) => (
                          <div className="flex mt-3 items-center justify-between w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            {input.name}
                            <div className="icons-inputs">
                              {/* <button
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
                              </button> */}

                              <button
                                onClick={() => handleDeleteInput(input.id)}
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
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="mt-10">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Colunas
                      </label>

                      {columns.length > 0 &&
                        columns.map((column, index) => (
                          <div key={column.id}>
                            {column.environment_id === environment.id && (
                              <div className="mt-2" key={index}>
                                <div className="relative flex items-center">
                                  <input
                                    value={column.name}
                                    id={`columns-${index}`}
                                    name="columns"
                                    type="text"
                                    onChange={(e) =>
                                      handleColumnChange(index, e.target.value)
                                    } // Atualiza o nome da coluna
                                    placeholder="Digite o nome da coluna..."
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  />

                                  <button
                                    onClick={() =>
                                      handlePipelineDelete(column.id)
                                    }
                                    className="absolute right-0 p-1 text-indigo-600 transition-all rounded-full hover:text-indigo-900"
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
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end flex-shrink-0 px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setIsOpenModal(false)}
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
  );
};

export default SettingsPipeline;
