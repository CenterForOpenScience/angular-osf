import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';
import { AdditionalInfoComponent } from '@osf/features/preprints/components/preprint-details/additional-info/additional-info.component';
import { GeneralInformationComponent } from '@osf/features/preprints/components/preprint-details/general-information/general-information.component';
import { PreprintFileSectionComponent } from '@osf/features/preprints/components/preprint-details/preprint-file-section/preprint-file-section.component';
import { ShareAndDownloadComponent } from '@osf/features/preprints/components/preprint-details/share-and-downlaod/share-and-download.component';
import { PreprintSelectors } from '@osf/features/preprints/store/preprint';
import { PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { MOCK_PROVIDER, MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { MetaTagsService } from '@shared/services';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { PreprintDetailsComponent } from './preprint-details.component';

import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';

describe('Component: Preprint Details', () => {
  let component: PreprintDetailsComponent;
  let fixture: ComponentFixture<PreprintDetailsComponent>;
  let helpScountService: HelpScoutService;

  let dataciteService: jest.Mocked<DataciteService>;

  const preprintSignal = signal<any | null>({ id: 'p1', title: 'Test', description: '' });
  const mockRoute: Partial<ActivatedRoute> = {
    params: of({ providerId: 'osf', preprintId: 'p1' }),
    queryParams: of({ providerId: 'osf', preprintId: 'p1' }),
  };

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case PreprintProvidersSelectors.getPreprintProviderDetails('osf'):
          return () => MOCK_PROVIDER;
        case PreprintProvidersSelectors.isPreprintProviderDetailsLoading:
          return () => false;
        case PreprintSelectors.getPreprint:
          return preprintSignal;
        case PreprintSelectors.isPreprintLoading:
          return () => false;
        default:
          return () => [];
      }
    });
    (MOCK_STORE.dispatch as jest.Mock).mockImplementation(() => of());
    dataciteService = DataciteMockFactory();

    await TestBed.configureTestingModule({
      imports: [
        PreprintDetailsComponent,
        MockPipe(TranslatePipe),
        ...MockComponents(
          PreprintFileSectionComponent,
          ShareAndDownloadComponent,
          GeneralInformationComponent,
          AdditionalInfoComponent
        ),
      ],
      providers: [
        MockProvider(Store, MOCK_STORE),
        provideNoopAnimations(),
        { provide: DataciteService, useValue: dataciteService },
        MockProvider(Router),
        MockProvider(ActivatedRoute, mockRoute),
        TranslateServiceMock,
        MockProvider(MetaTagsService),
        {
          provide: HelpScoutService,
          useValue: {
            setResourceType: jest.fn(),
            unsetResourceType: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    helpScountService = TestBed.inject(HelpScoutService);
    fixture = TestBed.createComponent(PreprintDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have a default value', () => {
    expect(component.classes).toBe('');
  });

  it('should called the helpScoutService', () => {
    expect(helpScountService.setResourceType).toHaveBeenCalledWith('preprint');
  });

  it('isOsfPreprint should be true if providerId === osf', () => {
    expect(component.isOsfPreprint()).toBeTruthy();
  });

  it('reacts to sequence of state changes', () => {
    fixture.detectChanges();
    expect(dataciteService.logIdentifiableView).toHaveBeenCalledWith(component.preprint$);
  });
});
