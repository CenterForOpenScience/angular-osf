export interface CedarEditorElement extends HTMLElement {
  currentMetadata?: unknown;
  instanceObject?: unknown;
  templateAndInstanceObject?: {
    templateObject: unknown;
    instanceObject: unknown;
  };
  dataQualityReport?: {
    isValid: boolean;
  };
}
