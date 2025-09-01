import { TranslatePipe } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { TieredMenu } from 'primeng/tieredmenu';

import { Component, computed, input, output } from '@angular/core';

import { FileMenuType } from '@osf/shared/enums';
import { FileMenuAction, FileMenuData } from '@osf/shared/models';

@Component({
  selector: 'osf-file-menu',
  imports: [Button, TieredMenu, TranslatePipe],
  templateUrl: './file-menu.component.html',
  styleUrl: './file-menu.component.scss',
})
export class FileMenuComponent {
  action = output<FileMenuAction>();
  isAnonymous = input<boolean>(false);
  isFolder = input<boolean>(false);

  private readonly allMenuItems: MenuItem[] = [
    {
      label: 'common.buttons.download',
      icon: 'fas fa-download',
      command: () => this.emitAction(FileMenuType.Download),
    },
    {
      label: 'common.buttons.share',
      icon: 'fas fa-share',
      items: [
        {
          label: 'files.detail.actions.share.email',
          icon: 'fas fa-envelope',
          command: () => this.emitAction(FileMenuType.Share, { type: 'email' }),
        },
        {
          label: 'files.detail.actions.share.x',
          icon: 'fab fa-square-x-twitter',
          command: () => this.emitAction(FileMenuType.Share, { type: 'twitter' }),
        },
        {
          label: 'files.detail.actions.share.facebook',
          icon: 'fab fa-facebook',
          command: () => this.emitAction(FileMenuType.Share, { type: 'facebook' }),
        },
      ],
    },
    {
      label: 'common.buttons.embed',
      icon: 'fas fa-code',
      items: [
        {
          label: 'files.detail.actions.copyDynamicIframe',
          icon: 'fas fa-file-code',
          command: () => this.emitAction(FileMenuType.Embed, { type: 'dynamic' }),
        },
        {
          label: 'files.detail.actions.copyStaticIframe',
          icon: 'fas fa-file-code',
          command: () => this.emitAction(FileMenuType.Embed, { type: 'static' }),
        },
      ],
    },
    {
      label: 'common.buttons.rename',
      icon: 'fas fa-edit',
      command: () => this.emitAction(FileMenuType.Rename),
    },
    {
      label: 'common.buttons.move',
      icon: 'fas fa-arrows-alt',
      command: () => this.emitAction(FileMenuType.Move),
    },
    {
      label: 'common.buttons.copy',
      icon: 'fas fa-copy',
      command: () => this.emitAction(FileMenuType.Copy),
    },
    {
      label: 'common.buttons.delete',
      icon: 'fas fa-trash',
      command: () => this.emitAction(FileMenuType.Delete),
    },
  ];

  menuItems = computed(() => {
    if (this.isAnonymous()) {
      const allowedActionsForFiles = [FileMenuType.Download, FileMenuType.Embed, FileMenuType.Share, FileMenuType.Copy];
      const allowedActionsForFolders = [FileMenuType.Download, FileMenuType.Copy];

      const allowedActions = this.isFolder() ? allowedActionsForFolders : allowedActionsForFiles;

      return this.allMenuItems.filter((item) => {
        if (item.command) {
          const action = this.getActionFromMenuItem(item);
          return allowedActions.includes(action);
        }

        if (item.items) {
          const action = this.getActionFromLabel(item.label);
          if (allowedActions.includes(action)) {
            return true;
          }
        }

        return false;
      });
    }

    return this.allMenuItems;
  });

  private getActionFromMenuItem(item: MenuItem): FileMenuType {
    return this.getActionFromLabel(item.label);
  }

  private getActionFromLabel(label: string | undefined): FileMenuType {
    switch (label) {
      case 'common.buttons.download':
        return FileMenuType.Download;
      case 'common.buttons.share':
        return FileMenuType.Share;
      case 'common.buttons.embed':
        return FileMenuType.Embed;
      case 'common.buttons.rename':
        return FileMenuType.Rename;
      case 'common.buttons.move':
        return FileMenuType.Move;
      case 'common.buttons.copy':
        return FileMenuType.Copy;
      case 'common.buttons.delete':
        return FileMenuType.Delete;
      default:
        return FileMenuType.Download;
    }
  }

  private emitAction(value: FileMenuType, data?: FileMenuData): void {
    this.action.emit({ value, data } as FileMenuAction);
  }
}
