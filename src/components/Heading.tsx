/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC } from "react";


interface HeaingProps {
    leftButtomGroup?: React.ReactNode
    rightButtomGroup?: React.ReactNode
    title?: string
}

const Heading: FC<HeaingProps> = ({leftButtomGroup, rightButtomGroup, title}) => {
 
  return (
    <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <div className="flex items-center">
        
        {leftButtomGroup}
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {title}
        </h3>
      </div>

      <div className="mt-3 sm:ml-4 sm:mt-0">
        {rightButtomGroup}
      </div>
    </div>
  );
};

export default Heading;
