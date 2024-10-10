import React, { ButtonHTMLAttributes } from "react";
type BaseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variation?: "base" | "border" | "delete";
};

export default function BaseButton(props: BaseButtonProps) {
  const { children, variation = "base", ...rest } = props;

  const baseClass =
    "flex items-center justify-center px-3 py-2 text-sm font-semibold text-center rounded-md shadow-sm w-[180px] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
  const typeClasses = {
    base: "text-app-text-primary bg-app-primary hover:bg-app-primary/70",
    border:
      "text-app-text-primary border border-app-primary text-app-primary hover:bg-app-primary/10",
    delete: "text-white bg-red-600 hover:bg-red-700",
  };

  return (
    <button {...rest} className={`${baseClass} ${typeClasses[variation]}`}>
      {children}
    </button>
  );
}
