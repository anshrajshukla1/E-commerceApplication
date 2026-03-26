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
      
      {/* LABEL */}
      <label
        htmlFor={id}
        className={`${className ? className : ""} font-semibold text-sm text-slate-800`}
      >
        {label}
      </label>

      {/* INPUT */}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        defaultValue={value}
        className={`${className ? className : ""} px-2 py-2 border outline-none bg-transparent text-slate-800 rounded-md ${
          errors[id]?.message ? "border-red-500" : "border-slate-700"
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

      {/* ERROR MESSAGE */}
      {errors[id]?.message && (
        <p className="text-sm font-semibold text-red-600 mt-1">
          {errors[id]?.message}
        </p>
      )}
    </div>
  );
};

export default InputField;