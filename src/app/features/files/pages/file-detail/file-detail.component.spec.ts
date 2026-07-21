import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import {
  CedarMetadataDataTemplateJsonApi,
  CedarMetadataRecordData,
  CedarRecordDataBinding,
  CedarTemplate,
} from '@osf/features/metadata/models';
import { GetCedarMetadataRecords, MetadataSelectors, UpdateCedarMetadataRecord } from '@osf/features/metadata/store';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { MetadataTabsComponent } from '@osf/shared/components/metadata-tabs/metadata-tabs.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { FilesShareEmbedService } from '@osf/shared/services/files-share-embed.service';
import { SignpostingService } from '@osf/shared/services/signposting.service';
import { SocialShareService } from '@osf/shared/services/social-share.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { FileDetailsMock } from '@testing/mocks/file-details.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { DataciteServiceMock, DataciteServiceMockType } from '@testing/providers/datacite.service.mock';
import {
  FilesShareEmbedServiceMock,
  FilesShareEmbedServiceMockType,
} from '@testing/providers/files-share-embed-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { SignpostingServiceMock, SignpostingServiceMockType } from '@testing/providers/signposting-provider.mock';
import { SocialShareServiceMock, SocialShareServiceMockType } from '@testing/providers/social-share-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';
import { ViewOnlyLinkHelperMock, ViewOnlyLinkHelperMockType } from '@testing/providers/view-only-link-helper.mock';

import { FileKeywordsComponent } from '../../components/file-keywords/file-keywords.component';
import { FileMetadataComponent } from '../../components/file-metadata/file-metadata.component';
import { FileResourceMetadataComponent } from '../../components/file-resource-metadata/file-resource-metadata.component';
import { FileRevisionsComponent } from '../../components/file-revisions/file-revisions.component';
import { FileDetailTab } from '../../enums/file-detail-tab.enum';
import { DeleteEntry, FilesSelectors, GetFileRevisions } from '../../store';

import { FileDetailComponent } from './file-detail.component';

