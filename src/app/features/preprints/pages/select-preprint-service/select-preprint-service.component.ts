import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PreprintProviderShortInfo } from '@osf/features/preprints/models';
import {
  GetPreprintProvidersAllowingSubmissions,
  PreprintProvidersSelectors,
} from '@osf/features/preprints/store/preprint-providers';
import { SetSelectedPreprintProviderId, SubmitPreprintSelectors } from '@osf/features/preprints/store/submit-preprint';
import { SubHeaderComponent } from '@shared/components';
import { DecodeHtmlPipe } from '@shared/pipes';

@Component({
  selector: 'osf-select-preprint-service',
  imports: [SubHeaderComponent, Card, Button, NgClass, Tooltip, DecodeHtmlPipe, Skeleton, TranslatePipe, RouterLink],
  templateUrl: './select-preprint-service.component.html',
  styleUrl: './select-preprint-service.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPreprintServiceComponent implements OnInit {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private actions = createDispatchMap({
    getPreprintProvidersAllowingSubmissions: GetPreprintProvidersAllowingSubmissions,
    setSelectedPreprintProviderId: SetSelectedPreprintProviderId,
  });

  preprintProvidersAllowingSubmissions = select(PreprintProvidersSelectors.getPreprintProvidersAllowingSubmissions);
  areProvidersLoading = select(PreprintProvidersSelectors.arePreprintProvidersAllowingSubmissionsLoading);
  selectedProviderId = select(SubmitPreprintSelectors.getSelectedProviderId);
  skeletonArray = Array.from({ length: 8 }, (_, i) => i + 1);

  ngOnInit(): void {
    this.actions.getPreprintProvidersAllowingSubmissions();
  }

  selectDeselectProvider(provider: PreprintProviderShortInfo) {
    if (provider.id === this.selectedProviderId()) {
      this.actions.setSelectedPreprintProviderId(null);
      return;
    }

    this.actions.setSelectedPreprintProviderId(provider.id);
  }
}
