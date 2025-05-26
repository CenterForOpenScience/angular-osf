import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Menu } from 'primeng/menu';
import { Skeleton } from 'primeng/skeleton';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { AddComponentDialogComponent, DeleteComponentDialogComponent } from '@osf/features/project/overview/components';
import { ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { TruncatedTextComponent } from '@shared/components/truncated-text/truncated-text.component';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-project-components',
  imports: [Button, Menu, Skeleton, TranslatePipe, TruncatedTextComponent, NgClass],
  templateUrl: './overview-components.component.html',
  styleUrl: './overview-components.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponentsComponent {
  private router = inject(Router);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  protected isMobile = toSignal(inject(IS_XSMALL));
  protected components = select(ProjectOverviewSelectors.getComponents);
  protected isComponentsLoading = select(ProjectOverviewSelectors.getComponentsLoading);
  protected readonly componentActionItems = (componentId: string) => [
    {
      label: 'project.overview.actions.manageContributors',
      command: () => this.router.navigate(['/my-projects', componentId, 'contributors']),
    },
    {
      label: 'project.overview.actions.settings',
      command: () => this.router.navigate(['/my-projects', componentId, 'settings']),
    },
    {
      label: 'project.overview.actions.delete',
      command: () => this.handleDeleteComponent(componentId),
    },
  ];

  handleAddComponent(): void {
    const dialogWidth = this.isMobile() ? '95vw' : '850px';

    this.dialogService.open(AddComponentDialogComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant('project.overview.dialog.addComponent.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  private handleDeleteComponent(componentId: string): void {
    const dialogWidth = this.isMobile() ? '95vw' : '650px';

    this.dialogService.open(DeleteComponentDialogComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant('project.overview.dialog.deleteComponent.header'),
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: {
        componentId,
      },
    });
  }
}
