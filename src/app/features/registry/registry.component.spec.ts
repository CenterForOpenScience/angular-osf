import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { PLATFORM_ID, Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';
import { PrerenderReadyService } from '@core/services/prerender-ready.service';
import { ClearCurrentProvider } from '@core/store/provider';
import { AnalyticsService } from '@osf/shared/services/analytics.service';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { ContributorsSelectors } from '@osf/shared/stores/contributors';
import { CurrentResourceSelectors } from '@shared/stores/current-resource';

import { RegistrySelectors } from './store/registry';
import { RegistrationOverviewModel } from './models';
import { RegistryComponent } from './registry.component';

import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';
import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { AnalyticsServiceMockFactory } from '@testing/providers/analytics.service.mock';
import { HelpScoutServiceMockFactory } from '@testing/providers/help-scout.service.mock';
import { MetaTagsServiceMockFactory } from '@testing/providers/meta-tags.service.mock';
import { PrerenderReadyServiceMockFactory } from '@testing/providers/prerender-ready.service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

interface SetupOverrides {
  registryId?: string;
  registry?: RegistrationOverviewModel | null;
  platform?: string;
}

function setup(overrides: SetupOverrides = {}) {
  const registryId = overrides.registryId ?? 'registry-1';
  const registry = overrides.registry ?? null;

  const helpScoutService = HelpScoutServiceMockFactory();
  const metaTagsService = MetaTagsServiceMockFactory();
  const dataciteService = DataciteMockFactory();
  const prerenderReadyService = PrerenderReadyServiceMockFactory();
  const analyticsService = AnalyticsServiceMockFactory();
  const routerBuilder = RouterMockBuilder.create();
  const mockRouter = routerBuilder.build();

  const providers: Provider[] = [
    provideOSFCore(),
    MockProvider(HelpScoutService, helpScoutService),
    MockProvider(MetaTagsService, metaTagsService),
    MockProvider(DataciteService, dataciteService),
    MockProvider(PrerenderReadyService, prerenderReadyService),
    MockProvider(AnalyticsService, analyticsService),
    MockProvider(ActivatedRoute, ActivatedRouteMockBuilder.create().withParams({ id: registryId }).build()),
    MockProvider(Router, mockRouter),
    provideMockStore({
      signals: [
        { selector: RegistrySelectors.getRegistry, value: registry },
        { selector: RegistrySelectors.isRegistryLoading, value: false },
        { selector: RegistrySelectors.getIdentifiers, value: [] },
        { selector: RegistrySelectors.getLicense, value: { name: 'MIT' } },
        { selector: RegistrySelectors.isLicenseLoading, value: false },
        { selector: ContributorsSelectors.getBibliographicContributors, value: [] },
        { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
        { selector: CurrentResourceSelectors.getCurrentResource, value: null },
      ],
    }),
  ];

  if (overrides.platform) {
    providers.push({ provide: PLATFORM_ID, useValue: overrides.platform });
  }

  TestBed.configureTestingModule({
    imports: [RegistryComponent],
    providers,
  });

  const store = TestBed.inject(Store);
  const fixture = TestBed.createComponent(RegistryComponent);
  fixture.detectChanges();

  return {
    fixture,
    component: fixture.componentInstance,
    store,
    routerBuilder,
    helpScoutService,
    metaTagsService,
    dataciteService,
    prerenderReadyService,
    analyticsService,
  };
}

describe('RegistryComponent', () => {
  it('should set helpScout resource type and prerender not ready on creation', () => {
    const { helpScoutService, prerenderReadyService } = setup();

    expect(helpScoutService.setResourceType).toHaveBeenCalledWith('registration');
    expect(prerenderReadyService.setNotReady).toHaveBeenCalled();
  });

  it('should call dataciteService.logIdentifiableView', () => {
    const { dataciteService } = setup();

    expect(dataciteService.logIdentifiableView).toHaveBeenCalled();
  });

  it('should dispatch init actions when registryId is available', () => {
    const { store } = setup();

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should not dispatch init actions when registryId is empty', () => {
    const { store } = setup({ registryId: '' });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should call setMetaTags when all data is loaded', () => {
    const { metaTagsService } = setup({ registry: MOCK_REGISTRATION_OVERVIEW_MODEL });

    expect(metaTagsService.updateMetaTags).toHaveBeenCalledWith(
      expect.objectContaining({
        osfGuid: MOCK_REGISTRATION_OVERVIEW_MODEL.id,
        title: MOCK_REGISTRATION_OVERVIEW_MODEL.title,
        description: MOCK_REGISTRATION_OVERVIEW_MODEL.description,
        siteName: 'OSF',
      }),
      expect.anything()
    );
  });

  it('should not call setMetaTags when registry is null', () => {
    const { metaTagsService } = setup({ registry: null });

    expect(metaTagsService.updateMetaTags).not.toHaveBeenCalled();
  });

  it('should send analytics on NavigationEnd event', () => {
    const { routerBuilder, analyticsService } = setup();

    routerBuilder.emit(new NavigationEnd(1, '/registries/registry-1', '/registries/registry-1'));

    expect(analyticsService.sendCountedUsageForRegistrationAndProjects).toHaveBeenCalledWith(
      '/registries/registry-1',
      null
    );
  });

  it('should unset helpScout and clear provider on destroy', () => {
    const { component, store, helpScoutService } = setup();
    jest.spyOn(store, 'dispatch');

    component.ngOnDestroy();

    expect(helpScoutService.unsetResourceType).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new ClearCurrentProvider());
  });

  it('should not dispatch clearCurrentProvider on destroy when not browser', () => {
    const { component, store, helpScoutService } = setup({ platform: 'server' });
    jest.spyOn(store, 'dispatch').mockClear();

    component.ngOnDestroy();

    expect(helpScoutService.unsetResourceType).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(new ClearCurrentProvider());
  });
});
