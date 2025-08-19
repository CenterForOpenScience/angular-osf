import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tab, TabList, Tabs } from 'primeng/tabs';

import { switchMap } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LoadingSpinnerComponent, SubHeaderComponent } from '@osf/shared/components';
import { OsfFile } from '@shared/models';
import { CustomConfirmationService, ToastService } from '@shared/services';

import {
  FileKeywordsComponent,
  FileMetadataComponent,
  FileResourceMetadataComponent,
  FileRevisionsComponent,
} from '../../components';
import { embedDynamicJs, embedStaticHtml } from '../../constants';
import { FileDetailTab } from '../../enums';
import {
  DeleteEntry,
  FilesSelectors,
  GetFile,
  GetFileMetadata,
  GetFileResourceContributors,
  GetFileResourceMetadata,
  GetFileRevisions,
} from '../../store';

@Component({
  selector: 'osf-file-detail',
  imports: [
    RouterLink,
    Button,
    Tab,
    TabList,
    Tabs,
    Menu,
    TranslatePipe,
    SubHeaderComponent,
    LoadingSpinnerComponent,
    FileKeywordsComponent,
    FileRevisionsComponent,
    FileMetadataComponent,
    FileResourceMetadataComponent,
  ],
  templateUrl: './file-detail.component.html',
  styleUrl: './file-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDetailComponent {
  @HostBinding('class') classes = 'flex flex-column flex-1 w-full h-full';

  readonly store = inject(Store);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly destroyRef = inject(DestroyRef);
  readonly sanitizer = inject(DomSanitizer);
  readonly toastService = inject(ToastService);
  readonly customConfirmationService = inject(CustomConfirmationService);

  private readonly actions = createDispatchMap({
    getFile: GetFile,
    getFileRevisions: GetFileRevisions,
    getFileMetadata: GetFileMetadata,
    getFileResourceMetadata: GetFileResourceMetadata,
    getFileResourceContributors: GetFileResourceContributors,
    deleteEntry: DeleteEntry,
  });

  file = select(FilesSelectors.getOpenedFile);
  isFileLoading = select(FilesSelectors.isOpenedFileLoading);
  safeLink: SafeResourceUrl | null = null;
  resourceId = '';
  resourceType = '';

  isIframeLoading = true;

  protected readonly FileDetailTab = FileDetailTab;

  protected selectedTab: FileDetailTab = FileDetailTab.Details;

  fileGuid = '';

  embedItems = [
    {
      label: 'files.detail.actions.copyDynamicIframe',
      command: () => this.handleCopyDynamicEmbed(),
    },
    {
      label: 'files.detail.actions.copyStaticIframe',
      command: () => this.handleCopyStaticEmbed(),
    },
  ];

  shareItems = [
    {
      label: 'files.detail.actions.share.email',
      command: () => this.handleEmailShare(),
    },
    {
      label: 'files.detail.actions.share.x',
      command: () => this.handleXShare(),
    },
    {
      label: 'files.detail.actions.share.facebook',
      command: () => this.handleFacebookShare(),
    },
  ];

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
        const link = this.file()?.links.render;
        if (link) {
          this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
        }
        this.resourceId = this.file()?.target.id || '';
        this.resourceType = this.file()?.target.type || '';
        const fileId = this.file()?.path.replaceAll('/', '');
        if (this.resourceId && this.resourceType) {
          this.actions.getFileResourceMetadata(this.resourceId, this.resourceType);
          this.actions.getFileResourceContributors(this.resourceId, this.resourceType);

          if (fileId) {
            const fileProvider = this.file()?.provider || '';
            this.actions.getFileRevisions(this.resourceId, fileProvider, fileId);
          }
        }
      });

    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.actions.getFileMetadata(params['fileGuid']);
    });
  }

  downloadFile(link: string): void {
    window.open(link)?.focus();
  }

  copyToClipboard(embedHtml: string): void {
    navigator.clipboard
      .writeText(embedHtml)
      .then(() => {
        this.toastService.showSuccess('files.detail.toast.copiedToClipboard');
      })
      .catch((err) => {
        this.toastService.showError(err.message);
      });
  }

  deleteEntry(link: string): void {
    if (this.resourceId) {
      const redirectUrl =
        this.resourceType === 'nodes' ? `/project/${this.resourceId}/files` : `/registry/${this.resourceId}/files`;
      this.actions
        .deleteEntry(this.resourceId, link)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.router.navigate([redirectUrl]);
        });
    }
  }

  confirmDelete(file: OsfFile): void {
    this.customConfirmationService.confirmDelete({
      headerKey: 'files.dialogs.deleteFile.title',
      messageParams: { name: file.name },
      messageKey: 'files.dialogs.deleteFile.message',
      onConfirm: () => this.deleteEntry(file.links.delete),
    });
  }

  onTabChange(index: FileDetailTab): void {
    this.selectedTab = index;
  }

  protected handleEmailShare(): void {
    const link = `mailto:?subject=${this.file()?.name ?? ''}&body=${this.file()?.links?.html ?? ''}`;
    window.location.href = link;
  }

  protected handleXShare(): void {
    const link = `https://x.com/intent/tweet?url=${this.file()?.links?.html ?? ''}&text=${this.file()?.name ?? ''}&via=OSFramework`;
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  protected handleFacebookShare(): void {
    const link = `https://www.facebook.com/dialog/share?app_id=1022273774556662&display=popup&href=${this.file()?.links?.html ?? ''}&redirect_uri=${this.file()?.links?.html ?? ''}`;
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  protected handleCopyDynamicEmbed(): void {
    const data = embedDynamicJs.replace('ENCODED_URL', this.file()?.links?.render ?? '');
    this.copyToClipboard(data);
  }

  protected handleCopyStaticEmbed(): void {
    const data = embedStaticHtml.replace('ENCODED_URL', this.file()?.links?.render ?? '');
    this.copyToClipboard(data);
  }
}
