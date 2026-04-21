import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { switchMap } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, HostBinding, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { FilesSelectors, GetFile } from '@osf/features/files/store';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

@Component({
  selector: 'osf-draft-file-detail',
  imports: [SubHeaderComponent, LoadingSpinnerComponent, TranslatePipe],
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePreviewComponent {
  @HostBinding('class') classes = 'flex flex-column flex-1 w-full h-full';

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewOnlyService = inject(ViewOnlyLinkHelperService);

  private readonly actions = createDispatchMap({ getFile: GetFile });

  file = select(FilesSelectors.getOpenedFile);
  isFileLoading = select(FilesSelectors.isOpenedFileLoading);

  isIframeLoading = true;
  safeLink: SafeResourceUrl | null = null;

  hasViewOnly = computed(() => this.viewOnlyService.hasViewOnlyParam(this.router));

  constructor() {
    this.route.params
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((params) => this.actions.getFile(params['fileGuid']))
      )
      .subscribe(() => this.getIframeLink(''));
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
