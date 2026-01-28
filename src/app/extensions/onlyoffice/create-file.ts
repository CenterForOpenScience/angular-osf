import { FileActionExtension } from '@osf/shared/tokens/file-action-extensions.token';

import { OnlyOfficeConfig } from './edit-by-onlyoffice';

/**
 * Factory function for Create File toolbar extension.
 * Adds a "Create File" button that opens OnlyOffice to create a new document.
 *
 * NOTE: This is a dummy implementation for demonstration purposes.
 * The actual OnlyOffice integration requires a running OnlyOffice Document Server.
 */
export function createFileExtensionFactory(config: OnlyOfficeConfig): FileActionExtension[] {
  return [
    {
      id: 'create-file-onlyoffice',
      label: 'Create File',
      icon: 'fas fa-file-circle-plus',
      command: (ctx) => {
        const params = new URLSearchParams({
          new: 'true',
          path: ctx.target.path!,
        });
        window.open(`${config.editorUrl}?${params}`, '_blank');
      },
      position: 'end',
      visible: (ctx) => ctx.location === 'file-list' && ctx.target.kind === 'folder' && !ctx.isViewOnly && ctx.canWrite,
    },
  ];
}
