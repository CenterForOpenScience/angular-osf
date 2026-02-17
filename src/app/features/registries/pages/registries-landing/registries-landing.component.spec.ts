import { Store } from '@ngxs/store';

import { MockComponents } from 'ng-mocks';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledBannerComponent } from '@core/components/osf-banners/scheduled-banner/scheduled-banner.component';
import { ClearCurrentProvider } from '@core/store/provider';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { ResourceCardComponent } from '@osf/shared/components/resource-card/resource-card.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ClearRegistryProvider, GetRegistryProvider } from '@osf/shared/stores/registration-provider';

import { RegistryServicesComponent } from '../../components/registry-services/registry-services.component';
import { GetRegistries, RegistriesSelectors } from '../../store';

import { RegistriesLandingComponent } from './registries-landing.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { provideRouterMock, RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistriesLandingComponent', () => {
  let component: RegistriesLandingComponent;
  let fixture: ComponentFixture<RegistriesLandingComponent>;
  let store: Store;
  let mockRouter: RouterMockType;

  beforeEach(() => {
    mockRouter = RouterMockBuilder.create().withUrl('/registries').build();

    TestBed.configureTestingModule({
      imports: [
        RegistriesLandingComponent,
        ...MockComponents(
          SearchInputComponent,
          RegistryServicesComponent,
          ResourceCardComponent,
          LoadingSpinnerComponent,
          SubHeaderComponent,
          ScheduledBannerComponent
        ),
      ],
      providers: [
        provideOSFCore(),
        provideRouterMock(mockRouter),
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideMockStore({
          signals: [
            { selector: RegistriesSelectors.getRegistries, value: [] },
            { selector: RegistriesSelectors.isRegistriesLoading, value: false },
          ],
        }),
      ],
    });

    fixture = TestBed.createComponent(RegistriesLandingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch getRegistries and getProvider on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(new GetRegistries());
    expect(store.dispatch).toHaveBeenCalledWith(new GetRegistryProvider(component.defaultProvider));
  });

  it('should dispatch clear actions on destroy', () => {
    (store.dispatch as jest.Mock).mockClear();
    fixture.destroy();
    expect(store.dispatch).toHaveBeenCalledWith(new ClearCurrentProvider());
    expect(store.dispatch).toHaveBeenCalledWith(new ClearRegistryProvider());
  });

  it('should navigate to search with value', () => {
    component.searchControl.setValue('abc');
    component.redirectToSearchPageWithValue();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { search: 'abc', tab: 3 } });
  });

  it('should navigate to search registrations tab', () => {
    component.redirectToSearchPageRegistrations();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/search'], { queryParams: { tab: 3 } });
  });

  it('should navigate to create page', () => {
    component.goToCreateRegistration();
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/registries/${component.defaultProvider}/new`]);
  });
});
