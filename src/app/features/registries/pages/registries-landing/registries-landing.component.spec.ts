import { MockComponents } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ScheduledBannerComponent } from '@core/components/osf-banners/scheduled-banner/scheduled-banner.component';
import { RegistryServicesComponent } from '@osf/features/registries/components';
import { RegistrationProviderSelectors } from '@osf/shared/stores/registration-provider';
import {
  LoadingSpinnerComponent,
  ResourceCardComponent,
  SearchInputComponent,
  SubHeaderComponent,
} from '@shared/components';

import { RegistriesSelectors } from '../../store';

import { RegistriesLandingComponent } from './registries-landing.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('RegistriesLandingComponent', () => {
  let component: RegistriesLandingComponent;
  let fixture: ComponentFixture<RegistriesLandingComponent>;
  let mockRouter: ReturnType<RouterMockBuilder['build']>;

  beforeEach(async () => {
    mockRouter = RouterMockBuilder.create().withUrl('/registries').build();

    await TestBed.configureTestingModule({
      imports: [
        RegistriesLandingComponent,
        OSFTestingModule,
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
        { provide: Router, useValue: mockRouter },
        provideMockStore({
          signals: [
            { selector: RegistrationProviderSelectors.getBrandedProvider, value: null },
            { selector: RegistrationProviderSelectors.isBrandedProviderLoading, value: false },
            { selector: RegistriesSelectors.getRegistries, value: [] },
            { selector: RegistriesSelectors.isRegistriesLoading, value: false },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistriesLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch get registries and provider on init', () => {
    const actionsMock = {
      getRegistries: jest.fn(),
      getProvider: jest.fn(),
      clearCurrentProvider: jest.fn(),
      clearRegistryProvider: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });

    component.ngOnInit();

    expect(actionsMock.getRegistries).toHaveBeenCalled();
    expect(actionsMock.getProvider).toHaveBeenCalledWith(component.defaultProvider);
  });

  it('should clear providers on destroy', () => {
    const actionsMock = {
      getRegistries: jest.fn(),
      getProvider: jest.fn(),
      clearCurrentProvider: jest.fn(),
      clearRegistryProvider: jest.fn(),
    } as any;
    Object.defineProperty(component, 'actions', { value: actionsMock });

    fixture.destroy();
    expect(actionsMock.clearCurrentProvider).toHaveBeenCalled();
    expect(actionsMock.clearRegistryProvider).toHaveBeenCalled();
  });

  it('should navigate to search with value', () => {
    const navSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    component.searchControl.setValue('abc');
    component.redirectToSearchPageWithValue();
    expect(navSpy).toHaveBeenCalledWith(['/search'], { queryParams: { search: 'abc', tab: 3 } });
  });

  it('should navigate to search registrations tab', () => {
    const navSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    component.redirectToSearchPageRegistrations();
    expect(navSpy).toHaveBeenCalledWith(['/search'], { queryParams: { tab: 3 } });
  });

  it('should navigate to create page', () => {
    const navSpy = jest.spyOn(TestBed.inject(Router), 'navigate');
    component.goToCreateRegistration();
    expect(navSpy).toHaveBeenCalledWith(['/registries/osf/new']);
  });
});
