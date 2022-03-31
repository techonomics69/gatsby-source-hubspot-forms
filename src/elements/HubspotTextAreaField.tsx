import React, { useCallback, useEffect, useState } from "react";
import {
  FieldProps,
  registerFieldTypeHandler,
} from "./HubspotFormFieldFactory";
import { HubspotFormFieldDefinition } from "./shared";
import { HubspotFormOptions } from "./shared";

const HubspotTextareaField: React.FC<FieldProps> = ({
  field,
  onInteracted,
  onChange,
  value,
  options,
}) => {
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

export function registerTextAreaField() {
  registerFieldTypeHandler("textarea", HubspotTextareaField);
}
