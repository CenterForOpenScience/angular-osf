import { select } from '@ngxs/store';

import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { IconComponent } from '@shared/components';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-preprint-share-and-download',
  imports: [Card, IconComponent, Skeleton, ButtonDirective],
  templateUrl: './share-and-download.component.html',
  styleUrl: './share-and-download.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareAndDownloadComponent {
  preprint = select(PreprintSelectors.getPreprint);
  isPreprintLoading = select(PreprintSelectors.isPreprintLoading);

  metrics = computed(() => {
    const preprint = this.preprint();

    if (!preprint) return null;

    return preprint.metrics!;
  });

  downloadLink = computed(() => {
    const preprint = this.preprint();

    if (!preprint) return '#';

    return `${environment.webUrl}/${this.preprint()?.id}/download/`;
  });
}
