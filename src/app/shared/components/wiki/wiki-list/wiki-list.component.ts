import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { DialogService } from 'primeng/dynamicdialog';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { ComponentWiki, Wiki, WikiItemType, WikiMenuItem } from '@osf/shared/models';
import { CustomConfirmationService } from '@osf/shared/services';

import { AddWikiDialogComponent } from '../add-wiki-dialog/add-wiki-dialog.component';

@Component({
  selector: 'osf-wiki-list',
  imports: [PanelModule, Button, PanelMenuModule, ButtonGroupModule, Skeleton, RouterModule, TranslatePipe],
  templateUrl: './wiki-list.component.html',
  styleUrl: './wiki-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class WikiListComponent {
  readonly list = input.required<Wiki[]>();
  readonly resourceId = input.required<string>();
  readonly currentWikiId = input.required<string>();
  readonly componentsList = input.required<ComponentWiki[]>();

  readonly showAddBtn = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly viewOnly = input<boolean>(false);

  readonly deleteWiki = output<void>();
  readonly createWiki = output<void>();

  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly router = inject(Router);

  wikiItemType = WikiItemType;
  expanded = signal(true);

  hasComponentsWikis = computed(() => {
    return this.componentsList().length > 0;
  });

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
    const dialogRef = this.dialogService.open(AddWikiDialogComponent, {
      header: this.translateService.instant('project.wiki.addNewWiki'),
      focusOnShow: false,
      closeOnEscape: true,
      modal: true,
      closable: true,
      width: '448px',
      data: {
        resourceId: this.resourceId(),
      },
    });

    dialogRef.onClose.subscribe(() => {
      this.createWiki.emit();
    });
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
