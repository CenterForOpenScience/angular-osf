import { Store } from '@ngxs/store';

import { MockComponents, MockProvider } from 'ng-mocks';

import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { RegistriesSelectors } from '@osf/features/registries/store';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { LoaderService } from '@osf/shared/services/loader.service';

import { RegistrationLinksCardComponent } from '../../components/registration-links-card/registration-links-card.component';
import { RegistryLinksSelectors } from '../../store/registry-links';

import { RegistryLinksComponent } from './registry-links.component';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { LoaderServiceMock } from '@testing/providers/loader-service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { BaseSetupOverrides, mergeSignalOverrides, provideMockStore } from '@testing/providers/store-provider.mock';

function setup(overrides: BaseSetupOverrides = {}) {
  const routeBuilder = ActivatedRouteMockBuilder.create().withParams(overrides.routeParams ?? { id: 'reg-1' });
  if (overrides.hasParent === false) routeBuilder.withNoParent();
  const mockRoute = routeBuilder.build();

  const mockRouter = RouterMockBuilder.create().withUrl('/test-url').build();
  const mockLoaderService = new LoaderServiceMock();

  const defaultSignals = [
    { selector: RegistryLinksSelectors.getLinkedNodes, value: [] },
    { selector: RegistryLinksSelectors.getLinkedNodesLoading, value: false },
    { selector: RegistryLinksSelectors.getLinkedRegistrations, value: [] },
    { selector: RegistryLinksSelectors.getLinkedRegistrationsLoading, value: false },
    { selector: RegistriesSelectors.getSchemaResponse, value: null },
  ];

  const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

  TestBed.configureTestingModule({
    imports: [
      RegistryLinksComponent,
      ...MockComponents(SubHeaderComponent, LoadingSpinnerComponent, RegistrationLinksCardComponent),
    ],
    providers: [
      provideOSFCore(),
      MockProvider(ActivatedRoute, mockRoute),
      MockProvider(Router, mockRouter),
      MockProvider(LoaderService, mockLoaderService),
      provideMockStore({ signals }),
    ],
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(RegistryLinksComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component, store, mockRouter, mockLoaderService };
}

describe('RegistryLinksComponent', () => {
  it('should create', () => {
    const { component } = setup();

    expect(component).toBeTruthy();
  });

  it('should dispatch GetLinkedNodes and GetLinkedRegistrations when registryId is available', () => {
    const { store } = setup();

    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ registryId: 'reg-1' }));
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it('should not dispatch when registryId is not available', () => {
    const { store } = setup({ hasParent: false });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should navigate to overview', () => {
    const { component, mockRouter } = setup();

    component.navigateToOverview('node-1');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['node-1', 'overview']);
  });

  it('should show loader and navigate to justification page on updateRegistration', () => {
    const schemaResponseSignal: WritableSignal<{ id: string } | null> = signal({ id: 'revision-1' });
    const { component, mockRouter, mockLoaderService } = setup({
      selectorOverrides: [{ selector: RegistriesSelectors.getSchemaResponse, value: schemaResponseSignal }],
    });

    component.updateRegistration('reg-1');

    expect(mockLoaderService.show).toHaveBeenCalled();
    expect(mockLoaderService.hide).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/registries/revisions/revision-1/justification']);
  });

  it('should hide loader but not navigate when schemaResponse is null', () => {
    const { component, mockRouter, mockLoaderService } = setup();

    component.updateRegistration('reg-1');

    expect(mockLoaderService.show).toHaveBeenCalled();
    expect(mockLoaderService.hide).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should return selector values', () => {
    const mockNodes = [{ id: 'node-1', title: 'Node 1' }];
    const mockRegistrations = [{ id: 'reg-1', title: 'Registration 1' }];
    const { component } = setup({
      selectorOverrides: [
        { selector: RegistryLinksSelectors.getLinkedNodes, value: mockNodes },
        { selector: RegistryLinksSelectors.getLinkedNodesLoading, value: true },
        { selector: RegistryLinksSelectors.getLinkedRegistrations, value: mockRegistrations },
        { selector: RegistryLinksSelectors.getLinkedRegistrationsLoading, value: true },
      ],
    });

    expect(component.linkedNodes()).toEqual(mockNodes);
    expect(component.linkedNodesLoading()).toBe(true);
    expect(component.linkedRegistrations()).toEqual(mockRegistrations);
    expect(component.linkedRegistrationsLoading()).toBe(true);
  });
});
