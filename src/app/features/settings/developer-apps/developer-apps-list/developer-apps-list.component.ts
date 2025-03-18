import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { DeveloperApp } from '@osf/features/settings/developer-apps/developer-app.entity';
import { IS_XSMALL } from '@shared/utils/breakpoints.tokens';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';

@Component({
  selector: 'osf-developer-applications-list',
  imports: [Button, Card, RouterLink, NgClass],
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
      name: 'Developer app name example',
    },
    {
      id: '2',
      name: 'Developer app name example',
    },
    {
      id: '3',
      name: 'Developer app name example',
    },
    {
      id: '4',
      name: 'Developer app name example',
    },
  ]);

  onDeleteAppBtnClicked(developerAppId: string): void {
    console.log('delete', developerAppId);
    //TODO implement api integration
  }
}
