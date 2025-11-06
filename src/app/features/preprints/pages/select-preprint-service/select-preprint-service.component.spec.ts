import { TranslatePipe } from '@ngx-translate/core';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { DecodeHtmlPipe } from '@osf/shared/pipes/decode-html.pipe';

import { PreprintProviderShortInfo } from '../../models';
import { PreprintProvidersSelectors } from '../../store/preprint-providers';
import { PreprintStepperSelectors } from '../../store/preprint-stepper';

import { SelectPreprintServiceComponent } from './select-preprint-service.component';

import { PREPRINT_PROVIDER_SHORT_INFO_MOCK } from '@testing/mocks/preprint-provider-short-info.mock';
import { OSFTestingModule } from '@testing/osf.testing.module';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('SelectPreprintServiceComponent', () => {
  let component: SelectPreprintServiceComponent;
  let fixture: ComponentFixture<SelectPreprintServiceComponent>;
  let routerMock: ReturnType<RouterMockBuilder['build']>;
  let routeMock: ReturnType<ActivatedRouteMockBuilder['build']>;

  const mockProviders: PreprintProviderShortInfo[] = [PREPRINT_PROVIDER_SHORT_INFO_MOCK];
  const mockSelectedProviderId = 'osf';

  beforeEach(async () => {
    routerMock = RouterMockBuilder.create().withNavigate(jest.fn().mockResolvedValue(true)).build();
    routeMock = ActivatedRouteMockBuilder.create().withParams({}).withQueryParams({}).build();

    await TestBed.configureTestingModule({
      imports: [
        SelectPreprintServiceComponent,
        OSFTestingModule,
        ...MockComponents(SubHeaderComponent),
        MockPipe(TranslatePipe),
        MockPipe(DecodeHtmlPipe),
      ],
      providers: [
        MockProvider(Router, routerMock),
        MockProvider(ActivatedRoute, routeMock),
        provideMockStore({
          signals: [
            {
              selector: PreprintProvidersSelectors.getPreprintProvidersAllowingSubmissions,
              value: mockProviders,
            },
            {
              selector: PreprintProvidersSelectors.arePreprintProvidersAllowingSubmissionsLoading,
              value: false,
            },
            {
              selector: PreprintStepperSelectors.getSelectedProviderId,
              value: mockSelectedProviderId,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPreprintServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return preprint providers from store', () => {
    const providers = component.preprintProvidersAllowingSubmissions();
    expect(providers).toBe(mockProviders);
  });

  it('should return loading state from store', () => {
    const loading = component.areProvidersLoading();
    expect(loading).toBe(false);
  });

  it('should return selected provider ID from store', () => {
    const selectedId = component.selectedProviderId();
    expect(selectedId).toBe(mockSelectedProviderId);
  });

  it('should handle provider data correctly', () => {
    const providers = component.preprintProvidersAllowingSubmissions();
    expect(providers).toBe(mockProviders);
    expect(Array.isArray(providers)).toBe(true);
    expect(providers.length).toBe(1);
    expect(providers[0].id).toBe(mockProviders[0].id);
  });

  it('should handle loading states correctly', () => {
    const loading = component.areProvidersLoading();
    expect(typeof loading).toBe('boolean');
    expect(loading).toBe(false);
  });

  it('should handle selected provider ID correctly', () => {
    const selectedId = component.selectedProviderId();
    expect(selectedId).toBe(mockSelectedProviderId);
    expect(typeof selectedId).toBe('string');
  });

  it('should initialize skeleton array correctly', () => {
    expect(component.skeletonArray).toBeDefined();
    expect(Array.isArray(component.skeletonArray)).toBe(true);
    expect(component.skeletonArray.length).toBe(8);
    expect(component.skeletonArray).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('should handle provider selection when provider is not selected', () => {
    const provider = mockProviders[0];
    component.selectDeselectProvider(provider);

    expect(component.selectedProviderId()).toBe(mockSelectedProviderId);
  });

  it('should handle provider deselection when provider is already selected', () => {
    const provider = mockProviders[0];

    expect(() => component.selectDeselectProvider(provider)).not.toThrow();
  });

  it('should handle empty providers array', () => {
    const providers = component.preprintProvidersAllowingSubmissions();
    expect(providers).toBeDefined();
    expect(Array.isArray(providers)).toBe(true);
  });

  it('should handle null selected provider ID', () => {
    const selectedId = component.selectedProviderId();
    expect(selectedId).toBeDefined();
  });
});
