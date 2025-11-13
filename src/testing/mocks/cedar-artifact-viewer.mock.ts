import { CedarEditorElement } from '@osf/features/metadata/models';

export class CedarArtifactViewerMock extends HTMLElement implements CedarEditorElement {
  instanceObject?: unknown;
  currentMetadata?: unknown;
  dataQualityReport?: {
    isValid: boolean;
  };
}

if (typeof customElements !== 'undefined' && !customElements.get('cedar-artifact-viewer')) {
  customElements.define('cedar-artifact-viewer', CedarArtifactViewerMock);
}
