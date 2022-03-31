import React from "react";
import {
  defaultShowError,
  HubspotFormFieldDefinition,
  HubspotFormOptions,
} from "./shared";

export interface FieldProps {
  field: HubspotFormFieldDefinition;
  value?: string | number;
  onInteracted: () => void;
  onChange?: (ev: React.ChangeEvent<HTMLElement>) => void;
  options: HubspotFormOptions;
}

const handlers: { [type: string]: React.FC<FieldProps> } = {};

export function registerFieldTypeHandler(
  type: string,
  component: React.FC<FieldProps>
) {
  handlers[type] = component;
}
export const FieldFactory: React.FC<{ type: string; field: FieldProps }> = ({
  type,
  field,
}) => {
  const C = handlers[type];
  if (C) {
    return <C {...field} />;
  }

  const { options } = field;
  const showError = options.showError || defaultShowError;
  return showError(`No field of type ${type}`);
};
