import { Input } from "antd";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

type PasswordInputProps<T extends FieldValues> = {
  name: Path<T>;
  placeholder?: string;
  required?: boolean;
  onlynumber?: boolean;
  numdes?: boolean;
  disable?: boolean;
  maxlength?: number;
};

export function PasswordInput<T extends FieldValues>(
  props: PasswordInputProps<T>
) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Get the error for this specific field
  const error = errors[props.name as keyof typeof errors];
  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field }) => (
        <>
          <Input.Password
            required={props.required}
            showCount={props.maxlength ? true : undefined}
            maxLength={props.maxlength ?? undefined}
            status={error ? "error" : undefined}
            className="w-full"
            value={field.value}
            disabled={props.disable ?? false}
            onChange={(e) => {
              if (!e) return;
              let { value } = e.target;

              if (props.numdes) {
                value = value.replace(/[^0-9.]/g, "");
              }

              if (props.onlynumber) {
                value = value.replace(/[^0-9]/g, "");
              }
              field.onChange(value);
            }}
            placeholder={props.placeholder ?? undefined}
          />
          {error && (
            <p className="text-xs text-red-500">{error.message?.toString()}</p>
          )}
        </>
      )}
    />
  );
}
