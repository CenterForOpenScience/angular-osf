import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearCurrentProvider } from '@core/store/provider';
import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { RegistryProviderDetails } from '@osf/shared/models/provider/registry-provider.model';
import { SetDefaultFilterValue, SetResourceType } from '@osf/shared/stores/global-search';
import {
  ClearRegistryProvider,
  GetRegistryProvider,
  RegistrationProviderSelectors,
} from '@osf/shared/stores/registration-provider';

import { RegistryProviderHeroComponent } from '../../components/registry-provider-hero/registry-provider-hero.component';

import { RegistriesProviderSearchComponent } from './registries-provider-search.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder, provideActivatedRouteMock } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

const MOCK_PROVIDER: RegistryProviderDetails = {
  id: 'provider-1',
  name: 'Test Provider',
  descriptionHtml: '',
  permissions: [],
  brand: null,
  iri: 'http://iri.example.com',
  reviewsWorkflow: 'pre-moderation',
};

describe('RegistriesProviderSearchComponent', () => {
  let component: RegistriesProviderSearchComponent;
  let fixture: ComponentFixture<RegistriesProviderSearchComponent>;
  let store: Store;

  const PROVIDER_ID = 'provider-1';

  function setup(params: Record<string, string> = { providerId: PROVIDER_ID }, platformId = 'browser') {
    const mockRoute = ActivatedRouteMockBuilder.create().withParams(params).build();

    TestBed.configureTestingModule({
      imports: [
        RegistriesProviderSearchComponent,
        ...MockComponents(RegistryProviderHeroComponent, GlobalSearchComponent),
      ],
      providers: [
        provideOSFCore(),
        provideActivatedRouteMock(mockRoute),
        { provide: PLATFORM_ID, useValue: platformId },
        provideMockStore({
          signals: [
            { selector: RegistrationProviderSelectors.getBrandedProvider, value: MOCK_PROVIDER },
            { selector: RegistrationProviderSelectors.isBrandedProviderLoading, value: false },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(RegistriesProviderSearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should fetch provider and initialize search filters on init', () => {
    setup();
    expect(store.dispatch).toHaveBeenCalledWith(new GetRegistryProvider(PROVIDER_ID));
    expect(store.dispatch).toHaveBeenCalledWith(new SetDefaultFilterValue('publisher', MOCK_PROVIDER.iri));
    expect(store.dispatch).toHaveBeenCalledWith(new SetResourceType(ResourceType.Registration));
    expect(component.defaultSearchFiltersInitialized()).toBe(true);
  });

  it('should initialize searchControl with empty string', () => {
    setup();
    expect(component.searchControl.value).toBe('');
  });

  it('should expose provider and isProviderLoading from store', () => {
    setup();
    expect(component.provider()).toEqual(MOCK_PROVIDER);
    expect(component.isProviderLoading()).toBe(false);
  });

  it('should dispatch clear actions on destroy in browser', () => {
    setup();
    (store.dispatch as jest.Mock).mockClear();
    component.ngOnDestroy();
    expect(store.dispatch).toHaveBeenCalledWith(new ClearCurrentProvider());
    expect(store.dispatch).toHaveBeenCalledWith(new ClearRegistryProvider());
  });

  it('should not fetch provider or initialize filters when providerId is missing', () => {
    setup({});
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(GetRegistryProvider));
    expect(component.defaultSearchFiltersInitialized()).toBe(false);
  });

  it('should not dispatch clear actions on destroy on server', () => {
    setup({}, 'server');
    (store.dispatch as jest.Mock).mockClear();
    component.ngOnDestroy();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
