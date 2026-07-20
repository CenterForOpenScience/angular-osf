import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';

import { FileProvider } from '@osf/features/files/constants';
import {
  FilesSelectors,
  GetConfiguredStorageAddons,
  GetFiles,
  GetRootFolders,
  SetFilesCurrentFolder,
} from '@osf/features/files/store';
import { SupportedFeature } from '@osf/shared/enums/addon-supported-features.enum';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { FilePageLinkModel } from '@osf/shared/models/files/file-page-link.model';
import { NodeShortInfoModel } from '@osf/shared/models/nodes/node-with-children.model';
import { SelectOption } from '@osf/shared/models/select-option.model';
import { FileDownloadService } from '@osf/shared/services/file-download.service';
import { FilesService } from '@osf/shared/services/files.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { MOCK_CONFIGURED_ADDON } from '@testing/mocks/configured-addon.mock';
import { FileModelMock } from '@testing/mocks/file.model.mock';
import { OSF_FILE_MOCK } from '@testing/mocks/osf-file.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { FileDownloadServiceMock, FileDownloadServiceMockType } from '@testing/providers/file-download-service.mock';
import { FilesServiceMock, FilesServiceMockType } from '@testing/providers/files-service.mock';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ViewOnlyLinkHelperMock, ViewOnlyLinkHelperMockType } from '@testing/providers/view-only-link-helper.mock';

import { FilesWidgetComponent } from './files-widget.component';

interface SetupOverrides extends BaseSetupOverrides {
  rootOption?: SelectOption;
  components?: NodeShortInfoModel[];
  areComponentsLoading?: boolean;
  hasViewOnly?: boolean;
}

