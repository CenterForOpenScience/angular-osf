import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSelectDestinationComponent } from '@osf/shared/components/file-select-destination/file-select-destination.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { FilesService } from '@osf/shared/services/files.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { CurrentResourceSelectors } from '@shared/stores/current-resource';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomConfirmationServiceMock } from '@testing/providers/custom-confirmation-provider.mock';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

import { FilesSelectors } from '../../store';

import { MoveFileDialogComponent } from './move-file-dialog.component';

describe('MoveFileDialogComponent', () => {
  let component: MoveFileDialogComponent;
  let fixture: ComponentFixture<MoveFileDialogComponent>;

  beforeEach(() => {
    const dialogConfigMock = {
      data: { files: [], currentFolder: null },
    };

    TestBed.configureTestingModule({
      imports: [
        MoveFileDialogComponent,
        ...MockComponents(IconComponent, LoadingSpinnerComponent, FileSelectDestinationComponent),
      ],
      providers: [
        provideOSFCore(),
        provideDynamicDialogRefMock(),
        MockProvider(DynamicDialogConfig, dialogConfigMock),
        MockProvider(FilesService),
        MockProvider(ToastService, ToastServiceMock.simple()),
        MockProvider(CustomConfirmationService, CustomConfirmationServiceMock.simple()),
        provideMockStore({
          signals: [
            { selector: FilesSelectors.getMoveDialogFiles, value: [] },
            { selector: FilesSelectors.getMoveDialogFilesTotalCount, value: 0 },
            { selector: FilesSelectors.isMoveDialogFilesLoading, value: false },
            { selector: FilesSelectors.getMoveDialogCurrentFolder, value: null },
            { selector: CurrentResourceSelectors.getCurrentResource, value: null },
            { selector: CurrentResourceSelectors.getResourceWithChildren, value: [] },
            { selector: CurrentResourceSelectors.isResourceWithChildrenLoading, value: false },
            { selector: FilesSelectors.isMoveDialogConfiguredStorageAddonsLoading, value: false },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(MoveFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct properties', () => {
    expect(component.config).toBeDefined();
    expect(component.dialogRef).toBeDefined();
    expect(component.files).toBeDefined();
    expect(component.isLoading).toBeDefined();
    expect(component.currentFolder).toBeDefined();
  });

  it('should get files from store', () => {
    expect(component.files()).toEqual([]);
  });

  it('should get loading state from store', () => {
    expect(component.isLoading()).toBe(false);
  });

  it('should get current folder from store', () => {
    expect(component.currentFolder()).toBeNull();
  });

  it('should have isFilesUpdating signal', () => {
    expect(component.isFilesUpdating()).toBe(false);
  });

  it('should have all required selectors defined', () => {
    expect(component.filesTotalCount).toBeDefined();
    expect(component.currentProject).toBeDefined();
    expect(component.components).toBeDefined();
    expect(component.areComponentsLoading).toBeDefined();
    expect(component.isConfiguredStorageAddonsLoading).toBeDefined();
  });
});
