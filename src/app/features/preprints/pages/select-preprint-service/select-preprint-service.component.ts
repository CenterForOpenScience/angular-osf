import { createDispatchMap, select } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';

import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';

import { PreprintProviderShortInfo } from '@osf/features/preprints/models';
import { GetPreprintProvidersAllowingSubmissions, PreprintsSelectors } from '@osf/features/preprints/store/preprints';
import { SetSelectedPreprintProviderId, SubmitPreprintSelectors } from '@osf/features/preprints/store/submit-preprint';
import { SubHeaderComponent } from '@shared/components';
import { DecodeHtmlPipe } from '@shared/pipes';

@Component({
  selector: 'osf-select-preprint-service',
  imports: [SubHeaderComponent, Card, Button, NgClass, Tooltip, DecodeHtmlPipe, Skeleton, TranslateModule],
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

  preprintProvidersAllowingSubmissions = select(PreprintsSelectors.getPreprintProvidersAllowingSubmissions);
  areProvidersLoading = select(PreprintsSelectors.arePreprintProvidersAllowingSubmissionsLoading);
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

  nextStep() {
    //[RNi] TODO: redirect to first step of submitting preprint
  }
}
