import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { MOCK_STORE } from '@shared/mocks';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { ShareAndDownloadComponent } from './share-and-download.component';

import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { OSFTestingModule } from '@testing/osf.testing.module';

describe('ShareAndDownloadComponent', () => {
  let component: ShareAndDownloadComponent;
  let fixture: ComponentFixture<ShareAndDownloadComponent>;
  let dataciteService: jest.Mocked<DataciteService>;

  beforeEach(async () => {
    dataciteService = DataciteMockFactory();
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      if (selector === PreprintSelectors.getPreprint) return () => null;
      if (selector === PreprintSelectors.isPreprintLoading) return () => false;
      return () => null;
    });

    await TestBed.configureTestingModule({
      imports: [ShareAndDownloadComponent, OSFTestingModule],
      providers: [MockProvider(Store, MOCK_STORE), { provide: DataciteService, useValue: dataciteService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareAndDownloadComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('preprintProvider', PREPRINT_PROVIDER_DETAILS_MOCK);
    fixture.detectChanges();
  });

  it('should call dataciteService.logIdentifiableDownload when logDownload is triggered', () => {
    component.logDownload();
    expect(dataciteService.logIdentifiableDownload).toHaveBeenCalledWith(component.preprint$);
  });
});
