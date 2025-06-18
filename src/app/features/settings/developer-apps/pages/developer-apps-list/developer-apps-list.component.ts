import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { CustomConfirmationService } from '@osf/shared/services';
import { IS_XSMALL } from '@osf/shared/utils';

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

  protected readonly isLoading = signal(false);
  protected readonly isXSmall = toSignal(inject(IS_XSMALL));
  readonly developerApplications = select(DeveloperAppsSelectors.getDeveloperApps);

  ngOnInit(): void {
    if (!this.developerApplications().length) {
      this.isLoading.set(true);

      this.actions.getDeveloperApps().subscribe({
        complete: () => {
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
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
