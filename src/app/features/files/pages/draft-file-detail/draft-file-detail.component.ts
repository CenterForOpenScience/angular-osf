import { createDispatchMap, select } from '@ngxs/store';

import { switchMap } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { FilesSelectors, GetFile } from '@osf/features/files/store';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkHelperService } from '@shared/services/view-only-link-helper.service';

@Component({
  selector: 'osf-draft-file-detail.component',
  imports: [SubHeaderComponent, LoadingSpinnerComponent],
  templateUrl: './draft-file-detail.component.html',
  styleUrl: './draft-file-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DraftFileDetailComponent {
  isFileLoading = select(FilesSelectors.isOpenedFileLoading);
  file = select(FilesSelectors.getOpenedFile);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly sanitizer = inject(DomSanitizer);
  private readonly viewOnlyService = inject(ViewOnlyLinkHelperService);
  isIframeLoading = true;
  safeLink: SafeResourceUrl | null = null;
  readonly destroyRef = inject(DestroyRef);
  fileGuid = '';
  hasViewOnly = computed(() => this.viewOnlyService.hasViewOnlyParam(this.router));

  private readonly actions = createDispatchMap({
    getFile: GetFile,
  });

  constructor() {
    this.route.params
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((params) => {
          this.fileGuid = params['fileGuid'];
          return this.actions.getFile(this.fileGuid);
        })
      )
      .subscribe(() => {
        this.getIframeLink('');
      });
  }

  getIframeLink(version: string) {
    const url = this.getMfrUrlWithVersion(version);
    if (url) {
      this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  getMfrUrlWithVersion(version?: string): string | null {
    const mfrUrl = this.file()?.links.render;
    if (!mfrUrl) return null;
    const mfrUrlObj = new URL(mfrUrl);
    const encodedDownloadUrl = mfrUrlObj.searchParams.get('url');
    if (!encodedDownloadUrl) return mfrUrl;

    const downloadUrlObj = new URL(decodeURIComponent(encodedDownloadUrl));

    if (version) downloadUrlObj.searchParams.set('version', version);

    if (this.hasViewOnly()) {
      const viewOnlyParam = this.viewOnlyService.getViewOnlyParam();
      if (viewOnlyParam) downloadUrlObj.searchParams.set('view_only', viewOnlyParam);
    }

    mfrUrlObj.searchParams.set('url', downloadUrlObj.toString());

    return mfrUrlObj.toString();
  }
}
