import React from "react";
import { HubspotFormFieldDefinition } from "./shared";
import { defaultShowError, HubspotFormOptions } from "./shared";
import { HubspotRadioField } from "./HubspotRadioField";
import { HubspotSelectField } from "./HubspotSelectField";
import { HubspotTextareaField } from "./HubspotTextAreaField";
import { HubspotTextField } from "./HubspotTextField";
import { HubspotCheckboxField } from "./HubspotCheckboxField";

function getFormField(
  field: HubspotFormFieldDefinition,
  options: HubspotFormOptions,
  value: string | number | undefined,
  onInteracted: () => void,
  onChange?: (
    ev: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void
) {
  switch (field.fieldType) {
    case "text":
    case "number":
    case "phonenumber":
      return (
        <HubspotTextField
          value={value}
          field={field}
          onInteracted={onInteracted}
          onChange={onChange}
          options={options}
        />
      );

    case "select":
      return (
        <HubspotSelectField
          value={value as string | undefined}
          field={field}
          onInteracted={onInteracted}
          onChange={onChange}
          options={options}
        />
      );

    case "textarea":
      return (
        <HubspotTextareaField
          value={value as string | undefined}
          field={field}
          onInteracted={onInteracted}
          onChange={onChange}
          options={options}
        />
      );
    case "radio":
      return (
        <HubspotRadioField
          value={value as string | undefined}
          field={field}
          onInteracted={onInteracted}
          onChange={onChange}
          options={options}
        />
      );
    case "checkbox":
      return (
        <HubspotCheckboxField
          value={value as string | undefined}
          field={field}
          onInteracted={onInteracted}
          onChange={onChange}
          options={options}
        />
      );
  }

  return (options.showError || defaultShowError)(
    `Invalid field type: ${field.fieldType || "??"}`
  );
}

export const HubspotFormField: React.FC<{
  field: HubspotFormFieldDefinition;
  options: HubspotFormOptions;
  value?: string | number | undefined;
  onInteracted: () => void;
  onChange?: (
    ev: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}> = ({ field, value, onInteracted, onChange, options }) => {
  return (
    <div className={options.fieldContainerClassName}>
      {options.showLabels && field.label && !field.hidden && (
        <label className={options.labelClassName} htmlFor={field.name}>
          <p dangerouslySetInnerHTML={{ __html: field.label }} />
          {field.required && options.requiredText && (
            <span className={options.requiredClassName}>
              <span>{options.requiredText}</span>
            </span>
          )}
        </label>
      )}
      {getFormField(field, options, value, onInteracted, onChange)}
    </div>
  );
};
