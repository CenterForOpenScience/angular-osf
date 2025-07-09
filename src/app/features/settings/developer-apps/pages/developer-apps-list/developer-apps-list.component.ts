import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CustomConfirmationService } from '@osf/shared/services';

import { DeveloperApp } from '../../models';
import { DeleteDeveloperApp, DeveloperAppsSelectors, GetDeveloperApps } from '../../store';

@Component({
  selector: 'osf-developer-applications-list',
  imports: [Button, Card, RouterLink, Skeleton, TranslatePipe],
  templateUrl: './developer-apps-list.component.html',
  styleUrl: './developer-apps-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppsListComponent implements OnInit {
  private readonly actions = createDispatchMap({
    getDeveloperApps: GetDeveloperApps,
    deleteDeveloperApp: DeleteDeveloperApp,
  });
  private readonly customConfirmationService = inject(CustomConfirmationService);

  protected readonly isLoading = select(DeveloperAppsSelectors.isLoading);
  readonly developerApplications = select(DeveloperAppsSelectors.getDeveloperApps);

  ngOnInit(): void {
    if (!this.developerApplications().length) {
      this.actions.getDeveloperApps();
    }
  }

  deleteApp(developerApp: DeveloperApp): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'settings.developerApps.confirmation.delete.title',
      headerParams: { name: developerApp.name },
      messageKey: 'settings.developerApps.confirmation.delete.message',
      onConfirm: () => this.actions.deleteDeveloperApp(developerApp.clientId),
    });
  }
}
