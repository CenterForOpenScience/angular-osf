import { MockComponent, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreprintProviderDetails } from '@osf/features/preprints/models';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { SocialsShareButtonComponent } from '@osf/shared/components/socials-share-button/socials-share-button.component';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';

import { ShareAndDownloadComponent } from './share-and-download.component';

import { PREPRINT_MOCK } from '@testing/mocks/preprint.mock';
import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { TranslationServiceMock } from '@testing/mocks/translation.service.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('ShareAndDownloadComponent', () => {
  let component: ShareAndDownloadComponent;
  let fixture: ComponentFixture<ShareAndDownloadComponent>;
  let dataciteService: jest.Mocked<DataciteService>;

  const mockPreprint = PREPRINT_MOCK;
  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;

  beforeEach(async () => {
    dataciteService = {
      logIdentifiableDownload: jest.fn().mockReturnValue(of(void 0)),
    } as any;

    await TestBed.configureTestingModule({
      imports: [ShareAndDownloadComponent, OSFTestingModule, MockComponent(SocialsShareButtonComponent)],
      providers: [
        TranslationServiceMock,
        MockProvider(DataciteService, dataciteService),
        provideMockStore({
          signals: [
            {
              selector: PreprintSelectors.getPreprint,
              value: mockPreprint,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareAndDownloadComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('preprintProvider', mockProvider);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return preprint from store', () => {
    const preprint = component.preprint();
    expect(preprint).toBe(mockPreprint);
  });

  it('should handle preprint provider input', () => {
    const provider = component.preprintProvider();
    expect(provider).toBe(mockProvider);
  });
});
