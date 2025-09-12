import { MockProvider } from 'ng-mocks';

import { DialogService } from 'primeng/dynamicdialog';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomConfirmationService, FilesService, ToastService } from '@shared/services';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { FilesTreeComponent } from './files-tree.component';

import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';
import { OSF_FILE_MOCK } from '@testing/mocks/osf-file.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FilesTreeComponent', () => {
  let component: FilesTreeComponent;
  let fixture: ComponentFixture<FilesTreeComponent>;
  let dataciteMock: jest.Mocked<DataciteService>;

  beforeEach(async () => {
    dataciteMock = DataciteMockFactory();
    await TestBed.configureTestingModule({
      imports: [FilesTreeComponent, OSFTestingModule],
      providers: [
        { provide: DataciteService, useValue: dataciteMock },
        MockProvider(FilesService),
        MockProvider(ToastService),
        MockProvider(CustomConfirmationService),
        MockProvider(DialogService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilesTreeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('currentFolder', null);
    fixture.componentRef.setInput('files', []);
    fixture.detectChanges();
  });

  it('should log Download', () => {
    component.downloadFileOrFolder(OSF_FILE_MOCK);
    expect(dataciteMock.logFileDownload).toHaveBeenCalledWith(OSF_FILE_MOCK.target.id, OSF_FILE_MOCK.target.type);
  });
});
