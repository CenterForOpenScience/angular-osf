import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { IconComponent } from '@shared/components';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-preprint-share-and-download',
  imports: [Card, IconComponent, Skeleton, ButtonDirective, TranslatePipe],
  templateUrl: './share-and-download.component.html',
  styleUrl: './share-and-download.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareAndDownloadComponent {
  preprintProvider = input.required<PreprintProviderDetails | undefined>();

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

    return `${environment.webUrl}/download/${this.preprint()?.id}`;
  });

  private preprintDetailsFullUrl = computed(() => {
    const preprint = this.preprint();
    const preprintProvider = this.preprintProvider();

    if (!preprint || !preprintProvider) return '';

    return `${environment.webUrl}/preprints/${preprintProvider.id}/${preprint.id}`;
  });

  emailShareLink = computed(() => {
    const preprint = this.preprint();
    const preprintProvider = this.preprintProvider();

    if (!preprint || !preprintProvider) return;

    const subject = encodeURIComponent(preprint.title);
    const body = encodeURIComponent(this.preprintDetailsFullUrl());

    return `mailto:?subject=${subject}&body=${body}`;
  });

  twitterShareLink = computed(() => {
    const preprint = this.preprint();
    const preprintProvider = this.preprintProvider();

    if (!preprint || !preprintProvider) return '';

    const url = encodeURIComponent(this.preprintDetailsFullUrl());
    const text = encodeURIComponent(preprint.title);

    return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
  });

  facebookShareLink = computed(() => {
    const preprint = this.preprint();
    const preprintProvider = this.preprintProvider();

    if (!preprint || !preprintProvider) return '';

    const href = encodeURIComponent(this.preprintDetailsFullUrl());

    const facebookAppId = preprintProvider.facebookAppId || environment.facebookAppId;
    return `https://www.facebook.com/dialog/share?app_id=${facebookAppId}&display=popup&href=${href}`;
  });

  linkedInShareLink = computed(() => {
    const preprint = this.preprint();
    const preprintProvider = this.preprintProvider();

    if (!preprint || !preprintProvider) return '';

    const url = encodeURIComponent(this.preprintDetailsFullUrl());
    const title = encodeURIComponent(preprint.title);
    const summary = encodeURIComponent(preprint.description || preprint.title);
    const source = encodeURIComponent('OSF');

    return `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}&source=${source}`;
  });
}
