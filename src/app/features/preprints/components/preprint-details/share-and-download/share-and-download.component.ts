import { select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { ChangeDetectionStrategy, Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { SocialShareService } from '@osf/shared/services/social-share.service';

@Component({
  selector: 'osf-preprint-share-and-download',
  imports: [Button, SocialsShareButtonComponent, TranslatePipe, Tooltip],
  templateUrl: './share-and-download.component.html',
  styleUrl: './share-and-download.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareAndDownloadComponent {
  preprintProvider = input.required<PreprintProviderDetails | undefined>();

  private readonly socialShareService = inject(SocialShareService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dataciteService = inject(DataciteService);

  preprint = select(PreprintSelectors.getPreprint);
  preprint$ = toObservable(this.preprint);
  resourceType = ResourceType.Preprint;

  download() {
    const preprint = this.preprint();

    if (!preprint) {
      return;
    }

    const downloadLink = this.socialShareService.createDownloadUrl(preprint.id);
    window.open(downloadLink)?.focus();

    this.dataciteService.logIdentifiableDownload(this.preprint$).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
