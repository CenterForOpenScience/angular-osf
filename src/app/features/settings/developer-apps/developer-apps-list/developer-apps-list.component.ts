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

@Component({
  selector: 'osf-developer-applications-list',
  imports: [Button, Card, RouterLink],
  templateUrl: './developer-apps-list.component.html',
  styleUrl: './developer-apps-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperAppsListComponent {
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

  deleteApp(developerAppId: string): void {
    console.log('delete', developerAppId);
    //TODO implement api integration
  }
}
