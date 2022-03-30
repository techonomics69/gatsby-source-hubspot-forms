import React, { useCallback, useEffect, useState } from "react";
import { HubspotFormFieldDefinition } from "~/types";
import { HubspotDependentFields } from "./HubspotDependentFields";
import { HubspotFormOptions } from "./HubspotForm";

export const HubspotRadioField: React.FC<{
  field: HubspotFormFieldDefinition;
  value?: string;
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  options: HubspotFormOptions;
}> = ({ field, onInteracted, onChange, value, options }) => {
  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => setCurrentValue(value), [value]);
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentValue(ev.currentTarget.value);
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
        {fieldOptions.map((option) => {
          const checked = option.value === currentValue;
          return (
            <label key={option.value} className={options.radioLabelClassName}>
              <input
                className={options.radioFieldClassName}
                type="radio"
                name={field.name}
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
      {field.__typename === "HubspotFormFormFieldGroupsFields" &&
        field.dependentFieldFilters && (
          <HubspotDependentFields
            fields={field.dependentFieldFilters}
            parentValue={currentValue}
            options={options}
            onInteracted={onInteracted}
          />
        )}
    </>
  );
};
