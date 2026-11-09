import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { SelectChangeEvent } from 'primeng/select';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintFileSource, ReviewsState } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import {
  CopyFileFromProject,
  DeletePreprintFile,
  FetchAvailableProjects,
  FetchPreprintFilesLinks,
  FetchPreprintPrimaryFile,
  FetchProjectFilesByLink,
  PreprintStepperSelectors,
  SetPreprintStepperCurrentFolder,
  SetProjectRootFolder,
  SetSelectedPreprintFileSource,
  UploadFile,
} from '@osf/features/preprints/store/preprint-stepper';
import { FilesTreeComponent } from '@osf/shared/components/files-tree/files-tree.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { FileModelMock } from '@testing/mocks/file.model.mock';
import { OSF_FILE_MOCK } from '@testing/mocks/osf-file.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { provideOSFCore } from '@testing/osf.testing.provider';
import {
  CustomConfirmationServiceMock,
  CustomConfirmationServiceMockType,
} from '@testing/providers/custom-confirmation-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { FileStepComponent } from './file-step.component';

interface SetupOverrides extends BaseSetupOverrides {
  provider?: PreprintProviderDetails;
  detectChanges?: boolean;
}

describe('FileStepComponent', () => {
  let component: FileStepComponent;
  let fixture: ComponentFixture<FileStepComponent>;
  let store: Store;
  let toastServiceMock: ToastServiceMockType;
  let confirmationMock: CustomConfirmationServiceMockType;
  const originalPointerEvent = (globalThis as unknown as { PointerEvent?: typeof Event }).PointerEvent;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockPreprint = { ...PREPRINT_MOCK, reviewsState: ReviewsState.Initial };
  const mockPreprintFile = FileModelMock.simple({
    id: 'file-123',
    name: 'example.pdf',
    links: {
      info: '',
      move: 'move',
      upload: '',
      delete: '/v2/files/file-123/',
      download: '',
      render: '',
      html: '',
      self: '',
    },
  });
  const mockCurrentFolder: FileFolderModel = OSF_FILE_MOCK;
  const mockAvailableProjects = [
    { id: 'project-1', name: 'Test Project 1' },
    { id: 'project-2', name: 'Test Project 2' },
  ];

  const defaultSignals: SignalOverride[] = [
    { selector: PreprintStepperSelectors.getPreprint, value: mockPreprint },
    { selector: PreprintStepperSelectors.getSelectedFileSource, value: PreprintFileSource.None },
    { selector: PreprintStepperSelectors.getUploadLink, value: 'upload-link' },
    { selector: PreprintStepperSelectors.getPreprintFile, value: mockPreprintFile },
    { selector: PreprintStepperSelectors.isPreprintFilesLoading, value: false },
    { selector: PreprintStepperSelectors.getAvailableProjects, value: mockAvailableProjects },
    { selector: PreprintStepperSelectors.areAvailableProjectsLoading, value: false },
    { selector: PreprintStepperSelectors.getProjectFiles, value: [OSF_FILE_MOCK] },
    { selector: PreprintStepperSelectors.getFilesTotalCount, value: 1 },
    { selector: PreprintStepperSelectors.areProjectFilesLoading, value: false },
    { selector: PreprintStepperSelectors.getCurrentFolder, value: mockCurrentFolder },
    { selector: PreprintStepperSelectors.isCurrentFolderLoading, value: false },
  ];

  function setup(overrides: SetupOverrides = {}) {
    toastServiceMock = ToastServiceMock.simple();
    confirmationMock = CustomConfirmationServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [FileStepComponent, ...MockComponents(IconComponent, FilesTreeComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ToastService, toastServiceMock),
        MockProvider(CustomConfirmationService, confirmationMock),
        provideMockStore({ signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides) }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(FileStepComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('provider', overrides.provider ?? mockProvider);
    if (overrides.detectChanges ?? true) {
      fixture.detectChanges();
    }
  }

  beforeAll(() => {
    if (!(globalThis as unknown as { PointerEvent?: typeof Event }).PointerEvent) {
      (globalThis as unknown as { PointerEvent: typeof Event }).PointerEvent = MouseEvent as unknown as typeof Event;
    }
  });

  afterAll(() => {
    if (originalPointerEvent) {
      (globalThis as unknown as { PointerEvent: typeof Event }).PointerEvent = originalPointerEvent;
    } else {
      delete (globalThis as unknown as { PointerEvent?: typeof Event }).PointerEvent;
    }
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create and expose default computed state', () => {
    setup({ detectChanges: false });

    expect(component).toBeTruthy();
    expect(component.showDeleteButton()).toBe(false);
    expect(component.preprintHasPrimaryFile()).toBe(true);
    expect(component.canDeletePrimaryFile()).toBe(true);
    expect(component.isFileSourceSelected()).toBe(false);
    expect(component.cancelSourceOptionButtonVisible()).toBe(false);

    fixture.componentRef.setInput('showDeleteButton', true);
    expect(component.showDeleteButton()).toBe(true);
  });

  it('should disallow delete for non-initial and non-rejected review states', () => {
    setup({
      selectorOverrides: [
        {
          selector: PreprintStepperSelectors.getPreprint,
          value: { ...mockPreprint, reviewsState: ReviewsState.Pending },
        },
      ],
      detectChanges: false,
    });

    expect(component.canDeletePrimaryFile()).toBe(false);
  });

  it('should allow delete for rejected review state', () => {
    setup({
      selectorOverrides: [
        {
          selector: PreprintStepperSelectors.getPreprint,
          value: { ...mockPreprint, reviewsState: ReviewsState.Rejected },
        },
      ],
      detectChanges: false,
    });

    expect(component.canDeletePrimaryFile()).toBe(true);
  });

  it('should show cancel source button when source selected and file missing', () => {
    setup({
      selectorOverrides: [
        { selector: PreprintStepperSelectors.getPreprintFile, value: null },
        { selector: PreprintStepperSelectors.getSelectedFileSource, value: PreprintFileSource.Computer },
      ],
      detectChanges: false,
    });

    expect(component.cancelSourceOptionButtonVisible()).toBe(true);
  });

  it('should dispatch fetch links and skip primary file when file is already loaded', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintFilesLinks());
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchPreprintPrimaryFile));
  });

  it('should dispatch fetch links and primary file when primary file id exists without loaded file', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprintFile, value: null }],
    });

    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintFilesLinks());
    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintPrimaryFile());
  });

  it('should dispatch fetch links only when primary file id is missing', () => {
    setup({
      selectorOverrides: [
        { selector: PreprintStepperSelectors.getPreprint, value: { ...mockPreprint, primaryFileId: null } },
      ],
    });

    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintFilesLinks());
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchPreprintPrimaryFile));
  });

  it('should skip init fetches when preprint is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprint, value: null }],
    });

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchPreprintFilesLinks));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchPreprintPrimaryFile));
  });

  it('should dispatch available projects from debounced project search', () => {
    vi.useFakeTimers();
    setup();
    (store.dispatch as Mock).mockClear();

    component.projectNameControl.setValue('project-search');
    vi.advanceTimersByTime(500);

    expect(store.dispatch).toHaveBeenCalledWith(new FetchAvailableProjects('project-search'));
  });

  it('should skip available projects dispatch when value equals selectedProjectId', () => {
    vi.useFakeTimers();
    setup();
    (store.dispatch as Mock).mockClear();
    component.selectedProjectId.set('project-1');

    component.projectNameControl.setValue('project-1');
    vi.advanceTimersByTime(500);

    expect(store.dispatch).not.toHaveBeenCalledWith(new FetchAvailableProjects('project-1'));
  });

  it('should select file source and fetch projects only for project source', () => {
    setup({ detectChanges: false });

    component.selectFileSource(PreprintFileSource.Project);
    expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedPreprintFileSource(PreprintFileSource.Project));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchAvailableProjects(null));

    (store.dispatch as Mock).mockClear();
    component.selectFileSource(PreprintFileSource.Computer);

    expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedPreprintFileSource(PreprintFileSource.Computer));
    expect(store.dispatch).not.toHaveBeenCalledWith(new FetchAvailableProjects(null));
  });

  it('should emit back and delete outputs', () => {
    setup({ detectChanges: false });
    const backSpy = vi.spyOn(component.backClicked, 'emit');
    const deleteSpy = vi.spyOn(component.deleteClicked, 'emit');

    component.backButtonClicked();
    component.deletePreprint();

    expect(backSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('should emit next and show success when file and primary file id exist', () => {
    setup({ detectChanges: false });
    const emitSpy = vi.spyOn(component.nextClicked, 'emit');

    component.nextButtonClicked();

    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith(
      'preprints.preprintStepper.common.successMessages.preprintSaved'
    );
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should block next when file requirements are missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprintFile, value: null }],
      detectChanges: false,
    });
    const emitSpy = vi.spyOn(component.nextClicked, 'emit');

    component.nextButtonClicked();

    expect(toastServiceMock.showSuccess).not.toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should upload selected file', () => {
    setup({ detectChanges: false });
    const file = new File(['content'], 'upload.pdf');
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file] });

    component.onFileSelected({ target: input } as unknown as Event);

    expect(store.dispatch).toHaveBeenCalledWith(new UploadFile(file));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchPreprintPrimaryFile));
  });

  it('should skip upload when no file is selected', () => {
    setup({ detectChanges: false });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [] });

    component.onFileSelected({ target: input } as unknown as Event);

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UploadFile));
  });

  it('should select project and load files when folder link exists', () => {
    setup({ detectChanges: false });

    component.selectProject({
      value: 'project-1',
      originalEvent: new PointerEvent('click'),
    } as SelectChangeEvent);

    expect(component.selectedProjectId()).toBe('project-1');
    expect(store.dispatch).toHaveBeenCalledWith(new SetProjectRootFolder('project-1'));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchProjectFilesByLink(mockCurrentFolder.links.filesLink, 1));
  });

  it('should select project without loading files when folder link is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getCurrentFolder, value: null }],
      detectChanges: false,
    });

    component.selectProject({
      value: 'project-1',
      originalEvent: new PointerEvent('click'),
    } as SelectChangeEvent);

    expect(store.dispatch).toHaveBeenCalledWith(new SetProjectRootFolder('project-1'));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchProjectFilesByLink));
  });

  it('should ignore project selection when original event is not a pointer event', () => {
    setup({ detectChanges: false });

    component.selectProject({
      value: 'project-1',
      originalEvent: new Event('change'),
    } as SelectChangeEvent);

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SetProjectRootFolder));
  });

  it('should copy project file', () => {
    setup({ detectChanges: false });
    const projectFile = FileModelMock.simple({ id: 'project-file-1' });

    component.selectProjectFile(projectFile);

    expect(store.dispatch).toHaveBeenCalledWith(new CopyFileFromProject(projectFile));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchPreprintPrimaryFile));
  });

  it('should confirm delete preprint file and clear project selection on confirm', () => {
    setup({ detectChanges: false });
    component.selectedProjectId.set('project-1');
    component.projectNameControl.setValue('project-1', { emitEvent: false });

    component.deletePreprintFile();

    expect(confirmationMock.confirmDelete).toHaveBeenCalledWith({
      headerKey: 'files.dialogs.deleteFile.title',
      messageParams: { name: mockPreprintFile.name },
      messageKey: 'files.dialogs.deleteFile.message',
      onConfirm: expect.any(Function),
    });

    const { onConfirm } = confirmationMock.confirmDelete.mock.calls[0][0];
    onConfirm();

    expect(store.dispatch).toHaveBeenCalledWith(new DeletePreprintFile(mockPreprintFile.links.delete));
    expect(component.selectedProjectId()).toBeNull();
    expect(component.projectNameControl.value).toBeNull();
    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith('files.dialogs.deleteFile.success');
  });

  it('should skip delete preprint file when file is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprintFile, value: null }],
      detectChanges: false,
    });

    component.deletePreprintFile();

    expect(confirmationMock.confirmDelete).not.toHaveBeenCalled();
  });

  it('should skip delete preprint file when review state does not allow delete', () => {
    setup({
      selectorOverrides: [
        {
          selector: PreprintStepperSelectors.getPreprint,
          value: { ...mockPreprint, reviewsState: ReviewsState.Pending },
        },
      ],
      detectChanges: false,
    });

    component.deletePreprintFile();

    expect(confirmationMock.confirmDelete).not.toHaveBeenCalled();
  });

  it('should reset file source and project selection on cancel when file is missing', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprintFile, value: null }],
      detectChanges: false,
    });
    component.selectedProjectId.set('project-1');
    component.projectNameControl.setValue('project-1', { emitEvent: false });
    (store.dispatch as Mock).mockClear();

    component.cancelButtonClicked();

    expect(component.selectedProjectId()).toBeNull();
    expect(component.projectNameControl.value).toBeNull();
    expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedPreprintFileSource(PreprintFileSource.None));
  });

  it('should keep file source on cancel when file is present', () => {
    setup({ detectChanges: false });

    component.cancelButtonClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(new SetSelectedPreprintFileSource(PreprintFileSource.None));
  });

  it('should set current folder only when folder id changes', () => {
    setup({ detectChanges: false });

    component.setCurrentFolder(mockCurrentFolder);
    expect(store.dispatch).not.toHaveBeenCalledWith(new SetPreprintStepperCurrentFolder(mockCurrentFolder));

    const nextFolder = { ...mockCurrentFolder, id: 'folder-2' } as FileFolderModel;
    component.setCurrentFolder(nextFolder);

    expect(store.dispatch).toHaveBeenCalledWith(new SetPreprintStepperCurrentFolder(nextFolder));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchProjectFilesByLink(nextFolder.links.filesLink, 1));
  });

  it('should dispatch files load in onLoadFiles', () => {
    setup({ detectChanges: false });

    component.onLoadFiles({ link: '/v2/nodes/node-456/files/', page: 3 });

    expect(store.dispatch).toHaveBeenCalledWith(new FetchProjectFilesByLink('/v2/nodes/node-456/files/', 3));
  });
});
