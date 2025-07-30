import { select } from '@ngxs/store';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Skeleton } from 'primeng/skeleton';

import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { LoadingSpinnerComponent } from '@shared/components';
import { IS_LARGE, IS_MEDIUM } from '@shared/utils';

@Component({
  selector: 'osf-preprint-file-section',
  imports: [LoadingSpinnerComponent, DatePipe, Skeleton, Menu, Button],
  templateUrl: './preprint-file-section.component.html',
  styleUrl: './preprint-file-section.component.scss',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintFileSectionComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly datePipe = inject(DatePipe);

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
      label: `Version ${++index}, ${this.datePipe.transform(version.dateCreated, 'mm/dd/yyyy hh:mm:ss')}`,
      url: version.downloadLink,
    }));
  });
}
