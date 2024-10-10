import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { FC } from 'react'

interface PropsMessage {
    text: string
}

const MessageSuccess: FC<PropsMessage> = (props) => {
  return (
    <div className="p-4 mb-6 rounded-md bg-green-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon aria-hidden="true" className="w-5 h-5 text-green-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">{props.text}</p>
        </div>
        <div className="pl-3 ml-auto">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon aria-hidden="true" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageSuccess;