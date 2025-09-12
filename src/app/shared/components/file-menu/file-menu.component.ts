import { TranslatePipe } from '@ngx-translate/core';

import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { TieredMenu } from 'primeng/tieredmenu';

import { Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

import { FileMenuType } from '@osf/shared/enums';
import { hasViewOnlyParam } from '@osf/shared/helpers';
import { FileMenuAction, FileMenuData } from '@osf/shared/models';

@Component({
  selector: 'osf-file-menu',
  imports: [Button, TieredMenu, TranslatePipe],
  templateUrl: './file-menu.component.html',
  styleUrl: './file-menu.component.scss',
})
export class FileMenuComponent {
  private router = inject(Router);
  action = output<FileMenuAction>();
  isFolder = input<boolean>(false);

  hasViewOnly = computed(() => {
    return hasViewOnlyParam(this.router);
  });

  private readonly allMenuItems: MenuItem[] = [
    {
      id: FileMenuType.Download,
      label: 'common.buttons.download',
      icon: 'fas fa-download',
      command: () => this.emitAction(FileMenuType.Download),
    },
    {
      id: FileMenuType.Share,
      label: 'common.buttons.share',
      icon: 'fas fa-share',
      items: [
        {
          id: `${FileMenuType.Share}-email`,
          label: 'files.detail.actions.share.email',
          icon: 'fas fa-envelope',
          command: () => this.emitAction(FileMenuType.Share, { type: 'email' }),
        },
        {
          id: `${FileMenuType.Share}-twitter`,
          label: 'files.detail.actions.share.x',
          icon: 'fab fa-square-x-twitter',
          command: () => this.emitAction(FileMenuType.Share, { type: 'twitter' }),
        },
        {
          id: `${FileMenuType.Share}-facebook`,
          label: 'files.detail.actions.share.facebook',
          icon: 'fab fa-facebook',
          command: () => this.emitAction(FileMenuType.Share, { type: 'facebook' }),
        },
      ],
    },
    {
      id: FileMenuType.Embed,
      label: 'common.buttons.embed',
      icon: 'fas fa-code',
      items: [
        {
          id: `${FileMenuType.Embed}-dynamic`,
          label: 'files.detail.actions.copyDynamicIframe',
          icon: 'fas fa-file-code',
          command: () => this.emitAction(FileMenuType.Embed, { type: 'dynamic' }),
        },
        {
          id: `${FileMenuType.Embed}-static`,
          label: 'files.detail.actions.copyStaticIframe',
          icon: 'fas fa-file-code',
          command: () => this.emitAction(FileMenuType.Embed, { type: 'static' }),
        },
      ],
    },
    {
      id: FileMenuType.Rename,
      label: 'common.buttons.rename',
      icon: 'fas fa-edit',
      command: () => this.emitAction(FileMenuType.Rename),
    },
    {
      id: FileMenuType.Move,
      label: 'common.buttons.move',
      icon: 'fas fa-arrows-alt',
      command: () => this.emitAction(FileMenuType.Move),
    },
    {
      id: FileMenuType.Copy,
      label: 'common.buttons.copy',
      icon: 'fas fa-copy',
      command: () => this.emitAction(FileMenuType.Copy),
    },
    {
      id: FileMenuType.Delete,
      label: 'common.buttons.delete',
      icon: 'fas fa-trash',
      command: () => this.emitAction(FileMenuType.Delete),
    },
  ];

  menuItems = computed(() => {
    if (this.hasViewOnly()) {
      const allowedActionsForFiles = [FileMenuType.Download, FileMenuType.Embed, FileMenuType.Share, FileMenuType.Copy];
      const allowedActionsForFolders = [FileMenuType.Download, FileMenuType.Copy];

      const allowedActions = this.isFolder() ? allowedActionsForFolders : allowedActionsForFiles;

      return this.allMenuItems.filter((item) => {
        if (item.command) {
          return allowedActions.includes(item.id as FileMenuType);
        }

        if (item.items) {
          return allowedActions.includes(item.id as FileMenuType);
        }

        return false;
      });
    }

    return this.allMenuItems;
  });

  private emitAction(value: FileMenuType, data?: FileMenuData): void {
    this.action.emit({ value, data } as FileMenuAction);
  }
}
