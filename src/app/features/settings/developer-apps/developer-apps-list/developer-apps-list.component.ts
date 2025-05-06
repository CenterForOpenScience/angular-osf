import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { defaultConfirmationConfig } from '@shared/helpers/default-confirmation-config.helper';
import { ConfirmationService } from 'primeng/api';
import { Store } from '@ngxs/store';
import {
  DeleteDeveloperApp,
  DeveloperAppsSelectors,
  GetDeveloperApps,
} from '@osf/features/settings/developer-apps/store';
import { DeveloperApp } from '@osf/features/settings/developer-apps/entities/developer-apps.models';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'osf-developer-applications-list',
  imports: [Button, Card, RouterLink, Skeleton],
  templateUrl: './developer-apps-list.component.html',
  styleUrl: './developer-apps-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppsListComponent implements OnInit {
  #store = inject(Store);
  #confirmationService = inject(ConfirmationService);

  protected readonly isLoading = signal(false);
  protected readonly isXSmall = toSignal(inject(IS_XSMALL));
  readonly developerApplications = this.#store.selectSignal(
    DeveloperAppsSelectors.getDeveloperApps,
  );

  deleteApp(developerApp: DeveloperApp): void {
    this.#confirmationService.confirm({
      ...defaultConfirmationConfig,
      message:
        "Are you sure you want to delete this developer app? All users' access tokens will be revoked. This cannot be reversed.",
      header: `Delete App ${developerApp.name}?`,
      acceptButtonProps: {
        ...defaultConfirmationConfig.acceptButtonProps,
        severity: 'danger',
        label: 'Delete',
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
