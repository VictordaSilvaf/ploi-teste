import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { FC } from "react";


interface ConfirmProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void;
  title: string
  onConfirm: () => void
  onCancel: () => void
  loadingButton?: boolean
  setLoadingButton?: (loading: boolean) => void

}

const Confirm: FC<ConfirmProps> = (props) => {


  return (
    <Dialog open={props.isOpen} onClose={props.setIsOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="sm:flex sm:items-center">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon aria-hidden="true" className="w-6 h-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                  {props.title}
                </DialogTitle>

              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={props.onConfirm}
                className={`inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto ${props.loadingButton ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={props.loadingButton}
              >
                {props.loadingButton ? (
                  <>
                    <svg className="w-5 h-5 mr-3 animate-spin" viewBox="0 0 24 24">
                      {/* Ícone de loading */}
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path fill="currentColor" d="M4 12a8 8 0 017-7.937V4a8 8 0 100 16v-1.063A7.998 7.998 0 014 12z" />
                    </svg>
                    Deletando...
                  </>
                ) : (
                  'Deletar'
                )}
              </button>

            
              <button
                type="button"
                data-autofocus

                onClick={props.onCancel}
                className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancelar
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )

}


export default Confirm