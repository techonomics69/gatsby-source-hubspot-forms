import React from "react";
import { HubspotDependentField } from "./HubspotDependentField";
import {
  HubspotFormOptions,
  HubspotFormFormDependentFieldDefinition,
} from "./shared";

export const HubspotDependentFields: React.FC<{
  fields: ReadonlyArray<HubspotFormFormDependentFieldDefinition>;
  parentValue?: string;
  options: HubspotFormOptions;
  onInteracted: () => void;
}> = ({ fields, parentValue, options, onInteracted }) => {
  return (
    <>
      {fields
        .filter((field) => field.dependentFormField?.enabled)
        .map((field) => (
          <HubspotDependentField
            key={field.dependentFormField?.label}
            field={field}
            parentValue={parentValue}
            options={options}
            onInteracted={onInteracted}
          />
        ))}
    </>
  );
};
