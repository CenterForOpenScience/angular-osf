import { MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileLabelModel, FilesTreeActions, OsfFile } from '@shared/models';
import { CustomConfirmationService, FilesService, ToastService } from '@shared/services';
import { DataciteService } from '@shared/services/datacite/datacite.service';
import { CurrentResourceSelectors } from '@shared/stores';

import { FilesTreeComponent } from './files-tree.component';

import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';
import { OSF_FILE_MOCK } from '@testing/mocks/osf-file.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('FilesTreeComponent', () => {
  let component: FilesTreeComponent;
  let fixture: ComponentFixture<FilesTreeComponent>;
  let dataciteMock: jest.Mocked<DataciteService>;

  const mockFolderFile: OsfFile = {
    ...OSF_FILE_MOCK,
    kind: 'folder',
    name: 'Test Folder',
  };

  const mockStorage: FileLabelModel = {
    label: 'OSF Storage',
    folder: mockFolderFile,
  };

  const mockActions: FilesTreeActions = {
    setCurrentFolder: jest.fn().mockReturnValue(of(void 0)),
    getFiles: jest.fn().mockReturnValue(of(void 0)),
    deleteEntry: jest.fn().mockReturnValue(of(void 0)),
    renameEntry: jest.fn().mockReturnValue(of(void 0)),
    setMoveFileCurrentFolder: jest.fn().mockReturnValue(of(void 0)),
    setFilesIsLoading: jest.fn(),
  };

  beforeEach(async () => {
    dataciteMock = DataciteMockFactory();
    await TestBed.configureTestingModule({
      imports: [FilesTreeComponent, OSFTestingModule],
      providers: [
        provideMockStore({
          signals: [{ selector: CurrentResourceSelectors.getCurrentResource, value: signal(null) }],
        }),
        MockProvider(DataciteService, dataciteMock),
        MockProvider(FilesService),
        MockProvider(ToastService),
        MockProvider(CustomConfirmationService),
        MockProvider(DialogService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesTreeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('files', []);
    fixture.componentRef.setInput('currentFolder', null);
    fixture.componentRef.setInput('storage', mockStorage);
    fixture.componentRef.setInput('resourceId', 'resource-123');
    fixture.componentRef.setInput('actions', mockActions);
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
    expect(component.actions()).toEqual(mockActions);
  });

  it('should log Download', () => {
    const mockOpen = jest.fn().mockReturnValue({ focus: jest.fn() });
    window.open = mockOpen;

    component.downloadFileOrFolder(OSF_FILE_MOCK);

    expect(dataciteMock.logFileDownload).toHaveBeenCalledWith('resource-123', 'nodes');
    expect(mockOpen).toHaveBeenCalledWith(OSF_FILE_MOCK.links.download);
  });
});
