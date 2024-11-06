import { capitalcase } from "@/lib/methods";
import { OptionValue } from "@/models/main";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

type RabioInputProps<T extends FieldValues> = {
    name: Path<T>;
    required: boolean;
    options: OptionValue[];
    extratax?: JSX.Element;
    disable?: boolean;
};

export function RabioInput<T extends FieldValues>(props: RabioInputProps<T>) {
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
                    <div className="flex gap-4">
                        {props.options.map((val: OptionValue, index: number) => {
                            return (
                                <label className="flex items-center gap-2" key={index}>
                                    <input
                                        type="radio"
                                        required={props.required}
                                        value={val.value}
                                        checked={field.value === val.value}
                                        onChange={() => field.onChange(val.value)}
                                        disabled={props.disable ?? false}
                                    />
                                    <p className="text-sm">{capitalcase(val.label)}</p>
                                </label>
                            );
                        })}
                    </div>
                    {error && (
                        <p className="text-xs text-red-500">{error.message?.toString()}</p>
                    )}
                </>
            )}
        />
    );
}