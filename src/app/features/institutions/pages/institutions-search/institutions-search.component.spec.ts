import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SetDefaultFilterValue } from '@osf/shared/stores/global-search';
import { FetchInstitutionById, InstitutionsSearchSelectors } from '@osf/shared/stores/institutions-search';

import { MOCK_INSTITUTION } from '@testing/mocks/institution.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import {
  BaseSetupOverrides,
  mergeSignalOverrides,
  provideMockStore,
  SignalOverride,
} from '@testing/providers/store-provider.mock';

import { InstitutionsSearchComponent } from './institutions-search.component';

describe('InstitutionsSearchComponent', () => {
  let component: InstitutionsSearchComponent;
  let fixture: ComponentFixture<InstitutionsSearchComponent>;
  let store: Store;

  const defaultSignals: SignalOverride[] = [
    { selector: InstitutionsSearchSelectors.getInstitution, value: MOCK_INSTITUTION },
    { selector: InstitutionsSearchSelectors.getInstitutionLoading, value: false },
  ];

  function setup(overrides: BaseSetupOverrides = {}) {
    const routeBuilder = ActivatedRouteMockBuilder.create();
    if (overrides.routeParams) {
      routeBuilder.withParams(overrides.routeParams);
    }
    if (overrides.hasParent === false) {
      routeBuilder.withNoParent();
    }
    const mockRoute = routeBuilder.build();

    TestBed.configureTestingModule({
      imports: [InstitutionsSearchComponent, ...MockComponents(GlobalSearchComponent, LoadingSpinnerComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, mockRoute),
        provideMockStore({
          signals: mergeSignalOverrides(defaultSignals, overrides.selectorOverrides),
        }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(InstitutionsSearchComponent);
    component = fixture.componentInstance;
  }

  it('should create', () => {
    setup({ routeParams: { institutionId: 'inst-1' } });
    expect(component).toBeTruthy();
  });

  it('should dispatch fetch and initialize default filter on init', () => {
    setup({ routeParams: { institutionId: 'inst-1' } });
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(new FetchInstitutionById('inst-1'));
    expect(store.dispatch).toHaveBeenCalledWith(
      new SetDefaultFilterValue('affiliation,isContainedBy.affiliation', MOCK_INSTITUTION.iris.join(','))
    );
    expect(component.defaultSearchFiltersInitialized()).toBe(true);
  });

  it('should not dispatch init actions when institution id is missing', () => {
    setup();
    fixture.detectChanges();

    expect(store.dispatch).not.toHaveBeenCalledWith(new FetchInstitutionById('inst-1'));
    expect(store.dispatch).not.toHaveBeenCalledWith(
      new SetDefaultFilterValue('affiliation,isContainedBy.affiliation', MOCK_INSTITUTION.iris.join(','))
    );
    expect(component.defaultSearchFiltersInitialized()).toBe(false);
  });
});
