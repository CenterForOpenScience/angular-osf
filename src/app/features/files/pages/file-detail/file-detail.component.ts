import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { Tab, TabList, Tabs } from 'primeng/tabs';

import { switchMap } from 'rxjs';

import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecordData,
  CedarRecordDataBinding,
} from '@osf/features/metadata/models';
import {
  CreateCedarMetadataRecord,
  GetCedarMetadataRecords,
  GetCedarMetadataTemplates,
  MetadataSelectors,
  UpdateCedarMetadataRecord,
} from '@osf/features/metadata/store';
import { LoadingSpinnerComponent, MetadataTabsComponent, SubHeaderComponent } from '@osf/shared/components';
import { MetadataResourceEnum, ResourceType } from '@osf/shared/enums';
import { pathJoin } from '@osf/shared/helpers';
import { MetadataTabsModel, OsfFile } from '@osf/shared/models';
import { CustomConfirmationService, MetaTagsService, ToastService } from '@osf/shared/services';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';

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

import { environment } from 'src/environments/environment';

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
    MetadataTabsComponent,
    TableModule,
  ],
  templateUrl: './file-detail.component.html',
  styleUrl: './file-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
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
  private readonly metaTags = inject(MetaTagsService);
  private readonly datePipe = inject(DatePipe);
  private readonly translateService = inject(TranslateService);
  readonly dataciteService = inject(DataciteService);

  private readonly actions = createDispatchMap({
    getFile: GetFile,
    getFileRevisions: GetFileRevisions,
    getFileMetadata: GetFileMetadata,
    getFileResourceMetadata: GetFileResourceMetadata,
    getFileResourceContributors: GetFileResourceContributors,
    deleteEntry: DeleteEntry,

    getCedarRecords: GetCedarMetadataRecords,
    getCedarTemplates: GetCedarMetadataTemplates,
    createCedarRecord: CreateCedarMetadataRecord,
    updateCedarRecord: UpdateCedarMetadataRecord,
  });

  file = select(FilesSelectors.getOpenedFile);
  fileMetadata$ = toObservable(select(FilesSelectors.getResourceMetadata));
  isFileLoading = select(FilesSelectors.isOpenedFileLoading);
  cedarRecords = select(MetadataSelectors.getCedarRecords);
  cedarTemplates = select(MetadataSelectors.getCedarTemplates);
  isAnonymous = select(FilesSelectors.isFilesAnonymous);
  fileCustomMetadata = select(FilesSelectors.getFileCustomMetadata);
  isFileCustomMetadataLoading = select(FilesSelectors.isFileMetadataLoading);
  resourceMetadata = select(FilesSelectors.getResourceMetadata);
  resourceContributors = select(FilesSelectors.getContributors);
  isResourceContributorsLoading = select(FilesSelectors.isResourceContributorsLoading);

  safeLink: SafeResourceUrl | null = null;
  resourceId = '';
  resourceType = '';

  isIframeLoading = true;

  readonly FileDetailTab = FileDetailTab;

  selectedTab: FileDetailTab = FileDetailTab.Details;

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

  tabs = signal<MetadataTabsModel[]>([]);

  isLoading = computed(() => {
    return this.isFileLoading();
  });

  selectedMetadataTab = signal('osf');

  selectedCedarRecord = signal<CedarMetadataRecordData | null>(null);
  selectedCedarTemplate = signal<CedarMetadataDataTemplateJsonApi | null>(null);
  cedarFormReadonly = signal<boolean>(true);

  private readonly effectMetaTags = effect(() => {
    const metaTagsData = this.metaTagsData();
    if (metaTagsData) {
      this.metaTags.updateMetaTags(metaTagsData, this.destroyRef);
    }
  });

  private readonly metaTagsData = computed(() => {
    if (this.isFileLoading() || this.isFileCustomMetadataLoading() || this.isResourceContributorsLoading()) {
      return null;
    }
    const file = this.file();
    if (!file) return null;
    return {
      osfGuid: file.guid,
      title: this.fileCustomMetadata()?.title || file.name,
      type: this.fileCustomMetadata()?.resourceTypeGeneral,
      description:
        this.fileCustomMetadata()?.description ?? this.translateService.instant('files.metaTagDescriptionPlaceholder'),
      url: pathJoin(environment.webUrl, this.fileGuid),
      publishedDate: this.datePipe.transform(file.dateCreated, 'yyyy-MM-dd'),
      modifiedDate: this.datePipe.transform(file.dateModified, 'yyyy-MM-dd'),
      language: this.fileCustomMetadata()?.language,
      contributors: this.resourceContributors()?.map((contributor) => ({
        fullName: contributor.fullName,
        givenName: contributor.givenName,
        familyName: contributor.familyName,
      })),
    };
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
            const storageLink = this.file()?.links.upload || '';
            this.actions.getFileRevisions(storageLink);
            this.actions.getCedarTemplates();
            this.actions.getCedarRecords(fileId, ResourceType.File);
          }
        }
      });

    effect(() => {
      const records = this.cedarRecords();

      const baseTabs = [{ id: 'osf', label: 'OSF', type: MetadataResourceEnum.PROJECT }];

      const cedarTabs =
        records?.map((record) => ({
          id: record.id || '',
          label: record.embeds?.template?.data?.attributes?.schema_name || `Record ${record.id}`,
          type: MetadataResourceEnum.CEDAR,
        })) || [];

      this.tabs.set([...baseTabs, ...cedarTabs]);
    });

    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.actions.getFileMetadata(params['fileGuid']);
    });
    this.dataciteService.logIdentifiableView(this.fileMetadata$).subscribe();
  }

  downloadFile(link: string): void {
    this.dataciteService.logIdentifiableDownload(this.fileMetadata$).subscribe();
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
      const redirectUrl = `/${this.resourceId}/files`;
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

  handleEmailShare(): void {
    const link = `mailto:?subject=${this.file()?.name ?? ''}&body=${this.file()?.links?.html ?? ''}`;
    window.location.href = link;
  }

  handleXShare(): void {
    const link = `https://x.com/intent/tweet?url=${this.file()?.links?.html ?? ''}&text=${this.file()?.name ?? ''}&via=OSFramework`;
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  handleFacebookShare(): void {
    const link = `https://www.facebook.com/dialog/share?app_id=1022273774556662&display=popup&href=${this.file()?.links?.html ?? ''}&redirect_uri=${this.file()?.links?.html ?? ''}`;
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  handleCopyDynamicEmbed(): void {
    const data = embedDynamicJs.replace('ENCODED_URL', this.file()?.links?.render ?? '');
    this.copyToClipboard(data);
  }

  handleCopyStaticEmbed(): void {
    const data = embedStaticHtml.replace('ENCODED_URL', this.file()?.links?.render ?? '');
    this.copyToClipboard(data);
  }

  onMetadataTabChange(tabId: string | number): void {
    const tab = this.tabs().find((x) => x.id === tabId.toString());

    if (!tab) {
      return;
    }

    this.selectedMetadataTab.set(tab.id as MetadataResourceEnum);
    if (tab.type === 'cedar') {
      this.selectedCedarRecord.set(null);
      this.selectedCedarTemplate.set(null);
      if (tab.id) {
        this.loadCedarRecord(tab.id);
      }
    } else {
      this.selectedCedarRecord.set(null);
      this.selectedCedarTemplate.set(null);
    }
  }

  onCedarFormEdit(): void {
    this.cedarFormReadonly.set(false);
  }

  onCedarFormSubmit(data: CedarRecordDataBinding): void {
    const selectedRecord = this.selectedCedarRecord();
    if (!this.resourceId || !selectedRecord) return;
    if (selectedRecord.id) {
      this.actions
        .updateCedarRecord(data, selectedRecord.id, this.resourceId, ResourceType.File)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.cedarFormReadonly.set(true);
            this.toastService.showSuccess('files.detail.toast.cedarUpdated');
            const fileId = this.file()?.path.replaceAll('/', '') || '';
            this.actions.getCedarRecords(fileId, ResourceType.File);
          },
        });
    }
  }

  private loadCedarRecord(recordId: string): void {
    const records = this.cedarRecords();
    const templates = this.cedarTemplates();
    if (!records) {
      return;
    }
    const record = records.find((r) => r.id === recordId);
    if (!record) {
      return;
    }
    this.selectedCedarRecord.set(record);
    this.cedarFormReadonly.set(true);
    const templateId = record.relationships?.template?.data?.id;
    if (templateId && templates?.data) {
      const template = templates.data.find((t) => t.id === templateId);
      if (template) {
        this.selectedCedarTemplate.set(template);
      } else {
        this.selectedCedarTemplate.set(null);
        this.actions.getCedarTemplates();
      }
    } else {
      this.selectedCedarTemplate.set(null);
      this.actions.getCedarTemplates();
    }
  }
}
