import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { RegistrationLinksCardComponent } from '../../components/registration-links-card/registration-links-card.component';
import { RegistryComponentsSelectors } from '../../store/registry-components';

import { RegistryComponentsComponent } from './registry-components.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';
import { ViewOnlyLinkHelperMock } from '@testing/providers/view-only-link-helper.mock';

interface SetupOverrides extends BaseSetupOverrides {
  hasViewOnly?: boolean;
}

function setup(overrides: SetupOverrides = {}) {
  const routeBuilder = ActivatedRouteMockBuilder.create().withParams(overrides.routeParams ?? { id: 'reg-1' });
  if (overrides.hasParent === false) routeBuilder.withNoParent();
  const mockRoute = routeBuilder.build();

  const mockRouter = RouterMockBuilder.create().withUrl('/test-url').build();

  const mockViewOnlyHelper = ViewOnlyLinkHelperMock.simple(overrides.hasViewOnly);

  const defaultSignals = [
    { selector: RegistryComponentsSelectors.getRegistryComponents, value: [] },
    { selector: RegistryComponentsSelectors.getRegistryComponentsLoading, value: false },
  ];

  const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

  TestBed.configureTestingModule({
    imports: [
      RegistryComponentsComponent,
      ...MockComponents(
        SubHeaderComponent,
        LoadingSpinnerComponent,
        RegistrationLinksCardComponent,
        ViewOnlyLinkMessageComponent
      ),
    ],
    providers: [
      provideOSFCore(),
      MockProvider(ActivatedRoute, mockRoute),
      MockProvider(Router, mockRouter),
      MockProvider(ViewOnlyLinkHelperService, mockViewOnlyHelper),
      provideMockStore({ signals }),
    ],
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(RegistryComponentsComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component, store, mockRouter };
}

describe('RegistryComponentsComponent', () => {
  it('should create', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
  });

  it('should dispatch GetRegistryComponents when registryId is available', () => {
    const { store } = setup();

    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ registryId: 'reg-1' }));
  });

  it('should not dispatch when registryId is not available', () => {
    const { store } = setup({ hasParent: false });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should navigate to component details', () => {
    const { component, mockRouter } = setup();

    component.reviewComponentDetails('comp-1');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['comp-1', 'overview']);
  });

  it('should compute hasViewOnly correctly', () => {
    const { component } = setup({ hasViewOnly: true });

    expect(component.hasViewOnly()).toBe(true);
  });

  it('should return selector values', () => {
    const mockComponents = [{ id: 'comp-1', title: 'Component 1' }];
    const { component } = setup({
      selectorOverrides: [
        { selector: RegistryComponentsSelectors.getRegistryComponents, value: mockComponents },
        { selector: RegistryComponentsSelectors.getRegistryComponentsLoading, value: true },
      ],
    });

    expect(component.registryComponents()).toEqual(mockComponents);
    expect(component.registryComponentsLoading()).toBe(true);
  });
});
