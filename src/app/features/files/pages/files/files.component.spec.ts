import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { FileProvider } from '@osf/features/files/constants';
import { FilesSelectors, GetFiles } from '@osf/features/files/store';
import { FileUploadDialogComponent } from '@osf/shared/components/file-upload-dialog/file-upload-dialog.component';
import { FilesTreeComponent } from '@osf/shared/components/files-tree/files-tree.component';
import { FormSelectComponent } from '@osf/shared/components/form-select/form-select.component';
import { GoogleFilePickerComponent } from '@osf/shared/components/google-file-picker/google-file-picker.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { SupportedFeature } from '@osf/shared/enums/addon-supported-features.enum';
import { FileKind } from '@osf/shared/enums/file-kind.enum';
import { FileMenuType } from '@osf/shared/enums/file-menu-type.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { ConfiguredAddonModel } from '@osf/shared/models/addons/configured-addon.model';
import { CurrentResource } from '@osf/shared/models/current-resource.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { FileLabelModel } from '@osf/shared/models/files/file-label.model';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { FilesService } from '@osf/shared/services/files.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';
import { CustomDialogService } from '@shared/services/custom-dialog.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMock, CustomDialogServiceMockType } from '@testing/providers/custom-dialog-provider.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideRouterMock, RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';
import { ViewOnlyLinkHelperMock, ViewOnlyLinkHelperMockType } from '@testing/providers/view-only-link-helper.mock';

import { FilesSelectionActionsComponent } from '../../components';

import { FilesComponent } from './files.component';

interface SetupOverrides extends BaseSetupOverrides {
  fileProvider?: string;
  hasViewOnlyParam?: boolean;
}

