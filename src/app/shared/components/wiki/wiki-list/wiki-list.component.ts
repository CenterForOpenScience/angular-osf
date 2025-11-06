import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Panel } from 'primeng/panel';
import { PanelMenu } from 'primeng/panelmenu';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';

import { WikiModel } from '@osf/shared/models/wiki/wiki.model';
import { WikiMenuItem } from '@osf/shared/models/wiki/wiki-menu.model';
import { WikiItemType } from '@osf/shared/models/wiki/wiki-type.model';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ComponentWiki } from '@osf/shared/stores/wiki';
import { RenameWikiDialogComponent } from '@shared/components/wiki/rename-wiki-dialog/rename-wiki-dialog.component';

import { AddWikiDialogComponent } from '../add-wiki-dialog/add-wiki-dialog.component';

@Component({
  selector: 'osf-wiki-list',
  imports: [Button, Panel, PanelMenu, Skeleton, TranslatePipe],
  templateUrl: './wiki-list.component.html',
  styleUrl: './wiki-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WikiListComponent {
  readonly list = input.required<WikiModel[]>();
  readonly resourceId = input.required<string>();
  readonly currentWikiId = input.required<string>();
  readonly componentsList = input.required<ComponentWiki[]>();

  readonly isLoading = input<boolean>(false);
  readonly canEdit = input<boolean>(false);

  readonly deleteWiki = output<void>();
  readonly createWiki = output<void>();
  readonly renameWiki = output<void>();

  private readonly customDialogService = inject(CustomDialogService);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly router = inject(Router);

  wikiItemType = WikiItemType;
  expanded = signal(true);

  hasComponentsWikis = computed(() => this.componentsList().length > 0);

  isHomeWikiSelected = computed(() => {
    const homeWikiId = this.list()?.find((wiki) => wiki.name.toLowerCase() === 'home')?.id;
    return this.currentWikiId() === homeWikiId;
  });

  wikiMenu = computed(() => {
    const menu: WikiMenuItem[] = [
      {
        expanded: true,
        type: WikiItemType.Folder,
        label: 'project.wiki.list.header',
        items: this.list()?.map((wiki) => ({
          id: wiki.id,
          label: wiki.name,
          type: WikiItemType.File,
          command: () => this.navigateTo(wiki.id),
        })),
      },
    ];

    if (this.hasComponentsWikis()) {
      menu.push({
        type: WikiItemType.Folder,
        label: 'project.wiki.list.componentsHeader',
        items: this.componentsList()?.map((component) => ({
          id: component.id,
          label: component.title,
          type: WikiItemType.Component,
          items: component.list.map((wiki) => ({
            id: wiki.id,
            label: wiki.name,
            type: WikiItemType.File,
            command: () => this.navigateTo(wiki.id, component.id),
          })),
        })),
      });
    }
    return menu;
  });

  openAddWikiDialog() {
    this.customDialogService
      .open(AddWikiDialogComponent, {
        header: 'project.wiki.addNewWiki',
        width: '448px',
        data: {
          resourceId: this.resourceId(),
        },
      })
      .onClose.subscribe(() => this.createWiki.emit());
  }

  openRenameWikiDialog(wikiId: string, wikiName: string) {
    this.customDialogService
      .open(RenameWikiDialogComponent, {
        header: 'project.wiki.renameWiki',
        width: '448px',
        data: {
          wikiId: wikiId,
          wikiName: wikiName,
        },
      })
      .onClose.subscribe(() => this.renameWiki.emit());
  }

  openDeleteWikiDialog(): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'project.wiki.deleteWiki',
      messageKey: 'project.wiki.deleteWikiMessage',
      onConfirm: () => this.deleteWiki.emit(),
    });
  }

  collapseNavigation() {
    this.expanded.update((value) => !value);
  }

  private navigateTo(wikiId: string, componentId?: string) {
    if (componentId) {
      this.router.navigateByUrl('/').then(() => {
        this.router.navigate([componentId, 'wiki'], {
          queryParams: { wiki: wikiId },
        });
      });
    } else {
      this.router.navigate([], {
        queryParams: { wiki: wikiId },
        queryParamsHandling: 'merge',
      });
    }
  }
}
