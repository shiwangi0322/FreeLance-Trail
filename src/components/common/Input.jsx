import { forwardRef } from "react";

/*
|--------------------------------------------------------------------------
| Input
|--------------------------------------------------------------------------
|
| Same forwardRef pattern as before (still required for React Hook Form's
| register()). Restyled: blue focus ring instead of slate, red asterisk
| on required fields, optional helperText for non-error hints.
|
*/

const Input = forwardRef(function Input(
  { label, error, helperText, className = "", id, required, ...rest },
  ref
) {
  const inputId = id ?? rest.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <input
        id={inputId}
        ref={ref}
        required={required}
        className={[
          "w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-500",
          className,
        ].join(" ")}
        {...rest}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="text-sm text-slate-500">{helperText}</p>}
    </div>
  );
});

export default Input;