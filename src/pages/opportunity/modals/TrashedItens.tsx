// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { FC, useEffect, useState } from "react";
import { useEnterpriseContext } from "../../../context/EnterpriseContext";
import {
  Environment,
  forceDeleteEnvironment,
  getAllEnvironmentTrashed,
  restoreEnvironment,
} from "../../../api/environments/environmentsApi";
import { useAuth } from "../../../context/AuthContext";
import Confirm from "../../../components/Corfirm";
import {
  getPipelinesTrashed,
  restorePipeline,
} from "../../../api/pipeline/pipelineApi";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { cardTrasheds } from "../../../api/cards/cardsApi";

interface TrashedItensProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const TrashedItens: FC<TrashedItensProps> = (props) => {
  const [listEnvironmentsTrashed, setListEnvironments] = useState<
    Environment[]
  >([]);
  const [listColumnsTrashed, setListColumnsTrashed] = useState<
    { color: string; name: string; id: string }[]
  >([]);
  const [listCardTrashed, setListCardTrashed] = useState<[]>([]);
  const [refreshEnvironments, setRefreshEnvironments] =
    useState<boolean>(false);
  const [refreshColumns, setRefreshColumns] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [pipelineSelected, setPipelineSelected] = useState<string>("");

  //context
  const { enterprise } = useEnterpriseContext();
  const { getUserContext } = useAuth();
  const userData = getUserContext();

  useEffect(() => {
    const listTrashedEnvironments = async () => {
      try {
        if (enterprise != null && userData != null) {
          const result = await getAllEnvironmentTrashed(
            userData.id,
            enterprise.id
          );
          setListEnvironments(result.environments);
        }
      } catch (error) {
        console.log(error);
      }
    };

    listTrashedEnvironments();
  }, [enterprise, userData, refreshEnvironments]);

  useEffect(() => {
    const listTrashedPipelines = async () => {
      try {
        if (enterprise != null) {
          const result = await getPipelinesTrashed(enterprise.id);

          setListColumnsTrashed(result.pipelines);
        }
      } catch (error) {
        console.log(error);
      }
    };

    listTrashedPipelines();
  }, [enterprise, refreshColumns]);

  useEffect(() => {
    const listTrashedsCards = async () => {
      try {
        if (userData != null) {
          const result = await cardTrasheds(userData.id.toString());

          setListCardTrashed(result.cards);
        }
      } catch (error) {
        console.log(error);
      }
    };

    listTrashedsCards();
  }, [userData]);

  const handleClickRestoreEnvironment = async (id: string) => {
    try {
      await restoreEnvironment(id);
      toast.success("Pipeline restaurada com sucesso!");
      setRefreshEnvironments(!refreshEnvironments);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickRestoreColumn = async (id: string) => {
    try {
      await restorePipeline(id);
      toast.success("Coluna restaurada com sucesso!");
      setRefreshColumns(!refreshColumns);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        // O erro é do Axios e tem uma resposta
        toast.error(error.response.data.message);
      } else {
        // Lidar com erros inesperados
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleClickForceDeleteEnvironment = async () => {
    try {
      await forceDeleteEnvironment(pipelineSelected);
      setRefreshEnvironments(!refreshEnvironments);
      toast.success("Pipeline deletada permanente com sucesso!");
      setConfirm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setConfirm(false);
  };

  const handleConfirm = (id: string) => {
    setConfirm(true);
    setPipelineSelected(id);
  };

  return (
    <>
      <Confirm
        onCancel={handleCancel}
        onConfirm={handleClickForceDeleteEnvironment}
        isOpen={confirm}
        setIsOpen={setConfirm}
        title="Deseja deletar permanente a pipeline?"
      ></Confirm>

      <Dialog
        open={props.isOpen}
        onClose={props.setIsOpen}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <div className="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                        Recuperar de excluídos
                      </DialogTitle>
                      <div className="flex items-center ml-3 h-7">
                        <button
                          type="button"
                          onClick={() => props.setIsOpen(false)}
                          className="relative text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-1 mt-6">
                    <ul role="list" className="w-ful">
                      {listEnvironmentsTrashed &&
                        listEnvironmentsTrashed.length > 0 &&
                        listEnvironmentsTrashed.map((environment) => (
                          <li className="mb-6 border-b border-l-8 border-l-indigo-600">
                            <button
                              type="button"
                              className="block w-full hover:bg-gray-50"
                            >
                              <div className="px-6 py-4">
                                <div className="flex items-center justify-between gap-1">
                                  <div className="text-sm font-medium truncate text-dark">
                                    {environment.name}
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    <button
                                      onClick={() =>
                                        handleConfirm(environment.id.toString())
                                      }
                                      className="p-1 text-white bg-indigo-600 rounded-full shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="size-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleClickRestoreEnvironment(
                                          environment.id.toString()
                                        )
                                      }
                                      className="p-1 text-white bg-indigo-600 rounded-full shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="size-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </button>
                          </li>
                        ))}
                    </ul>

                    <ul role="list" className="w-ful">
                      {listColumnsTrashed &&
                        listColumnsTrashed.length > 0 &&
                        listColumnsTrashed.map((column) => (
                          <li
                            key={column.id}
                            style={{ borderLeftColor: column.color }}
                            className="mb-6 border-b border-l-8"
                          >
                            <button
                              type="button"
                              className="block w-full hover:bg-gray-50"
                            >
                              <div className="px-6 py-4">
                                <div className="flex items-center justify-between gap-1">
                                  <div className="text-sm font-medium truncate text-dark">
                                    {column.name}
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    <button
                                      onClick={() =>
                                        handleConfirm(column.id.toString())
                                      }
                                      className="p-1 text-white bg-indigo-600 rounded-full shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="size-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleClickRestoreColumn(
                                          column.id.toString()
                                        )
                                      }
                                      className="p-1 text-white bg-indigo-600 rounded-full shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="size-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </button>
                          </li>
                        ))}
                    </ul>

                    <ul role="list" className="w-ful">
                      {listCardTrashed &&
                        listCardTrashed.length > 0 &&
                        listCardTrashed.map((task) => (
                          <li key={task.id} className="mb-6 border-b border-l-8 border-l-indigo-600">
                            <button
                              type="button"
                              className="block w-full hover:bg-gray-50"
                            >
                              <div className="px-6 py-4">
                                <div className="flex items-center justify-between gap-1">
                                  <div className="text-sm font-medium truncate text-dark">
                                    {task.title}
                                  </div>
                                  <div className="flex items-center justify-between gap-3">
                                    {/* <button
                                      onClick={() =>
                                        handleConfirm(environment.id.toString())
                                      }
                                      className="p-1 text-white bg-indigo-600 rounded-full shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="size-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleClickRestoreEnvironment(
                                          environment.id.toString()
                                        )
                                      }
                                      className="p-1 text-white bg-indigo-600 rounded-full shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                      type="button"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="size-5"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button> */}
                                  </div>
                                </div>
                              </div>
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default TrashedItens;
