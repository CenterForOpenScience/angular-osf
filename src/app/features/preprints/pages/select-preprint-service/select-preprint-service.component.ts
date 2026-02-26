import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { SafeHtmlPipe } from '@osf/shared/pipes/safe-html.pipe';

import { PreprintProviderShortInfo } from '../../models';
import { GetPreprintProvidersAllowingSubmissions, PreprintProvidersSelectors } from '../../store/preprint-providers';

@Component({
  selector: 'osf-select-preprint-service',
  imports: [SubHeaderComponent, Card, Button, NgClass, Tooltip, Skeleton, RouterLink, TranslatePipe, SafeHtmlPipe],
  templateUrl: './select-preprint-service.component.html',
  styleUrl: './select-preprint-service.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPreprintServiceComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private actions = createDispatchMap({
    getPreprintProvidersAllowingSubmissions: GetPreprintProvidersAllowingSubmissions,
  });

  preprintProvidersAllowingSubmissions = select(PreprintProvidersSelectors.getPreprintProvidersAllowingSubmissions);
  areProvidersLoading = select(PreprintProvidersSelectors.arePreprintProvidersAllowingSubmissionsLoading);

  selectedProviderId = signal<string | null>(null);
  skeletonArray = new Array(8);

  constructor() {
    this.actions.getPreprintProvidersAllowingSubmissions();
  }

  toggleProviderSelection(provider: PreprintProviderShortInfo): void {
    if (provider.id === this.selectedProviderId()) {
      this.selectedProviderId.set(null);
      return;
    }

    this.selectedProviderId.set(provider.id);
  }
}
