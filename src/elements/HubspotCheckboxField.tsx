import React, { useCallback, useEffect, useState } from "react";
import { HubspotFormFieldDefinition } from "./shared";
import { HubspotFormOptions } from "./shared";

function buildSet(value?: string): ReadonlyArray<string> {
  return value?.split(";") || [];
}

function addValue(
  current: ReadonlyArray<string>,
  value: string
): ReadonlyArray<string> {
  if (current.includes(value)) return current;
  return [...current, value];
}

function removeValue(
  current: ReadonlyArray<string>,
  value: string
): ReadonlyArray<string> {
  const index = current.indexOf(value);
  if (index < 0) return current;
  return current.filter((_, i) => i !== index);
}

export const HubspotCheckboxField: React.FC<{
  field: HubspotFormFieldDefinition;
  value?: string;
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  options: HubspotFormOptions;
}> = ({ field, onInteracted, onChange, value, options }) => {
  const [currentValue, setCurrentValue] = useState(() => buildSet(value));
  useEffect(() => setCurrentValue(buildSet(value)), [value]);
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const input = ev.currentTarget;
      const { checked, value } = input;
      setCurrentValue((current) => {
        const newValue = checked
          ? addValue(current, value)
          : removeValue(current, value);
        return newValue;
      });
      onChange?.(ev);
    },
    [onChange]
  );

  const { options: fieldOptions } = field;
  if (!fieldOptions) {
    return null;
  }

  return (
    <>
      <div className={options.radioContainerClassName}>
        <input type="hidden" name={field.name} value={currentValue} />
        {fieldOptions.map((option) => {
          const checked = currentValue.includes(option.value);
          return (
            <label key={option.value} className={options.radioLabelClassName}>
              <input
                className={options.radioFieldClassName}
                type="checkbox"
                checked={checked}
                value={option.value}
                onInput={onInteracted}
                onChange={handleChange}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </>
  );
};
