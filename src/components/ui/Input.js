const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  ...props
}) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {label && <label className="text-sm">{label}</label>}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm focus:outline-none ${
          error ? "border-red-500" : "border-zinc-300 focus:border-black"
        }`}
        {...props}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
