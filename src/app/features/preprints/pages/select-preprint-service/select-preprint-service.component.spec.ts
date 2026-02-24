import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';

import { PreprintProviderShortInfo } from '../../models';
import { GetPreprintProvidersAllowingSubmissions, PreprintProvidersSelectors } from '../../store/preprint-providers';
import { PreprintStepperSelectors, SetSelectedPreprintProviderId } from '../../store/preprint-stepper';

import { SelectPreprintServiceComponent } from './select-preprint-service.component';

import { PREPRINT_PROVIDER_SHORT_INFO_MOCK } from '@testing/mocks/preprint-provider-short-info.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';

describe('SelectPreprintServiceComponent', () => {
  let component: SelectPreprintServiceComponent;
  let fixture: ComponentFixture<SelectPreprintServiceComponent>;
  let store: Store;

  const mockProvider: PreprintProviderShortInfo = PREPRINT_PROVIDER_SHORT_INFO_MOCK;
  const mockProviders: PreprintProviderShortInfo[] = [mockProvider];

  const defaultSignals: SignalOverride[] = [
    { selector: PreprintProvidersSelectors.getPreprintProvidersAllowingSubmissions, value: mockProviders },
    { selector: PreprintProvidersSelectors.arePreprintProvidersAllowingSubmissionsLoading, value: false },
    { selector: PreprintStepperSelectors.getSelectedProviderId, value: null },
  ];

  function setup(overrides?: { selectorOverrides?: SignalOverride[] }) {
    const signals = mergeSignalOverrides(defaultSignals, overrides?.selectorOverrides);

    TestBed.configureTestingModule({
      imports: [SelectPreprintServiceComponent, ...MockComponents(SubHeaderComponent)],
      providers: [
        provideOSFCore(),
        MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().build()),
        provideMockStore({ signals }),
      ],
    });

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(SelectPreprintServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    fixture?.destroy();
    jest.restoreAllMocks();
  });

  it('should initialize with correct default values', () => {
    setup();

    expect(component.classes).toBe('flex-1 flex flex-column w-full');
    expect(component.skeletonArray.length).toBe(8);
  });

  it('should dispatch fetch action on creation', () => {
    setup();

    expect(store.dispatch).toHaveBeenCalledWith(new GetPreprintProvidersAllowingSubmissions());
  });

  it('should dispatch select action when toggling an unselected provider', () => {
    setup();

    component.toggleProviderSelection(mockProvider);

    expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedPreprintProviderId(mockProvider.id));
  });

  it('should dispatch deselect action when toggling the already selected provider', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getSelectedProviderId, value: mockProvider.id }],
    });

    component.toggleProviderSelection(mockProvider);

    expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedPreprintProviderId(null));
  });

  it('should dispatch select action when toggling a different provider', () => {
    setup({
      selectorOverrides: [{ selector: PreprintStepperSelectors.getSelectedProviderId, value: 'other-provider' }],
    });

    component.toggleProviderSelection(mockProvider);

    expect(store.dispatch).toHaveBeenCalledWith(new SetSelectedPreprintProviderId(mockProvider.id));
  });
});