describe('FilesWidgetComponent', () => {
  let component: FilesWidgetComponent;
  let fixture: ComponentFixture<FilesWidgetComponent>;
  let store: Store;
  let routerMock: RouterMockType;
  let filesService: FilesServiceMockType;
  let fileDownloadService: FileDownloadServiceMockType;
  let viewOnlyHelper: ViewOnlyLinkHelperMockType;

  const rootFolder: FileFolderModel = {
    ...OSF_FILE_MOCK,
    id: 'root-1',
    name: 'OSF Storage',
    provider: FileProvider.OsfStorage,
    links: { ...OSF_FILE_MOCK.links, filesLink: '/files-link' },
  };

  const rootOption: SelectOption = { label: 'Root', value: 'project-1' };
  const components: NodeShortInfoModel[] = [
    { id: 'project-1', title: 'Project 1', isPublic: true, permissions: [] },
    { id: 'component-1', title: 'Component 1', isPublic: true, permissions: [], parentId: 'project-1' },
  ];

  function setup(overrides: SetupOverrides = {}) {
    routerMock = RouterMockBuilder.create()
      .withUrl('/abc?view_only=token')
      .withCreateUrlTree(vi.fn().mockReturnValue({} as UrlTree))
      .withSerializeUrl(vi.fn().mockReturnValue('/serialized'))
      .build();
    filesService = FilesServiceMock.simple();
    fileDownloadService = FileDownloadServiceMock.simple();
    viewOnlyHelper = ViewOnlyLinkHelperMock.simple(overrides.hasViewOnly ?? false);
    viewOnlyHelper.getViewOnlyParamFromUrl.mockReturnValue('token');

    const defaultSignals: SignalOverride[] = [
      { selector: FilesSelectors.getFiles, value: [] },
      { selector: FilesSelectors.getFilesTotalCount, value: 0 },
      { selector: FilesSelectors.isFilesLoading, value: false },
      { selector: FilesSelectors.getCurrentFolder, value: rootFolder },
      { selector: FilesSelectors.getRootFolders, value: [rootFolder] },
      { selector: FilesSelectors.isRootFoldersLoading, value: false },
      {
        selector: FilesSelectors.getConfiguredStorageAddons,
        value: [{ ...MOCK_CONFIGURED_ADDON, id: 'addon-1', externalServiceName: FileProvider.OsfStorage }],
      },
      { selector: FilesSelectors.isConfiguredStorageAddonsLoading, value: false },
      {
        selector: FilesSelectors.getStorageSupportedFeatures,
        value: { [FileProvider.OsfStorage]: [SupportedFeature.AddUpdateFiles] },
      },
    ];

    TestBed.configureTestingModule({
      imports: [FilesWidgetComponent],
      providers: [
        provideOSFCore(),
        MockProvider(Router, routerMock),
        MockProvider(FilesService, filesService),
        MockProvider(FileDownloadService, fileDownloadService),
        MockProvider(ViewOnlyLinkHelperService, viewOnlyHelper),
        provideMockStore({ signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides) }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(FilesWidgetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('rootOption', overrides.rootOption ?? rootOption);
    fixture.componentRef.setInput('components', overrides.components ?? components);
    fixture.componentRef.setInput('areComponentsLoading', overrides.areComponentsLoading ?? false);
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should load storage addons and files on init', () => {
    setup();
    const calls = (store.dispatch as Mock).mock.calls.map((c) => c[0]);

    expect(calls).toContainEqual(new GetRootFolders('project-1', ResourceType.Project));
    expect(calls).toContainEqual(new GetConfiguredStorageAddons('project-1'));
    expect(calls).toContainEqual(new SetFilesCurrentFolder(rootFolder));
    expect(calls).toContainEqual(new GetFiles('/files-link', 1));
  });

  it('should build options with root option and filtered component options', () => {
    setup();
    const values = component.options().map((o) => o.value);

    expect(values[0]).toBe('project-1');
    expect(values).toContain('component-1');
  });

  it('should reload storage addons on project change', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.onChangeProject('project-2');

    expect(store.dispatch).toHaveBeenCalledWith(new GetRootFolders('project-2', ResourceType.Project));
    expect(store.dispatch).toHaveBeenCalledWith(new GetConfiguredStorageAddons('project-2'));
  });

  it('should set current root folder on storage change', () => {
    setup();

    component.onStorageChange('root-1');

    expect(component.currentRootFolder()?.folder.id).toBe('root-1');
  });

  it('should dispatch getFiles from onLoadFiles', () => {
    setup();
    (store.dispatch as Mock).mockClear();
    const event: FilePageLinkModel = { link: '/next-page', page: 3 };

    component.onLoadFiles(event);

    expect(store.dispatch).toHaveBeenCalledWith(new GetFiles('/next-page', 3));
  });

  it('should dispatch set current folder', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.setCurrentFolder(rootFolder);

    expect(store.dispatch).toHaveBeenCalledWith(new SetFilesCurrentFolder(rootFolder));
  });

  it('should disable download button when folder has no files', () => {
    setup();

    expect(component.isButtonDisabled()).toBe(true);
  });

  it('should enable download button when folder has files', () => {
    setup({
      selectorOverrides: [{ selector: FilesSelectors.getFilesTotalCount, value: 2 }],
    });

    expect(component.isButtonDisabled()).toBe(false);
  });

  it('should download current folder as zip', () => {
    setup({
      selectorOverrides: [{ selector: FilesSelectors.getFilesTotalCount, value: 1 }],
    });

    component.downloadFolder();

    expect(fileDownloadService.downloadFolderAsZip).toHaveBeenCalledWith({
      resourceId: 'project-1',
      resourceType: CurrentResourceType.Projects,
      downloadLink: '/v2/files/file-123/download/',
    });
  });

  it('should open file directly when guid exists', () => {
    setup();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const file = FileModelMock.simple({ guid: 'guid-1' });

    component.navigateToFile(file);

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/', 'guid-1'], undefined);
    expect(openSpy).toHaveBeenCalledWith('/serialized', '_blank');
    expect(filesService.getFileGuid).not.toHaveBeenCalled();
  });

  it('should resolve guid then open file when guid is missing', () => {
    setup();
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    filesService.getFileGuid.mockReturnValue(of(FileModelMock.simple({ guid: 'resolved-guid' })));
    const file = FileModelMock.simple({ id: 'file-1', guid: null });

    component.navigateToFile(file);

    expect(filesService.getFileGuid).toHaveBeenCalledWith('file-1');
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/', 'resolved-guid'], undefined);
    expect(openSpy).toHaveBeenCalledWith('/serialized', '_blank');
  });

  it('should include view_only query param when hasViewOnly is true', () => {
    setup({ hasViewOnly: true });
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const file = FileModelMock.simple({ guid: 'guid-1' });

    component.navigateToFile(file);

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/', 'guid-1'], {
      queryParams: { view_only: 'token' },
    });
    expect(openSpy).toHaveBeenCalledWith('/serialized', '_blank');
  });
});
