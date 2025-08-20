import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Menu } from 'primeng/menu';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { IconComponent, TruncatedTextComponent } from '@osf/shared/components';
import { ResourceType, UserPermissions } from '@osf/shared/enums';
import { IS_XSMALL } from '@osf/shared/helpers';

import { ProjectOverviewSelectors } from '../../store';
import { AddComponentDialogComponent } from '../add-component-dialog/add-component-dialog.component';
import { DeleteComponentDialogComponent } from '../delete-component-dialog/delete-component-dialog.component';

@Component({
  selector: 'osf-project-components',
  imports: [Button, Menu, Skeleton, TranslatePipe, TruncatedTextComponent, IconComponent],
  templateUrl: './overview-components.component.html',
  styleUrl: './overview-components.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponentsComponent {
  private router = inject(Router);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  protected isMobile = toSignal(inject(IS_XSMALL));
  isCollectionsRoute = input<boolean>(false);
  canWrite = input.required<boolean>();
  protected components = select(ProjectOverviewSelectors.getComponents);
  protected isComponentsLoading = select(ProjectOverviewSelectors.getComponentsLoading);
  protected readonly componentActionItems = (componentId: string) => [
    {
      label: 'project.overview.actions.manageContributors',
      command: () => this.router.navigate([componentId, 'contributors']),
    },
    {
      label: 'project.overview.actions.settings',
      command: () => this.router.navigate([componentId, 'settings']),
    },
    {
      label: 'project.overview.actions.delete',
      command: () => this.handleDeleteComponent(componentId),
    },
  ];
  readonly UserPermissions = UserPermissions;

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
        resourceType: ResourceType.Project,
      },
    });
  }
}
