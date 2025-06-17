import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { DialogService } from 'primeng/dynamicdialog';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { defaultConfirmationConfig } from '@osf/shared/utils';

import { Wiki, WikiItemType, WikiMenuItem } from '../../models';
import { ComponentWiki } from '../../store';
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
  readonly projectId = input.required<string>();
  readonly list = input.required<Wiki[]>();
  readonly isLoading = input<boolean>(false);
  readonly componentsList = input.required<ComponentWiki[]>();
  readonly currentWikiId = input.required<string>();
  readonly deleteWiki = output<void>();
  readonly createWiki = output<void>();
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly confirmationService = inject(ConfirmationService);
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
        label: this.translateService.instant('project.wiki.list.header'),
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
        label: this.translateService.instant('project.wiki.list.componentsHeader'),
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
      modal: true,
      data: {
        projectId: this.projectId(),
      },
    });
    dialogRef.onClose.subscribe(() => {
      this.createWiki.emit();
    });
  }

  openDeleteWikiDialog(): void {
    this.confirmationService.confirm({
      ...defaultConfirmationConfig,
      header: this.translateService.instant('project.wiki.deleteWiki'),
      message: this.translateService.instant('project.wiki.deleteWikiMessage'),
      acceptButtonProps: {
        ...defaultConfirmationConfig.acceptButtonProps,
        severity: 'danger',
        label: this.translateService.instant('common.buttons.delete'),
      },
      accept: () => this.deleteWiki.emit(),
    });
  }

  collapseNavigation() {
    this.expanded.update((value) => !value);
  }

  private navigateTo(wikiId: string, componentId?: string) {
    if (componentId) {
      this.router.navigateByUrl('/my-projects').then(() => {
        this.router.navigate(['/my-projects', componentId, 'wiki'], {
          queryParams: { wiki: wikiId },
        });
      });
    } else {
      // change only the wiki id in query params
      this.router.navigate([], {
        queryParams: { wiki: wikiId },
        queryParamsHandling: 'merge',
      });
    }
  }
}
