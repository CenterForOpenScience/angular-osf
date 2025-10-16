import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomConfirmationService, FilesService, ToastService } from '@osf/shared/services';
import { CurrentResourceSelectors } from '@shared/stores';

import { FilesSelectors } from '../../store';

import { MoveFileDialogComponent } from './move-file-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMock } from '@testing/providers/custom-confirmation-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

describe('MoveFileDialogComponent', () => {
  let component: MoveFileDialogComponent;
  let fixture: ComponentFixture<MoveFileDialogComponent>;

  const mockFilesService = {
    moveFiles: jest.fn(),
    getMoveDialogFiles: jest.fn(),
  };

  beforeEach(async () => {
    const dialogRefMock = {
      close: jest.fn(),
    };

    const dialogConfigMock = {
      data: { files: [], currentFolder: null },
    };

    await TestBed.configureTestingModule({
      imports: [MoveFileDialogComponent, OSFTestingModule, MockPipe(TranslatePipe)],
      providers: [
        { provide: DynamicDialogRef, useValue: dialogRefMock },
        { provide: DynamicDialogConfig, useValue: dialogConfigMock },
        { provide: FilesService, useValue: mockFilesService },
        { provide: ToastService, useValue: ToastServiceMock.simple() },
        { provide: CustomConfirmationService, useValue: CustomConfirmationServiceMock.simple() },
        provideMockStore({
          signals: [
            { selector: FilesSelectors.getMoveDialogFiles, value: signal([]) },
            { selector: FilesSelectors.getMoveDialogFilesTotalCount, value: signal(0) },
            { selector: FilesSelectors.isMoveDialogFilesLoading, value: signal(false) },
            { selector: FilesSelectors.getMoveDialogCurrentFolder, value: signal(null) },
            { selector: CurrentResourceSelectors.getCurrentResource, value: signal(null) },
            { selector: CurrentResourceSelectors.getResourceWithChildren, value: signal([]) },
            { selector: CurrentResourceSelectors.isResourceWithChildrenLoading, value: signal(false) },
            { selector: FilesSelectors.isMoveDialogConfiguredStorageAddonsLoading, value: signal(false) },
          ],
        }),
      ],
    }).compileComponents();

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
