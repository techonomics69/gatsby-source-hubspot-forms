import React from "react";
import { HubspotFormFieldDefinition } from "~/types";
import { defaultShowError, HubspotFormOptions } from "./HubspotForm";
import { HubspotRadioField } from "./HubspotRadioField";
import { HubspotSelectField } from "./HubspotSelectField";
import { HubspotTextareaField } from "./HubspotTextAreaField";
import { HubspotTextField } from "./HubspotTextField";

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
    <div className="mt-xs flex flex-col">
      {options.showLabels && field.label && !field.hidden && (
        <label className="p4 mb-tiny flex" htmlFor={field.name}>
          <p dangerouslySetInnerHTML={{ __html: field.label }} />
          {field.required && (
            <span className="text-copper">
              <sup>*</sup>
            </span>
          )}
        </label>
      )}
      {getFormField(field, options, value, onInteracted, onChange)}
    </div>
  );
};
