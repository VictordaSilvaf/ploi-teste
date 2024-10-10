/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { Environment, getAllEnvironment } from "../../../api/environments/environmentsApi";
import { useAuth } from "../../../context/AuthContext";
import { useEnterpriseContext } from "../../../context/EnterpriseContext";
import { useEnvironmentContext } from "../../../context/EnvironmentContext";


export default function ListEnvironmentButtom() {
  const { environment, handleEnvironmentChange } = useEnvironmentContext();

  const { getUserContext } = useAuth();
  const userData = getUserContext();

  const [environmentsEnterprise, setEnvironmentsEnterprise] = useState<
    Environment[]
  >([]);

  const { enterprise } = useEnterpriseContext();

  useEffect(() => {
    const listEnvironments = async () => {
      try {
        if (userData != null && enterprise?.id != null) {
          const result = await getAllEnvironment(
            enterprise.user_id,
            enterprise.id
          );

          setEnvironmentsEnterprise(result.environments);

          const storedEnvironment = localStorage.getItem("selectedEnvironment");

          if (storedEnvironment) {
            const parsedEnvironment = JSON.parse(storedEnvironment);
            if (parsedEnvironment) {
              // Verifique se parsedEnvironment é válido
              handleEnvironmentChange(parsedEnvironment);
            }
          } else if (result.environments.length > 0) {
            const firstEnvironment = result.environments[0];
            if (firstEnvironment) {
              // Verifique se firstEnvironment é válido
              handleEnvironmentChange(firstEnvironment);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    listEnvironments();
  }, [enterprise, userData, handleEnvironmentChange]);

  const handleClickEnvironments = (environmentItem: any) => {
    handleEnvironmentChange(environmentItem);
    toast.success("Pipeline trocada com sucesso");
  };

  return (
    <Listbox>
      <Label className="sr-only">// Change published status // </Label>

      <div className="relative">
        <div className="inline-flex divide-x divide-indigo-700 rounded-md shadow-sm">
          <div className="inline-flex items-center gap-x-1.5 rounded-l-md bg-white border border-indigo-600 px-3 py-2 text-dark shadow-sm">
            <ListboxButton className="text-sm font-semibold">
              {environment?.name}
            </ListboxButton>
          </div>

          <ListboxButton className="inline-flex items-center p-2 bg-indigo-600 rounded-l-none rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-50">
            <span className="sr-only">Change published status</span>

            <ChevronDownIcon
              aria-hidden="true"
              className="w-5 h-5 text-white"
            />
          </ListboxButton>
        </div>
        <ListboxOptions
          transition
          className="absolute z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in"
        >
          {environmentsEnterprise && (
            <>
              {environmentsEnterprise.map((environment) => (
                <ListboxOption
                  onClick={() => handleClickEnvironments(environment)}
                  key={environment.id}
                  value={environment}
                  className="group cursor-pointer select-none p-4 text-sm text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white"
                >
                  <div className="flex flex-col">
                    <div className="flex justify-between">
                      <p className="font-normal group-data-[selected]:font-semibold">
                        {environment.name}
                      </p>
                      <span className="text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                        <CheckIcon aria-hidden="true" className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </ListboxOption>
              ))}
            </>
          )}

          <ListboxOption
            value=" "
            className="group cursor-default select-none text-sm text-purple-700 bg-purple-50 data-[focus]:bg-indigo-600 data-[focus]:text-white"
          >
            <Link to="/settings" className="flex flex-col">
              <div className="flex items-center gap-2 p-4">
                <IoMdSettings className="text-purple-700 size-5" />
                <p className="font-semibold group-data-[selected]:font-semibold">
                  Configurações do pipeline
                </p>
                <span className="text-indigo-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
                  <CheckIcon aria-hidden="true" className="w-5 h-5" />
                </span>
              </div>
            </Link>
          </ListboxOption>
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
