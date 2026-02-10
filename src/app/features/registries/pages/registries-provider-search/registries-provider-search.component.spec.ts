import { MockComponents } from 'ng-mocks';

import { of } from 'rxjs';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';

import { RegistryProviderHeroComponent } from '@osf/features/registries/components/registry-provider-hero/registry-provider-hero.component';
import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { RegistrationProviderSelectors } from '@osf/shared/stores/registration-provider';

import { RegistriesProviderSearchComponent } from './registries-provider-search.component';

import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

const MOCK_PROVIDER = { iri: 'http://iri/provider', name: 'Test Provider' };

describe('RegistriesProviderSearchComponent', () => {
  let component: RegistriesProviderSearchComponent;
  let fixture: ComponentFixture<RegistriesProviderSearchComponent>;
  let actionsMock: {
    getProvider: jest.Mock;
    setDefaultFilterValue: jest.Mock;
    setResourceType: jest.Mock;
    clearCurrentProvider: jest.Mock;
    clearRegistryProvider: jest.Mock;
  };

  function setup(options: { params?: Params; platformId?: string } = {}) {
    const { params = { providerId: 'osf' }, platformId = 'browser' } = options;

    fixture?.destroy();
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      imports: [
        RegistriesProviderSearchComponent,
        OSFTestingModule,
        ...MockComponents(GlobalSearchComponent, RegistryProviderHeroComponent),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: ActivatedRouteMockBuilder.create().withParams(params).build() },
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

    actionsMock = {
      getProvider: jest.fn().mockReturnValue(of({})),
      setDefaultFilterValue: jest.fn().mockReturnValue(of({})),
      setResourceType: jest.fn().mockReturnValue(of({})),
      clearCurrentProvider: jest.fn().mockReturnValue(of({})),
      clearRegistryProvider: jest.fn().mockReturnValue(of({})),
    };
    Object.defineProperty(component, 'actions', { value: actionsMock, writable: true });

    fixture.detectChanges();
  }

  beforeEach(() => setup());

  afterEach(() => fixture?.destroy());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchControl with empty string', () => {
    expect(component.searchControl.value).toBe('');
  });

  it('should initialize defaultSearchFiltersInitialized as false before ngOnInit completes', () => {
    setup({ params: {} });
    expect(component.defaultSearchFiltersInitialized()).toBe(false);
  });

  it('should fetch provider and set filters on init when providerId exists', () => {
    expect(actionsMock.getProvider).toHaveBeenCalledWith('osf');
    expect(actionsMock.setDefaultFilterValue).toHaveBeenCalledWith('publisher', MOCK_PROVIDER.iri);
    expect(actionsMock.setResourceType).toHaveBeenCalledWith(ResourceType.Registration);
    expect(component.defaultSearchFiltersInitialized()).toBe(true);
  });

  it('should not fetch provider when providerId is missing', () => {
    setup({ params: {} });
    expect(actionsMock.getProvider).not.toHaveBeenCalled();
    expect(actionsMock.setDefaultFilterValue).not.toHaveBeenCalled();
    expect(actionsMock.setResourceType).not.toHaveBeenCalled();
    expect(component.defaultSearchFiltersInitialized()).toBe(false);
  });

  it('should clear providers on destroy in browser', () => {
    component.ngOnDestroy();
    expect(actionsMock.clearCurrentProvider).toHaveBeenCalled();
    expect(actionsMock.clearRegistryProvider).toHaveBeenCalled();
  });

  it('should not clear providers on destroy on server', () => {
    setup({ platformId: 'server' });
    component.ngOnDestroy();
    expect(actionsMock.clearCurrentProvider).not.toHaveBeenCalled();
    expect(actionsMock.clearRegistryProvider).not.toHaveBeenCalled();
  });
});
