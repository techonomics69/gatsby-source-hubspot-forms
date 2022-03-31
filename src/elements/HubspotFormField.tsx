import React from "react";
import { HubspotFormFieldDefinition } from "./shared";
import { HubspotFormOptions } from "./shared";
import { FieldFactory } from "./HubspotFormFieldFactory";

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
      <FieldFactory
        type={field.fieldType}
        field={{ field, value, onInteracted, onChange, options }}
      />
    </div>
  );
};
