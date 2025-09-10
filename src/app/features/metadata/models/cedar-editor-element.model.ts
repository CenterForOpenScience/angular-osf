export interface CedarEditorElement extends HTMLElement {
  currentMetadata?: unknown;
  instanceObject?: unknown;
  dataQualityReport?: {
    isValid: boolean;
  };
}
