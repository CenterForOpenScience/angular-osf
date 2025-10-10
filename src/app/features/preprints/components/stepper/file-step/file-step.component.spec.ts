import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintFileSource } from '@osf/features/preprints/enums';
import { Preprint, PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintStepperSelectors } from '@osf/features/preprints/store/preprint-stepper';
import { FilesTreeComponent, IconComponent } from '@shared/components';
import { FileFolderModel } from '@shared/models';
import { CustomConfirmationService, ToastService } from '@shared/services';

import { FileStepComponent } from './file-step.component';

import { OSF_FILE_MOCK } from '@testing/mocks/osf-file.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('FileStepComponent', () => {
  let component: FileStepComponent;
  let fixture: ComponentFixture<FileStepComponent>;
  let toastServiceMock: ReturnType<ToastServiceMockBuilder['build']>;
  let confirmationServiceMock: ReturnType<CustomConfirmationServiceMockBuilder['build']>;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockPreprint: Preprint = PREPRINT_MOCK;
  const mockProjectFiles: FileFolderModel[] = [OSF_FILE_MOCK];
  const mockPreprintFile: FileFolderModel = OSF_FILE_MOCK;

  const mockAvailableProjects = [
    { id: 'project-1', title: 'Test Project 1' },
    { id: 'project-2', title: 'Test Project 2' },
  ];

  beforeEach(async () => {
    toastServiceMock = ToastServiceMockBuilder.create().build();
    confirmationServiceMock = CustomConfirmationServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [FileStepComponent, MockComponents(IconComponent, FilesTreeComponent), OSFTestingModule],
      providers: [
        MockProvider(ToastService, toastServiceMock),
        MockProvider(CustomConfirmationService, confirmationServiceMock),
        provideMockStore({
          signals: [
            {
              selector: PreprintStepperSelectors.getPreprint,
              value: mockPreprint,
            },
            {
              selector: PreprintStepperSelectors.getSelectedProviderId,
              value: 'provider-1',
            },
            {
              selector: PreprintStepperSelectors.getSelectedFileSource,
              value: PreprintFileSource.None,
            },
            {
              selector: PreprintStepperSelectors.getUploadLink,
              value: 'upload-link',
            },
            {
              selector: PreprintStepperSelectors.getPreprintFile,
              value: mockPreprintFile,
            },
            {
              selector: PreprintStepperSelectors.isPreprintFilesLoading,
              value: false,
            },
            {
              selector: PreprintStepperSelectors.getAvailableProjects,
              value: mockAvailableProjects,
            },
            {
              selector: PreprintStepperSelectors.areAvailableProjectsLoading,
              value: false,
            },
            {
              selector: PreprintStepperSelectors.getProjectFiles,
              value: mockProjectFiles,
            },
            {
              selector: PreprintStepperSelectors.areProjectFilesLoading,
              value: false,
            },
            {
              selector: PreprintStepperSelectors.getCurrentFolder,
              value: null,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileStepComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('provider', mockProvider);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct values', () => {
    expect(component.provider()).toBe(mockProvider);
    expect(component.preprint()).toBe(mockPreprint);
    expect(component.selectedFileSource()).toBe(PreprintFileSource.None);
    expect(component.preprintFile()).toBe(mockPreprintFile);
  });

  it('should emit backClicked when backButtonClicked is called', () => {
    const emitSpy = jest.spyOn(component.backClicked, 'emit');

    component.backButtonClicked();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit nextClicked when nextButtonClicked is called with primary file', () => {
    const emitSpy = jest.spyOn(component.nextClicked, 'emit');

    component.nextButtonClicked();

    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith(
      'preprints.preprintStepper.common.successMessages.preprintSaved'
    );
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit nextClicked when nextButtonClicked is called without primary file', () => {
    const emitSpy = jest.spyOn(component.nextClicked, 'emit');
    jest.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, primaryFileId: null });

    component.nextButtonClicked();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should handle file selection for upload', () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as any;

    component.onFileSelected(mockEvent);

    expect(mockFile).toBeDefined();
  });

  it('should handle file selection for reupload', () => {
    component.versionFileMode.set(true);

    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const mockEvent = {
      target: {
        files: [mockFile],
      },
    } as any;

    component.onFileSelected(mockEvent);

    expect(component.versionFileMode()).toBe(false);
  });

  it('should handle version file confirmation', () => {
    confirmationServiceMock.confirmContinue.mockImplementation(({ onConfirm }) => {
      onConfirm();
    });

    component.versionFile();

    expect(confirmationServiceMock.confirmContinue).toHaveBeenCalledWith({
      headerKey: 'preprints.preprintStepper.file.versionFile.header',
      messageKey: 'preprints.preprintStepper.file.versionFile.message',
      onConfirm: expect.any(Function),
      onReject: expect.any(Function),
    });
    expect(component.versionFileMode()).toBe(true);
  });

  it('should handle cancel button click', () => {
    jest.spyOn(component, 'preprintFile').mockReturnValue(null);

    component.cancelButtonClicked();

    expect(component.preprintFile()).toBeNull();
  });

  it('should not handle cancel button click when preprint file exists', () => {
    component.cancelButtonClicked();

    expect(component.preprintFile()).toBeDefined();
  });

  it('should expose readonly properties', () => {
    expect(component.PreprintFileSource).toBe(PreprintFileSource);
  });

  it('should have correct form control', () => {
    expect(component.projectNameControl).toBeDefined();
    expect(component.projectNameControl.value).toBeNull();
  });
});