describe('FileDetailComponent', () => {
  let fixture: ComponentFixture<FileDetailComponent>;
  let component: FileDetailComponent;
  let store: Store;
  let dataciteService: DataciteServiceMockType;
  let customConfirmationService: CustomConfirmationServiceMockType;
  let routerMock: RouterMockType;
  let socialShareService: SocialShareServiceMockType;
  let filesShareEmbedService: FilesShareEmbedServiceMockType;
  let signpostingService: SignpostingServiceMockType;
  let viewOnlyHelper: ViewOnlyLinkHelperMockType;
  let toastService: ToastServiceMockType;

  const file = FileDetailsMock.simple({
    guid: 'file-1',
    links: {
      info: 'https://osf.test/info',
      move: 'https://osf.test/move',
      upload: 'https://osf.test/upload',
      delete: 'https://osf.test/delete',
      download: 'https://osf.test/download',
      render: 'https://osf.test/render',
      html: 'https://osf.test/html',
      self: 'https://osf.test/self',
    },
    target: { id: 'node-1', type: ResourceType.Project } as never,
  });

  interface SetupOverrides extends BaseSetupOverrides {
    routeParams?: Record<string, string>;
    viewOnly?: boolean;
  }

  function setup(overrides: SetupOverrides = {}) {
    dataciteService = DataciteServiceMock.simple();
    customConfirmationService = CustomConfirmationServiceMock.simple();
    socialShareService = SocialShareServiceMock.simple();
    filesShareEmbedService = FilesShareEmbedServiceMock.simple();
    signpostingService = SignpostingServiceMock.simple();
    viewOnlyHelper = ViewOnlyLinkHelperMock.simple(overrides.viewOnly ?? false);
    toastService = ToastServiceMock.simple();
    routerMock = RouterMockBuilder.create().withUrl('/node-1/files/osf/file-1').build();
    const routeMock = ActivatedRouteMockBuilder.create()
      .withParams(overrides.routeParams ?? { providerId: 'osf', fileGuid: 'file-1' })
      .build();

    const defaultSignals: SignalOverride[] = [
      { selector: FilesSelectors.getOpenedFile, value: file },
      { selector: FilesSelectors.getResourceMetadata, value: null },
      { selector: FilesSelectors.isOpenedFileLoading, value: false },
      { selector: MetadataSelectors.getCedarRecords, value: [] },
      { selector: MetadataSelectors.getCedarTemplates, value: null },
      { selector: FilesSelectors.isFilesAnonymous, value: false },
      { selector: FilesSelectors.getFileCustomMetadata, value: null },
      { selector: FilesSelectors.isFileMetadataLoading, value: false },
      { selector: FilesSelectors.getContributors, value: [] },
      { selector: FilesSelectors.isResourceContributorsLoading, value: false },
      { selector: FilesSelectors.getFileRevisions, value: null },
      { selector: FilesSelectors.isFileRevisionsLoading, value: false },
      { selector: FilesSelectors.hasWriteAccess, value: true },
    ];

    TestBed.configureTestingModule({
      imports: [
        FileDetailComponent,
        ...MockComponents(
          SubHeaderComponent,
          LoadingSpinnerComponent,
          FileKeywordsComponent,
          FileRevisionsComponent,
          FileMetadataComponent,
          FileResourceMetadataComponent,
          MetadataTabsComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, routeMock),
        MockProvider(DataciteService, dataciteService),
        MockProvider(Router, routerMock),
        MockProvider(ToastService, toastService),
        MockProvider(SocialShareService, socialShareService),
        MockProvider(FilesShareEmbedService, filesShareEmbedService),
        MockProvider(SignpostingService, signpostingService),
        MockProvider(ViewOnlyLinkHelperService, viewOnlyHelper),
        MockProvider(CustomConfirmationService, customConfirmationService),
        provideMockStore({ signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides) }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(FileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should log identifiable view on init', () => {
    setup();
    expect(dataciteService.logIdentifiableView).toHaveBeenCalledWith(component.fileMetadata$);
  });

  it('should call datacite and open revision download url', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    const openSpy = vi.spyOn(window, 'open').mockReturnValue({ focus: vi.fn() } as unknown as Window);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    component.downloadRevision('3');

    expect(dataciteService.logIdentifiableDownload).toHaveBeenCalledWith(component.fileMetadata$);
    expect(openSpy).toHaveBeenCalledWith(
      `https://osf.test/download/?revision=3&source=file-detail&tz=${encodeURIComponent(timeZone)}`
    );
    expect(store.dispatch).toHaveBeenCalledWith(new GetFileRevisions('https://osf.test/upload'));
  });

  it('should confirm delete with file info', () => {
    setup();

    component.confirmDelete();

    expect(customConfirmationService.confirmDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        headerKey: 'files.dialogs.deleteFile.title',
        messageKey: 'files.dialogs.deleteFile.message',
        messageParams: { name: file.name },
      })
    );
  });

  it('should delete entry and navigate to files page', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.resourceId = 'node-1';
    component.deleteEntry('/delete');

    expect(store.dispatch).toHaveBeenCalledWith(new DeleteEntry('/delete'));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/node-1/files']);
  });

  it('should update selected tab when tab value is numeric', () => {
    setup();

    component.onTabChange('2');

    expect(component.selectedTab).toBe(2);
  });

  it('should keep selected tab unchanged for non numeric value', () => {
    setup();
    component.selectedTab = FileDetailTab.Details;

    component.onTabChange('not-a-number');

    expect(component.selectedTab).toBe(FileDetailTab.Details);
  });

  it('should log download and open file link when downloading current file', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    const openSpy = vi.spyOn(window, 'open').mockReturnValue({ focus: vi.fn() } as unknown as Window);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    component.downloadFile();

    expect(dataciteService.logIdentifiableDownload).toHaveBeenCalledWith(component.fileMetadata$);
    expect(openSpy).toHaveBeenCalledWith(
      `https://osf.test/download?source=file-detail&tz=${encodeURIComponent(timeZone)}`
    );
    openSpy.mockRestore();
  });

  it('should skip download when file has no download link', () => {
    const fileWithoutDownload = {
      ...file,
      links: { ...file.links, download: '' },
    };
    setup({
      selectorOverrides: [{ selector: FilesSelectors.getOpenedFile, value: fileWithoutDownload }],
    });
    const openSpy = vi.spyOn(window, 'open');

    component.downloadFile();

    expect(dataciteService.logIdentifiableDownload).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it('should skip delete confirmation when file is missing', () => {
    setup({
      selectorOverrides: [{ selector: FilesSelectors.getOpenedFile, value: null }],
    });

    component.confirmDelete();

    expect(customConfirmationService.confirmDelete).not.toHaveBeenCalled();
  });

  it('should skip delete dispatch when resource id is missing', async () => {
    setup();
    await fixture.whenStable();
    (store.dispatch as Mock).mockClear();
    component.resourceId = '';

    component.deleteEntry('https://osf.test/delete');

    expect(store.dispatch).not.toHaveBeenCalledWith(new DeleteEntry('https://osf.test/delete'));
  });

  it('should set iframe revision state when opening a new revision', () => {
    setup();

    component.onOpenRevision('4');

    expect(component.fileVersion()).toBe('4');
    expect(component.isIframeLoading).toBe(true);
    expect(component.safeLink).not.toBeNull();
  });

  it('should derive header title from opened file name', () => {
    setup();

    expect(component.headerTitle()).toBe('file-name.pdf');
  });

  it('should disable file actions for anonymous users', () => {
    setup({
      selectorOverrides: [{ selector: FilesSelectors.isFilesAnonymous, value: true }],
    });

    expect(component.canManageFileActions()).toBe(false);
  });

  it('should disable file actions for view-only sessions', () => {
    setup({ viewOnly: true });

    expect(component.canManageFileActions()).toBe(false);
  });

  it('should request email share link from social service', () => {
    setup();

    component.handleEmailShare();

    expect(socialShareService.getEmailLink).toHaveBeenCalledWith(file.name, file.links.html);
  });

  it('should open x and facebook share links from social service', () => {
    setup();
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);

    component.handleXShare();
    component.handleFacebookShare();

    expect(socialShareService.getXLink).toHaveBeenCalledWith(file.name, file.links.html);
    expect(socialShareService.getFacebookCustomLink).toHaveBeenCalledWith(file.links.html);
    expect(openSpy).toHaveBeenCalledTimes(2);
    openSpy.mockRestore();
  });

  it('should copy embed html through files share embed service', () => {
    setup();

    component.handleCopyDynamicEmbed();
    component.handleCopyStaticEmbed();

    expect(filesShareEmbedService.copyEmbedToClipboard).toHaveBeenCalledWith('https://osf.test/render', 'dynamic');
    expect(filesShareEmbedService.copyEmbedToClipboard).toHaveBeenCalledWith('https://osf.test/render', 'static');
  });

  it('should toggle cedar form readonly flag', () => {
    setup();

    expect(component.cedarFormReadonly()).toBe(true);
    component.toggleEditMode();
    expect(component.cedarFormReadonly()).toBe(false);
    component.toggleEditMode();
    expect(component.cedarFormReadonly()).toBe(true);
  });

  it('should ignore unknown metadata tab ids', () => {
    setup();

    component.onMetadataTabChange('unknown-tab');

    expect(component.selectedCedarRecord()).toBeNull();
  });

  it('should select cedar record when metadata tab matches cedar record id', () => {
    const cedarRecord = {
      id: 'rec-1',
      attributes: {
        metadata: {},
        is_published: false,
      },
      relationships: {
        template: { data: { type: 'cedar-metadata-templates', id: 'tpl-1' } },
        target: { data: { type: 'files', id: 'file-1' } },
      },
    } as CedarMetadataRecordData;
    const cedarTemplate = {
      id: 'tpl-1',
      type: 'cedar-metadata-templates',
      attributes: {
        schema_name: 'Schema A',
        cedar_id: 'cedar',
        template: {} as CedarTemplate,
      },
    } as CedarMetadataDataTemplateJsonApi;
    setup({
      selectorOverrides: [
        { selector: MetadataSelectors.getCedarRecords, value: [cedarRecord] },
        { selector: MetadataSelectors.getCedarTemplates, value: { data: [cedarTemplate] } },
      ],
    });

    component.onMetadataTabChange('rec-1');

    expect(component.selectedCedarRecord()?.id).toBe('rec-1');
    expect(component.selectedCedarTemplate()?.id).toBe('tpl-1');
  });

  it('should dispatch cedar update and refresh records on cedar form submit', async () => {
    const cedarRecord = {
      id: 'rec-1',
      attributes: {
        metadata: {},
        is_published: false,
      },
      relationships: {
        template: { data: { type: 'cedar-metadata-templates', id: 'tpl-1' } },
        target: { data: { type: 'files', id: 'file-1' } },
      },
    } as CedarMetadataRecordData;
    const cedarTemplate = {
      id: 'tpl-1',
      type: 'cedar-metadata-templates',
      attributes: {
        schema_name: 'Schema A',
        cedar_id: 'cedar',
        template: {} as CedarTemplate,
      },
    } as CedarMetadataDataTemplateJsonApi;
    setup({
      selectorOverrides: [
        { selector: MetadataSelectors.getCedarRecords, value: [cedarRecord] },
        { selector: MetadataSelectors.getCedarTemplates, value: { data: [cedarTemplate] } },
      ],
    });
    component.onMetadataTabChange('rec-1');
    await fixture.whenStable();
    (store.dispatch as Mock).mockClear();

    const payload = { id: 'bind-1', isPublished: false, data: {} } as CedarRecordDataBinding;
    component.onCedarFormSubmit(payload);

    await fixture.whenStable();

    expect(store.dispatch).toHaveBeenCalledWith(
      new UpdateCedarMetadataRecord(payload, 'rec-1', 'node-1', ResourceType.File)
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      new GetCedarMetadataRecords('node-1', ResourceType.File, 'https://osf.test/info')
    );
    expect(toastService.showSuccess).toHaveBeenCalledWith('files.detail.toast.cedarUpdated');
    expect(component.cedarFormReadonly()).toBe(true);
  });

  it('should register signposting on load and remove on destroy', () => {
    setup();

    expect(signpostingService.addSignposting).toHaveBeenCalledWith('file-1');

    component.ngOnDestroy();

    expect(signpostingService.removeSignpostingLinkTags).toHaveBeenCalled();
  });
});
