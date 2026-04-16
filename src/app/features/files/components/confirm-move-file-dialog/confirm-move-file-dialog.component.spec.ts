import { MockComponents, MockProvider } from 'ng-mocks';

import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSelectDestinationComponent } from '@osf/shared/components/file-select-destination/file-select-destination.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { FilesService } from '@osf/shared/services/files.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { CustomConfirmationServiceMock } from '@testing/providers/custom-confirmation-provider.mock';
import { provideDynamicDialogRefMock } from '@testing/providers/dynamic-dialog-ref.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock } from '@testing/providers/toast-provider.mock';

import { FilesSelectors } from '../../store';

import { ConfirmMoveFileDialogComponent } from './confirm-move-file-dialog.component';

describe('ConfirmConfirmMoveFileDialogComponent', () => {
  let component: ConfirmMoveFileDialogComponent;
  let fixture: ComponentFixture<ConfirmMoveFileDialogComponent>;

  beforeEach(() => {
    const dialogConfigMock = {
      data: { files: [], destination: { name: 'files' } },
    };

    TestBed.configureTestingModule({
      imports: [
        ConfirmMoveFileDialogComponent,
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
            { selector: FilesSelectors.getProvider, value: null },
          ],
        }),
      ],
    });

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
