import React, { useCallback, useEffect, useState } from "react";
import { HubspotFormFieldDefinition } from "~/types";
import { HubspotFormOptions } from "./HubspotForm";

export const HubspotTextareaField: React.FC<{
  field: HubspotFormFieldDefinition;
  single?: boolean;
  value?: string;
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLTextAreaElement>) => void;
  options: HubspotFormOptions;
}> = ({ field, single, onInteracted, onChange, value, options }) => {
  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => setCurrentValue(value), [value]);
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentValue(ev.currentTarget.value);
      onChange?.(ev);
    },
    [onChange]
  );

  return (
    <textarea
      value={currentValue}
      id={field.name}
      name={field.name}
      placeholder={field.placeholder}
      hidden={field.hidden}
      required={field.required}
      className={options.fieldClassName}
      rows={options.textAreaRows || 3}
      onInput={onInteracted}
      onChange={handleChange}
    />
  );
};
