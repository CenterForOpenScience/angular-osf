import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe } from 'ng-mocks';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSelectDestinationComponent } from '@osf/shared/components/file-select-destination/file-select-destination.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { FilesService } from '@osf/shared/services/files.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { FilesSelectors } from '../../store';

import { ConfirmMoveFileDialogComponent } from './confirm-move-file-dialog.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMock } from '@testing/providers/custom-confirmation-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

describe('ConfirmConfirmMoveFileDialogComponent', () => {
  let component: ConfirmMoveFileDialogComponent;
  let fixture: ComponentFixture<ConfirmMoveFileDialogComponent>;

  const mockFilesService = {
    moveFiles: jest.fn(),
    getMoveDialogFiles: jest.fn(),
  };

  beforeEach(async () => {
    const dialogRefMock = {
      close: jest.fn(),
    };

    const dialogConfigMock = {
      data: { files: [], destination: { name: 'files' } },
    };

    await TestBed.configureTestingModule({
      imports: [
        ConfirmMoveFileDialogComponent,
        OSFTestingModule,
        ...MockComponents(IconComponent, LoadingSpinnerComponent, FileSelectDestinationComponent),
        MockPipe(TranslatePipe),
      ],
      providers: [
        { provide: DynamicDialogRef, useValue: dialogRefMock },
        { provide: DynamicDialogConfig, useValue: dialogConfigMock },
        { provide: FilesService, useValue: mockFilesService },
        { provide: ToastService, useValue: ToastServiceMock.simple() },
        { provide: CustomConfirmationService, useValue: CustomConfirmationServiceMock.simple() },
        provideMockStore({
          signals: [
            { selector: FilesSelectors.getMoveDialogFiles, value: [] },
            { selector: FilesSelectors.getProvider, value: null },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmMoveFileDialogComponent);
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
  });

  it('should get files from store', () => {
    expect(component.files()).toEqual([]);
  });
});
