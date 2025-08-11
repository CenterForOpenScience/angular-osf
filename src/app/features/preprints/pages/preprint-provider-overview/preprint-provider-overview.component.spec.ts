import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import {
  AdvisoryBoardComponent,
  BrowseBySubjectsComponent,
  PreprintProviderFooterComponent,
  PreprintProviderHeroComponent,
} from '@osf/features/preprints/components';
import { PreprintProviderOverviewComponent } from '@osf/features/preprints/pages';
import { PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { MOCK_PROVIDER, MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { BrandService } from '@shared/services';

describe('PreprintProviderOverviewComponent', () => {
  let component: PreprintProviderOverviewComponent;
  let fixture: ComponentFixture<PreprintProviderOverviewComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case PreprintProvidersSelectors.getPreprintProviderDetails('osf'):
          return () => MOCK_PROVIDER;
        case PreprintProvidersSelectors.isPreprintProviderDetailsLoading:
          return () => false;
        case PreprintProvidersSelectors.getHighlightedSubjectsForProvider:
          return () => [];
        case PreprintProvidersSelectors.areSubjectsLoading:
          return () => false;
        default:
          return () => [];
      }
    });

    await TestBed.configureTestingModule({
      imports: [
        PreprintProviderOverviewComponent,
        MockPipe(TranslatePipe),
        ...MockComponents(
          PreprintProviderHeroComponent,
          PreprintProviderFooterComponent,
          AdvisoryBoardComponent,
          BrowseBySubjectsComponent
        ),
      ],
      teardown: { destroyAfterEach: false },
      providers: [
        MockProvider(Store, MOCK_STORE),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ providerId: 'osf' }),
            snapshot: { params: { providerId: 'osf' } },
          },
        },
        MockProvider(BrandService),
        TranslateServiceMock,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintProviderOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
