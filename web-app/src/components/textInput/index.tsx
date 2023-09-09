import { ChangeEventHandler } from "react";

export const TextInput = ({
  label,
  name,
  onChange,
  placeholder,
  required = false,
  type = "text",
  value,
}: {
  label: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  required?: boolean;
  type?: "text" | "password";
  value: string;
}) => {
  return (
    <div className="text-input-wrapper">
      <label htmlFor={name}>{label}</label>
      <input
        className="text-input"
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};
