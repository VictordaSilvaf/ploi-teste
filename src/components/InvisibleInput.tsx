type InvisibleInputProps = {
  value: string | number | Date;
  setValue?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void | Promise<void>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function InvisibleInput({
  value,
  setValue,
  ...rest
}: InvisibleInputProps) {
  return (
    <input
      value={value}
      onChange={(e) => setValue && setValue(e.target.value)}
      {...rest}
      className={`px-2 py-1.5 w-full my-3 rounded-md input-invisible focus:shadow-none flex-1 capitalize text-base text-gray-800 border-none bg-transparent outline-none focus:bg-white transition-all duration-300 ease-in-out ${
        rest.className || ""
      }`}
    />
  );
}
