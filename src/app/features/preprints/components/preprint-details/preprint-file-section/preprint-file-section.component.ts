import { select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

import { ProviderReviewsWorkflow } from '@osf/features/preprints/enums';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { IS_LARGE, IS_MEDIUM } from '@osf/shared/helpers/breakpoints.tokens';
import { SafeUrlPipe } from '@osf/shared/pipes/safe-url.pipe';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';

@Component({
  selector: 'osf-preprint-file-section',
  imports: [LoadingSpinnerComponent, Skeleton, Menu, Button, DatePipe, TranslatePipe, SafeUrlPipe],
  templateUrl: './preprint-file-section.component.html',
  styleUrl: './preprint-file-section.component.scss',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintFileSectionComponent {
  private readonly datePipe = inject(DatePipe);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dataciteService = inject(DataciteService);

  providerReviewsWorkflow = input.required<ProviderReviewsWorkflow | null>();

  isMedium = toSignal(inject(IS_MEDIUM));
  isLarge = toSignal(inject(IS_LARGE));

  preprint = select(PreprintSelectors.getPreprint);
  preprint$ = toObservable(this.preprint);
  file = select(PreprintSelectors.getPreprintFile);
  isFileLoading = select(PreprintSelectors.isPreprintFileLoading);
  fileVersions = select(PreprintSelectors.getPreprintFileVersions);
  areFileVersionsLoading = select(PreprintSelectors.arePreprintFileVersionsLoading);

  safeLink = computed(() => this.file()?.links.render ?? null);
  isIframeLoading = true;

  versionMenuItems = computed(() => {
    const fileVersions = this.fileVersions() ?? [];
    if (!fileVersions.length) return [];

    return fileVersions.map((version) => ({
      label: this.translateService.instant('preprints.details.file.downloadVersion', {
        version: version.id,
        date: this.datePipe.transform(version.dateCreated, 'MM/dd/yyyy hh:mm:ss'),
      }),
      url: version.downloadLink,
      command: () => this.logDownload(),
    }));
  });

  dateLabel = computed(() => {
    const reviewsWorkflow = this.providerReviewsWorkflow();

    return reviewsWorkflow === ProviderReviewsWorkflow.PreModeration
      ? 'preprints.details.file.submitted'
      : 'preprints.details.file.created';
  });

  logDownload() {
    this.dataciteService.logIdentifiableDownload(this.preprint$).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
