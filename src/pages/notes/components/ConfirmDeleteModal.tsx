import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { deleteNote } from "../../../api/notes/notesApi";

interface ConfirmDeleteModalProps {
  close: () => void;
  isOpen: boolean;
  note_id: number | undefined;
  refreshData: () => void;
}

export default function ConfirmDeleteModal({
  close,
  isOpen,
  note_id,
  refreshData,
}: ConfirmDeleteModalProps) {
  return (
    <>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
        __demoMode
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-app-secondary p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-white"
              >
                Tem certeza disso?
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-white/50">
                Realmente deseja excluir esse item? após isso não tem como
                voltar.
              </p>
              <div className="mt-4 flex gap-4 justify-end">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray- transition-all duration-300 ease-in-out"
                  onClick={close}
                >
                  Cancelar
                </Button>
                {note_id && (
                  <Button
                    className="inline-flex items-center gap-2 rounded-md bg-red-400 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-500 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray- transition-all duration-300 ease-in-out"
                    onClick={() => {
                      deleteNote(note_id).then(() => {
                        refreshData();
                      });
                      close();
                    }}
                  >
                    Excluir
                  </Button>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
