import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { MOCK_PROVIDER, MOCK_STORE, TranslateServiceMock } from '@shared/mocks';
import { BrandService } from '@shared/services';

import { PreprintsLandingComponent } from './preprints-landing.component';

describe('PreprintsLandingComponent', () => {
  let component: PreprintsLandingComponent;
  let fixture: ComponentFixture<PreprintsLandingComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case PreprintProvidersSelectors.getPreprintProviderDetails('osf'):
          return () => MOCK_PROVIDER;
        case PreprintProvidersSelectors.isPreprintProviderDetailsLoading:
          return () => false;
        case PreprintProvidersSelectors.getPreprintProvidersToAdvertise:
          return () => [];
        case PreprintProvidersSelectors.getHighlightedSubjectsForProvider:
          return () => [];
        case PreprintProvidersSelectors.areSubjectsLoading:
          return () => false;
        default:
          return () => [];
      }
    });

    await TestBed.configureTestingModule({
      imports: [PreprintsLandingComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(Store, MOCK_STORE),
        provideRouter([]),
        MockProvider(ActivatedRoute, {}),
        MockProvider(BrandService),
        TranslateServiceMock,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
