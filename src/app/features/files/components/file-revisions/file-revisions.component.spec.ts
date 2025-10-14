import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesSelectors } from '@osf/features/files/store';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { FileRevisionsComponent } from './file-revisions.component';

import { MOCK_STORE } from '@testing/mocks';
import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FileRevisionsComponent', () => {
  let component: FileRevisionsComponent;
  let fixture: ComponentFixture<FileRevisionsComponent>;
  let dataciteMock: jest.Mocked<DataciteService>;

  beforeEach(async () => {
    dataciteMock = DataciteMockFactory();
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case FilesSelectors.isFileRevisionsLoading:
          return () => false;
        default:
          return () => [];
      }
    });
    await TestBed.configureTestingModule({
      providers: [MockProvider(Store, MOCK_STORE), MockProvider(DataciteService, dataciteMock)],
      imports: [FileRevisionsComponent, OSFTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FileRevisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should log download', () => {
    component.downloadRevision('123');
    expect(dataciteMock.logIdentifiableDownload).toHaveBeenCalledWith(component.resourceMetadata);
  });
});
