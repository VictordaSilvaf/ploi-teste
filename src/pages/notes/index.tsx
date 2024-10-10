import BaseButton from "../../components/BaseButton";
import { useEffect, useState } from "react";
import { getAllNotes, storeNote } from "../../api/notes/notesApi";
import { Note, Tag } from "../../api/notes/notesApi";
import Badge from "../../components/Badge";
import formatTimeLeft from "../../traits/FormatTimeLeft";
import Aside from "../../components/Aside";
import { Link } from "react-router-dom";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

export default function Notes() {
  const [data, setData] = useState<Note[]>([]);
  const [loading, isLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<number>();

  function open(note_id: number) {
    setIsOpen(true);
    setSelectedNote(note_id);
  }

  function close() {
    setIsOpen(false);
  }

  function refreshData() {
    isLoading(true);
    getAllNotes()
      .then(({ notas }) => {
        setData(notas);
      })
      .finally(() => {
        isLoading(false);
      });
  }

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <Aside>
      <div className="flex justify-end mb-5">
        <div className="flex items-center gap-x-4">
          <BaseButton
            onClick={() => {
              storeNote("", "", "", [{ id: 1, name: "name" }]).then(
                (response) => {
                  console.log(response);
                  const noteId = response.id;
                  window.location.href = `/notes/${noteId}`;
                }
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            Adicionar nota
          </BaseButton>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-3 xl:gap-x-8 animate-pulse">
          <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded"></div>
          <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded"></div>
          <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded"></div>
          <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded"></div>
        </div>
      ) : (
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
        >
          {data.length === 0 ? (
            <div className="w-full text-center text-gray-500 col-span-full">
              Nenhuma nota encontrada.
            </div>
          ) : (
            <>
              {data.map((note: Note) => (
                <Link
                  to={`/notes/${note.id}`}
                  className="flex flex-col justify-between py-4 border rounded-lg relative group"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      open(note.id);
                    }}
                    type="button"
                    className="absolute z-10 hover:bg-red-400 p-1 rounded text-black fill-black top-2 right-2 group-hover:opacity-100 opacity-0 duration-300 ease-in-out"
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
                  <div className="px-6">
                    <div className="relative flex flex-row w-full mb-4 overflow-hidden gap-x-2 flex-nowrap">
                      {note.tag.map((tag: Tag, index: number) => (
                        <Badge key={index} color={tag.color}>
                          {tag.content}
                        </Badge>
                      ))}
                      <div className="absolute right-0 w-1/6 h-full bg-gradient-to-l from-white"></div>
                    </div>

                    <span className="text-xl font-semibold text-app-text-primary">
                      {note.title}
                    </span>
                    <p className="mt-4 text-app-text-secondary line-clamp-5">
                      {note.description}
                    </p>
                  </div>

                  <div className="mt-2">
                    <div className="w-full h-[.5px] bg-app-quinary"></div>

                    <div className="flex flex-row items-start justify-between px-6 mt-4">
                      <div className="font-semibold">card people</div>
                      <div className="text-app-text-secondary">
                        {formatTimeLeft(note.created_at)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </ul>
      )}

      <ConfirmDeleteModal
        refreshData={refreshData}
        note_id={selectedNote}
        close={close}
        isOpen={isOpen}
      />
    </Aside>
  );
}
