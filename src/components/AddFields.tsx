import { ChangeEvent, FC, useState } from "react";
import { useEnterpriseContext } from "../context/EnterpriseContext";
import toast from "react-hot-toast";
import { createInputs } from "../api/inputs/inputsApi";

interface Filed {
  type: "text" | "number" | "date" | "select";
  value: string;
  id: number;
  options?: string[];
}

interface AddFieldsProps {
    refresh: boolean
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}

const AddFields: FC<AddFieldsProps> = ({refresh, setRefresh}) => {
  const [fields, setFields] = useState<Filed[]>([]);
  const [newOptions, setNewOptions] = useState<{ [key: number]: string[] }>({}); // Estado para gerenciar opções de cada campo select
  const [labelInput, setLabelInput] = useState<string>("");
  const [activeFieldId, setActiveFieldId] = useState<number | null>(null);
  const [isOpenFormAtributtes, setIsOpenFormatributtes] =
    useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const { enterprise } = useEnterpriseContext();

  // função para adicionar novos campos
  const handleAddFields = (type: "text" | "number" | "date" | "select") => {
    if (fields.length === 0 || activeFieldId !== null) {
      const newField = {
        type,
        value: "",
        id: fields.length,
        options: type === "select" ? [""] : [],
      };

      //campos diferentes do select
      setFields((prevFields) => [...prevFields, newField]);

      // Se o campo for do tipo 'select', defina o campo ativo para adicionar opções
      if (type === "select") {
        setNewOptions((prevOptions) => ({
          ...prevOptions,
          [newField.id]: [""],
        }));
        setActiveFieldId(newField.id);
      } else {
        setActiveFieldId(null);
      }
    } else {
      toast.error("Adicione o campo existente para criar outro");
    }
  };

  // Função separada para resetar os estados
  const resetFields = () => {
    setLabelInput(""); // Limpa o input
    setFields([]); // Limpa o array de campos
    setNewOptions({}); // Limpa as opções
    setActiveFieldId(null); // Reseta o campo ativo
  };

  const resetSelect = () => {
    const selectElement = document.getElementById(
      "type-select"
    ) as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = ""; // Redefine para o valor inicial
    }
  };

  // fuction para salvar os campos no banco de dados
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingButton(true);
    if (fields[0] && enterprise != null) {
      const optionsArray = fields[0] ? newOptions[fields[0].id] || [] : [];
      const optionsString = `['${optionsArray.join("', '")}']`; // array no formato string

      try {
        await createInputs(
          labelInput,
          fields[0].type,
          enterprise.id,
          optionsString
        );
        
        setRefresh(!refresh);
        setIsOpenFormatributtes(false);
        
        resetSelect();
        resetFields();
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingButton(false);
      }
    }
  };

  // Função para adicionar uma nova opção ao campo select
  const addOptionToField = (fieldId: number) => {
    setNewOptions((prevOptions) => ({
      ...prevOptions,
      [fieldId]: [...(prevOptions[fieldId] || []), ""],
    }));
  };

  // Função para atualizar o valor da nova opção
  const handleOptionChange = (
    fieldId: number,
    optionIndex: number,
    value: string
  ) => {
    setNewOptions((prevOptions) => {
      const updatedOptions = [...(prevOptions[fieldId] || [])];
      updatedOptions[optionIndex] = value;
      return { ...prevOptions, [fieldId]: updatedOptions };
    });
  };

  // função para trocar o valor do input da label
  const handleLabelInput = (event: ChangeEvent<HTMLInputElement>) => {
    setLabelInput(event.target.value);
  };

  return (
    <div className="">
      {!isOpenFormAtributtes && (
        <button
          type="button"
          onClick={() => setIsOpenFormatributtes(true)}
          className="rounded-md mt-5 flex items-center justify-center gap-2 bg-white w-full px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
          </svg>
          Adicionar novo campo
        </button>
      )}

      {isOpenFormAtributtes && (
        <form onSubmit={handleSubmitForm} className="mt-5" method="POST">
          <div className="mb-6">
            <label
              htmlFor="name-atributte"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Nome do campo
            </label>
            <div className="mt-2">
              <input
                value={labelInput}
                onChange={handleLabelInput}
                id="name-atributte"
                name="name-atributte"
                type="text"
                placeholder="Nome do campo..."
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="atributtes"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Tipo de campo
            </label>
            <select
              onChange={(e) =>
                handleAddFields(
                  e.target.value as "text" | "number" | "date" | "select"
                )
              }
              id="atributtes"
              name="atributtes"
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="">selecione um tipo de campo</option>
              <option value="text">Texto</option>
              <option value="number">Número</option>
              <option value="date">Data</option>
              <option value="select">Select</option>
            </select>
          </div>

          <div className="mt-[20px]">
            {fields.map((field) => (
              <div key={field.id}>
                {field.type === "select" && (
                  <>
                    {newOptions[field.id]?.map((option, index) => (
                      <div key={index} className="flex items-center mb-2 ">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(field.id, index, e.target.value)
                          }
                          placeholder={`Opção ${index + 1}`}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    ))}

                    <button
                      className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      type="button"
                      onClick={() => addOptionToField(field.id)}
                    >
                      Adicionar Opção
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-6">
            <button
              type="button"
              onClick={() => setIsOpenFormatributtes(false)}
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={`rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
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
                "Salvar campo"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddFields;
