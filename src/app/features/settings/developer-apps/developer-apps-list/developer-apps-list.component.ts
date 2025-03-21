import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { DeveloperApp } from '@osf/features/settings/developer-apps/developer-app.entities';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { defaultConfirmationConfig } from '@shared/helpers/default-confirmation-config.helper';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'osf-developer-applications-list',
  imports: [Button, Card, RouterLink],
  templateUrl: './developer-apps-list.component.html',
  styleUrl: './developer-apps-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppsListComponent {
  private readonly confirmationService = inject(ConfirmationService);
  #isXSmall$ = inject(IS_XSMALL);
  isXSmall = toSignal(this.#isXSmall$);

  developerApplications = signal<DeveloperApp[]>([
    {
      id: '1',
      appName: 'Developer app name example',
      projHomePageUrl: 'https://example.com',
      appDescription: 'Example description',
      authorizationCallbackUrl: 'https://example.com/callback',
    },
    {
      id: '2',
      appName: 'Developer app name example',
      projHomePageUrl: 'https://example.com',
      appDescription: 'Example description',
      authorizationCallbackUrl: 'https://example.com/callback',
    },
  ]);

  deleteApp(developerApp: DeveloperApp): void {
    this.confirmationService.confirm({
      ...defaultConfirmationConfig,
      message:
        "Are you sure you want to delete this developer app? All users' access tokens will be revoked. This cannot be reversed.",
      header: `Delete App ${developerApp.appName}?`,
      acceptButtonProps: {
        ...defaultConfirmationConfig.acceptButtonProps,
        severity: 'danger',
        label: 'Delete',
      },
      accept: () => {
        //TODO integrate API
      },
    });
  }
}
