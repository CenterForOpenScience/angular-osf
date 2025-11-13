import { CedarEditorElement } from '@osf/features/metadata/models';

export class CedarEmbeddableEditorMock extends HTMLElement implements CedarEditorElement {
  instanceObject?: unknown;
  currentMetadata?: unknown;
  dataQualityReport?: {
    isValid: boolean;
  };
}

if (typeof customElements !== 'undefined' && !customElements.get('cedar-embeddable-editor')) {
  customElements.define('cedar-embeddable-editor', CedarEmbeddableEditorMock);
}
