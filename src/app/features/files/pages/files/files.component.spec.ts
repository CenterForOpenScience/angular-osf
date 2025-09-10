import { Store } from '@ngxs/store';

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

import {
  FilesTreeComponent,
  FormSelectComponent,
  LoadingSpinnerComponent,
  SearchInputComponent,
  SubHeaderComponent,
  ViewOnlyLinkMessageComponent,
} from '@osf/shared/components';
import { GoogleFilePickerComponent } from '@osf/shared/components/addons/folder-selector/google-file-picker/google-file-picker.component';
import { OsfFile } from '@osf/shared/models';
import { CustomConfirmationService, FilesService } from '@osf/shared/services';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { FilesSelectors } from '../../store';

import { FilesComponent } from './files.component';

import { getConfiguredAddonsMappedData } from '@testing/data/addons/addons.configured.data';
import { getNodeFilesMappedData } from '@testing/data/files/node.data';
import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { MockComponentWithSignal } from '@testing/providers/component-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('Component: Files', () => {
  let component: FilesComponent;
  let fixture: ComponentFixture<FilesComponent>;
  const currentFolderSignal = signal(getNodeFilesMappedData(0));

  let dataciteService: jest.Mocked<DataciteService>;

  beforeEach(async () => {
    jest.clearAllMocks();
    window.open = jest.fn();
    dataciteService = DataciteMockFactory();
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
        { provide: DataciteService, useValue: dataciteService },
        DialogService,
        provideMockStore({
          signals: [
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
              'actions',
              'viewOnly',
              'viewOnlyDownloadable',
              'resourceId',
              'provider',
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
    it('should handle the updateFilesList with a filesLink', () => {
      let results!: string;
      const store = TestBed.inject(Store);
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      dispatchSpy.mockClear();
      jest.spyOn(component.filesTreeActions, 'setFilesIsLoading');
      component.updateFilesList().subscribe({
        next: (result) => {
          results = result as any;
        },
      });

      expect(results).toBeTruthy();

      expect(component.filesTreeActions.setFilesIsLoading).toHaveBeenCalledWith(true);
      expect(dispatchSpy).toHaveBeenCalledWith({
        filesLink: 'https://api.staging4.osf.io/v2/nodes/xgrm4/files/osfstorage/',
      });
    });

    it('should handle the updateFilesList without a filesLink', () => {
      let results!: string;
      const currentFolder = currentFolderSignal() as OsfFile;
      currentFolder.relationships.filesLink = '';
      currentFolderSignal.set(currentFolder);
      const store = TestBed.inject(Store);
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      dispatchSpy.mockClear();
      jest.spyOn(component.filesTreeActions, 'setFilesIsLoading');
      component.updateFilesList().subscribe({
        next: (result) => {
          results = result as any;
        },
      });

      expect(results).toBeUndefined();

      expect(component.filesTreeActions.setFilesIsLoading).not.toHaveBeenCalled();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Download file', () => {
    it('', () => {
      component.resourceId.set('123');
      component.downloadFolder();
      expect(dataciteService.logFileDownload).toHaveBeenCalledWith('123', 'nodes');
    });
  });
});
