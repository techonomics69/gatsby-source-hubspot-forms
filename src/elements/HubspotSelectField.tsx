import React, {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { HubspotFormFieldDefinition } from "./shared";
import { HubspotDependentFields } from "./HubspotDependentFields";
import { HubspotFormOptions } from "./shared";

export const HubspotSelectField: React.FC<{
  value?: string;
  field: HubspotFormFieldDefinition;
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLSelectElement>) => void;
  options: HubspotFormOptions;
}> = ({ field, onInteracted, onChange, value, options }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      const element = ev.currentTarget;
      setCurrentValue(element.value);
      onInteracted();
      onChange?.(ev);
    },
    [onInteracted, onChange]
  );
  return (
    <>
      <select
        id={field.name}
        name={field.name}
        placeholder={field.placeholder ? field.placeholder : undefined}
        hidden={field.hidden}
        required={field.required}
        className={options.fieldClassName}
        onChange={handleChange}
        value={currentValue}
      >
        {options.selectText && (
          <option label={options.selectText} disabled={true} value="">
            {options.selectText}
          </option>
        )}
        {field.options?.map((o) => (
          <option key={o.label} label={o.label} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
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
