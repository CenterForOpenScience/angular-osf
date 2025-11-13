import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { BrowserTabHelper } from '@osf/shared/helpers/browser-tab.helper';
import { HeaderStyleHelper } from '@osf/shared/helpers/header-style.helper';
import { BrandService } from '@osf/shared/services/brand.service';

import { PreprintProviderHeroComponent } from '../../components';
import { PreprintProviderDetails } from '../../models';
import { PreprintProvidersSelectors } from '../../store/preprint-providers';

import { PreprintProviderDiscoverComponent } from './preprint-provider-discover.component';

import { PREPRINT_PROVIDER_DETAILS_MOCK } from '@testing/mocks/preprint-provider-details';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('PreprintProviderDiscoverComponent', () => {
  let component: PreprintProviderDiscoverComponent;
  let fixture: ComponentFixture<PreprintProviderDiscoverComponent>;
  let routeMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  const mockProvider: PreprintProviderDetails = PREPRINT_PROVIDER_DETAILS_MOCK;
  const mockProviderId = 'osf';

  beforeEach(async () => {
    jest.spyOn(BrowserTabHelper, 'updateTabStyles').mockImplementation(() => {});
    jest.spyOn(BrowserTabHelper, 'resetToDefaults').mockImplementation(() => {});
    jest.spyOn(HeaderStyleHelper, 'applyHeaderStyles').mockImplementation(() => {});
    jest.spyOn(HeaderStyleHelper, 'resetToDefaults').mockImplementation(() => {});
    jest.spyOn(BrandService, 'applyBranding').mockImplementation(() => {});
    jest.spyOn(BrandService, 'resetBranding').mockImplementation(() => {});

    routeMock = ActivatedRouteMockBuilder.create()
      .withParams({ providerId: mockProviderId })
      .withQueryParams({})
      .build();

    await TestBed.configureTestingModule({
      imports: [
        PreprintProviderDiscoverComponent,
        OSFTestingModule,
        ...MockComponents(PreprintProviderHeroComponent, GlobalSearchComponent),
      ],
      providers: [
        MockProvider(ActivatedRoute, routeMock),
        provideMockStore({
          signals: [
            {
              selector: PreprintProvidersSelectors.getPreprintProviderDetails(mockProviderId),
              value: mockProvider,
            },
            {
              selector: PreprintProvidersSelectors.isPreprintProviderDetailsLoading,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreprintProviderDiscoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.providerId).toBe(mockProviderId);
    expect(component.classes).toBe('flex-1 flex flex-column w-full h-full');
    expect(component.searchControl).toBeDefined();
    expect(component.searchControl.value).toBe('');
  });

  it('should return preprint provider from store', () => {
    const provider = component.preprintProvider();
    expect(provider).toBe(mockProvider);
  });

  it('should return loading state from store', () => {
    const loading = component.isPreprintProviderLoading();
    expect(loading).toBe(false);
  });

  it('should initialize search control correctly', () => {
    expect(component.searchControl).toBeDefined();
    expect(component.searchControl.value).toBe('');
  });

  it('should handle search control value changes', () => {
    const testValue = 'test search';
    component.searchControl.setValue(testValue);
    expect(component.searchControl.value).toBe(testValue);
  });

  it('should initialize signals correctly', () => {
    expect(component.preprintProvider).toBeDefined();
    expect(component.isPreprintProviderLoading).toBeDefined();
  });

  it('should handle provider data correctly', () => {
    const provider = component.preprintProvider();
    expect(provider).toBe(mockProvider);
    expect(provider?.id).toBe(mockProvider.id);
    expect(provider?.name).toBe(mockProvider.name);
  });

  it('should handle loading state correctly', () => {
    const loading = component.isPreprintProviderLoading();
    expect(typeof loading).toBe('boolean');
    expect(loading).toBe(false);
  });

  it('should handle search control initialization', () => {
    expect(component.searchControl).toBeInstanceOf(FormControl);
    expect(component.searchControl.value).toBe('');
  });

  it('should handle search control updates', () => {
    const newValue = 'new search term';
    component.searchControl.setValue(newValue);
    expect(component.searchControl.value).toBe(newValue);
  });

  it('should handle search control reset', () => {
    component.searchControl.setValue('some value');
    component.searchControl.setValue('');
    expect(component.searchControl.value).toBe('');
  });

  it('should handle search control with null value', () => {
    component.searchControl.setValue(null);
    expect(component.searchControl.value).toBe(null);
  });
});
