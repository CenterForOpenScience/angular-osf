import { Store } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MockComponents, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { DestroyRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { MetadataTabsComponent } from '@osf/shared/components/metadata-tabs/metadata-tabs.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { CustomConfirmationService } from '@shared/services/custom-confirmation.service';
import { DataciteService } from '@shared/services/datacite/datacite.service';
import { ToastService } from '@shared/services/toast.service';

import {
  FileKeywordsComponent,
  FileMetadataComponent,
  FileResourceMetadataComponent,
  FileRevisionsComponent,
} from '../../components';

import { FileDetailComponent } from './file-detail.component';

import { MOCK_STORE } from '@testing/mocks/mock-store.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('FileDetailComponent', () => {
  let fixture: ComponentFixture<FileDetailComponent>;
  let component: FileDetailComponent;
  let dataciteService: jest.Mocked<DataciteService>;

  beforeEach(async () => {
    window.open = jest.fn();
    dataciteService = {
      logIdentifiableView: jest.fn().mockReturnValue(of(void 0)),
      logIdentifiableDownload: jest.fn().mockReturnValue(of(void 0)),
    } as unknown as jest.Mocked<DataciteService>;

    const mockRoute: Partial<ActivatedRoute> = {
      params: of({ providerId: 'osf', fileGuid: 'file-1' }),
      queryParams: of({ providerId: 'osf', fileGuid: 'file-1' }),
    };
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        default:
          return () => [];
      }
    });

    await TestBed.configureTestingModule({
      imports: [
        FileDetailComponent,
        OSFTestingModule,
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
        TranslatePipe,
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Store, useValue: MOCK_STORE },
        { provide: DataciteService, useValue: dataciteService },
        Router,
        DestroyRef,
        MockProvider(ToastService),
        MockProvider(CustomConfirmationService),
        TranslateService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(FileDetailComponent);
    component = fixture.componentInstance;
    document.head.innerHTML = '';
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
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
