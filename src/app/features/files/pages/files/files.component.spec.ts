import { MockComponents, MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SENTRY_TOKEN } from '@core/provider/sentry.provider';
import { FileUploadDialogComponent } from '@osf/shared/components/file-upload-dialog/file-upload-dialog.component';
import { FilesTreeComponent } from '@osf/shared/components/files-tree/files-tree.component';
import { FormSelectComponent } from '@osf/shared/components/form-select/form-select.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { FilesService } from '@osf/shared/services/files.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';
import { GoogleFilePickerComponent } from '@shared/components/google-file-picker/google-file-picker.component';

import { FilesSelectionActionsComponent } from '../../components';
import { FilesSelectors } from '../../store';

import { FilesComponent } from './files.component';

import { getConfiguredAddonsMappedData } from '@testing/data/addons/addons.configured.data';
import { getNodeFilesMappedData } from '@testing/data/files/node.data';
import { testNode } from '@testing/mocks/base-node.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { MockComponentWithSignal } from '@testing/providers/component-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('Component: Files', () => {
  let component: FilesComponent;
  let fixture: ComponentFixture<FilesComponent>;
  const currentFolderSignal = signal(getNodeFilesMappedData(0));

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [
        FilesComponent,
        OSFTestingModule,
        ...MockComponents(
          FileUploadDialogComponent,
          FormSelectComponent,
          GoogleFilePickerComponent,
          LoadingSpinnerComponent,
          SearchInputComponent,
          SubHeaderComponent,
          ViewOnlyLinkMessageComponent,
          GoogleFilePickerComponent,
          FilesSelectionActionsComponent
        ),
      ],
      providers: [
        FilesService,
        MockProvider(ActivatedRoute),
        MockProvider(CustomConfirmationService),
        DialogService,
        {
          provide: SENTRY_TOKEN,
          useValue: {
            captureException: jest.fn(),
            captureMessage: jest.fn(),
            setUser: jest.fn(),
          },
        },
        provideMockStore({
          signals: [
            {
              selector: CurrentResourceSelectors.getResourceDetails,
              value: testNode,
            },
            {
              selector: FilesSelectors.getRootFolders,
              value: getNodeFilesMappedData(),
            },
            {
              selector: FilesSelectors.getCurrentFolder,
              value: currentFolderSignal(),
            },
            {
              selector: FilesSelectors.getConfiguredStorageAddons,
              value: getConfiguredAddonsMappedData(),
            },
            {
              selector: FilesSelectors.getProvider,
              value: 'osfstorage',
            },
            {
              selector: FilesSelectors.getStorageSupportedFeatures,
              value: {
                osfstorage: ['AddUpdateFiles', 'DownloadAsZip', 'DeleteFiles', 'CopyInto'],
                googledrive: ['AddUpdateFiles', 'DownloadAsZip', 'DeleteFiles', 'CopyInto'],
              },
            },
          ],
        }),
      ],
    })
      .overrideComponent(FilesComponent, {
        remove: {
          imports: [FilesTreeComponent],
        },
        add: {
          imports: [
            MockComponentWithSignal('osf-files-tree', [
              'files',
              'currentFolder',
              'isLoading',
              'viewOnly',
              'resourceId',
              'provider',
              'storage',
              'totalCount',
              'allowedMenuActions',
              'supportUpload',
              'selectedFiles',
              'scrollHeight',
            ]),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('CurrentRootFolder effect', () => {
    it('should handle the initial effects', () => {
      expect(component.currentRootFolder()?.folder.name).toBe('osfstorage');
      expect(component.isGoogleDrive()).toBeFalsy();
      expect(component.accountId()).toBeFalsy();
      expect(component.selectedRootFolder()).toEqual(Object({}));
    });

    it('should handle changing the folder to googledrive', () => {
      component.currentRootFolder.set(
        Object({
          label: 'label',
          folder: Object({
            name: 'Google Drive',
            provider: 'googledrive',
          }),
        })
      );

      fixture.detectChanges();

      expect(component.currentRootFolder()?.folder.name).toBe('Google Drive');
      expect(component.isGoogleDrive()).toBeTruthy();
      expect(component.accountId()).toBe('62ed6dd7-f7b7-4003-b7b4-855789c1f991');
      expect(component.selectedRootFolder()).toEqual(
        Object({
          itemId: '0AIl0aR4C9JAFUk9PVA',
        })
      );
    });
  });

  describe('updateFilesList', () => {
    it('should call updateFilesList without errors when filesLink exists', () => {
      expect(() => component.updateFilesList()).not.toThrow();
    });

    it('should not throw when filesLink is null', () => {
      const mockFolder: any = {
        id: 'folder-123',
        kind: 'folder',
        name: 'Test Folder',
        node: 'node-456',
        path: '/test',
        provider: 'osfstorage',
        links: {
          newFolder: '/test/new',
          storageAddons: '/addons',
          upload: '/upload',
          filesLink: '',
          download: '/download',
        },
      };
      currentFolderSignal.set(mockFolder);

      expect(() => component.updateFilesList()).not.toThrow();
    });
  });
});
