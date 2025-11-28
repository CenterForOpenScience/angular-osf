import { FileActionExtension } from '@osf/shared/tokens/file-action-extensions.token';

export interface OnlyOfficeConfig {
  editorUrl: string;
}

const SUPPORTED_EXTENSIONS = /\.(docx?|xlsx?|pptx?|odt|ods|odp)$/i;

/**
 * Factory function for Edit by OnlyOffice action extension.
 * Adds "Edit by OnlyOffice" option to file context menu.
 *
 * NOTE: This is a dummy implementation for demonstration purposes.
 * The actual OnlyOffice integration requires a running OnlyOffice Document Server.
 */
export function editByOnlyOfficeExtensionFactory(config: OnlyOfficeConfig): FileActionExtension[] {
  return [
    {
      id: 'edit-onlyoffice',
      label: 'Edit by OnlyOffice',
      icon: 'fas fa-edit',
      command: (ctx) => {
        const editorUrl = `${config.editorUrl}?fileId=${ctx.target.id}`;
        window.open(editorUrl, '_blank');
      },
      position: 'start',
      visible: (ctx) => ctx.target.kind === 'file' && ctx.canWrite && SUPPORTED_EXTENSIONS.test(ctx.target.name),
    },
  ];
}
