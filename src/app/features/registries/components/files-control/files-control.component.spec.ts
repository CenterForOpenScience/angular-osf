import { MockProvider } from 'ng-mocks';

import { of, Subject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpScoutService } from '@core/services/help-scout.service';
import { RegistriesSelectors } from '@osf/features/registries/store';
import { CustomConfirmationService, CustomDialogService, FilesService, ToastService } from '@osf/shared/services';

import { FilesControlComponent } from './files-control.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { CustomConfirmationServiceMockBuilder } from '@testing/providers/custom-confirmation-provider.mock';
import { CustomDialogServiceMockBuilder } from '@testing/providers/custom-dialog-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';
import { ToastServiceMockBuilder } from '@testing/providers/toast-provider.mock';

describe('Component: File Control', () => {
  let component: FilesControlComponent;
  let fixture: ComponentFixture<FilesControlComponent>;
  let helpScoutService: HelpScoutService;
  let mockFilesService: jest.Mocked<FilesService>;
  let mockDialogService: ReturnType<CustomDialogServiceMockBuilder['build']>;
  let mockToastService: ReturnType<ToastServiceMockBuilder['build']>;
  let mockCustomConfirmationService: ReturnType<CustomConfirmationServiceMockBuilder['build']>;
  const currentFolder = {
    links: { newFolder: '/new-folder', upload: '/upload' },
    relationships: { filesLink: '/files-link' },
  } as any;

  beforeEach(async () => {
    mockFilesService = { uploadFile: jest.fn(), getFileGuid: jest.fn() } as any;
    mockDialogService = CustomDialogServiceMockBuilder.create().withDefaultOpen().build();
    mockToastService = ToastServiceMockBuilder.create().build();
    mockCustomConfirmationService = CustomConfirmationServiceMockBuilder.create().build();

    await TestBed.configureTestingModule({
      imports: [FilesControlComponent, OSFTestingModule],
      providers: [
        MockProvider(FilesService, mockFilesService),
        MockProvider(CustomDialogService, mockDialogService),
        MockProvider(ToastService, mockToastService),
        MockProvider(CustomConfirmationService, mockCustomConfirmationService),
        {
          provide: HelpScoutService,
          useValue: {
            setResourceType: jest.fn(),
            unsetResourceType: jest.fn(),
          },
        },
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getFiles, value: [] },
            { selector: RegistriesSelectors.getFilesTotalCount, value: 0 },
            { selector: RegistriesSelectors.isFilesLoading, value: false },
            { selector: RegistriesSelectors.getCurrentFolder, value: currentFolder },
          ],
        }),
      ],
    }).compileComponents();

    helpScoutService = TestBed.inject(HelpScoutService);
    fixture = TestBed.createComponent(FilesControlComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('attachedFiles', []);
    fixture.componentRef.setInput('filesLink', '/files-link');
    fixture.componentRef.setInput('projectId', 'project-1');
    fixture.componentRef.setInput('provider', 'provider-1');
    fixture.componentRef.setInput('filesViewOnly', false);
    fixture.detectChanges();
  });

  it('should have a default value', () => {
    expect(component.fileIsUploading()).toBeFalsy();
  });

  it('should called the helpScoutService', () => {
    expect(helpScoutService.setResourceType).toHaveBeenCalledWith('files');
  });

  it('should open create folder dialog and trigger files update', () => {
    const onClose$ = new Subject<string>();
    (mockDialogService.open as any).mockReturnValue({ onClose: onClose$ });
    const updateSpy = jest.spyOn(component, 'updateFilesList').mockReturnValue(of(void 0));

    component.createFolder();

    expect(mockDialogService.open).toHaveBeenCalled();
    onClose$.next('New Folder');
    expect(updateSpy).toHaveBeenCalled();
  });

  it('should upload files, update progress and select uploaded file', () => {
    const file = new File(['data'], 'test.txt', { type: 'text/plain' });
    const progress = { type: 1, loaded: 50, total: 100 } as any;
    const response = { type: 4, body: { data: { id: 'files/abc' } } } as any;

    (mockFilesService.uploadFile as any).mockReturnValue(of(progress, response));
    (mockFilesService.getFileGuid as any).mockReturnValue(of({ id: 'abc' }));

    const selectSpy = jest.spyOn(component, 'selectFile');

    component.uploadFiles(file);
    expect(mockFilesService.uploadFile).toHaveBeenCalledWith(file, '/upload');
    expect(selectSpy).toHaveBeenCalledWith({ id: 'abc' } as any);
  });

  it('should emit attachFile when selectFile and not view-only', (done) => {
    const file = { id: 'file-1' } as any;
    component.attachFile.subscribe((f) => {
      expect(f).toEqual(file);
      done();
    });
    component.selectFile(file);
  });
});
