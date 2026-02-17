import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { of, Subject } from 'rxjs';

import { HttpEventType } from '@angular/common/http';
import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  CreateFolder,
  GetFiles,
  RegistriesSelectors,
  SetFilesIsLoading,
  SetRegistriesCurrentFolder,
} from '@osf/features/registries/store';
import { FileUploadDialogComponent } from '@osf/shared/components/file-upload-dialog/file-upload-dialog.component';
import { FilesTreeComponent } from '@osf/shared/components/files-tree/files-tree.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { FILE_SIZE_LIMIT } from '@osf/shared/constants/files-limits.const';
import { FileModel } from '@osf/shared/models/files/file.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { FilesService } from '@osf/shared/services/files.service';
import { ToastService } from '@osf/shared/services/toast.service';

import { FilesControlComponent } from './files-control.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { MockComponentWithSignal } from '@testing/providers/component-provider.mock';
import {
  CustomDialogServiceMockBuilder,
  CustomDialogServiceMockType,
} from '@testing/providers/custom-dialog-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMock, ToastServiceMockType } from '@testing/providers/toast-provider.mock';

describe('FilesControlComponent', () => {
  let component: FilesControlComponent;
  let fixture: ComponentFixture<FilesControlComponent>;
  let store: Store;
  let mockFilesService: { uploadFile: jest.Mock; getFileGuid: jest.Mock };
  let mockDialogService: CustomDialogServiceMockType;
  let currentFolderSignal: WritableSignal<FileFolderModel | null>;
  let toastService: ToastServiceMockType;

  const CURRENT_FOLDER = {
    links: { newFolder: '/new-folder', upload: '/upload', filesLink: '/files-link' },
  } as FileFolderModel;

  beforeEach(() => {
    mockFilesService = { uploadFile: jest.fn(), getFileGuid: jest.fn() };
    mockDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    currentFolderSignal = signal<FileFolderModel | null>(CURRENT_FOLDER);
    toastService = ToastServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [FilesControlComponent, ...MockComponents(LoadingSpinnerComponent, FileUploadDialogComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ToastService, toastService),
        MockProvider(CustomConfirmationService),
        MockProvider(FilesService, mockFilesService),
        MockProvider(CustomDialogService, mockDialogService),
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getFiles, value: [] },
            { selector: RegistriesSelectors.getFilesTotalCount, value: 0 },
            { selector: RegistriesSelectors.isFilesLoading, value: false },
            { selector: RegistriesSelectors.getCurrentFolder, value: currentFolderSignal },
          ],
        }),
      ],
    }).overrideComponent(FilesControlComponent, {
      remove: { imports: [FilesTreeComponent] },
      add: {
        imports: [
          MockComponentWithSignal('osf-files-tree', [
            'files',
            'selectionMode',
            'totalCount',
            'storage',
            'currentFolder',
            'isLoading',
            'scrollHeight',
            'viewOnly',
            'resourceId',
            'provider',
            'selectedFiles',
          ]),
        ],
      },
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(FilesControlComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('attachedFiles', []);
    fixture.componentRef.setInput('filesLink', '/files-link');
    fixture.componentRef.setInput('projectId', 'project-1');
    fixture.componentRef.setInput('provider', 'provider-1');
    fixture.componentRef.setInput('filesViewOnly', false);
    fixture.detectChanges();
  });

  it('should create with default signal values', () => {
    expect(component).toBeTruthy();
    expect(component.fileIsUploading()).toBe(false);
    expect(component.progress()).toBe(0);
    expect(component.fileName()).toBe('');
  });

  it('should do nothing when no file is selected', () => {
    const event = { target: { files: [] } } as unknown as Event;
    const uploadSpy = jest.spyOn(component, 'uploadFiles');

    component.onFileSelected(event);

    expect(uploadSpy).not.toHaveBeenCalled();
  });

  it('should show warning when file exceeds size limit', () => {
    const oversizedFile = new File([''], 'big.bin');
    Object.defineProperty(oversizedFile, 'size', { value: FILE_SIZE_LIMIT });
    const event = { target: { files: [oversizedFile] } } as unknown as Event;

    component.onFileSelected(event);

    expect(toastService.showWarn).toHaveBeenCalledWith('shared.files.limitText');
  });

  it('should upload valid file', () => {
    const file = new File(['data'], 'test.txt');
    const event = { target: { files: [file] } } as unknown as Event;
    const uploadSpy = jest.spyOn(component, 'uploadFiles').mockImplementation();

    component.onFileSelected(event);

    expect(uploadSpy).toHaveBeenCalledWith(file);
  });

  it('should open dialog and dispatch createFolder on confirm', () => {
    const onClose$ = new Subject<string>();
    mockDialogService.open.mockReturnValue({ onClose: onClose$ } as any);
    (store.dispatch as jest.Mock).mockClear();

    component.createFolder();

    expect(mockDialogService.open).toHaveBeenCalled();
    onClose$.next('New Folder');
    expect(store.dispatch).toHaveBeenCalledWith(new CreateFolder('/new-folder', 'New Folder'));
  });

  it('should upload file, track progress, and select uploaded file', () => {
    const file = new File(['data'], 'test.txt');
    const progress = { type: HttpEventType.UploadProgress, loaded: 50, total: 100 };
    const response = { type: HttpEventType.Response, body: { data: { id: 'files/abc' } } };

    mockFilesService.uploadFile.mockReturnValue(of(progress, response));
    mockFilesService.getFileGuid.mockReturnValue(of({ id: 'abc' } as FileModel));

    const selectSpy = jest.spyOn(component, 'selectFile');

    component.uploadFiles(file);

    expect(mockFilesService.uploadFile).toHaveBeenCalledWith(file, '/upload');
    expect(component.progress()).toBe(50);
    expect(selectSpy).toHaveBeenCalledWith({ id: 'abc' } as FileModel);
  });

  it('should not upload when no upload link', () => {
    currentFolderSignal.set({ links: {} } as FileFolderModel);

    const file = new File(['data'], 'test.txt');
    component.uploadFiles(file);

    expect(mockFilesService.uploadFile).not.toHaveBeenCalled();
  });

  it('should handle File array input', () => {
    const file = new File(['data'], 'test.txt');
    mockFilesService.uploadFile.mockReturnValue(of({ type: HttpEventType.Sent }));

    component.uploadFiles([file]);

    expect(mockFilesService.uploadFile).toHaveBeenCalledWith(file, '/upload');
  });

  it('should emit attachFile when not view-only', (done) => {
    const file = { id: 'file-1' } as FileModel;
    component.attachFile.subscribe((f) => {
      expect(f).toEqual(file);
      done();
    });
    component.selectFile(file);
  });

  it('should not emit attachFile when filesViewOnly is true', () => {
    fixture.componentRef.setInput('filesViewOnly', true);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.attachFile, 'emit');
    component.selectFile({ id: 'file-1' } as FileModel);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should dispatch getFiles on onLoadFiles', () => {
    (store.dispatch as jest.Mock).mockClear();

    component.onLoadFiles({ link: '/files', page: 2 });

    expect(store.dispatch).toHaveBeenCalledWith(new GetFiles('/files', 2));
  });

  it('should dispatch setCurrentFolder', () => {
    const folder = { id: 'folder-1' } as FileFolderModel;
    (store.dispatch as jest.Mock).mockClear();

    component.setCurrentFolder(folder);

    expect(store.dispatch).toHaveBeenCalledWith(new SetRegistriesCurrentFolder(folder));
  });

  it('should add file to filesSelection and deduplicate', () => {
    const file = { id: 'file-1' } as FileModel;

    component.onFileTreeSelected(file);
    component.onFileTreeSelected(file);

    expect(component.filesSelection).toEqual([file]);
  });

  it('should not open dialog when no newFolder link', () => {
    currentFolderSignal.set({ links: {} } as FileFolderModel);

    component.createFolder();

    expect(mockDialogService.open).not.toHaveBeenCalled();
  });

  it('should not dispatch getFiles when currentFolder has no filesLink', () => {
    (store.dispatch as jest.Mock).mockClear();
    currentFolderSignal.set({ links: {} } as FileFolderModel);
    fixture.detectChanges();

    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(SetFilesIsLoading));
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetFiles));
  });
});
