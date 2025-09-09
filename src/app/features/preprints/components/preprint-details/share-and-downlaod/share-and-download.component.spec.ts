import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderReviewsWorkflow } from '@osf/features/preprints/enums';
import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { ReviewPermissions } from '@osf/shared/enums';
import { MOCK_STORE } from '@shared/mocks';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { ShareAndDownloadComponent } from './share-and-download.component';

import { OSFTestingModule } from '@testing/osf.testing.module';

export const mockPreprintProvider: PreprintProviderDetails = {
  id: 'osf-preprints',
  name: 'OSF Preprints',
  descriptionHtml: '<p>Open preprints for all disciplines</p>',
  advisoryBoardHtml: '<p>Advisory board content here</p>',
  examplePreprintId: '12345',
  domain: 'osf.io',
  footerLinksHtml: '<a href="/about">About</a>',
  preprintWord: 'preprint',
  allowSubmissions: true,
  assertionsEnabled: false,
  reviewsWorkflow: ProviderReviewsWorkflow.PreModeration,
  permissions: [ReviewPermissions.ViewSubmissions],
  brand: {
    id: 'brand-1',
    name: 'OSF Brand',
    heroLogoImageUrl: 'https://osf.io/assets/hero-logo.png',
    heroBackgroundImageUrl: 'https://osf.io/assets/hero-bg.png',
    topNavLogoImageUrl: 'https://osf.io/assets/nav-logo.png',
    primaryColor: '#0056b3',
    secondaryColor: '#ff9900',
    backgroundColor: '#ffffff',
  },
  iri: 'https://osf.io/preprints/',
  faviconUrl: 'https://osf.io/favicon.ico',
  squareColorNoTransparentImageUrl: 'https://osf.io/image.png',
  facebookAppId: '1234567890',
  reviewsCommentsPrivate: null,
  reviewsCommentsAnonymous: null,
  lastFetched: Date.now(),
};
describe('ShareAndDownloadComponent', () => {
  let component: ShareAndDownloadComponent;
  let fixture: ComponentFixture<ShareAndDownloadComponent>;
  let dataciteService: jest.Mocked<DataciteService>;

  beforeEach(async () => {
    dataciteService = {
      logIdentifiableView: jest.fn().mockReturnValue(of(void 0)),
      logIdentifiableDownload: jest.fn().mockReturnValue(of(void 0)),
    } as unknown as jest.Mocked<DataciteService>;
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
    fixture.componentRef.setInput('preprintProvider', mockPreprintProvider);
    fixture.detectChanges();
  });

  it('should call dataciteService.logIdentifiableDownload when logDownload is triggered', () => {
    component.logDownload();
    expect(dataciteService.logIdentifiableDownload).toHaveBeenCalledWith(component.preprint$);
  });

  it('should call dataciteService.logIdentifiableView on start  ', () => {
    expect(dataciteService.logIdentifiableView).toHaveBeenCalledWith(component.preprint$);
  });
});
