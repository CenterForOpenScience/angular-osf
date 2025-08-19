import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';
import { MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { PreprintProviderDiscoverComponent } from '@osf/features/preprints/pages';
import { PreprintProvidersSelectors } from '@osf/features/preprints/store/preprint-providers';
import { MOCK_PROVIDER, MOCK_STORE, TranslateServiceMock } from '@shared/mocks';

describe.skip('PreprintProviderDiscoverComponent', () => {
  let component: PreprintProviderDiscoverComponent;
  let fixture: ComponentFixture<PreprintProviderDiscoverComponent>;

  beforeEach(async () => {
    (MOCK_STORE.selectSignal as jest.Mock).mockImplementation((selector) => {
      switch (selector) {
        case PreprintProvidersSelectors.getPreprintProviderDetails('prov1'):
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
      imports: [PreprintProviderDiscoverComponent, MockPipe(TranslatePipe)],
      providers: [
        MockProvider(Store, MOCK_STORE),
        provideRouter([]),
        MockProvider(ActivatedRoute),
        TranslateServiceMock,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintProviderDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
