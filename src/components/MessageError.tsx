import { XCircleIcon } from '@heroicons/react/20/solid'
import { FC } from 'react'


interface PropMessage {
    text: string
}

const MessageError: FC<PropMessage> =  (props) => {
  return (
    <div className="p-4 mb-6 rounded-md bg-red-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon aria-hidden="true" className="w-5 h-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{props.text}</h3>
          
        </div>
      </div>
    </div>
  )
}

export default MessageError