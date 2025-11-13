import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { DecodeHtmlPipe } from '@osf/shared/pipes/decode-html.pipe';

import { PreprintProviderShortInfo } from '../../models';
import { GetPreprintProvidersAllowingSubmissions, PreprintProvidersSelectors } from '../../store/preprint-providers';
import { PreprintStepperSelectors, SetSelectedPreprintProviderId } from '../../store/preprint-stepper';

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
  selectedProviderId = select(PreprintStepperSelectors.getSelectedProviderId);
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
