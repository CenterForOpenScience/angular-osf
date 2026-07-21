import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tab, TabList, Tabs } from 'primeng/tabs';

import { switchMap } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  OnDestroy,
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
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { MetadataTabsComponent } from '@osf/shared/components/metadata-tabs/metadata-tabs.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { MetadataResourceEnum } from '@osf/shared/enums/metadata-resource.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { appendDownloadTrackingParams } from '@osf/shared/helpers/download-link.helper';
import { getMfrUrlWithVersion } from '@osf/shared/helpers/mfr-url.helper';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { FilesShareEmbedService } from '@osf/shared/services/files-share-embed.service';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { MetaTagsBuilderService } from '@osf/shared/services/meta-tags-builder.service';
import { SignpostingService } from '@osf/shared/services/signposting.service';
import { SocialShareService } from '@osf/shared/services/social-share.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';
import { MetadataTabsModel } from '@shared/models/metadata-tabs.model';

import { FileKeywordsComponent } from '../../components/file-keywords/file-keywords.component';
import { FileMetadataComponent } from '../../components/file-metadata/file-metadata.component';
import { FileResourceMetadataComponent } from '../../components/file-resource-metadata/file-resource-metadata.component';
import { FileRevisionsComponent } from '../../components/file-revisions/file-revisions.component';
import { FileDetailTab } from '../../enums/file-detail-tab.enum';
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
    MetadataTabsComponent,
  ],
  templateUrl: './file-detail.component.html',
  styleUrl: './file-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDetailComponent implements OnDestroy {
  @HostBinding('class') classes = 'flex flex-column flex-1 w-full h-full';

  readonly store = inject(Store);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly destroyRef = inject(DestroyRef);
  readonly sanitizer = inject(DomSanitizer);
  readonly toastService = inject(ToastService);
  readonly customConfirmationService = inject(CustomConfirmationService);

  private readonly metaTags = inject(MetaTagsService);
  private readonly metaTagsBuilder = inject(MetaTagsBuilderService);
  private readonly viewOnlyService = inject(ViewOnlyLinkHelperService);
  private readonly socialShareService = inject(SocialShareService);
  private readonly filesShareEmbedService = inject(FilesShareEmbedService);
  private readonly signpostingService = inject(SignpostingService);
  private readonly translateService = inject(TranslateService);
  private readonly dataciteService = inject(DataciteService);

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
  resourceContributors = select(FilesSelectors.getContributors);
  isResourceContributorsLoading = select(FilesSelectors.isResourceContributorsLoading);
  fileRevisions = select(FilesSelectors.getFileRevisions);
  isFileRevisionLoading = select(FilesSelectors.isFileRevisionsLoading);
  hasWriteAccess = select(FilesSelectors.hasWriteAccess);

  hasViewOnly = computed(() => this.viewOnlyService.hasViewOnlyParam(this.router));

  safeLink: SafeResourceUrl | null = null;
  resourceId = '';
  resourceType = '';

  isIframeLoading = true;

  readonly FileDetailTab = FileDetailTab;

  selectedTab = FileDetailTab.Details;

  fileGuid = '';
  fileVersion = signal('');

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
      label: 'common.labels.email',
      command: () => this.handleEmailShare(),
    },
    {
      label: 'common.socials.x',
      command: () => this.handleXShare(),
    },
    {
      label: 'common.socials.facebook',
      command: () => this.handleFacebookShare(),
    },
  ];

  tabs = signal<MetadataTabsModel[]>([]);

  selectedMetadataTab = signal('osf');

  selectedCedarRecord = signal<CedarMetadataRecordData | null>(null);
  selectedCedarTemplate = signal<CedarMetadataDataTemplateJsonApi | null>(null);
  cedarFormReadonly = signal<boolean>(true);

  canManageFileActions = computed(() => !this.isAnonymous() && !this.hasViewOnly() && this.hasWriteAccess());

  readonly headerTitle = computed(() => {
    const fileName = this.file()?.name ?? '';
    if (!this.fileVersion()) return fileName;
    return `${fileName} (${this.translateService.instant('project.wiki.version.title')} ${this.fileVersion()})`;
  });

  private readonly metaTagsData = computed(() => {
    if (this.isFileLoading() || this.isFileCustomMetadataLoading() || this.isResourceContributorsLoading()) {
      return null;
    }

    const file = this.file();

    if (!file) return null;

    return this.metaTagsBuilder.buildFileMetaTagsData({
      file,
      fileMetadata: this.fileCustomMetadata(),
      contributors: this.resourceContributors() ?? [],
    });
  });

  constructor() {
    this.initRouteSync();
    this.initTabsEffect();
    this.initMetaTagsEffect();
    this.initIdentifiableViewTracking();
  }

  ngOnDestroy(): void {
    if (this.fileGuid) {
      this.signpostingService.removeSignpostingLinkTags();
    }
  }

  getIframeLink(version: string) {
    const viewOnlyParam = this.hasViewOnly() ? this.viewOnlyService.getViewOnlyParam() : null;
    const url = getMfrUrlWithVersion(this.file()?.links.render, version, viewOnlyParam);

    if (url) {
      this.safeLink = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  onOpenRevision(version: string): void {
    if (this.fileVersion() !== version) {
      this.fileVersion.set(version);
      this.getIframeLink(version);
      this.isIframeLoading = true;
    }
  }

  downloadRevision(version: string) {
    this.dataciteService
      .logIdentifiableDownload(this.fileMetadata$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    const downloadUrl = this.file()?.links.download;
    const storageLink = this.file()?.links.upload || '';

    if (downloadUrl) {
      const link = appendDownloadTrackingParams(`${downloadUrl}/?revision=${version}`, 'file-detail');
      window.open(link)?.focus();
      this.actions.getFileRevisions(storageLink);
    }
  }

  downloadFile(): void {
    const link = this.file()?.links.download;

    if (!link) {
      return;
    }

    this.dataciteService
      .logIdentifiableDownload(this.fileMetadata$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    window.open(appendDownloadTrackingParams(link, 'file-detail'))?.focus();
  }

  deleteEntry(link: string): void {
    if (this.resourceId) {
      const redirectUrl = `/${this.resourceId}/files`;
      this.actions
        .deleteEntry(link)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.router.navigate([redirectUrl]));
    }
  }

  confirmDelete(): void {
    const file = this.file();

    if (!file) {
      return;
    }

    this.customConfirmationService.confirmDelete({
      headerKey: 'files.dialogs.deleteFile.title',
      messageParams: { name: file.name },
      messageKey: 'files.dialogs.deleteFile.message',
      onConfirm: () => this.deleteEntry(file.links.delete),
    });
  }

  onTabChange(event: string | number | undefined): void {
    const value = Number(event);

    if (!isNaN(value)) {
      this.selectedTab = value;
    }
  }

  handleEmailShare(): void {
    const link = this.socialShareService.getEmailLink(this.file()?.name ?? '', this.file()?.links?.html ?? '');
    window.location.href = link;
  }

  handleXShare(): void {
    const link = this.socialShareService.getXLink(this.file()?.name ?? '', this.file()?.links?.html ?? '');
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  handleFacebookShare(): void {
    const link = this.socialShareService.getFacebookCustomLink(this.file()?.links?.html ?? '');
    window.open(link, '_blank', 'noopener,noreferrer');
  }

  handleCopyDynamicEmbed(): void {
    this.filesShareEmbedService.copyEmbedToClipboard(this.file()?.links?.render ?? '', 'dynamic');
  }

  handleCopyStaticEmbed(): void {
    this.filesShareEmbedService.copyEmbedToClipboard(this.file()?.links?.render ?? '', 'static');
  }

  onMetadataTabChange(tabId: string | number): void {
    const tab = this.tabs().find((x) => x.id === tabId.toString());

    if (!tab) {
      return;
    }

    this.selectedMetadataTab.set(tab.id as MetadataResourceEnum);
    this.selectedCedarRecord.set(null);
    this.selectedCedarTemplate.set(null);

    if (tab.type === MetadataResourceEnum.CEDAR && tab.id) {
      this.loadCedarRecord(tab.id);
    }
  }

  toggleEditMode(): void {
    const editMode = this.cedarFormReadonly();
    this.cedarFormReadonly.set(!editMode);
  }

  onCedarFormSubmit(data: CedarRecordDataBinding): void {
    const selectedRecord = this.selectedCedarRecord();
    if (!this.resourceId || !selectedRecord?.id) return;

    this.actions
      .updateCedarRecord(data, selectedRecord.id, this.resourceId, ResourceType.File)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => {
          const cedarUrl = this.file()?.links.info;
          if (cedarUrl) {
            return this.actions.getCedarRecords(this.resourceId, ResourceType.File, cedarUrl);
          }
          return [];
        })
      )
      .subscribe(() => {
        this.cedarFormReadonly.set(true);
        this.updateSelectedCedarRecord(selectedRecord.id!);
        this.toastService.showSuccess('files.detail.toast.cedarUpdated');
      });
  }

  private updateSelectedCedarRecord(recordId: string): void {
    const records = this.cedarRecords();
    if (!records) return;

    const record = records.find((r) => r.id === recordId);
    if (record) {
      this.selectedCedarRecord.set(record);
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

  private initTabsEffect(): void {
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
  }

  private initMetaTagsEffect(): void {
    effect(() => {
      const metaTagsData = this.metaTagsData();

      if (metaTagsData) {
        this.metaTags.updateMetaTags(metaTagsData, this.destroyRef);
      }
    });
  }

  private initIdentifiableViewTracking(): void {
    this.dataciteService.logIdentifiableView(this.fileMetadata$).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  private initRouteSync(): void {
    this.route.params
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((params) => {
          const nextFileGuid = params['fileGuid'];
          this.syncFileGuid(nextFileGuid);
          this.actions.getFileMetadata(this.fileGuid);
          return this.actions.getFile(this.fileGuid);
        })
      )
      .subscribe(() => {
        this.handleFileLoaded();
      });
  }

  private syncFileGuid(nextFileGuid: string): void {
    if (this.fileGuid && this.fileGuid !== nextFileGuid) {
      this.signpostingService.removeSignpostingLinkTags();
    }

    this.fileGuid = nextFileGuid;
    this.signpostingService.addSignposting(this.fileGuid);
  }

  private handleFileLoaded(): void {
    this.getIframeLink('');
    const file = this.file();
    if (!file) return;

    this.resourceId = file.target?.id || '';
    this.resourceType = file.target?.type || '';
    if (!this.resourceId || !this.resourceType) return;

    this.actions.getFileResourceMetadata(this.resourceId, this.resourceType);
    this.actions.getFileResourceContributors(this.resourceId, this.resourceType);
    this.actions.getFileRevisions(file.links.upload || '');
    this.actions.getCedarTemplates();

    const cedarUrl = file.links.info;
    if (cedarUrl) {
      this.actions.getCedarRecords(this.resourceId, ResourceType.File, cedarUrl);
    }
  }
}
