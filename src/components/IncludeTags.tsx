/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


import { FC, useEffect, useState } from "react";

import toast from "react-hot-toast";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

import {
  deleteLabelActive,
  deleteLabelsCard,
  getLabelsAtive,
  getLabelsCard,
  labelCardActive,
  labelsCardCreate,
} from "../api/labelsCard/labelsCard";
import { useEnvironmentContext } from "../context/EnvironmentContext";

interface ModalIncludeUsersProps {
  card_id: number;
}

const IncludeTags: FC<ModalIncludeUsersProps> = ({ card_id }) => {
  const [selectedTags, setSelectedTags] = useState([]); // Etiquetas selecionadas
  const [newTag, setNewTag] = useState(""); // Armazena a nova etiqueta a ser criada
  const [listTagsCard, setListTagsCard] = useState<[]>([]);
  const [listTagsActive, setListTagsActive] = useState<[]>([]);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const { environment } = useEnvironmentContext();
  const [refreshTags, setRefreshTags] = useState<boolean>(false);
  const [refreshTagsActive, setRefreshTagsActive] = useState<boolean>(false);

  const handleTagsSubmit = async (nameTag: string, colorTag: string) => {
    try {
      if (environment != null) {
        const result = await labelsCardCreate(
          nameTag,
          colorTag,
          environment.id.toString()
        );

        await labelCardActive(result.tag.id, card_id.toString(), 1);
        setRefreshTags(!refreshTags);
        setRefreshTagsActive(!refreshTagsActive);
        toast.success("Tags criadas com sucesso");
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const hexToRgba = (hex: any, opacity: any) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * optionsColors.length);
    return optionsColors[randomIndex];
  };

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
  useEffect(() => {
    const listTags = async () => {
      try {
        if (environment != null) {
          const result = await getLabelsCard(environment.id);

          setListTagsCard(result.tags);
        }
      } catch (error) {
        console.log(error);
      }
    };

    listTags();
  }, [card_id, environment, refreshTags]);

  useEffect(() => {
    const getLabelsCardActive = async () => {
      try {
        const result = await getLabelsAtive(card_id.toString());

        setListTagsActive(result);
      } catch (error) {
        console.log(error);
      }
    };
    getLabelsCardActive();
  }, [card_id, refreshTagsActive]);

  const handleDeleteLabelsActive = async (id: string) => {
    try {
      await deleteLabelActive(id);
      setRefreshTagsActive(!refreshTagsActive);
      toast.success("Tag desativada!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTagsActive = async (idTagActive: string) => {
    try {
      await labelCardActive(idTagActive, card_id.toString(), 1);
      toast.success("Tag ativada com sucesso!");
      setRefreshTagsActive(!refreshTagsActive);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteLabels = async (id: string) => {
    try {
      await deleteLabelsCard(id); // Chama a função para deletar a tag no banco de dados
      setRefreshTags(!refreshTags);
    } catch (error) {
      console.log(error); // Corrigido: console.log ao invés de consolel.log
    }
  };

  const handleRemoveTag = (id: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== id)); // Remove a tag visualmente
    handleDeleteLabels(id); // Deleta a tag no banco de dados
  };

  return (
    <Combobox as="div" className="w-full">
      <div className="gap-3 pr-0.5 flex flex-row items-center w-full rounded-md border-0 py-0.5 bg-white text-gray-900  ring-0 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        <div className="flex flex-row gap-x-0">
          {Array.isArray(listTagsActive.tags) &&
            listTagsActive.tags.length > 0 &&
            listTagsActive.tags.map((tag: any) => (
              <div
                key={tag.label_card.id}
                className="relative flex flex-wrap items-start left-2"
              >
                <>
                  <span
                    style={{
                      backgroundColor: hexToRgba(tag.label_card.color, 0.2),
                      color: tag.label_card.color,
                      borderColor: tag.label_card.color,
                    }}
                    className="inline-flex border mr-1 mb-2 items-center gap-x-0.5 rounded-md px-2 py-1 text-xs font-medium"
                  >
                    {tag.label_card.name}
                    <button
                      onClick={() => handleDeleteLabelsActive(tag.id)}
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

          
        </div>
        <ComboboxInput
          className="flex-1 text-sm border-none focus:ring-0 focus:border-none"
          placeholder="Adicionar pessoas"
          value={newTag}
          onKeyUp={handleKeyPress}
          onChange={(e) => setNewTag(e.target.value)}
          onFocus={() => setIsFocus(true)}
        />
        {isFocus && (
          <>
            {listTagsCard.length > 0 && (
              <ComboboxOptions className="absolute z-10 w-full py-1 pl-3 overflow-auto text-base bg-white rounded-md shadow-lg top-10 max-h-56 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <div className="flex">
                  {listTagsCard.map((tag: any) => (
                    <ComboboxOption
                      disabled
                      key={tag.id}
                      value={tag.name}
                      className="group relative cursor-pointer select-none py-2 text-gray-900  data-[focus]:text-white"
                    >
                      <span
                        style={{
                          backgroundColor: hexToRgba(tag.color, 0.2),
                          color: tag.color,
                          borderColor: tag.color,
                        }}
                        key={tag.id}
                        onClick={() => handleAddTagsActive(tag.id)}
                        className="inline-flex cursor-pointer border mr-2 mb-2 items-center gap-x-0.5 rounded-md  px-2 py-1 text-xs font-medium"
                      >
                        {tag.name}
                        <button
                          type="button"
                          className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-red-600/20"
                          onClick={() => handleRemoveTag(tag.id)}
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            style={{ stroke: tag.color }}
                            viewBox="0 0 14 14"
                            className="h-3.5 w-3.5 "
                          >
                            <path d="M4 4l6 6m0-6l-6 6" />
                          </svg>
                          <span className="absolute -inset-1" />
                        </button>
                      </span>

                    </ComboboxOption>
                  ))}
                </div>
              </ComboboxOptions>
            )}
          </>
        )}
      </div>
    </Combobox>
  );
};

export default IncludeTags;
