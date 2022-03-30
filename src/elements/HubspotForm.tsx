import { useFirstVisibleToUser } from "@bond-london/gatsby-graphcms-components";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  EventReporter,
  HubspotFormDefinition,
  HubspotFormFieldDefinition,
} from "~/types";
import { HubspotFormField } from "./HubspotFormField";

export function defaultShowError(message: string) {
  return <pre>{message}</pre>;
}
export interface HubspotFormOptions {
  radioContainerClassName?: string;
  radioLabelClassName?: string;
  radioFieldClassName?: string;
  fieldContainerClassName?: string;
  labelClassName?: string;
  requiredClassName?: string;
  requiredText?: string;
  selectText?: string;
  fieldClassName?: string;
  textAreaRows?: number;
  showLabels?: boolean;
  submitButton?: boolean;
  successClassName?: string;
  failureClassName?: string;
  defaultSuccessMessage?: string;
  defaultFailureMessage?: string;
  showFormResponseOutside?: boolean;
  responseClassName?: string;
  formClassName?: string;
  submitClassName?: string;
  defaultSubmitText?: string;
  hideSubmitButton?: boolean;
  renderSubmitButton?: (text: string) => React.ReactElement;
  showError?: (message: string) => React.ReactElement;
}

interface HubspotFormResponse {
  message: string;
  status: string;
  errors: { message: string }[];
}

function getCookieValue(name: string) {
  return (
    document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() ||
    undefined
  );
}

