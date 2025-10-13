import { TranslatePipe } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SENTRY_TOKEN } from '@core/provider/sentry.provider';
import {
  FilesTreeComponent,
  FormSelectComponent,
  LoadingSpinnerComponent,
  SearchInputComponent,
  SubHeaderComponent,
  ViewOnlyLinkMessageComponent,
} from '@osf/shared/components';
import { CustomConfirmationService, FilesService } from '@osf/shared/services';
import { CurrentResourceSelectors } from '@osf/shared/stores';
import { GoogleFilePickerComponent } from '@shared/components/google-file-picker/google-file-picker.component';

import { FilesSelectors } from '../../store';

import { FilesComponent } from './files.component';

import { getConfiguredAddonsMappedData } from '@testing/data/addons/addons.configured.data';
import { getNodeFilesMappedData } from '@testing/data/files/node.data';
import { testNode } from '@testing/mocks';
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
        OSFTestingModule,
        FilesComponent,
        Button,
        Dialog,
        FormSelectComponent,
        FormsModule,
        GoogleFilePickerComponent,
        LoadingSpinnerComponent,
        ReactiveFormsModule,
        SearchInputComponent,
        SubHeaderComponent,
        TableModule,
        TranslatePipe,
        ViewOnlyLinkMessageComponent,
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
