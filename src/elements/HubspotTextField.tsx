import React, {
  HTMLInputTypeAttribute,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  FieldProps,
  registerFieldTypeHandler,
} from "./HubspotFormFieldFactory";
import { HubspotFormFieldDefinition } from "./shared";
import { HubspotFormOptions } from "./shared";

function calculateInputType(
  field: HubspotFormFieldDefinition
): HTMLInputTypeAttribute | undefined {
  const { name, type } = field;
  switch (type) {
    case "string":
      if (name === "email") {
        return "email";
      }
      break;

    case "phonenumber":
      return "tel";

    case "number":
      return "number";
  }

  return type;
}

const HubspotTextField: React.FC<FieldProps> = ({
  field,
  onInteracted,
  onChange,
  value,
  options,
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => setCurrentValue(value), [value]);
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentValue(ev.currentTarget.value);
      onChange?.(ev);
    },
    [onChange]
  );

  return (
    <input
      value={currentValue}
      id={field.name}
      name={field.name}
      placeholder={field.placeholder}
      type={calculateInputType(field)}
      hidden={field.hidden}
      required={field.required}
      className={options.fieldClassName}
      onInput={onInteracted}
      onChange={handleChange}
    />
  );
};

export function registerHubspotTextField() {
  registerFieldTypeHandler("text", HubspotTextField);
  registerFieldTypeHandler("number", HubspotTextField);
  registerFieldTypeHandler("phonenumber", HubspotTextField);
}
