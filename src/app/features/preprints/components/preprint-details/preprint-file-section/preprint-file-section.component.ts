import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';

import { ProviderReviewsWorkflow } from '@osf/features/preprints/enums';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { IS_LARGE, IS_MEDIUM } from '@osf/shared/helpers';
import { LoadingSpinnerComponent } from '@shared/components';

@Component({
  selector: 'osf-preprint-file-section',
  imports: [LoadingSpinnerComponent, DatePipe, Skeleton, Menu, Button, TranslatePipe],
  templateUrl: './preprint-file-section.component.html',
  styleUrl: './preprint-file-section.component.scss',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintFileSectionComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly datePipe = inject(DatePipe);
  private readonly translateService = inject(TranslateService);

  providerReviewsWorkflow = input.required<ProviderReviewsWorkflow | null>();

  isMedium = toSignal(inject(IS_MEDIUM));
  isLarge = toSignal(inject(IS_LARGE));

  file = select(PreprintSelectors.getPreprintFile);
  isFileLoading = select(PreprintSelectors.isPreprintFileLoading);
  safeLink = computed(() => {
    const link = this.file()?.links.render;
    if (!link) return null;

    return this.sanitizer.bypassSecurityTrustResourceUrl(link);
  });
  isIframeLoading = true;

  fileVersions = select(PreprintSelectors.getPreprintFileVersions);
  areFileVersionsLoading = select(PreprintSelectors.arePreprintFileVersionsLoading);

  versionMenuItems = computed(() => {
    const fileVersions = this.fileVersions();
    if (!fileVersions.length) return [];

    return fileVersions.map((version, index) => ({
      label: this.translateService.instant('preprints.details.file.downloadVersion', {
        version: ++index,
        date: this.datePipe.transform(version.dateCreated, 'mm/dd/yyyy hh:mm:ss'),
      }),
      url: version.downloadLink,
    }));
  });

  dateLabel = computed(() => {
    const reviewsWorkflow = this.providerReviewsWorkflow();
    if (!reviewsWorkflow) return '';

    return reviewsWorkflow === ProviderReviewsWorkflow.PreModeration
      ? 'preprints.details.file.submitted'
      : 'preprints.details.file.created';
  });
}
