// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { FC, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useAuth } from "../../context/AuthContext";
import { getCardsResponsableUser } from "../../api/responsable/responsableApi";
import { MdHourglassEmpty } from "react-icons/md";
import { useEnterpriseContext } from "../../context/EnterpriseContext";
import { getPipelineEnterprise } from "../../api/pipeline/pipelineApi";
import { Link } from "react-router-dom";
import { getAllEnvironment } from "../../api/environments/environmentsApi";
import { useEnvironmentContext } from "../../context/EnvironmentContext";
import Aside from "../../components/Aside";
import Heading from "../../components/Heading";

const Dashboard: FC = () => {
  const stats = [
    {
      name: "Revenue",
      value: "$405,091.00",
      change: "+4.75%",
      changeType: "positive",
    },
    {
      name: "Overdue invoices",
      value: "$12,787.00",
      change: "+54.02%",
      changeType: "negative",
    },
    {
      name: "Outstanding invoices",
      value: "$245,988.00",
      change: "-1.39%",
      changeType: "positive",
    },
    {
      name: "Expenses",
      value: "$30,156.00",
      change: "+10.18%",
      changeType: "negative",
    },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

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

  const [listTaskRespponsable, setListTaskResponsable] = useState<[]>([]);
  const [listPipelinesInCard, setListPipelinesInCard] = useState<[]>([]);
  const [listEnvironmentUser, setEnvironmentUser] = useState<[]>([]);

  const { getUserContext } = useAuth();
  const userData = getUserContext();

  const { enterprise } = useEnterpriseContext();

  const { handleEnvironmentChange } = useEnvironmentContext();

  useEffect(() => {
    const getCardsUserResposable = async () => {
      try {
        if (userData != null) {
          const result = await getCardsResponsableUser(userData.id.toString());

          setListTaskResponsable(result.responsable);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCardsUserResposable();
  }, [userData]);

  useEffect(() => {
    const getPipelines = async () => {
      try {
        if (enterprise != null) {
          const result = await getPipelineEnterprise(enterprise.id);

          setListPipelinesInCard(result.pipelines);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getPipelines();
  }, [enterprise]);

  useEffect(() => {
    const getEnvironmentUser = async () => {
      try {
        if (enterprise != null && userData != null) {
          const result = await getAllEnvironment(userData.id, enterprise.id);

          setEnvironmentUser(result.environments);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getEnvironmentUser();
  }, [enterprise, userData]);

  return (
    <Aside>
      <>
        
      <Heading title="Dashboard" />
        <main>
          <div className="relative overflow-hidden isolate">
            {/* Stats */}
            <div className="hidden border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
              <dl className="grid grid-cols-1 mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
                {stats.map((stat, statIdx) => (
                  <div
                    key={stat.name}
                    className={classNames(
                      statIdx % 2 === 1
                        ? "sm:border-l"
                        : statIdx === 2
                        ? "lg:border-l"
                        : "",
                      "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8"
                    )}
                  >
                    <dt className="text-sm font-medium leading-6 text-gray-500">
                      {stat.name}
                    </dt>
                    <dd
                      className={classNames(
                        stat.changeType === "negative"
                          ? "text-rose-600"
                          : "text-gray-700",
                        "text-xs font-medium"
                      )}
                    >
                      {stat.change}
                    </dd>
                    <dd className="flex-none w-full text-3xl font-medium leading-10 tracking-tight text-gray-900">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div
              aria-hidden="true"
              className="absolute left-0 origin-top-left -rotate-90 translate-y-40 top-full -z-10 mt-96 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-ml-96 sm:-mt-10 sm:translate-y-0 sm:rotate-0 sm:transform-gpu sm:opacity-50"
            >
              <div
                style={{
                  clipPath:
                    "polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)",
                }}
                className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
              />
            </div>
          </div>

          <div className="flex items-start gap-4 mt-5 lg:flex-row sm:flex-col">
            <div className="w-1/2 my-task ">
              <div className="overflow-y-scroll border rounded-lg shadow-lg">
                <div className="flex items-start justify-between py-5 border-b header-task">
                  <div className="flex items-center gap-3 px-3">
                    {userData != null && (
                      <span
                        style={{
                          backgroundColor: getBackgroundColor(
                            userData.name.charAt(0).toUpperCase()
                          ),
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full"
                      >
                        <span className="text-sm font-medium text-white">
                          {userData.name.charAt(0).toUpperCase()}
                        </span>
                      </span>
                    )}

                    <h2 className="text-lg font-medium text-dark">
                      Minhas Tarefas
                    </h2>
                  </div>

                  <Menu
                    as="div"
                    className="relative inline-block px-3 text-left"
                  >
                    <div>
                      <MenuButton className="flex items-center text-gray-400 rounded-full hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                        <span className="sr-only">Open options</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </MenuButton>
                    </div>

                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      <div className="py-1">
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                          >
                            Account settings
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                          >
                            Support
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                          >
                            License
                          </a>
                        </MenuItem>
                        <form action="#" method="POST">
                          <MenuItem>
                            <button
                              type="submit"
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                            >
                              Sign out
                            </button>
                          </MenuItem>
                        </form>
                      </div>
                    </MenuItems>
                  </Menu>
                </div>

                <div className="p-4">
                  <Link
                    to="/opportunity"
                    type="button"
                    className="flex items-center w-full gap-1 pb-3 text-sm text-gray-500 border-b"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                    </svg>
                    Criar Tarefa
                  </Link>
                  {listTaskRespponsable.length > 0 &&
                    listTaskRespponsable.map((task) => (
                      <div
                        key={task.id}
                        className="flex justify-between gap-2 pt-3 pb-3 border-b"
                      >
                        <div className="flex items-center gap-1 text-sm font-normal capitalize">
                          {task.card.date_conclusion != null ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="text-gray-500 size-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.5 12.75 6 6 9-13.5"
                              />
                            </svg>
                          ) : (
                            <MdHourglassEmpty className="text-gray-500 size-4" />
                          )}

                          {task.card.title}
                        </div>

                        <div className="flex items-center gap-1">
                          {listPipelinesInCard.length > 0 &&
                            listPipelinesInCard.map((pipeline) => (
                              <span
                                key={pipeline.id}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-md"
                              >
                                {pipeline.name}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="w-1/2 my-task ">
              <div className="px-3 border rounded-lg shadow-lg ">
                <div className="flex items-start justify-between py-5 border-b header-task">
                  <div className="flex items-center gap-3 px-3">
                    <h2 className="text-lg font-medium text-dark">Projetos</h2>
                  </div>

                  <Menu
                    as="div"
                    className="relative inline-block px-3 text-left"
                  >
                    <div>
                      <MenuButton className="flex items-center text-gray-400 rounded-full hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                        <span className="sr-only">Open options</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </MenuButton>
                    </div>

                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      <div className="py-1">
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                          >
                            Account settings
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                          >
                            Support
                          </a>
                        </MenuItem>
                        <MenuItem>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                          >
                            License
                          </a>
                        </MenuItem>
                        <form action="#" method="POST">
                          <MenuItem>
                            <button
                              type="submit"
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                            >
                              Sign out
                            </button>
                          </MenuItem>
                        </form>
                      </div>
                    </MenuItems>
                  </Menu>
                </div>

                <div className="flex items-center gap-4 p-4">
                  <button
                    type="button"
                    className="flex items-center gap-3 pb-3 text-sm text-gray-500 "
                  >
                    <Link
                      to="/settings"
                      className="p-4 border-2 border-dashed rounded-xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className=" size-5"
                      >
                        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                      </svg>
                    </Link>
                    Criar projeto
                  </button>
                </div>

                {listEnvironmentUser &&
                  listEnvironmentUser.map((environment) => (
                    <Link
                      key={environment.id}
                      onClick={() => handleEnvironmentChange(environment)}
                      to="/opportunity"
                      className="flex items-center gap-2 px-3 mb-4"
                    >
                      <div className="w-[56px] h-[56px] rounded-xl bg-indigo-600 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-white size-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                            clipRule="evenodd"
                          />
                          <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
                        </svg>
                      </div>

                      <p className="text-sm text-dark">{environment.name}</p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </>
    </Aside>
  );
};

export default Dashboard;
