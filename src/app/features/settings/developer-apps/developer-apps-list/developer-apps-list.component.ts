import { Store } from '@ngxs/store';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { DeveloperApp } from '@osf/features/settings/developer-apps/entities/developer-apps.models';
import {
  DeleteDeveloperApp,
  DeveloperAppsSelectors,
  GetDeveloperApps,
} from '@osf/features/settings/developer-apps/store';
import { defaultConfirmationConfig } from '@shared/helpers/default-confirmation-config.helper';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';

@Component({
  selector: 'osf-developer-applications-list',
  imports: [Button, Card, RouterLink, Skeleton, TranslateModule],
  templateUrl: './developer-apps-list.component.html',
  styleUrl: './developer-apps-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppsListComponent implements OnInit {
  #store = inject(Store);
  #confirmationService = inject(ConfirmationService);
  #translateService = inject(TranslateService);

  protected readonly isLoading = signal(false);
  protected readonly isXSmall = toSignal(inject(IS_XSMALL));
  readonly developerApplications = this.#store.selectSignal(DeveloperAppsSelectors.getDeveloperApps);

  deleteApp(developerApp: DeveloperApp): void {
    this.#confirmationService.confirm({
      ...defaultConfirmationConfig,
      message: this.#translateService.instant('settings.developerApps.confirmation.delete.message'),
      header: this.#translateService.instant('settings.developerApps.confirmation.delete.title', {
        name: developerApp.name,
      }),
      acceptButtonProps: {
        ...defaultConfirmationConfig.acceptButtonProps,
        severity: 'danger',
        label: this.#translateService.instant('settings.developerApps.list.deleteButton'),
      },
      accept: () => {
        this.#store.dispatch(new DeleteDeveloperApp(developerApp.clientId));
      },
    });
  }

  ngOnInit(): void {
    if (!this.developerApplications().length) {
      this.isLoading.set(true);

      this.#store.dispatch(GetDeveloperApps).subscribe({
        complete: () => {
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
    }
  }
}
