import { FileModel } from '@osf/shared/models/files/file.model';
import { FileActionExtension } from '@osf/shared/tokens/file-action-extensions.token';

/**
 * Factory function that creates Copy Link action extension.
 */
export function copyLinksExtensionFactory(): FileActionExtension[] {
  return [
    {
      id: 'copy-link',
      label: 'Copy Link',
      icon: 'fas fa-link',
      command: (ctx) => {
        const file = ctx.target as FileModel;
        navigator.clipboard.writeText(file.links.html);
      },
      parentId: 'share',
      position: 'end',
      visible: (ctx) => ctx.target.kind === 'file',
    },
  ];
}