export function useFormHandler(
  formDefinition: HubspotFormDefinition,
  handleFormData?: (formData: FormData) => void,
  reportEvent?: EventReporter,
  title?: string,
  ipAddress?: string
) {
  const [formRef, formVisible] = useFirstVisibleToUser<HTMLFormElement>(
    0.1,
    0.1
  );

  const formState = useRef<DynamicFormState>({ isDirty: false });
  const handleFinished = useCallback(() => {
    const { isDirty, form } = formState.current;

    if (form && formDefinition && isDirty) {
      handleFormAbandoned(form, formDefinition);
    }
  }, [formDefinition]);

  useEffect(() => handleFinished, [handleFinished]);

  const handleFormInteracted = useCallback(() => {
    formState.current.isDirty = true;
    setStatus("Idle");
  }, []);

  useEffect(() => {
    if (formVisible && formDefinition) {
      formState.current.form = formRef.current;
      reportEvent?.("hubspot_form_view", {
        formId: formDefinition.id,
        formName: formDefinition.name?.trim(),
      });
    }
  }, [formVisible, formDefinition, formRef]);
  const { allFields, fieldMapping } = useMemo(
    () => buildHubspotFormInformation(formDefinition),
    [formDefinition]
  );
  const [status, setStatus] = useState<"Idle" | "Success" | "Failed">("Idle");
  const [formResponse, setFormResponse] = useState<HubspotFormResponse>();
  const submitForm = useCallback(
    (form: HTMLFormElement, onSuccess?: () => void) => {
      if (formDefinition.portalId && formDefinition.guid) {
        reportEvent?.("hubspot_form_submit", {
          formId: formDefinition.id,
          formName: formDefinition.name?.trim(),
        });
        const formData = new FormData(form);
        handleFormData?.(formData);
        const fields: {
          objectTypeId: string | undefined;
          name: string;
          value: string;
        }[] = [];
        const request = {
          fields,
          context: {
            pageName: title,
            pageUri: window.location.pathname,
            hutk: getCookieValue("hubspotutk"),
            ipAddress,
          },
        };
        formData.forEach((v, k) => {
          const field = fieldMapping[k];
          if (field) {
            fields.push({
              objectTypeId: field.objectTypeId,
              name: k,
              value: v.toString(),
            });
          }
        });

        formState.current.isDirty = false;
        const url = `https://api.hsforms.com/submissions/v3/integration/submit/${formDefinition.portalId}/${formDefinition.guid}`;
        const payload = JSON.stringify(request);
        fetch(url, {
          method: "POST",
          body: payload,
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => {
            if (response.ok) {
              setFormResponse(undefined);
              reportEvent?.("hubspot_form_success", {
                formId: formDefinition.id,
                formName: formDefinition.name?.trim(),
              });

              setStatus(formState.current.isDirty ? "Idle" : "Success");
              const element = document.getElementById("success-response");
              if (element) {
                element.scrollIntoView();
              }
              onSuccess?.();
            } else {
              console.log("error:", response);
              response
                .json()
                .then((t: HubspotFormResponse) => {
                  console.log("response text", t);
                  reportEvent?.("hubspot_form_failure", {
                    formName: formDefinition.name?.trim(),
                    formId: formDefinition.id,
                    formResponse: t,
                  });
                  setFormResponse(t);
                })
                .catch((error) => {
                  console.log("getting response error:", error);
                  reportEvent?.("hubspot_form_failure", {
                    formId: formDefinition.id,
                    formName: formDefinition.name?.trim(),
                  });
                })
                .finally(() => {
                  setStatus("Failed");
                });
            }
          })
          .catch((error) => {
            console.log("Failed", error);
            reportEvent?.("hubspot_form_error", {
              formId: formDefinition.id,
              formName: formDefinition.name?.trim(),
            });
            setStatus("Failed");
          });
      }
    },
    [fieldMapping, formDefinition, ipAddress, title, handleFormData]
  );

  return {
    submitForm,
    allFields,
    status,
    formResponse,
    formRef,
    handleFormInteracted,
  };
}

export function handleFormAbandoned(
  form: HTMLFormElement,
  formDefinition: HubspotFormDefinition,
  reportEvent?: EventReporter
) {
  const data = new FormData(form);
  const nonEmptyFields: string[] = [];
  data.forEach((value, key) => {
    if (value.toString()) {
      nonEmptyFields.push(key);
    }
  });
  reportEvent?.("hubspot_form_abandoned", {
    formId: formDefinition.id,
    formName: formDefinition.name?.trim(),
    formNonEmptyFields: nonEmptyFields.length ? nonEmptyFields : undefined,
  });
}

export function buildHubspotFormInformation(
  formDefinition?: HubspotFormDefinition
) {
  const fieldMapping: { [name: string]: HubspotFormFieldDefinition } = {};
  const allFields: HubspotFormFieldDefinition[] = [];
  if (formDefinition) {
    formDefinition.formFieldGroups
      ?.filter((ffg) => ffg.default)
      .flatMap((ffg) => ffg.fields)
      .forEach((field) => {
        if (field?.name) {
          allFields.push(field);
          fieldMapping[field.name] = field;
        }
        if (field?.dependentFieldFilters) {
          field.dependentFieldFilters.forEach((dff) => {
            if (dff.dependentFormField?.name) {
              fieldMapping[dff.dependentFormField.name] =
                dff.dependentFormField;
            }
          });
        }
      });
  }
  return { allFields, fieldMapping };
}

export interface DynamicFormState {
  isDirty: boolean;
  form?: HTMLFormElement | null;
}

export const HubspotForm: React.FC<{
  form: HubspotFormDefinition;
  options?: HubspotFormOptions;
  values?: { [name: string]: string | number | undefined };
}> = ({ form: formDefinition, values, options = {} }) => {
  const {
    status,
    formResponse,
    submitForm,
    allFields,
    formRef,
    handleFormInteracted,
  } = useFormHandler(formDefinition);

  const showError = options.showError || defaultShowError;

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submitForm(e.currentTarget);
    },
    [submitForm]
  );
  if (!formDefinition) {
    return showError("Form does not exist");
  }
  if (!formDefinition.portalId || !formDefinition.guid) {
    return showError("Invalid form configuration");
  }

  if (status === "Success") {
    if (formDefinition?.redirect) {
      const link = document.createElement("a");
      link.href = formDefinition.redirect;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
    }
    return (
      <div id="success-response" className={options.successClassName}>
        {formDefinition.inlineMessage ? (
          <div
            dangerouslySetInnerHTML={{ __html: formDefinition.inlineMessage }}
          />
        ) : (
          <p>{options.defaultSuccessMessage || ""}</p>
        )}
      </div>
    );
  }

  if (status === "Failed") {
    if (!formResponse) {
      return (
        <div className={options.failureClassName}>
          <p>{options.defaultFailureMessage || ""}</p>
        </div>
      );
    }
  }

  const name = (formDefinition.name || formDefinition.id).replace(/\s+/g, "");
  const submitText =
    formDefinition.submitText || options.defaultSubmitText || "Submit";

  return (
    <>
      {formResponse && options.showFormResponseOutside && (
        <div className={options.responseClassName}>
          <h3>{formResponse.message}</h3>
          {formResponse.errors.map((error) => (
            <p key={error.message}>{error.message}</p>
          ))}
        </div>
      )}
      <form
        id={name}
        className={options.formClassName}
        method="POST"
        onSubmit={onSubmit}
        ref={formRef}
      >
        {formResponse && !options.showFormResponseOutside && (
          <div className={options.responseClassName}>
            <h3>{formResponse.message}</h3>
            {formResponse.errors.map((error) => (
              <p key={error.message}>{error.message}</p>
            ))}
          </div>
        )}
        {allFields.map((field) => (
          <HubspotFormField
            key={field.name}
            field={field}
            options={options}
            onInteracted={handleFormInteracted}
            value={values && field.name ? values[field.name] : undefined}
          />
        ))}
        {!options.hideSubmitButton && (
          <button
            id={`Submit ${name}`}
            type="submit"
            className={options.submitClassName}
          >
            {options.renderSubmitButton ? (
              options.renderSubmitButton(submitText)
            ) : (
              <span>{submitText}</span>
            )}
          </button>
        )}
      </form>
    </>
  );
};
