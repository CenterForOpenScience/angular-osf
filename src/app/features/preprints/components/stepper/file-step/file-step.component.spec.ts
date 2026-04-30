import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { SelectChangeEvent } from 'primeng/select';

import { Mock } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintFileSource } from '@osf/features/preprints/enums';
import { PreprintModel, PreprintProviderDetails } from '@osf/features/preprints/models';
import {
  CopyFileFromProject,
  FetchAvailableProjects,
  FetchPreprintFilesLinks,
  FetchPreprintPrimaryFile,
  FetchProjectFilesByLink,
  PreprintStepperSelectors,
  ReuploadFile,
  SetPreprintStepperCurrentFolder,
  SetProjectRootFolder,
  SetSelectedPreprintFileSource,
  UploadFile,
} from '@osf/features/preprints/store/preprint-stepper';
import { FilesTreeComponent } from '@osf/shared/components/files-tree/files-tree.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { FileModel } from '@osf/shared/models/files/file.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { ToastService } from '@osf/shared/services/toast.service';

import { OSF_FILE_MOCK } from '@testing/mocks/osf-file.mock';
import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

import { FileStepComponent } from './file-step.component';

describe('FileStepComponent', () => {
  let component: FileStepComponent;
  let fixture: ComponentFixture<FileStepComponent>;
  let store: Store;
  let toastServiceMock: ToastServiceMockType;
  const originalPointerEvent = (globalThis as unknown as { PointerEvent?: typeof Event }).PointerEvent;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockPreprint: PreprintModel = PREPRINT_MOCK;
  const mockProjectFiles: FileFolderModel[] = [OSF_FILE_MOCK];
  const mockPreprintFile: FileFolderModel = OSF_FILE_MOCK;
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
    { selector: PreprintStepperSelectors.getProjectFiles, value: mockProjectFiles },
    { selector: PreprintStepperSelectors.getFilesTotalCount, value: 1 },
    { selector: PreprintStepperSelectors.areProjectFilesLoading, value: false },
    { selector: PreprintStepperSelectors.getCurrentFolder, value: mockCurrentFolder },
    { selector: PreprintStepperSelectors.isCurrentFolderLoading, value: false },
  ];

  function setup(overrides?: {
    selectorOverrides?: SignalOverride[];
    provider?: PreprintProviderDetails;
    detectChanges?: boolean;
  }) {
    const signals = mergeSignalOverrides(defaultSignals, overrides?.selectorOverrides);
    toastServiceMock = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [FileStepComponent, ...MockComponents(IconComponent, FilesTreeComponent)],
      providers: [provideOSFCore(), MockProvider(ToastService, toastServiceMock), provideMockStore({ signals })],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(FileStepComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('provider', overrides?.provider ?? mockProvider);
    if (overrides?.detectChanges ?? true) {
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

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should compute state values', () => {
    setup({ detectChanges: false });
    expect(component.preprintHasPrimaryFile()).toBe(true);
    expect(component.isFileSourceSelected()).toBe(false);
    expect(component.canProceedToNext()).toBe(true);
    expect(component.cancelSourceOptionButtonVisible()).toBe(false);
  });

  it('should dispatch fetch links and primary file fetch in ngOnInit', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getPreprintFile, value: null }],
      detectChanges: false,
    });

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintFilesLinks());
    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintPrimaryFile());
  });

  it('should not dispatch primary file fetch in ngOnInit without primary file id', () => {
    setup({
      selectorOverrides: [
        { selector: PreprintStepperSelectors.getPreprint, value: { ...mockPreprint, primaryFileId: null } },
      ],
      detectChanges: false,
    });

    component.ngOnInit();

    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintFilesLinks());
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchPreprintPrimaryFile));
  });

  it('should dispatch available projects from debounced projectNameControl value', () => {
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

  it('should handle selectFileSource for project and computer source', () => {
    setup({ detectChanges: false });

    component.selectFileSource(PreprintFileSource.Project);
    expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedPreprintFileSource(PreprintFileSource.Project));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchAvailableProjects(null));

    (store.dispatch as Mock).mockClear();
    component.selectFileSource(PreprintFileSource.Computer);

    expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedPreprintFileSource(PreprintFileSource.Computer));
    expect(store.dispatch).not.toHaveBeenCalledWith(new FetchAvailableProjects(null));
  });

  it('should emit backClicked', () => {
    setup({ detectChanges: false });
    const emitSpy = vi.spyOn(component.backClicked, 'emit');

    component.backButtonClicked();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit deleteClicked when deletePreprint is called', () => {
    setup({ detectChanges: false });
    const emitSpy = vi.spyOn(component.deleteClicked, 'emit');

    component.deletePreprint();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should handle nextButtonClicked for allowed and blocked states', () => {
    setup({ detectChanges: false });
    const emitSpy = vi.spyOn(component.nextClicked, 'emit');

    component.nextButtonClicked();

    expect(toastServiceMock.showSuccess).toHaveBeenCalledWith(
      'preprints.preprintStepper.common.successMessages.preprintSaved'
    );
    expect(emitSpy).toHaveBeenCalledTimes(1);

    component.versionFileMode.set(true);
    toastServiceMock.showSuccess.mockClear();

    component.nextButtonClicked();

    expect(toastServiceMock.showSuccess).not.toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledTimes(1);

    vi.spyOn(component, 'preprint').mockReturnValue({ ...mockPreprint, primaryFileId: null } as PreprintModel);
    component.versionFileMode.set(false);

    component.nextButtonClicked();

    expect(toastServiceMock.showSuccess).not.toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it('should skip file upload dispatches when no file is selected', () => {
    setup({ detectChanges: false });

    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [] });
    component.onFileSelected({ target: input } as unknown as Event);

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(UploadFile));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(ReuploadFile));
  });

  it('should handle upload and reupload flows in onFileSelected', () => {
    setup({ detectChanges: false });
    const file = new File(['file-body'], 'test.txt');
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file] });

    component.onFileSelected({ target: input } as unknown as Event);
    expect(store.dispatch).toHaveBeenCalledWith(new UploadFile(file));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintPrimaryFile());

    (store.dispatch as Mock).mockClear();
    component.versionFileMode.set(true);

    component.onFileSelected({ target: input } as unknown as Event);

    expect(store.dispatch).toHaveBeenCalledWith(new ReuploadFile(file));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintPrimaryFile());
    expect(component.versionFileMode()).toBe(false);
  });

  it('should handle selectProject with and without current folder files link', () => {
    setup({ detectChanges: false });

    component.selectProject({
      value: 'project-1',
      originalEvent: new PointerEvent('click'),
    } as SelectChangeEvent);

    expect(store.dispatch).toHaveBeenCalledWith(new SetProjectRootFolder('project-1'));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchProjectFilesByLink(mockCurrentFolder.links.filesLink, 1));
    expect(component.selectedProjectId()).toBe('project-1');

    vi.spyOn(component, 'currentFolder').mockReturnValue(null);
    (store.dispatch as Mock).mockClear();

    component.selectProject({
      value: 'project-1',
      originalEvent: new PointerEvent('click'),
    } as SelectChangeEvent);

    expect(store.dispatch).toHaveBeenCalledWith(new SetProjectRootFolder('project-1'));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(FetchProjectFilesByLink));
  });

  it('should return early in selectProject when original event is not pointer event', () => {
    setup({ detectChanges: false });

    component.selectProject({
      value: 'project-1',
      originalEvent: new Event('change'),
    } as SelectChangeEvent);

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SetProjectRootFolder));
  });

  it('should dispatch copy file from project and preprint file fetch', () => {
    setup({ detectChanges: false });
    const projectFile = OSF_FILE_MOCK as unknown as FileModel;

    component.selectProjectFile(projectFile);

    expect(store.dispatch).toHaveBeenCalledWith(new CopyFileFromProject(projectFile));
    expect(store.dispatch).toHaveBeenCalledWith(new FetchPreprintPrimaryFile());
  });

  it('should handle cancelButtonClicked for file present and file missing states', () => {
    setup({ detectChanges: false });

    component.cancelButtonClicked();
    expect(store.dispatch).not.toHaveBeenCalledWith(new SetSelectedPreprintFileSource(PreprintFileSource.None));

    vi.spyOn(component, 'preprintFile').mockReturnValue(null);
    (store.dispatch as Mock).mockClear();

    component.cancelButtonClicked();
    expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedPreprintFileSource(PreprintFileSource.None));
  });

  it('should handle setCurrentFolder for unchanged and changed folders', () => {
    setup({ detectChanges: false });

    component.setCurrentFolder(mockCurrentFolder);
    expect(store.dispatch).not.toHaveBeenCalledWith(new SetPreprintStepperCurrentFolder(mockCurrentFolder));
    expect(store.dispatch).not.toHaveBeenCalledWith(new FetchProjectFilesByLink(mockCurrentFolder.links.filesLink, 1));

    (store.dispatch as Mock).mockClear();
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

  it('should default showDeleteButton to false', () => {
    setup();

    expect(component.showDeleteButton()).toBe(false);
  });

  it('should update showDeleteButton when input changes', () => {
    setup();

    fixture.componentRef.setInput('showDeleteButton', true);
    fixture.detectChanges();

    expect(component.showDeleteButton()).toBe(true);
  });
});
