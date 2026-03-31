const InputField = ({
  label,
  id,
  type,
  errors,
  register,
  message,
  className,
  min,
  required,
  value,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        htmlFor={id}
        className={`${className ? className : ""} mb-1 text-sm font-semibold text-slate-700`}
      >
        {label}
      </label>

      <input
        type={type}
        id={id}
        placeholder={placeholder}
        defaultValue={value}
        className={`${className ? className : ""} form-input ${
          errors[id]?.message ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(220,38,38,0.12)]" : ""
        }`}
        {...register(id, {
          required: required
            ? { value: true, message: message || "This field is required" }
            : false,

          minLength: min
            ? {
                value: min,
                message: `Minimum ${min} characters are required`,
              }
            : undefined,

          pattern:
            type === "email"
              ? {
                  value:
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid Email",
                }
              : type === "url"
              ? {
                  value:
                    /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})(\/[\w.-]*)*\/?$/i,
                  message: "Invalid URL",
                }
              : undefined,
        })}
      />

      {errors[id]?.message && (
        <p className="text-sm font-semibold text-red-600 mt-1">
          {errors[id]?.message}
        </p>
      )}
    </div>
  );
};

export default InputField;
