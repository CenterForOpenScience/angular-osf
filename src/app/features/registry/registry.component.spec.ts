import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { Mock } from 'vitest';

import { PLATFORM_ID, Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { HelpScoutService } from '@core/services/help-scout.service';
import { PrerenderReadyService } from '@core/services/prerender-ready.service';
import { ClearCurrentProvider } from '@core/store/provider';
import { IdentifierModel } from '@osf/shared/models/identifiers/identifier.model';
import { MetaTagsData } from '@osf/shared/models/meta-tags/meta-tags-data.model';
import { AnalyticsService } from '@osf/shared/services/analytics.service';
import { DataciteService } from '@osf/shared/services/datacite/datacite.service';
import { MetaTagsService } from '@osf/shared/services/meta-tags.service';
import { MetaTagsBuilderService } from '@osf/shared/services/meta-tags-builder.service';
import { ContributorsSelectors } from '@osf/shared/stores/contributors';
import { CurrentResourceSelectors } from '@shared/stores/current-resource';

import { MOCK_REGISTRATION_OVERVIEW_MODEL } from '@testing/mocks/registration-overview-model.mock';
import { provideOSFCore } from '@testing/osf.testing.provider';
import { AnalyticsServiceMockFactory } from '@testing/providers/analytics.service.mock';
import { DataciteServiceMock } from '@testing/providers/datacite.service.mock';
import { HelpScoutServiceMockFactory } from '@testing/providers/help-scout.service.mock';
import { MetaTagsServiceMockFactory } from '@testing/providers/meta-tags.service.mock';
import { MetaTagsBuilderServiceMockFactory } from '@testing/providers/meta-tags-builder.service.mock';
import { PrerenderReadyServiceMockFactory } from '@testing/providers/prerender-ready.service.mock';
import { ActivatedRouteMockBuilder } from '@testing/providers/route-provider.mock';
import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { mergeSignalOverrides, provideMockStore, SignalOverride } from '@testing/providers/store-provider.mock';

import { RegistrySelectors } from './store/registry';
import { RegistrationOverviewModel } from './models';
import { RegistryComponent } from './registry.component';

interface SetupOverrides {
  registryId?: string;
  registry?: RegistrationOverviewModel | null;
  identifiers?: IdentifierModel[];
  canonicalPath?: string;
  platform?: string;
  selectorOverrides?: SignalOverride[];
}

function setup(overrides: SetupOverrides = {}) {
  const registryId = overrides.registryId ?? 'registry-1';
  const registry = overrides.registry ?? null;
  const identifiers = overrides.identifiers ?? [];
  const canonicalPath = overrides.canonicalPath;

  const helpScoutService = HelpScoutServiceMockFactory();
  const metaTagsService = MetaTagsServiceMockFactory();
  const metaTagsBuilderService = MetaTagsBuilderServiceMockFactory();
  const dataciteService = DataciteServiceMock.simple();
  const prerenderReadyService = PrerenderReadyServiceMockFactory();
  const analyticsService = AnalyticsServiceMockFactory();
  const routerBuilder = RouterMockBuilder.create();
  const mockRouter = routerBuilder.build();
  const routeBuilder = ActivatedRouteMockBuilder.create().withParams({ id: registryId });
  if (canonicalPath) {
    routeBuilder.withFirstChild((child) => child.withData({ canonicalPath }));
  }
  metaTagsBuilderService.buildRegistryMetaTagsData.mockImplementation(
    ({ registry: currentRegistry, canonicalPath }) =>
      ({
        osfGuid: currentRegistry.id,
        title: currentRegistry.title,
        description: currentRegistry.description,
        url: `http://localhost:4200/${currentRegistry.id}`,
        canonicalUrl: `http://localhost:4200/${currentRegistry.id}/${canonicalPath}`,
        siteName: 'OSF',
      }) as MetaTagsData
  );

  const defaultSignals: SignalOverride[] = [
    { selector: RegistrySelectors.getRegistry, value: registry },
    { selector: RegistrySelectors.isRegistryLoading, value: false },
    { selector: RegistrySelectors.getIdentifiers, value: identifiers },
    { selector: RegistrySelectors.getLicense, value: { name: 'MIT' } },
    { selector: RegistrySelectors.isLicenseLoading, value: false },
    { selector: ContributorsSelectors.getBibliographicContributors, value: [] },
    { selector: ContributorsSelectors.isBibliographicContributorsLoading, value: false },
    { selector: CurrentResourceSelectors.getCurrentResource, value: null },
    { selector: CurrentResourceSelectors.hasNoPermissions, value: false },
  ];

  const signals = mergeSignalOverrides(defaultSignals, overrides.selectorOverrides);

  const providers: Provider[] = [
    provideOSFCore(),
    MockProvider(HelpScoutService, helpScoutService),
    MockProvider(MetaTagsService, metaTagsService),
    MockProvider(MetaTagsBuilderService, metaTagsBuilderService),
    MockProvider(DataciteService, dataciteService),
    MockProvider(PrerenderReadyService, prerenderReadyService),
    MockProvider(AnalyticsService, analyticsService),
    MockProvider(ActivatedRoute, routeBuilder.build()),
    MockProvider(Router, mockRouter),
    provideMockStore({ signals }),
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
    metaTagsBuilderService,
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

  it('should map identifiers to null when identifiers are empty', () => {
    const { dataciteService } = setup({ identifiers: [] });
    const identifiers$ = (dataciteService.logIdentifiableView as Mock).mock.calls[0][0];
    let emitted: unknown;

    identifiers$.subscribe((value: unknown) => {
      emitted = value;
    });

    expect(emitted).toBeNull();
  });

  it('should map identifiers to payload when identifiers exist', () => {
    const identifiers: IdentifierModel[] = [
      {
        id: 'identifier-1',
        type: 'identifiers',
        category: 'doi',
        value: '10.1234/osf.test',
      },
    ];
    const { dataciteService } = setup({ identifiers });
    const identifiers$ = (dataciteService.logIdentifiableView as Mock).mock.calls[0][0];
    let emitted: unknown;

    identifiers$.subscribe((value: unknown) => {
      emitted = value;
    });

    expect(emitted).toEqual({ identifiers });
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
    const { metaTagsService, metaTagsBuilderService } = setup({ registry: MOCK_REGISTRATION_OVERVIEW_MODEL });

    expect(metaTagsBuilderService.buildRegistryMetaTagsData).toHaveBeenCalledWith(
      expect.objectContaining({
        registry: expect.objectContaining({ id: MOCK_REGISTRATION_OVERVIEW_MODEL.id }),
        canonicalPath: 'overview',
      })
    );

    expect(metaTagsService.updateMetaTags).toHaveBeenCalledWith(
      expect.objectContaining({
        osfGuid: MOCK_REGISTRATION_OVERVIEW_MODEL.id,
        title: MOCK_REGISTRATION_OVERVIEW_MODEL.title,
        description: MOCK_REGISTRATION_OVERVIEW_MODEL.description,
        url: `http://localhost:4200/${MOCK_REGISTRATION_OVERVIEW_MODEL.id}`,
        canonicalUrl: `http://localhost:4200/${MOCK_REGISTRATION_OVERVIEW_MODEL.id}/overview`,
        siteName: 'OSF',
      }),
      expect.anything()
    );
    expect(metaTagsService.updateMetaTags).toHaveBeenCalledTimes(1);
  });

  it('should set canonicalUrl using active subroute path', () => {
    const { metaTagsService } = setup({
      registry: MOCK_REGISTRATION_OVERVIEW_MODEL,
      canonicalPath: 'files/osfstorage',
    });

    expect(metaTagsService.updateMetaTags).toHaveBeenLastCalledWith(
      expect.objectContaining({
        canonicalUrl: `http://localhost:4200/${MOCK_REGISTRATION_OVERVIEW_MODEL.id}/files/osfstorage`,
      }),
      expect.anything()
    );
  });

  it('should not call setMetaTags when registry is null', () => {
    const { metaTagsService } = setup({ registry: null });

    expect(metaTagsService.updateMetaTags).not.toHaveBeenCalled();
  });

  it('should send analytics on NavigationEnd event', () => {
    const mockResource = { id: 'registry-1' };
    const { routerBuilder, analyticsService } = setup({
      selectorOverrides: [
        { selector: CurrentResourceSelectors.getCurrentResource, value: mockResource },
        { selector: CurrentResourceSelectors.hasNoPermissions, value: true },
      ],
    });
    routerBuilder.emit(new NavigationEnd(1, '/registries/registry-1', '/registries/registry-1'));
    expect(analyticsService.sendCountedUsageForRegistrationAndProjects).toHaveBeenCalledWith(
      '/registries/registry-1',
      mockResource
    );
  });

  it('should unset helpScout and clear provider on destroy', () => {
    const { component, store, helpScoutService } = setup();
    vi.spyOn(store, 'dispatch');

    component.ngOnDestroy();

    expect(helpScoutService.unsetResourceType).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(new ClearCurrentProvider());
  });

  it('should not dispatch clearCurrentProvider on destroy when not browser', () => {
    const { component, store, helpScoutService } = setup({ platform: 'server' });
    vi.spyOn(store, 'dispatch').mockClear();

    component.ngOnDestroy();

    expect(helpScoutService.unsetResourceType).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(new ClearCurrentProvider());
  });
});