describe('FilesComponent', () => {
  let component: FilesComponent;
  let fixture: ComponentFixture<FilesComponent>;
  let store: Store;
  let routerMock: RouterMockType & { serializeUrl: Mock };
  let customDialogServiceMock: CustomDialogServiceMockType;
  let customConfirmationServiceMock: CustomConfirmationServiceMockType;
  let toastService: ToastServiceMockType;
  let viewOnlyLinkHelperMock: ViewOnlyLinkHelperMockType;

  const currentFolder: FileFolderModel = {
    id: 'folder-1',
    kind: FileKind.Folder,
    name: 'Root folder',
    node: 'node-1',
    path: '/',
    provider: FileProvider.OsfStorage,
    links: {
      newFolder: '/new-folder',
      storageAddons: '/storage-addons',
      upload: '/upload',
      filesLink: '/files-link',
      download: '/download-link',
    },
  };

  const rootFolders: FileFolderModel[] = [currentFolder];

  const configuredAddons: ConfiguredAddonModel[] = [
    {
      id: 'addon-osfstorage',
      type: 'addons',
      externalServiceName: FileProvider.OsfStorage,
      displayName: 'OSF Storage',
      connectedCapabilities: [],
      connectedOperationNames: [],
      currentUserIsOwner: true,
      selectedStorageItemId: '',
      baseAccountId: '',
      baseAccountType: '',
      iconUrl: '',
      authUrl: '',
      credentialsAvailable: true,
    },
    {
      id: 'addon-gdrive',
      type: 'addons',
      externalServiceName: FileProvider.GoogleDrive,
      displayName: 'Google Drive',
      connectedCapabilities: [],
      connectedOperationNames: [],
      currentUserIsOwner: true,
      selectedStorageItemId: 'google-item',
      baseAccountId: 'base-google',
      baseAccountType: 'users',
      iconUrl: '',
      authUrl: '',
      credentialsAvailable: true,
    },
  ];

  const defaultSignals: SignalOverride[] = [
    { selector: FilesSelectors.getFiles, value: [] },
    { selector: FilesSelectors.getFilesTotalCount, value: 0 },
    { selector: FilesSelectors.isFilesLoading, value: false },
    { selector: FilesSelectors.getCurrentFolder, value: currentFolder },
    { selector: FilesSelectors.getProvider, value: FileProvider.OsfStorage },
    {
      selector: CurrentResourceSelectors.getResourceDetails,
      value: {
        id: 'node-1',
        type: 'nodes',
        title: 'Node',
        description: '',
        category: 'project',
        dateCreated: '',
        dateModified: '',
        isRegistration: false,
        isPreprint: false,
        isFork: false,
        isCollection: false,
        isPublic: true,
        tags: [],
        accessRequestsEnabled: false,
        nodeLicense: { copyrightHolders: null, year: null },
        currentUserPermissions: [UserPermissions.Admin],
        currentUserIsContributor: true,
        wikiEnabled: true,
      },
    },
    {
      selector: CurrentResourceSelectors.getCurrentResource,
      value: { id: 'node-1', type: 'nodes', permissions: [UserPermissions.Admin] } as CurrentResource,
    },
    { selector: FilesSelectors.getRootFolders, value: rootFolders },
    { selector: FilesSelectors.isRootFoldersLoading, value: false },
    { selector: FilesSelectors.getConfiguredStorageAddons, value: configuredAddons },
    { selector: FilesSelectors.isConfiguredStorageAddonsLoading, value: false },
    {
      selector: FilesSelectors.getStorageSupportedFeatures,
      value: {
        [FileProvider.OsfStorage]: [
          SupportedFeature.DownloadAsZip,
          SupportedFeature.AddUpdateFiles,
          SupportedFeature.DeleteFiles,
          SupportedFeature.CopyInto,
        ],
      },
    },
  ];

  function setup(overrides: SetupOverrides = {}) {
    const routerBuilder = RouterMockBuilder.create().withUrl('/abc');
    routerMock = {
      ...routerBuilder.build(),
      serializeUrl: vi.fn().mockReturnValue('/guid-url'),
    };
    (routerMock.createUrlTree as Mock).mockReturnValue('/guid-url');
    customDialogServiceMock = CustomDialogServiceMock.simple();
    customConfirmationServiceMock = CustomConfirmationServiceMock.simple();
    toastService = ToastServiceMock.simple();
    viewOnlyLinkHelperMock = ViewOnlyLinkHelperMock.simple(overrides.hasViewOnlyParam ?? false);
    viewOnlyLinkHelperMock.getViewOnlyParamFromUrl.mockReturnValue('view-only-token');

    const resourceRouteMock = ActivatedRouteMockBuilder.create().withParams({ id: 'node-1' }).build();
    const dataRouteMock = ActivatedRouteMockBuilder.create()
      .withData({ resourceType: ResourceType.Project })
      .withParentRoute(resourceRouteMock)
      .build();
    const activatedRouteMock = ActivatedRouteMockBuilder.create()
      .withParams({ fileProvider: overrides.fileProvider ?? FileProvider.OsfStorage })
      .withParentRoute(dataRouteMock)
      .build();

    TestBed.configureTestingModule({
      imports: [
        FilesComponent,
        ...MockComponents(
          FilesTreeComponent,
          FormSelectComponent,
          GoogleFilePickerComponent,
          LoadingSpinnerComponent,
          SearchInputComponent,
          SubHeaderComponent,
          FileUploadDialogComponent,
          ViewOnlyLinkMessageComponent,
          GoogleFilePickerComponent,
          FilesSelectionActionsComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, activatedRouteMock),
        provideRouterMock(routerMock),
        MockProvider(FilesService, {
          uploadFile: vi.fn().mockReturnValue(of({})),
          getFolderDownloadLink: vi.fn().mockReturnValue('https://download.link'),
        }),
        MockProvider(CustomDialogService, customDialogServiceMock),
        MockProvider(CustomConfirmationService, customConfirmationServiceMock),
        MockProvider(ToastService, toastService),
        MockProvider(ViewOnlyLinkHelperService, viewOnlyLinkHelperMock),
        MockProvider(ENVIRONMENT, { webUrl: 'http://localhost:4200', apiDomainUrl: 'http://localhost:8000' }),
        provideMockStore({ signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides) }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(FilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();

    expect(component).toBeTruthy();
  });

  it('should compute canEdit based on current user permissions', () => {
    setup();
    expect(component.canEdit()).toBe(true);
  });

  it('should return false for canEdit without admin/write permissions', () => {
    setup({
      selectorOverrides: [
        {
          selector: CurrentResourceSelectors.getResourceDetails,
          value: {
            id: 'node-1',
            type: 'nodes',
            title: 'Node',
            description: '',
            category: 'project',
            dateCreated: '',
            dateModified: '',
            isRegistration: false,
            isPreprint: false,
            isFork: false,
            isCollection: false,
            isPublic: true,
            tags: [],
            accessRequestsEnabled: false,
            nodeLicense: { copyrightHolders: null, year: null },
            currentUserPermissions: [UserPermissions.Read],
            currentUserIsContributor: true,
            wikiEnabled: true,
          },
        },
      ],
    });
    expect(component.canEdit()).toBe(false);
  });

  it('should expose read-only menu actions when view-only mode is enabled', () => {
    setup({ hasViewOnlyParam: true });

    const actions = component.allowedMenuActions();

    expect(actions[FileMenuType.Download]).toBe(true);
    expect(actions[FileMenuType.Embed]).toBe(true);
    expect(actions[FileMenuType.Share]).toBe(true);
    expect(actions[FileMenuType.Rename]).toBe(false);
    expect(actions[FileMenuType.Delete]).toBe(false);
    expect(actions[FileMenuType.Move]).toBe(false);
    expect(actions[FileMenuType.Copy]).toBe(false);
  });

  it('should map root folder options from folders and configured addons', () => {
    setup();

    const options = component.rootFoldersOptions();

    expect(options.length).toBe(1);
    expect(options[0].folder.id).toBe('folder-1');
  });

  it('should return addon display name for non-osf provider in getAddonName', () => {
    setup();

    const name = component.getAddonName(configuredAddons, FileProvider.GoogleDrive);

    expect(name).toBe('Google Drive');
  });

  it('should show warning and skip upload when selected file exceeds size limit', () => {
    setup();
    const uploadSpy = vi.spyOn(component, 'uploadFiles');
    const oversizedFile = new File([new ArrayBuffer(1)], 'large.txt');
    Object.defineProperty(oversizedFile, 'size', { value: 5 * 1024 * 1024 * 1024 });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [oversizedFile] });

    component.onFileSelected({ target: input } as unknown as Event);

    expect(toastService.showWarn).toHaveBeenCalledWith('shared.files.limitText');
    expect(uploadSpy).not.toHaveBeenCalled();
  });

  it('should pass selected files to uploadFiles when files are valid', () => {
    setup();
    const uploadSpy = vi.spyOn(component, 'uploadFiles').mockImplementation(() => {});
    const validFile = new File(['body'], 'small.txt');
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [validFile] });

    component.onFileSelected({ target: input } as unknown as Event);

    expect(uploadSpy).toHaveBeenCalledWith([validFile]);
  });

  it('should dispatch GetFiles from updateFilesList when current folder has files link', () => {
    setup();
    (store.dispatch as Mock).mockClear();

    component.updateFilesList();

    expect(store.dispatch).toHaveBeenCalledWith(new GetFiles('/files-link', 1));
  });

  it('should navigate with provider on root folder change', () => {
    setup();
    const selectedFolder: FileLabelModel = { label: 'OSF Storage', folder: currentFolder };

    component.handleRootFolderChange(selectedFolder);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/node-1/files', FileProvider.OsfStorage], {
      queryParamsHandling: 'preserve',
    });
  });
});
