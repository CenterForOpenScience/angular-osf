import { TranslatePipe } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';

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
import { CustomConfirmationService, FilesService } from '@osf/shared/services';

import { FilesSelectors } from '../../store';

import { FilesComponent } from './files.component';

import { getConfiguredAddonsMappedData } from '@testing/data/addons/addons.configured.data';
import { getNodeFilesMappedData } from '@testing/data/files/node.data';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('Component: Files', () => {
  let component: FilesComponent;
  let fixture: ComponentFixture<FilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OSFTestingModule,
        FilesComponent,
        Button,
        Dialog,
        FilesTreeComponent,
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
        provideMockStore({
          signals: [
            {
              selector: FilesSelectors.getRootFolders,
              value: getNodeFilesMappedData(),
            },
            {
              selector: FilesSelectors.getFiles,
              value: [],
            },
            {
              selector: FilesSelectors.getConfiguredStorageAddons,
              value: getConfiguredAddonsMappedData(),
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

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
