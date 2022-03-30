export type EventReporter = (
  eventName: string,
  eventData: { [key: string]: unknown }
) => void;

export interface HubspotFormDefinition {
  readonly __typename?: "HubspotForm";
  readonly id: string;
  readonly portalId?: string;
  readonly guid?: string;
  readonly name?: string;
  readonly action?: string;
  readonly method?: string;
  readonly cssClass?: string;
  readonly redirect?: string;
  readonly submitText?: string;
  readonly followUpId?: string;
  readonly notifyRecipients?: string;
  readonly leadNurturingCampaignId?: string;
  readonly formFieldGroups?: ReadonlyArray<HubspotFormFieldGroupsDefinition>;
  readonly metaData?: ReadonlyArray<HubspotFormMetaDataDefinition>;
  readonly inlineMessage?: string;
  readonly isPublished?: boolean;
  readonly thankYouMessageJson?: string;
}

export interface HubspotFormMetaDataDefinition {
  readonly __typename?: "HubspotFormMetaData";
  readonly name?: string;
  readonly value?: string;
}

export interface HubspotFormFieldGroupsDefinition {
  readonly __typename?: "HubspotFormFormFieldGroups";
  readonly fields?: ReadonlyArray<HubspotFormFieldDefinition>;
  readonly default?: boolean;
  readonly isSmartGroup?: boolean;
  readonly richText?: HubspotFormRichTextDefinition;
  readonly isPageBreak?: boolean;
}

export interface HubspotFormRichTextDefinition {
  readonly __typename?: "HubspotFormFormFieldGroupsRichText";
  readonly content?: string;
  readonly type?: string;
}

export interface HubspotFormFieldDefinition {
  readonly __typename?: "HubspotFormFormFieldGroupsFields";
  readonly name?: string;
  readonly label?: string;
  readonly type?: string;
  readonly fieldType?: string;
  readonly description?: string;
  readonly groupName?: string;
  readonly displayOrder?: number;
  readonly required?: boolean;
  readonly options?: ReadonlyArray<HubspotFormFormFieldOptionsDefinition>;
  readonly validation?: HubspotFormFormFieldValidationDefinition;
  readonly enabled?: boolean;
  readonly hidden?: boolean;
  readonly defaultValue?: string;
  readonly isSmartField?: boolean;
  readonly unselectedLabel?: string;
  readonly placeholder?: string;
  readonly dependentFieldFilters?: ReadonlyArray<HubspotFormFormDependentFieldDefinition>;
  readonly labelHidden?: boolean;
  readonly propertyObjectType?: string;
  readonly objectTypeId?: string;
}

export interface HubspotFormFormFieldOptionsDefinition {
  readonly __typename?: "HubspotFormFormFieldGroupsFieldsOptions";
  readonly label?: string;
  readonly value?: string;
  readonly displayOrder?: number;
  readonly doubleData?: number;
  readonly hidden?: boolean;
  readonly description?: string;
  readonly readOnly?: boolean;
}

export interface HubspotFormFormFieldValidationDefinition {
  readonly __typename?: "HubspotFormFormFieldGroupsFieldsValidation";
  readonly name?: string;
  readonly message?: string;
  readonly data?: string;
  readonly useDefaultBlockList?: boolean;
}

export interface HubspotFormFormDependentFieldDefinition {
  readonly __typename?: "HubspotFormFormFieldGroupsFieldsDependentFieldFilters";
  readonly filters?: ReadonlyArray<HubspotFormFormDependentFieldFiltersDefinition>;
  readonly dependentFormField?: Omit<
    HubspotFormFieldDefinition,
    "dependentFieldFilters"
  >;
  readonly formFieldAction?: string;
}

export interface HubspotFormFormDependentFieldFiltersDefinition {
  readonly __typename?: "HubspotFormFormFieldGroupsFieldsDependentFieldFiltersFilters";
  readonly operator?: string;
  readonly strValue?: string;
  readonly boolValue?: boolean;
  readonly numberValue?: number;
  readonly strValues?: ReadonlyArray<string>;
}
