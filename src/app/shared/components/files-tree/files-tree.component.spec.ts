import { MockComponents, MockProvider } from 'ng-mocks';

import { TreeDragDropService } from 'primeng/api';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FileKind } from '@osf/shared/enums/file-kind.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { FilesService } from '@osf/shared/services/files.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';
import { FileFolderModel } from '@shared/models/files/file-folder.model';
import { FileLabelModel } from '@shared/models/files/file-label.model';

import { OSF_FILE_MOCK } from '@testing/mocks/osf-file.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { DataciteServiceMock, DataciteServiceMockType } from '@testing/providers/datacite.service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { FileMenuComponent } from '../file-menu/file-menu.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

import { FilesTreeComponent } from './files-tree.component';

describe('FilesTreeComponent', () => {
  let component: FilesTreeComponent;
  let fixture: ComponentFixture<FilesTreeComponent>;
  let dataciteMock: DataciteServiceMockType;

  const mockFolderFile: FileFolderModel = {
    ...OSF_FILE_MOCK,
    kind: FileKind.Folder,
    name: 'Test Folder',
  };

  const mockStorage: FileLabelModel = {
    label: 'OSF Storage',
    folder: mockFolderFile,
  };

  beforeEach(() => {
    dataciteMock = DataciteServiceMock.simple();

    TestBed.configureTestingModule({
      imports: [FilesTreeComponent, ...MockComponents(LoadingSpinnerComponent, FileMenuComponent)],
      providers: [
        provideOSFCore(),
        provideRouter([]),
        provideMockStore({
          signals: [{ selector: CurrentResourceSelectors.getCurrentResource, value: signal(null) }],
        }),
        MockProvider(DataciteService, dataciteMock),
        MockProvider(FilesService),
        MockProvider(ToastService),
        MockProvider(CustomConfirmationService),
        MockProvider(CustomDialogService),
        TreeDragDropService,
      ],
    });

    fixture = TestBed.createComponent(FilesTreeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('files', []);
    fixture.componentRef.setInput('currentFolder', null);
    fixture.componentRef.setInput('storage', mockStorage);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all required inputs', () => {
    expect(component.files()).toEqual([]);
    expect(component.currentFolder()).toBe(null);
    expect(component.storage()).toEqual(mockStorage);
    expect(component.resourceId()).toBe('resource-123');
  });

  it('should log Download', () => {
    const mockOpen = vi.fn().mockReturnValue({ focus: vi.fn() });
    window.open = mockOpen;

    component.downloadFileOrFolder(OSF_FILE_MOCK as any);

    expect(dataciteMock.logFileDownload).toHaveBeenCalledWith('resource-123', 'nodes');
    expect(mockOpen).toHaveBeenCalled();
  });
});
