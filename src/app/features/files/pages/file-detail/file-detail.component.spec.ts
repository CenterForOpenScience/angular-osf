import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { MetadataSelectors } from '@osf/features/metadata/store';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { MetadataTabsComponent } from '@osf/shared/components/metadata-tabs/metadata-tabs.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { CustomConfirmationService } from '@shared/services/custom-confirmation.service';
import { DataciteService } from '@shared/services/datacite/datacite.service';
import { ToastService } from '@shared/services/toast.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { DataciteServiceMock, DataciteServiceMockType } from '@testing/providers/datacite.service.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import {
  FileKeywordsComponent,
  FileMetadataComponent,
  FileResourceMetadataComponent,
  FileRevisionsComponent,
} from '../../components';
import { FilesSelectors } from '../../store';

import { FileDetailComponent } from './file-detail.component';

describe.skip('FileDetailComponent', () => {
  let fixture: ComponentFixture<FileDetailComponent>;
  let component: FileDetailComponent;
  let dataciteService: DataciteServiceMockType;

  beforeEach(() => {
    window.open = vi.fn();
    dataciteService = DataciteServiceMock.simple();

    const mockRoute: Partial<ActivatedRoute> = {
      params: of({ providerId: 'osf', fileGuid: 'file-1' }),
      queryParams: of({ providerId: 'osf', fileGuid: 'file-1' }),
    };

    TestBed.configureTestingModule({
      imports: [
        FileDetailComponent,
        ...MockComponents(
          SubHeaderComponent,
          LoadingSpinnerComponent,
          FileKeywordsComponent,
          FileRevisionsComponent,
          FileMetadataComponent,
          FileResourceMetadataComponent,
          MetadataTabsComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        { provide: ActivatedRoute, useValue: mockRoute },
        MockProvider(DataciteService, dataciteService),
        MockProvider(Router),
        MockProvider(ToastService),
        MockProvider(CustomConfirmationService),
        provideMockStore({
          signals: [
            { selector: FilesSelectors.getOpenedFile, value: null },
            { selector: FilesSelectors.getResourceMetadata, value: null },
            { selector: FilesSelectors.isOpenedFileLoading, value: true },
            { selector: MetadataSelectors.getCedarRecords, value: [] },
            { selector: MetadataSelectors.getCedarTemplates, value: null },
            { selector: FilesSelectors.isFilesAnonymous, value: false },
            { selector: FilesSelectors.getFileCustomMetadata, value: null },
            { selector: FilesSelectors.isFileMetadataLoading, value: false },
            { selector: FilesSelectors.getContributors, value: [] },
            { selector: FilesSelectors.isResourceContributorsLoading, value: false },
            { selector: FilesSelectors.getFileRevisions, value: null },
            { selector: FilesSelectors.isFileRevisionsLoading, value: false },
            { selector: FilesSelectors.hasWriteAccess, value: true },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(FileDetailComponent);
    component = fixture.componentInstance;
    document.head.innerHTML = '';
    fixture.detectChanges();
  });

  it('should call dataciteService.logIdentifiableDownload when downloadFile is triggered', () => {
    const link = '123';
    component.downloadFile(link);
    expect(dataciteService.logIdentifiableDownload).toHaveBeenCalledWith(component.fileMetadata$);
  });

  it('should call dataciteService.logIdentifiableView on start  ', () => {
    expect(dataciteService.logIdentifiableView).toHaveBeenCalledWith(component.fileMetadata$);
  });

  it('should add signposting tags during SSR', () => {
    fixture.detectChanges();

    const linkTags = Array.from(document.head.querySelectorAll('link[rel="linkset"]'));
    expect(linkTags.length).toBe(2);
    expect(linkTags[0].getAttribute('href')).toBe('http://localhost:4200/metadata/file-1/?format=linkset');
    expect(linkTags[0].getAttribute('type')).toBe('application/linkset');
    expect(linkTags[1].getAttribute('href')).toBe('http://localhost:4200/metadata/file-1/?format=linkset-json');
    expect(linkTags[1].getAttribute('type')).toBe('application/linkset+json');
  });
});
