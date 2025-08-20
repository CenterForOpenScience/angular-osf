import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { IconComponent } from '@shared/components';
import { ShareableContent } from '@shared/models';
import { SocialShareService } from '@shared/services';

@Component({
  selector: 'osf-preprint-share-and-download',
  imports: [Card, IconComponent, Skeleton, ButtonDirective, TranslatePipe],
  templateUrl: './share-and-download.component.html',
  styleUrl: './share-and-download.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareAndDownloadComponent {
  preprintProvider = input.required<PreprintProviderDetails | undefined>();

  private readonly socialShareService = inject(SocialShareService);

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

    return this.socialShareService.createDownloadUrl(preprint.id);
  });

  private shareableContent = computed((): ShareableContent | null => {
    const preprint = this.preprint();
    const preprintProvider = this.preprintProvider();

    if (!preprint || !preprintProvider) return null;

    return {
      id: preprint.id,
      title: preprint.title,
      description: preprint.description,
      url: this.socialShareService.createPreprintUrl(preprint.id, preprintProvider.id),
    };
  });

  shareLinks = computed(() => {
    const content = this.shareableContent();

    if (!content) return null;

    return this.socialShareService.generateAllSharingLinks(content);
  });

  emailShareLink = computed(() => this.shareLinks()?.email || '');
  twitterShareLink = computed(() => this.shareLinks()?.twitter || '');
  facebookShareLink = computed(() => this.shareLinks()?.facebook || '');
  linkedInShareLink = computed(() => this.shareLinks()?.linkedIn || '');
}
