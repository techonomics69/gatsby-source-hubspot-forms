import React, { useMemo } from "react";
import {
  HubspotFormOptions,
  HubspotFormFormDependentFieldDefinition,
} from "./shared";
import { HubspotFormField } from "./HubspotFormField";

export const HubspotDependentField: React.FC<{
  field: HubspotFormFormDependentFieldDefinition;
  parentValue?: string;
  onInteracted: () => void;
  options: HubspotFormOptions;
}> = ({ field, parentValue, options, onInteracted }) => {
  const { filters, dependentFormField } = field;

  const isDisplayed = useMemo(() => {
    if (filters && parentValue) {
      const valid = filters.find((filter) => {
        switch (filter.operator) {
          case "SET_ANY":
            if (parentValue === filter.strValue) {
              return true;
            }
            if (filter.strValues) {
              if (filter.strValues.includes(parentValue)) {
                return true;
              }
            }
            break;

          default:
            throw new Error(
              `Don't support filter operator ${filter.operator || "??"}`
            );
        }
      });
      if (valid) {
        return true;
      }
    }
    return false;
  }, [filters, parentValue]);

  if (isDisplayed && dependentFormField) {
    return (
      <HubspotFormField
        field={dependentFormField}
        options={options}
        onInteracted={onInteracted}
      />
    );
  }
  return null;
};
