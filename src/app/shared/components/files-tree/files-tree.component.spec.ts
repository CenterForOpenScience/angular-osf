import { MockComponents, MockProvider } from 'ng-mocks';

import { TreeDragDropService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileKind } from '@osf/shared/enums/file-kind.enum';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { FilesService } from '@osf/shared/services/files.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { CurrentResourceSelectors } from '@osf/shared/stores/current-resource';
import { FileFolderModel } from '@shared/models/files/file-folder.model';
import { FileLabelModel } from '@shared/models/files/file-label.model';

import { FileMenuComponent } from '../file-menu/file-menu.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

import { FilesTreeComponent } from './files-tree.component';

import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';
import { OSF_FILE_MOCK } from '@testing/mocks/osf-file.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('FilesTreeComponent', () => {
  let component: FilesTreeComponent;
  let fixture: ComponentFixture<FilesTreeComponent>;
  let dataciteMock: jest.Mocked<DataciteService>;

  const mockFolderFile: FileFolderModel = {
    ...OSF_FILE_MOCK,
    kind: FileKind.Folder,
    name: 'Test Folder',
  };

  const mockStorage: FileLabelModel = {
    label: 'OSF Storage',
    folder: mockFolderFile,
  };

  beforeEach(async () => {
    dataciteMock = DataciteMockFactory();
    await TestBed.configureTestingModule({
      imports: [FilesTreeComponent, OSFTestingModule, ...MockComponents(LoadingSpinnerComponent, FileMenuComponent)],
      providers: [
        provideMockStore({
          signals: [{ selector: CurrentResourceSelectors.getCurrentResource, value: signal(null) }],
        }),
        MockProvider(DataciteService, dataciteMock),
        MockProvider(FilesService),
        MockProvider(ToastService),
        MockProvider(CustomConfirmationService),
        MockProvider(DialogService),
        TreeDragDropService,
      ],
    }).compileComponents();

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
    const mockOpen = jest.fn().mockReturnValue({ focus: jest.fn() });
    window.open = mockOpen;

    component.downloadFileOrFolder(OSF_FILE_MOCK as any);

    expect(dataciteMock.logFileDownload).toHaveBeenCalledWith('resource-123', 'nodes');
    expect(mockOpen).toHaveBeenCalled();
  });
});
